import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with a larger limit to accommodate 50,000+ characters
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

/**
 * Smart Text Chunking Utility
 * Splits a text into chunks of target size (2000-3000 characters) without breaking sentences or paragraphs.
 */
function chunkText(text: string, targetSize: number = 2500): string[] {
  if (!text) return [];
  const normalizedText = text.replace(/\r\n/g, "\n").trim();
  
  // Try splitting by paragraphs first to keep cohesive context blocks
  const paragraphs = normalizedText.split(/\n+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    // If paragraph itself is too large, split it by sentence
    if (trimmedPara.length > targetSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      
      // Split paragraph by sentence ending characters (., ?, !)
      const sentences = trimmedPara.match(/[^.!?]+[.!?]+(\s|$)/g) || [trimmedPara];
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > targetSize) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += (currentChunk ? " " : "") + sentence;
        }
      }
    } else if (currentChunk.length + trimmedPara.length + 1 > targetSize) {
      // Current chunk is full enough, push and start new
      chunks.push(currentChunk.trim());
      currentChunk = trimmedPara;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmedPara;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  // Ensure absolutely no overly small trailing chunks under 200 characters if possible,
  // by merging them with the previous chunk.
  if (chunks.length > 1 && chunks[chunks.length - 1].length < 300) {
    const lastChunk = chunks.pop();
    chunks[chunks.length - 1] += "\n\n" + lastChunk;
  }

  return chunks;
}

// ---------------- API ENDPOINTS ----------------

// 1. Text Chunking API
app.post("/api/chunk-text", (req, res) => {
  try {
    const { text, targetSize } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Văn bản nguồn không hợp lệ." });
    }
    
    const size = parseInt(targetSize, 10) || 2500;
    if (size < 1000 || size > 5000) {
      return res.status(400).json({ error: "Kích thước đoạn phải nằm trong khoảng 1000 - 5000 ký tự." });
    }

    const segments = chunkText(text, size);
    return res.json({ chunks: segments });
  } catch (error: any) {
    console.error("Lỗi chia đoạn văn bản:", error);
    return res.status(500).json({ error: error.message || "Lỗi máy chủ khi chia đoạn." });
  }
});

// Semantic-aware Speaker Predictor for self-healing dialogue splits
function predictSpeaker(content: string, lastSpeakerName: string, activeSpeakers: any[]): string {
  if (!activeSpeakers || activeSpeakers.length === 0) return lastSpeakerName;

  // 1. Look for explicit address/mention of other speakers in the text
  for (const s of activeSpeakers) {
    if (s && s.name) {
      const escapedName = s.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Matches addresses like "thưa [tên]", "cảm ơn [tên]", "chào [tên]" (case-insensitive)
      const addressRegex = new RegExp(`(?:thưa|cảm\\s+ơn|chào|hỏi|gọi|nhắc\\s+đến|với)\\s+${escapedName}`, 'i');
      if (addressRegex.test(content)) {
        // The speaker is talking TO s.name, so the speaker MUST be someone else!
        const other = activeSpeakers.find(os => os.name !== s.name);
        if (other) return other.name;
      }
    }
  }

  // 2. Look for role titles (e.g. addressing "Bác sĩ" or "Thầy" or "Chuyên gia")
  const hasDoctorMention = /\b(?:bác\s*sĩ|bác\s*si|thầy|thay|chuyên\s*gia)\b/i.test(content);
  if (hasDoctorMention) {
    const doctorSpeaker = activeSpeakers.find(s => 
      s.role.toLowerCase().includes("bác sĩ") || 
      s.role.toLowerCase().includes("bác si") || 
      s.role.toLowerCase().includes("thầy") ||
      s.role.toLowerCase().includes("thay") ||
      s.role.toLowerCase().includes("chuyên gia") ||
      s.name.toLowerCase().includes("bác sĩ") ||
      s.name.toLowerCase().includes("thầy")
    );
    const mcSpeaker = activeSpeakers.find(s => 
      s.role.toLowerCase().includes("host") || 
      s.role.toLowerCase().includes("mc") || 
      s.role.toLowerCase().includes("người dẫn") ||
      s.name.toLowerCase().includes("khánh lành")
    );

    // If "bác sĩ/thầy" is mentioned, it's highly likely the MC is talking
    if (doctorSpeaker && mcSpeaker && lastSpeakerName === doctorSpeaker.name) {
      return mcSpeaker.name;
    }
  }

  // 3. Natural Dialogue Alternation (If exactly 2 speakers)
  if (activeSpeakers.length === 2 && lastSpeakerName) {
    const other = activeSpeakers.find(s => s.name !== lastSpeakerName);
    if (other) return other.name;
  }

  return lastSpeakerName || (activeSpeakers[0] ? activeSpeakers[0].name : "");
}

// Helper function to ensure each non-empty line starts with "SpeakerName: "
function ensureSpeakerPrefix(text: string, activeSpeakers: any[], isMonologue: boolean): string {
  if (!text) return "";

  // Pre-processing to fix Lỗi 2: split speaker turns that got merged into a single line without newline
  let processedText = text;
  if (!isMonologue && activeSpeakers && activeSpeakers.length > 0) {
    for (const s of activeSpeakers) {
      if (s && s.name) {
        const escapedName = s.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        // Match any non-newline character, followed by optional spaces, then the speaker name and a colon (case-insensitive)
        const insertNewlineRegex = new RegExp(`([^\\n])\\s*(${escapedName}\\s*:)`, 'gi');
        processedText = processedText.replace(insertNewlineRegex, '$1\n$2');
      }
    }
  }

  const lines = processedText.split("\n");
  const soleSpeaker = activeSpeakers[0];
  let lastSpeakerName = isMonologue && soleSpeaker ? soleSpeaker.name : (activeSpeakers[0] ? activeSpeakers[0].name : "");

  // First pass: extract speaker and clean content for each line
  const parsedLines: { speaker: string; content: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue; // Skip empty lines entirely during parsing to avoid blank blocks

    // Check if the line matches dynamic pattern "SpeakerName: Content"
    const hasPrefixMatch = trimmed.match(/^([^:]+)\s*:/);
    let hasPrefix = false;
    let currentSpeakerName = lastSpeakerName;
    let content = trimmed;

    if (hasPrefixMatch) {
      const detectedName = hasPrefixMatch[1].trim();
      const matchedSpeaker = activeSpeakers.find(s => s.name === detectedName || s.name.toLowerCase() === detectedName.toLowerCase());
      if (matchedSpeaker) {
        hasPrefix = true;
        currentSpeakerName = matchedSpeaker.name;
        lastSpeakerName = matchedSpeaker.name;
        content = trimmed.substring(trimmed.indexOf(":") + 1).trim();
      }
    }

    if (!hasPrefix) {
      // Force prefix if missing
      if (isMonologue && soleSpeaker) {
        currentSpeakerName = soleSpeaker.name;
      } else {
        currentSpeakerName = predictSpeaker(trimmed, lastSpeakerName, activeSpeakers);
        lastSpeakerName = currentSpeakerName;
      }
    }

    // Fix Lỗi 1: Clean repetitive speaker name prefixes from the start of the content (Recursive/Iterative removal)
    let prefixRemoved = true;
    while (prefixRemoved) {
      prefixRemoved = false;
      for (const s of activeSpeakers) {
        if (s && s.name) {
          const escapedName = s.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`^${escapedName}\\s*:\\s*`, 'i');
          if (regex.test(content)) {
            content = content.replace(regex, '').trim();
            prefixRemoved = true;
          }
        }
      }
      if (hasPrefixMatch && hasPrefixMatch[1]) {
        const detectedName = hasPrefixMatch[1].trim();
        const escapedDetected = detectedName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regexGen = new RegExp(`^${escapedDetected}\\s*:\\s*`, 'i');
        if (regexGen.test(content)) {
          content = content.replace(regexGen, '').trim();
          prefixRemoved = true;
        }
      }
    }

    parsedLines.push({ speaker: currentSpeakerName, content });
  }

  // Second pass: Merge consecutive lines belonging to the same speaker ONLY if it is a dialogue
  // (In monologue, we allow paragraph breaks for reading flow, but in dialogue, each turn must be a single block)
  if (!isMonologue) {
    const mergedTurns: { speaker: string; paragraphs: string[] }[] = [];
    for (const item of parsedLines) {
      if (mergedTurns.length > 0 && mergedTurns[mergedTurns.length - 1].speaker === item.speaker) {
        mergedTurns[mergedTurns.length - 1].paragraphs.push(item.content);
      } else {
        mergedTurns.push({ speaker: item.speaker, paragraphs: [item.content] });
      }
    }
    return mergedTurns.map(turn => `${turn.speaker}: ${turn.paragraphs.join("\n\n")}`).join("\n\n");
  } else {
    // For monologue, there is only one speaker. We only prepend the prefix to the very first paragraph,
    // and join all paragraphs with double newlines naturally to form a beautiful, continuous speech.
    const cleanParagraphs = parsedLines.map(line => line.content);
    const speakerName = soleSpeaker ? soleSpeaker.name : "Speaker";
    return `${speakerName}: ${cleanParagraphs.join("\n\n")}`;
  }
}

// Post-processing filter to clean up accidental self-pronoun slip-ups (con/em/cháu) in Host/MC lines
function sanitizeHostPronouns(text: string, hostName: string, hostPronounSelf: string): string {
  if (!text) return "";
  const lines = text.split("\n");
  const sanitizedLines = lines.map(line => {
    const trimmed = line.trim();
    // Match line that starts with "HostName: " (case-insensitive)
    const hostPrefixRegex = new RegExp(`^(${hostName})\\s*:`, 'i');
    if (hostPrefixRegex.test(trimmed)) {
      const match = trimmed.match(hostPrefixRegex);
      if (!match) return line;
      const matchedPrefix = match[0];
      let content = trimmed.substring(matchedPrefix.length);

      // Replace self-pronouns while preserving general words like "con người", "con cháu", "con đường"
      const replacements = [
        { regex: /\bcho\s+(?:con|em|cháu)\s+hỏi\b/gi, rep: `cho ${hostPronounSelf} hỏi` },
        { regex: /\b(?:con|em|cháu)\s+xin\s+hỏi\b/gi, rep: `${hostPronounSelf} xin hỏi` },
        { regex: /\b(?:con|em|cháu)\s+muốn\s+hỏi\b/gi, rep: `${hostPronounSelf} muốn hỏi` },
        { regex: /\b(?:con|em|cháu)\s+hỏi\s+bác\s+sĩ\b/gi, rep: `${hostPronounSelf} hỏi bác sĩ` },
        { regex: /\bthưa\s+bác\s+sĩ,\s+(?:con|em|cháu)\b/gi, rep: `thưa bác sĩ, ${hostPronounSelf}` },
        { regex: /\bdạ\s+thưa\s+bác\s+sĩ,\s+(?:con|em|cháu)\b/gi, rep: `dạ thưa bác sĩ, ${hostPronounSelf}` },
        { regex: /\bthưa\s+quý\s+thính\s+giả,\s+(?:con|em|cháu)\b/gi, rep: `thưa quý thính giả, ${hostPronounSelf}` },
        { regex: /\b(?:con|em|cháu)\s+nghĩ\b/gi, rep: `${hostPronounSelf} nghĩ` },
        { regex: /\b(?:con|em|cháu)\s+thấy\b/gi, rep: `${hostPronounSelf} thấy` },
        { regex: /\b(?:con|em|cháu)\s+hiểu\b/gi, rep: `${hostPronounSelf} hiểu` },
        { regex: /\b(?:con|em|cháu)\s+kính\s+thưa\b/gi, rep: `${hostPronounSelf} kính thưa` },
        { regex: /\b(?:con|em|cháu)\s+dạ\s+hỏi\b/gi, rep: `${hostPronounSelf} dạ hỏi` },
        { regex: /\b(?:con|em|cháu)\s+cảm\s+ơn\b/gi, rep: `${hostPronounSelf} cảm ơn` }
      ];

      for (const r of replacements) {
        content = content.replace(r.regex, r.rep);
      }
      return `${matchedPrefix}${content}`;
    }
    return line;
  });
  return sanitizedLines.join("\n");
}

// 2. Chat / Write Single Chunk of Podcast API
app.post("/api/generate-chunk", async (req, res) => {
  try {
    const {
      chunkText,
      chunkIndex,
      totalChunks,
      toneStyle,
      speakers,
      expansionRate,
      previousGeneratedText,
      podcastName,
      ctaInterval,
      model,
      outputLanguage
    } = req.body;

    if (!chunkText) {
      return res.status(400).json({ error: "Văn bản đoạn (chunk) không hợp lệ." });
    }

    const activeSpeakers = speakers?.filter((s: any) => s.isActive) || [];
    if (activeSpeakers.length === 0) {
      return res.status(400).json({ error: "Phải kích hoạt ít nhất 1 người nói (chuyên gia hoặc host)." });
    }

    const isMonologue = activeSpeakers.length === 1;
    const rate = parseFloat(expansionRate) || 1.2;
    const originalLength = chunkText.length;
    
    // Explicit mathematical boundary targets
    const optimalTarget = Math.round(originalLength * rate);
    const minTarget = Math.round(optimalTarget * 0.88); // 12% lower variance limit
    const maxTarget = Math.round(optimalTarget * 1.12); // 12% upper variance limit to prevent runaway writing
    
    // Output language instructions
    let languageInstruction = "";
    if (outputLanguage === "vi") {
      languageInstruction = "HÃY ĐẢM BẢO VIẾT HOÀN TOÀN BẰNG TIẾNG VIỆT (VIETNAMESE).";
    } else if (outputLanguage === "en") {
      languageInstruction = "HÃY ĐẢM BẢO VIẾT HOÀN TOÀN BẰNG TIẾNG ANH (ENGLISH). Hãy chuyển dịch tên gọi, lời thoại, vai vế và từ xưng hô của các nhân vật sang tiếng Anh một cách tự nhiên nhất (ví dụ: MC, Host, Doctor, Sir, Madam, Guest, Everyone, You, I).";
    } else {
      languageInstruction = "HÃY TỰ ĐỘNG nhận diện ngôn ngữ của VĂN BẢN NGUỒN được cung cấp và viết kịch bản bằng CHÍNH NGÔN NGỮ ĐÓ (Ví dụ: nếu văn bản nguồn là tiếng Anh thì viết kịch bản bằng tiếng Anh, nếu văn bản nguồn là tiếng Việt thì viết kịch bản bằng tiếng Việt).";
    }

    const targetLengthMsg = `
ĐỘ DÀI KỊCH BẢN KẾT QUẢ ĐẦU RA PHẢI NẰM NGHIÊM NGẶT trong giới hạn: từ ${minTarget} đến ${maxTarget} ký tự (bao gồm cả khoảng trắng và tên nhân vật đối thoại).
- Mục tiêu giãn nở lý tưởng của bạn là: ~${optimalTarget} ký tự (tương ứng chuẩn xác tỉ lệ giãn nở ${Math.round(rate * 100)}% so với văn bản gốc có ${originalLength} ký tự).
- TUYỆT ĐỐI KHÔNG ĐƯỢC viết lan man, dông dài lặp ý vượt qua giới hạn cực đại là ${maxTarget} ký tự. Hãy điều tiết lượng đối đáp nhịp nhàng để đạt tiêu chuẩn này.
- TUYỆT ĐỐI KHÔNG ĐƯỢC tóm tắt hay cắt xén nội dung chính dưới mức giới hạn cực tiểu là ${minTarget} ký tự. Hãy giữ lại vẹn toàn tính triết lý, y học hoặc phong thủy cốt lõi của nội dung gốc.
`;

    // Strict rules to prevent repeated welcoming greetings across blocks
    let antiGreetingInstruction = "";
    if (chunkIndex > 0) {
      antiGreetingInstruction = `
RÀNG BUỘC PHẢI TUÂN THỦ NGHIÊM NGẶT ĐỂ TRÁNH TRÙNG LẶP CHÀO HỎI GIỮA CÁC ĐOẠN (ANTI-REPEATED-GREETING MANDATE):
- Đây là phần tiếp theo (Đoạn số ${chunkIndex + 1} trên ${totalChunks}) của cuộc trò chuyện. Các cuộc hội thoại trước đó đang tiếp diễn mượt mà.
- TUYỆT ĐỐI CẤM (STRICTLY FORBIDDEN) các hành vi chào hỏi, bắt tay xã giao ban đầu hay giới thiệu lại tên nhân vật/chương trình ("Chào chào", "Chào Bác sĩ Huy", "Chào Biên tập viên", "Rất vui gặp lại quý vị", v.v.) trong đoạn thoại này.
- Hãy đi thẳng trục diện vào phân tích sâu nội dung tiếp theo như một dòng chảy tự nhiên liên tục, không mào đầu khách sáo hay lặp lại lời mờ chào.
`;
    }

    // Call to action instruction if enabled
    let ctaInstruction = "";
    if (podcastName && ctaInterval && parseInt(ctaInterval) > 0) {
      const interval = parseInt(ctaInterval);
      if ((chunkIndex + 1) % interval === 0 && chunkIndex < totalChunks - 1) {
        ctaInstruction = `
YÊU CẦU KÊU GỌI TƯƠNG TÁC TINH TẾ (SUBTLE CALL TO ACTION):
Chương trình/Kênh YouTube hiện tại của chúng ta là: "${podcastName}".
- Vì đã đi được một phần chặng đường của podcast (Đoạn số ${chunkIndex + 1}/${totalChunks}), hãy cho một nhân vật thích hợp (thường là Host/MC) phát ngôn 1-2 câu kêu gọi thính giả một cách chân thành nhất để họ nhấn Thích (Like), chia sẻ cảm nhận bằng Bình luận (Comment) và Đăng ký (Subscribe) kênh "${podcastName}" để ủng hộ sản xuất thêm nội dung bổ ích.
- Lời thoại kêu gọi phải được lồng ghép hài hòa, nhuần nhuyễn vào ngữ cảnh đàm luận chuyên môn của đoạn này, phát ngôn tự nhiên từ cảm xúc biết ơn sâu sắc chứ không hô hào sáo rỗng.
`;
      }
    }

    // Categorize style instructions based on selection
    let styleBrief = "";
    if (toneStyle === "spiritual") {
      styleBrief = "Tâm linh / Thiền môn / Trị liệu tâm hồn: Văn phong từ tốn, an yên, thâm trầm, sâu sắc, giàu lòng vị tha. Sử dụng các ngôn từ thanh lọc, xoa dịu lo âu, nhắc nhở chánh niệm, tỉnh thức.";
    } else if (toneStyle === "health") {
      styleBrief = "Y học / Sức khỏe chủ động / Thực dưỡng: Văn phong khoa học nhưng ấm áp, tin cậy, dễ hiểu. Giải thích cơ chế sinh học, mẹo dưỡng sinh tự nhiên một cách gần gũi như người thầy thuốc tận tâm.";
    } else if (toneStyle === "fengshui") {
      styleBrief = "Phong thủy / Bản mệnh / Vận số cát hung: Văn phong uyên bác, trang nghiêm, phân tích logic theo học lý Ngũ Hành, Âm Dương, mang tính chiêm nghiệm cao. Hạn chế mê tín dị đoan, tập trung vào đức năng thắng số.";
    } else if (toneStyle === "life") {
      styleBrief = "Tâm lý học ứng xử / Trải nghiệm cuộc sống: Văn phong triết lý, lôi cuốn, thực tế. Kể câu chuyện sinh động, đúc kết bài học thiết thực về nhân sinh, kết nối cảm xúc với thính giả podcast.";
    }

    // Build descriptions for active speakers
    let speakersInstruction = "";
    activeSpeakers.forEach((sp: any, idx: number) => {
      speakersInstruction += `
Nhân vật ${idx + 1}:
- Tên người nói: "${sp.name}"
- Vai trò/Thân phận: "${sp.role}"
- Phong thái/Giọng điệu: "${sp.style}"
- Cách xưng hô tự xưng (tự gọi mình): "${sp.pronounSelf || "tôi"}"
- Cách xưng hô khi đối thoại (gọi người nói khác): "${sp.pronounOther || "bạn"}"
- Cách xưng hô khi tương tác với thính giả (khán giả): "${sp.pronounAudience || "quý thính giả"}"
`;
    });

    // Chunk flow status instructions
    let flowInstruction = "";
    if (totalChunks === 1) {
      let introMsg = `Đây là toàn bộ nội dung duy nhất của kịch bản podcast. Bạn bắt buộc phải tuân thủ nghiêm ngặt QUY TẮC MỞ ĐẦU KỊCH TÍNH, CHẠM THẲNG CẢM XÚC (QUY TẮC COLD OPEN):
- Bước 1 (Đoạn Hook/Mồi dẫn): Bạn phải quét kỹ VĂN BẢN NGUỒN được cung cấp. Nếu trong văn bản nguồn ĐÃ CÓ SẴN mồi dẫn, lời tâm sự khơi mào hay câu hỏi lôi cuốn (ví dụ: "Cô bác có biết không? Có một căn bệnh mà...", "Hôm nay tôi sẽ chỉ cho..."), bạn BẮT BUỘC phải giữ lại nguyên vẹn ý tưởng và chuyển thể mượt mà nội dung này vào lời thoại đầu tiên của người dẫn chương trình (Host/MC). Nếu văn bản nguồn đi thẳng vào bài viết khô khan không có mở đầu, hãy chủ động sáng tạo ra 2-3 câu hỏi hoặc tình huống thực tế dựa sát nội dung bài để khơi gợi tính tò mò của thính giả làm mồi dẫn.
- Bước 2 (Chuyển tiếp siêu tốc, KHÔNG chào hỏi rườm rà):
  * TUYỆT ĐỐI CẤM (STRICTLY FORBIDDEN) viết các câu chào mừng trang trọng, sáo rỗng, rườm rà làm mất đi sự kịch tính của đoạn mồi dẫn (Ví dụ: CẤM viết những câu như "Chào mừng các cô các bác đã đến với chương trình...", "Hôm nay chúng tôi vinh hạnh được đồng hành cùng bác sĩ... từ bệnh viện..."). Những câu này vô cùng nhàm chán và làm loãng sự chú ý của thính giả.
  * Hãy chuyển nhịp bằng cách để người dẫn chương trình (Host/MC) hỏi thẳng khách mời một câu hỏi đối thoại tự nhiên, đi thẳng vào trọng tâm chủ đề dựa trên câu mồi dẫn vừa nói.
  * Ví dụ mượt mà: Sau khi MC nói xong câu mồi dẫn, MC hỏi ngay: "Bác sĩ Phúc ơi, vậy thực chất căn bệnh khó nói này là gì, và tại sao đi nội soi bác sĩ lại kết luận hoàn toàn bình thường ạ?". Khách mời đáp lại tự nhiên: "Chào Khánh Lành và thưa các cô các bác, đúng là như vậy..."
- Đoạn cuối kịch bản: Triển khai toàn bộ nội dung văn bản nguồn và kết thúc bằng lời cảm ơn sâu sắc, lời chúc lành, chúc tinh tấn/sức khỏe ấm áp và lời tạm biệt thính giả.`;
      flowInstruction = introMsg;
    } else if (chunkIndex === 0) {
      let introMsg = `Đây là PHẦN MỞ ĐẦU (Intro/Hook) của kịch bản podcast dài nhiều tập. Bạn bắt buộc phải tuân thủ nghiêm ngặt QUY TẮC MỞ ĐẦU KỊCH TÍNH, CHẠM THẲNG CẢM XÚC (QUY TẮC COLD OPEN):
- Bước 1 (Đoạn Hook/Mồi dẫn): Bạn phải quét kỹ VĂN BẢN NGUỒN được cung cấp. Nếu trong văn bản nguồn ĐÃ CÓ SẴN mồi dẫn, lời tâm sự khơi mào hay câu hỏi lôi cuốn (ví dụ: "Cô bác có biết không? Có một căn bệnh mà...", "Hôm nay tôi sẽ chỉ cho..."), bạn BẮT BUỘC phải giữ lại nguyên vẹn ý tưởng và chuyển thể mượt mà nội dung này vào lời thoại đầu tiên của người dẫn chương trình (Host/MC). Nếu văn bản nguồn đi thẳng vào bài viết khô khan không có mở đầu, hãy chủ động sáng tạo ra 2-3 câu hỏi hoặc tình huống thực tế dựa sát nội dung bài để khơi gợi tính tò mò của thính giả làm mồi dẫn.
- Bước 2 (Chuyển tiếp siêu tốc, KHÔNG chào hỏi rườm rà):
  * TUYỆT ĐỐI CẤM (STRICTLY FORBIDDEN) viết các câu chào mừng trang trọng, sáo rỗng, rườm rà làm mất đi sự kịch tính của đoạn mồi dẫn (Ví dụ: CẤM viết những câu như "Chào mừng các cô các bác đã đến với chương trình...", "Hôm nay chúng tôi vinh hạnh được đồng hành cùng bác sĩ... từ bệnh viện..."). Những câu này vô cùng nhàm chán và làm loãng sự chú ý của thính giả.
  * Hãy chuyển nhịp bằng cách để người dẫn chương trình (Host/MC) hỏi thẳng khách mời một câu hỏi đối thoại tự nhiên, đi thẳng vào trọng tâm chủ đề dựa trên câu mồi dẫn vừa nói.
  * Ví dụ mượt mà: Sau khi MC nói xong câu mồi dẫn, MC hỏi ngay: "Bác sĩ Phúc ơi, vậy thực chất căn bệnh khó nói này là gì, và tại sao đi nội soi bác sĩ lại kết luận hoàn toàn bình thường ạ?". Khách mời đáp lại tự nhiên: "Chào Khánh Lành và thưa các cô các bác, đúng là như vậy..."
- Tuyệt đối không kết bài hay chào tạm biệt ở phần này.`;
      flowInstruction = introMsg;
    } else if (chunkIndex === totalChunks - 1) {
      flowInstruction = "Đây là PHẦN KẾT THÚC (Outro) của podcast. Hãy thảo luận nốt nội dung cuối tập này, sau đó tổng kết lại ngắn gọn các ý chính sâu sắc, gửi lời cảm ơn khách mời, gửi lời chúc lành an yên, chúc tinh tấn/sức khỏe và tạm biệt thính giả. Tuyệt đối không chào mừng ở phần này.";
    } else {
      flowInstruction = `Đây là PHẦN GIỮA (Thân bài - Content) của podcast (Phần ${chunkIndex + 1} trên ${totalChunks}).
Tuyệt đối KHÔNG chào mừng, KHÔNG chào hỏi ban đầu, KHÔNG giới thiệu lại chương trình, KHÔNG kết bài hay tạm biệt. 
Hãy bắt đầu một cách tự nhiên nối tiếp liền mạch từ nội dung trước đó và thảo luận sâu sắc toàn bộ văn bản của đoạn này.`;
    }

    // Brand replacement instruction to substitute alternative brand names from source text
    let brandReplacementInstruction = "";
    if (podcastName) {
      brandReplacementInstruction = `
🛑 QUY TẮC THAY THẾ THƯƠNG HIỆU / TÊN KÊNH CŨ (BRAND REPLACEMENT):
- Nếu trong VĂN BẢN NGUỒN được cung cấp có nhắc đến bất kỳ tên chương trình, tên kênh YouTube, câu chào cửa miệng đặc trưng hoặc bất cứ thương hiệu cũ nào từ nguồn tài liệu gốc, bạn BẮT BUỘC phải thay thế triệt để 100% bằng tên chương trình hiện tại của chúng ta là: "${podcastName}".
- Tuyệt đối không được giữ nguyên hay chuyển phát vào kịch bản bất kỳ tên kênh nào khác ngoài "${podcastName}".
`;
    }

    // Dialogue layout & host/guest setup
    const hostSpeaker = activeSpeakers.find((s: any) => s.role.toLowerCase().includes("host") || s.role.toLowerCase().includes("mc") || s.role.toLowerCase().includes("người dẫn")) || activeSpeakers[0];
    let relationshipConstraint = "";
    if (isMonologue) {
       const soleSpeaker = activeSpeakers[0];
       relationshipConstraint = `
 Vì ĐÂY LÀ PODCAST ĐỘC THOẠI (Chỉ có duy nhất 1 người nói là "${soleSpeaker.name}"):
 - Hãy viết toàn bộ nội dung dưới dạng bài nói độc thoại, bài giảng hoặc tâm sự trôi chảy từ một mình nhân vật "${soleSpeaker.name}".
 - Hãy chia đoạn văn một cách tự nhiên và đầy đặn (mỗi đoạn văn dài từ 3-5 câu liên kết chặt chẽ, tuyệt đối KHÔNG ngắt dòng vụn vặt từng câu hay băm nhỏ câu thoại làm nát kịch bản).
 - Không có bất kỳ người nói hay host nào khác chen vào. Không dùng định dạng hội thoại nhiều người.
 - Nhân vật tuyệt đối tuân thủ xưng hô tự xưng "${soleSpeaker.pronounSelf}" và gọi khán giả/thính giả là "${soleSpeaker.pronounAudience}".
 - 🛑 QUY TẮC ĐỊNH DẠNG: Chỉ cần ghi tiền tố "${soleSpeaker.name}: " một lần duy nhất ở ngay đầu kịch bản để phân vai. Tuyệt đối KHÔNG ĐƯỢC lặp lại tên nhân vật này ở đầu các đoạn văn tiếp theo.
  `;
    } else {
      const guestSpeakers = activeSpeakers.filter((s: any) => s.id !== hostSpeaker.id);

      relationshipConstraint = `
Vì ĐÂY LÀ PODCAST HỘI THOẠI (Gồm ${activeSpeakers.length} nhân vật):
- Người dẫn chương trình (Host/MC) là "${hostSpeaker.name}".
- MC "${hostSpeaker.name}" tuyệt đối CHỈ đặt câu hỏi, nêu thắc mắc, gợi mở vấn đề hoặc đề nghị làm rõ thêm dưới dạng các câu hỏi/thắc mắc. MC không thuyết giảng, không giải thích sâu.
- Các khách mời chuyên gia (${guestSpeakers.map((s: any) => `"${s.name}"`).join(", ")}) sẽ phụ trách việc trả lời chi tiết và giải thích chiều sâu các kiến thức chuyên môn.
- CÁCH XỨNG HÔ QUY ĐỊNH (Cực kỳ quan trọng - QUYẾT ĐỊNH CHẤT LƯỢNG KỊCH BẢN):
  * Khi các nhân vật ĐỐI THOẠI VỚI NHAU: Họ phải gọi đối phương theo quy định cách xưng hô đối thoại ("${activeSpeakers.map((s: any) => `${s.name} gọi đối phương là "${s.pronounOther}"`).join(", ")}"). Họ cũng tự xưng theo cách xưng hô tự xưng ("${activeSpeakers.map((s: any) => `${s.name} tự xưng là "${s.pronounSelf}"`).join(", ")}").
  * Khi các nhân vật TƯƠNG TÁC VỚI THÍNH GIẢ hoặc KHÁN GIẢ: Họ phải dùng từ gọi thính giả là ("${activeSpeakers.map((s: any) => `${s.name} gọi thính giả là "${s.pronounAudience}"`).join(", ")}").
  
🛑 RÀNG BUỘC PHẢI TUÂN THỦ 100% VỀ XỨNG HÔ - KHÔNG ĐƯỢC TỰ Ý THAY THẾ:
- TUYỆT ĐỐI NGHIÊM CẤM nhân vật tự ý xưng hô khác với cấu hình ở trên.
- 🛑 DANH SÁCH TỪ CẤM XƯNG HÔ (PRONOUN BLACKLIST) CHO MC/HOST "${hostSpeaker.name}":
  * Tuyệt đối NGHIÊM CẤM MC/Host tự xưng mình là "con", "cháu", "em" trong bất kỳ câu thoại nào khi trò chuyện với khách mời hoặc thính giả.
  * MC/Host tuyệt đối chỉ được dùng từ tự xưng đã được cấu hình cứng là "${hostSpeaker.pronounSelf}" (ví dụ: tự xưng bằng chính tên mình như "${hostSpeaker.name}" hoặc "tôi").
  * Kể cả đối phương là bác sĩ lớn tuổi hay bậc trưởng bối bề trên, MC/Host vẫn phải giữ nguyên xưng hô cấu hình tôn trọng khách sáo nhưng đĩnh đạc, không xưng bề dưới khúm núm.
- Ví dụ cụ thể: Nếu nhân vật tự xưng là "${activeSpeakers.map((s: any) => `${s.name} tự xưng là "${s.pronounSelf}"`).join(", ")}" thì trong bất kể hoàn cảnh nào, từ ngữ bắt đầu câu thoại hoặc tự gọi mình của họ PHẢI CỨNG KHỚP là "${activeSpeakers.map((s: any) => `"${s.pronounSelf}"`).join(", ")}". 
- TUYỆT ĐỐI KHÔNG ĐƯỢC tự ý đổi xưng hô thành "con" hay "em" khi cấu hình xưng gọi là "tôi", "Khánh Lành" v.v.
- Việc xưng hô sai cấu hình sẽ phá hỏng kịch bản và gây mất cảm xúc người đọc. Hãy chú ý kiểm dịch từng câu thoại trước khi phản hồi để đảm bảo từ ngữ xưng hô đúng 100% thiết lập.
- Hãy khéo léo lồng ghép xưng hô tự xưng và xưng gọi đối phương trong lời thoại để hội thoại tự nhiên, chân thật nhất có thể. Đảm bảo rõ ràng mối quan hệ xưng hô thân mật hay kính cẩn đúng như cài đặt.

🛑 QUY TẮC PHÂN CHIA LƯỢT THOẠI (DÀNH CHO HỘI THOẠI):
- Mỗi lượt thoại của một nhân vật (lượt nói liên tiếp của một người từ khi bắt đầu đến khi nhường lời cho người khác) BẮT BUỘC phải được viết liền mạch thành một đoạn văn duy nhất, KHÔNG ĐƯỢC phép xuống dòng giữa chừng khi cùng một người nói.
- Chỉ xuống dòng khi chuyển sang lượt thoại của nhân vật tiếp theo.
- Tuyệt đối nghiêm cấm viết nhiều đoạn văn liên tiếp hay xuống dòng vụn vặt cho cùng một người nói. (Ví dụ: Không viết 'Anh Thư: ...' rồi lại 'Anh Thư: ...' ở dòng tiếp theo).
`;
    }

    // Previous context integration
    let previousContextPrompt = "";
    if (previousGeneratedText) {
      previousContextPrompt = `
Dưới đây là một phần kịch bản đã được viết trước đó từ (chunk) liền trước để bạn tham khảo mạch chuyện, phong thái diễn đạt, và xưng hô. Hãy tiếp tục viết trôi chảy từ đoạn hội thoại trước đó để tránh trùng lặp ý, lắp bắp từ ngữ hay đổi giọng đột ngột:
---
${previousGeneratedText.slice(-1500)}
---
`;
    }

    // Construct perfect prompt with all rules
    const systemInstruction = `Bạn là một tác giả viết kịch bản Podcast chuyên nghiệp người Việt Nam, có khả năng viết những lời thoại sâu sắc, lắng đọng, lay động lòng người và mang tính thực tiễn cao theo bất cứ trường phái văn phong nào.

Mục tiêu của bạn là chuyển đổi văn bản nguồn (độc thoại/tài liệu) thành kịch bản Podcast tiếng Việt cho các nhân vật tùy chọn, với các ràng buộc vô cùng khắt khe dưới đây.

ĐIỀU KHOẢN RÀNG BUỘC PHẢI TUÂN THỦ TUYỆT ĐỐI (TTS COMPLIANCE):
1. Đọc TTS Trơn Tru (TRUYỆT ĐỐI KHÔNG CHỈ ĐẠO SÂN KHẤU):
   - Tuyệt đối KHÔNG ĐƯỢC chứa các dấu ngoặc chỉ đạo sân khấu, hiệu ứng như: (cười), [nhạc nổi lên], (thở dài), (ngập ngừng), v.v.
   - Tuyệt đối KHÔNG phân chia đề mục như "Mở Đầu", "Phần 1:...", hay bất kỳ tiêu đề hoặc ký hiệu định dạng tiêu đề nào.
   - Toàn bộ văn bản chỉ được chứa lời thoại nối tiếp nhau một cách tự nhiên.
2. Định dạng kịch bản chuẩn xác (Áp dụng nghiêm ngặt cho cả hội thoại và độc thoại):
   - Đối với độc thoại (Monologue): Để dễ đọc, có thể chia thành một vài đoạn văn lớn tương đối dài, tránh xuống dòng vụn vặt từng câu. Mỗi đoạn văn mới bắt đầu bắt buộc phải viết rõ tên nhân vật nói và một dấu hai chấm ở đầu.
   - Đối với hội thoại (Dialogue): Mỗi lượt thoại của một nhân vật phải viết liền mạch thành một đoạn văn duy nhất (không xuống dòng giữa chừng khi cùng một người nói). Chỉ xuống dòng khi chuyển sang lượt thoại của nhân vật tiếp theo.
   - Ví dụ viết độc thoại chính xác:
     Bác Sĩ Phúc: Thói quen thứ mười, cũng là thói quen khép lại một ngày ăn uống lành mạnh...
     Bác Sĩ Phúc: Thưa quý vị thính giả, việc duy trì một ấm trà tươi vào buổi sáng...
   - Ví dụ viết hội thoại chính xác:
     Cư Sĩ Tâm An: Đại chúng cần hiểu rằng chánh niệm không phải điều gì xa vời. Khi chúng ta ăn cơm biết mình đang ăn cơm, khi thở biết mình đang thở, đó chính là chánh niệm tỉnh thức trong từng phút giây.
     Bác Sĩ Huy: Đúng vậy thưa thầy Tâm An, dưới góc độ y học thực dưỡng, việc ăn uống chậm rãi trong chánh niệm giúp dịch vị được tiết ra tốt hơn, từ đó nuôi dưỡng cơ thể khoẻ mạnh tự nhiên.
3. Không rút gọn nội dung:
   - Toàn bộ các kiến thức, thông điệp, triết lý trong văn bản nguồn PHẢI được giữ lại trọn vẹn, không được lược bỏ hay nói chung chung.
4. Điều chỉnh dung lượng mở rộng:
   - Viết chi tiết, tỉ mỷ, giàu hình tượng, phân tích sâu, đan xen đối đáp nhịp nhàng để kéo dãn độ dài đạt mức yêu cầu.

Dữ liệu đầu vào chi tiết:
Văn phong chủ đạo:
${styleBrief}

Danh sách nhân vật tham gia Podcast:
${speakersInstruction}

Mối quan hệ và ràng buộc hội thoại/độc thoại:
${relationshipConstraint}

Trạng thái luồng bài viết hiện tại:
${flowInstruction}

${brandReplacementInstruction}

${antiGreetingInstruction}

${ctaInstruction}

${previousContextPrompt}

Yêu cầu độ dài:
${targetLengthMsg}

VĂN BẢN NGUỒN CỦA ĐOẠN NÀY (HÃY CHUYỂN THỂ TRỌN VẸN VĂN BẢN NÀY):
"""
${chunkText}
"""

HÃY BẮT ĐẦU VIẾT KỊCH BẢN PODCAST CHO ĐOẠN NÀY NGAY BÂY GIỜ. ${languageInstruction} KHÔNG CÓ KÝ HIỆU CHỈ ĐẠO SÂN KHẤU.`;

    const modelName = model || "gemini-3.5-flash-lite"; 

    console.log(`Starting generation for chunk ${chunkIndex + 1} of ${totalChunks} with model ${modelName}`);

    let attempts: { text: string; length: number }[] = [];
    let finalResult = "";

    for (let attempt = 0; attempt < 2; attempt++) {
      let currentSystemInstruction = systemInstruction;
      
      // If not the first attempt, refine the prompt based on previous failures
      if (attempt > 0) {
        const lastAttempt = attempts[attempts.length - 1];
        const lastLen = lastAttempt.length;
        currentSystemInstruction += `\n\n🛑 CẢNH BÁO: PHẢN HỒI LẦN TRƯỚC BỊ SAI MỤC TIÊU ĐỘ DÀI:
        Mục tiêu là: ${minTarget} - ${maxTarget} ký tự.
        Lần trước bạn viết ${lastLen} ký tự.
        ${lastLen > maxTarget ? "LẦN NÀY YÊU CẦU BẠN VIẾT GỌN GÀNG HƠN, LOẠI BỎ Ý LẶP, TĂNG TỐC ĐỘ DIỄN ĐẠT." : "LẦN NÀY YÊU CẦU BẠN VIẾT CHI TIẾT HƠN, MỞ RỘNG CÁC ĐOẠN PHÂN TÍCH CHUYÊN MÔN." }
        HÃY ĐIỀU CHỈNH CHÍNH XÁC ĐỘ DÀI LẦN NÀY SAO CHO GẦN NHẤT VỚI ~${optimalTarget} KÝ TỰ.`;
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: currentSystemInstruction,
        config: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
        }
      });

      const resultText = response.text || "";
      const resultLen = resultText.length;
      attempts.push({ text: resultText, length: resultLen });

      // Check if within acceptable boundaries (target +/- 12% as per original calculation logic)
      if (resultLen >= minTarget && resultLen <= maxTarget) {
        finalResult = resultText;
        break; // Acceptable result found
      }
    }

    // If no attempt was within boundaries, pick the closest one to optimalTarget
    if (!finalResult) {
      console.log(`No attempt within [${minTarget}, ${maxTarget}]. Picking closest.`);
      let closest = attempts[0];
      let minDiff = Infinity;
      for (const att of attempts) {
        const diff = Math.abs(att.length - optimalTarget);
        if (diff < minDiff) {
          minDiff = diff;
          closest = att;
        }
      }
      finalResult = closest.text;
    }

    let resultText = ensureSpeakerPrefix(finalResult, activeSpeakers, isMonologue);
    if (!isMonologue && hostSpeaker) {
      resultText = sanitizeHostPronouns(resultText, hostSpeaker.name, hostSpeaker.pronounSelf || hostSpeaker.name);
    }

    return res.json({ 
      originalLength: chunkText.length,
      generatedText: resultText.trim(),
      chunkIndex,
      totalChunks,
      retryCount: attempts.length - 1
    });

  } catch (error: any) {
    console.error("Lỗi khi sinh kịch bản từ Gemini:", error);
    return res.status(500).json({ 
      error: error.message || "Không thể gọi dịch vụ AI viết kịch bản.",
      details: error.stack
    });
  }
});

// Serve Vite dev server or static outputs
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});
