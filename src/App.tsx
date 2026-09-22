import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Settings, 
  Sliders, 
  HelpCircle, 
  Play, 
  Pause, 
  RefreshCw, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Users, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Info,
  Clock,
  BookOpen,
  Volume2,
  FileText,
  UserCheck,
  Check,
  Flame,
  ArrowRight,
  Youtube,
  Tv,
  MessageSquare,
  Globe
} from 'lucide-react';
import { Speaker, ToneStyle, ChunkState, PodcastConfig } from './types';

// Predefined illustrative long Vietnamese text samples to let users test instantly
const SAMPLE_TEXT_SPIRITUAL = `Hành trình quay về bên trong và trị liệu những tổn thương tâm hồn bắt đầu từ sự nhận diện giản đơn nhất. Trong nhịp sống hiện đại hối hả, vội vã, chúng ta dường như luôn hướng mắt ra thế giới bên ngoài, mải miết chạy theo danh lợi, tiền tài và những ham muốn bất tận. Nhưng có bao giờ bạn dừng lại, đặt bàn tay lên ngực trái và tự hỏi: "Tâm hồn mình thực sự có đang an yên?". Chánh niệm là một chiếc chìa khóa vạn năng, giúp chúng ta vượt thoát khỏi những bóng ma của lo âu quá khứ và sự bất an tương lai. Chánh niệm không đòi hỏi chúng ta phải đi tu hay trốn lánh cõi hồng trần, mà đó là nghệ thuật sống tỉnh thức ngay tại giây phút này. Khi bạn uống một chén trà, hãy biết mình đang uống chén trà; khi bạn hít một làn sinh khí, hãy biết ngực mình đang căng phồng. Mọi khổ đau của đời người tóm gọn lại đều phát khởi từ sự chấp ngã sâu dày và khao khát kiểm soát vạn vật diễn ra theo ý mình mà bỏ quên luật vô thường của tạo hóa. Sự trị liệu tâm hồn chỉ thực sự khởi sắc khi bạn học được cách bao dung cho chính những lỗi lầm cũ kỹ của bản thân mình, dang rộng cánh tay ôm lấy đứa trẻ tổn thương đang khóc nghẹn bên trong tâm khảm. Mỗi vết sẹo tinh thần đều mang trong mình một bài học giác ngộ quý báu về sự buông bỏ. Khi trái tim đủ rộng lớn, tình thương sẽ tự khắc lan tỏa tới vạn vật xung quanh mà không màng điều kiện. Hãy tập quan sát hơi thở mỗi sớm mai thức dậy. Ba hơi thở sâu tinh tươm sẽ neo giữ tâm bạn với thân bạn thành một khối an định vững chãi. Đừng cố gắng đàn áp cơn giận hay ghét bỏ nỗi cô đơn, hãy xem chúng như những vị khách lạ ghé thăm hiên nhà tâm hồn. Ta mời họ một tách trà ấm, lắng nghe họ tâm sự, rồi ung dung tiễn họ rời đi dưới ánh hoàng hôn tĩnh mịch. Khi thiền môn mở lối, đó không phải là tôn giáo xa lạ mà chính là bến đỗ bình yên nhất bên trong mỗi sinh mệnh cư ngụ nơi trần thế này. Những thanh lọc dịu êm của chánh niệm sẽ tưới mát tâm hồn khô cằn của bạn, đem lại sự nhẹ nhàng thanh thản chưa từng có.`;

const SAMPLE_TEXT_HEALTH = `Y học tự nhiên luôn nhắc nhở chúng ta rằng cơ thể con người là một kỳ quan vĩ đại có khả năng tự chữa lành kỳ diệu nếu được tiếp năng lượng đúng cách và tôn trọng nhịp sinh học tự nhiên. Thực dưỡng hay dinh dưỡng chủ động không đơn thuần là việc chọn lựa món ăn mà là cả một hệ thống triết lý thấu hiểu sự hòa hợp giữa con người và thổ nhưỡng. Trong xã hội hiện nay, bệnh lý chuyển hóa và ung thư gia tăng chóng mặt có nguồn gốc sâu xa từ thói quen ăn uống quá mức tinh chế, lạm dụng đường sữa động vật và thực phẩm công nghiệp hóa chất. Hệ tiêu hóa, đặc biệt là đường ruột, được mệnh danh là bộ não thứ hai của cơ thể. Một hệ vi sinh đường ruột khỏe mạnh quyết định đến 70% hệ miễn dịch chủ động của chúng ta. Để nuôi dưỡng hệ vi sinh này, chúng ta cần bổ sung dồi dào các loại rau củ quả tươi sạch hữu cơ, các loại ngũ cốc nguyên cám giàu chất xơ hòa tan kết hợp các thức ăn lên men tự nhiên như dưa chua truyền thống hay miso lên men cổ truyền. Việc uống nước cũng cần có khoa học: tránh uống quá nhiều nước ngay trong bữa ăn làm loãng dịch vị dạ dày, đồng thời duy trì việc uống nước ấm từng ngụm nhỏ suốt cả ngày để tế bào hấp thụ trọn vẹn. Hãy quay về với cách chế biến thủ công đơn giản như luộc, hấp, kho nhẹ thay vì rán nướng quá lửa sinh độc tố gây hại gan thận. Khung giờ từ 11 giờ đêm đến 3 giờ sáng là thời gian vàng để túi mật và gan tiến hành giải độc tố sâu, do đó việc thức khuya qua nửa đêm là sự tàn phá khủng khiếp đối với sự trẻ trung của tế bào và năng lượng khí huyết. Dưỡng sinh tự nhiên còn bắt nguồn từ sự vận động vừa sức mỗi ngày: nửa tiếng đi bộ dưới ánh nắng ban mai giúp kích hoạt hệ thống vitamin D nội sinh, làm săn chắc cơ xương khớp vững chãi. Người thầy thuốc tận tâm nhất không ở đâu xa mà chính là sự hiểu biết sâu sắc của bạn về nhu cầu dinh dưỡng thực tế của cơ thể mình.`;

const SAMPLE_TEXT_FENGSUI = `Phong thủy học chính tông là một bộ môn khoa học cổ phương Đông dựa trên sự nghiên cứu tỉ mỉ về mối tương quan năng lượng giữa thiên nhiên hoàn cảnh và con người tại các thời điểm không gian khác nhau. Bản mệnh con người chịu sự chi phối mạnh mẽ từ hệ thống Ngũ Hành gồm Kim, Mộc, Thủy, Hỏa, Thổ cùng sự tương tác Âm Dương lưỡng hợp. Mọi điềm cát hung luân chuyển đều tuân theo hệ quy chiếu nhân quả và lý thuyết dịch học tinh vi chứ không thuần túy là sự may rủi. Nhà ở hay nơi làm việc là vỏ bọc năng lượng trực tiếp tác động lên thể khí của gia chủ. Luồng sinh khí hay phong thủy của một ngôi nhà cát lành cần đáp ứng được nguyên tắc "tàng phong tụ khí" - nghĩa là gió thổi vừa phải để tụ giữ năng lượng sinh sống chứ không thổi lùa trực diện phá tan tài lộc. Minh đường của căn nhà, tức là khoảng không sân trước, cần thênh thang tươi sáng không bị vật cản u tối nhắm thẳng. Phòng ngủ cần yên tĩnh đại diện cho yếu tố Âm để nuôi dưỡng giấc ngủ phục hồi thể lực sâu, tránh đặt gương soi đối diện giường hoặc lắp đặt quá nhiều thiết bị điện tử tỏa bức xạ mạnh gây tán lộc tổn hại gia đạo. Các góc hướng tài lộc thịnh vượng như hướng Đông Nam cần đặt những vật phẩm kích hoạt tích cực lành mạnh như chậu cây xanh tươi hay bể cá nước luân chuyển thông thoáng để chiêu nạp hành Thủy kích tài. Tuy nhiên, cổ nhân có câu: "Địa linh nhân kiệt" hay "Đức đức năng thắng số". Phong thủy dù tốt thế nào cũng xếp sau phong thủy của tâm hồn con người. Một người có lòng nhân từ, hành thiện gieo duyên lành sẽ tự tỏa ra từ trường ấm áp xua tan sát khí hung tinh xung quanh ngôi nhà của họ. Ngược lại, nếu lòng dạ hẹp hòi mưu mô thì dù có bày trí vật phẩm chiêu tài quý giá hàng tỷ đồng cũng vô phương cải mệnh. Cân bằng ngũ hành thông qua rèn luyện đạo đức chính trực mới là bí pháp thực sự giúp vận số luôn hanh thông, gia đạo bình an thịnh vượng qua các niên đại.`;

const SAMPLE_TEXT_LIFE = `Mối quan hệ giữa con người với con người là tấm gương phản chiếu trung thực nhất thế giới nội tâm của chính chúng ta. Trong tương tác ứng xử hàng ngày, bí quyết để đạt được sự hòa hợp không nằm ở việc cố gắng thay đổi người khác, mà nằm ở sự thấu hiểu sự khác biệt cốt lõi trong tính cách và tư duy của từng người. Mỗi chúng ta lớn lên trong những hoàn cảnh gia đình khác nhau, nhận sự giáo dục khác nhau nên tự khắc mang những lăng kính quan sát cuộc sống hoàn toàn riêng biệt. Khi bạn hiểu được điều này, sự phán xét sẽ dần nhường chỗ cho lòng thấu cảm sâu sắc. Kể một câu chuyện sinh động: Có một thanh niên luôn oán hận người cha nghiêm khắc của mình vì cho rằng ông thiếu tình thương, nhưng chỉ tới khi tự mình gánh vác trách nhiệm trụ cột gia đình chật vật kiếm sống, anh ta mới bàng hoàng nhận diện được sự hi sinh thầm lặng khuất sau bờ vai hao gầy của cha. Những bài học đắt giá nhất của nhân sinh luôn được đúc kết từ những va vấp, những lúc gian nan cùng cực. Sự cô đơn hay nỗi thất vọng không phải là kẻ thù, chúng là những người thầy nghiêm khắc khơi gợi chúng ta định vị lại giá trị chân thật của mình. Lắng nghe chủ động là liều thuốc xoa dịu mọi xung đột gia đình hay đồng nghiệp: hãy nghe để thấu suốt bản chất đằng sau câu từ chứ đừng vội nghe để đối đáp chuẩn bị tranh cãi hơn thua. Khi bạn biết cách quản trị cảm xúc của mình tốt, bạn đã sở hữu nguồn sức mạnh vô ngôn cực kỳ to lớn. Hãy học cách trân trọng từng khoảnh khắc giản dị bên người thân yêu, bởi thời gian trôi đi không bao giờ trở lại và tài sản lớn nhất trần gian không phải ngân phiếu ngân hàng, mà là chiếc hòm chứa đầy ắp kỷ niệm đầy ắp yêu thương và sự kết nối tâm hồn chân thành giữa các thế hệ.`;

// 3 basic default speakers configurations for ToneStyles
const STYLE_SPEAKER_PRESETS: Record<ToneStyle, Speaker[]> = {
  spiritual: [
    {
      id: 'speaker-1',
      name: 'MC Minh Triết',
      role: 'Người dẫn hội thoại gieo duyên',
      style: 'Ấm áp, tôn trọng, dắt dẫn gợi mở bằng câu hỏi từ tốn',
      pronounSelf: 'mình',
      pronounOther: 'Thầy Pháp Ấn',
      pronounAudience: 'quý vị đạo hữu',
      isActive: true
    },
    {
      id: 'speaker-2',
      name: 'Thiền Sư Pháp Ấn',
      role: 'Nội sư trụ trì Tổ đình - Chuyên gia Phật học chánh niệm',
      style: 'Thiền vị, trầm tĩnh, thấu cảm sâu rễ, từ ái khoan dung',
      pronounSelf: 'Thầy',
      pronounOther: 'đạo hữu Minh Triết',
      pronounAudience: 'Đại chúng',
      isActive: true
    },
    {
      id: 'speaker-3',
      name: 'Cư Sĩ Diệu Âm',
      role: 'Chuyên gia thiền trị liệu tâm hồn',
      style: 'Nhẹ nhàng, an yên, thấu suốt tâm can, giọng đọc xoa dịu',
      pronounSelf: 'Tôi',
      pronounOther: 'đạo huynh Pháp Ấn',
      pronounAudience: 'quý vị hữu duyên',
      isActive: true
    }
  ],
  health: [
    {
      id: 'speaker-1',
      name: 'BTV Hoài Anh',
      role: 'Host biên tập viên chuyên đề sức khỏe',
      style: 'Trong trẻo, rành mạch, luôn tò mò học hỏi cốt lõi để hỏi thắc mắc',
      pronounSelf: 'Hoài Anh',
      pronounOther: 'Bác sĩ Huy',
      pronounAudience: 'quý vị khán thính giả',
      isActive: true
    },
    {
      id: 'speaker-2',
      name: 'Bác Sĩ Huy',
      role: 'Chuyên khoa Y học cổ truyền & Sức khỏe chủ động',
      style: 'Ấm áp, cẩn trọng, phân tích lý chứng khoa học kết hợp lối giải nghĩa gần gũi',
      pronounSelf: 'Tôi',
      pronounOther: 'chị Hoài Anh',
      pronounAudience: 'quý thính giả thân thương',
      isActive: true
    },
    {
      id: 'speaker-3',
      name: 'Lương Y Tuệ Lâm',
      role: 'Chuyên gia Thực dưỡng dưỡng sinh tự nhiên',
      style: 'Mộc mạc, thực nghiệm, nhiệt huyết thảo dược dưỡng nuôi thân tâm',
      pronounSelf: 'Tuệ Lâm',
      pronounOther: 'Bác Sĩ Huy',
      pronounAudience: 'đại chúng đồng tu dưỡng',
      isActive: true
    }
  ],
  fengshui: [
    {
      id: 'speaker-1',
      name: 'MC Quốc Khánh',
      role: 'Host kết nối đàm đạo',
      style: 'Lịch lãm, khúc chiết, tổng hợp câu hỏi thính giả để mời giải đáp',
      pronounSelf: 'Quốc Khánh',
      pronounOther: 'Thầy Minh Đường',
      pronounAudience: 'quý khách thính giả',
      isActive: true
    },
    {
      id: 'speaker-2',
      name: 'Thầy Minh Đường',
      role: 'Học sĩ dịch lý và kiến trúc phong thủy',
      style: 'Trang nghiêm, bác cổ thông kim, phân tích logic Ngũ Hành lý trí bài trừ mê tín',
      pronounSelf: 'Tôi',
      pronounOther: 'Quốc Khánh',
      pronounAudience: 'quý vị hữu duyên cát tường',
      isActive: true
    },
    {
      id: 'speaker-3',
      name: 'Đại sư Cát Tường',
      role: 'Chuyên gia cố vấn cát hung gia vận',
      style: 'Thâm trầm, trang trọng, hướng con người phát tâm đức năng thắng số',
      pronounSelf: 'Tôi',
      pronounOther: 'Thầy Minh Đường',
      pronounAudience: 'mọi thính giả hữu duyên',
      isActive: true
    }
  ],
  life: [
    {
      id: 'speaker-1',
      name: 'BTV Thủy Tiên',
      role: 'Host kể chuyện chia sẻ tâm sự',
      style: 'Nghẹn ngào thấu cảm, cởi mở dẫn nhịp, luôn đặt góc nhìn của bạn trẻ đặt câu hỏi hỏi ý nghĩa',
      pronounSelf: 'Thủy Tiên',
      pronounOther: 'chị Vân Trang',
      pronounAudience: 'cả nhà mình',
      isActive: true
    },
    {
      id: 'speaker-2',
      name: 'Chuyên Gia Vân Trang',
      role: 'Nhà tham vấn tâm lý học hành vi gia đình',
      style: 'Lôi cuốn, tinh tế, đưa ví dụ giải pháp cụ thể đầy nhân bản',
      pronounSelf: 'Tôi',
      pronounOther: 'Thủy Tiên',
      pronounAudience: 'các bạn thính giả',
      isActive: true
    },
    {
      id: 'speaker-3',
      name: 'Nhà báo Quốc Khánh',
      role: 'Tác giả sách triết lý sống ứng dụng',
      style: 'Thẳng thắn, giản dị, gần gũi như người đi trước đúc kết bài học đường đời',
      pronounSelf: 'Tôi',
      pronounOther: 'cô Vân Trang',
      pronounAudience: 'quý vị thính giả',
      isActive: true
    }
  ]
};

export default function App() {
  // Config
  const [toneStyle, setToneStyle] = useState<ToneStyle>('spiritual');
  const [expansionRate, setExpansionRate] = useState<number>(1.2); // Options: 1.0 (Không mở rộng), 1.2 (+20%), 1.5 (+50%)
  const [targetChunkSize, setTargetChunkSize] = useState<number>(5000); 
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    try {
      return localStorage.getItem('podcast_selected_model') || 'gemini-3.5-flash-lite';
    } catch (e) {
      return 'gemini-3.5-flash-lite';
    }
  });
  const [outputLanguage, setOutputLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem('podcast_output_language') || 'auto';
    } catch (e) {
      return 'auto';
    }
  });
  const [speakers, setSpeakers] = useState<Speaker[]>(() => {
    try {
      const saved = localStorage.getItem('podcast_speakers_spiritual');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return STYLE_SPEAKER_PRESETS.spiritual;
  });

  // Radio/Youtube branding configurations
  const [podcastName, setPodcastName] = useState<string>(() => {
    try {
      return localStorage.getItem('podcast_name') || 'Kênh Sách Nói Chữa Lành';
    } catch (e) {
      return 'Kênh Sách Nói Chữa Lành';
    }
  });

  const [ctaInterval, setCtaInterval] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('podcast_cta_interval');
      return saved ? parseInt(saved, 10) : 3;
    } catch (e) {
      return 3;
    }
  });

  const handlePodcastNameChange = (val: string) => {
    setPodcastName(val);
    try {
      localStorage.setItem('podcast_name', val);
    } catch (e) {}
  };

  const handleCtaIntervalChange = (val: number) => {
    setCtaInterval(val);
    try {
      localStorage.setItem('podcast_cta_interval', val.toString());
    } catch (e) {}
  };

  // Text inputs & state
  const [sourceText, setSourceText] = useState<string>('');
  const [isChunking, setIsChunking] = useState<boolean>(false);
  const [chunks, setChunks] = useState<ChunkState[]>([]);
  
  // Pipeline automation execution states
  const [pipelineActive, setPipelineActive] = useState<boolean>(false);
  const [delayTime, setDelayTime] = useState<number>(3); // seconds of delay between chunks outputs
  const [currentRunningIndex, setCurrentRunningIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Editing state for specific converted chunk
  const [editingChunkId, setEditingChunkId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  // Info modal states
  const [showConfigTips, setShowConfigTips] = useState<boolean>(false);

  // References
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stopPipelineRef = useRef<boolean>(false);

  // Synchronize dynamic preset changes when ToneStyle changes, loading from local storage if existing
  const handleToneStyleChange = (style: ToneStyle) => {
    setToneStyle(style);
    try {
      const saved = localStorage.getItem(`podcast_speakers_${style}`);
      if (saved) {
        setSpeakers(JSON.parse(saved));
        addLog(`Đã chuyển văn phong sang: ${getToneStyleLabel(style)}. Cấu tạo nhân vật đã lưu của bạn đã được khôi phục từ trình duyệt.`);
      } else {
        setSpeakers(STYLE_SPEAKER_PRESETS[style]);
        addLog(`Đã chuyển văn phong sang: ${getToneStyleLabel(style)}. Đã tải cấu hình nhân vật mặc định.`);
      }
    } catch (e) {
      setSpeakers(STYLE_SPEAKER_PRESETS[style]);
      addLog(`Đã chuyển văn phong sang: ${getToneStyleLabel(style)}.`);
    }
  };

  // Helper log function
  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 49)]);
  };

  const getToneStyleLabel = (style: ToneStyle) => {
    switch (style) {
      case 'spiritual': return 'Tâm linh / Thiền môn / Trị liệu tâm hồn';
      case 'health': return 'Y học / Sức khỏe chủ động / Thực dưỡng';
      case 'fengshui': return 'Phong thủy / Bản mệnh / Vận số cát hung';
      case 'life': return 'Tâm lý học ứng xử / Trải nghiệm cuộc sống';
    }
  };

  const getToneStyleIcon = (style: ToneStyle) => {
    switch (style) {
      case 'spiritual': return <BookOpen className="w-5 h-5" />;
      case 'health': return <Volume2 className="w-5 h-5" />;
      case 'fengshui': return <Flame className="w-5 h-5" />;
      case 'life': return <Users className="w-5 h-5" />;
    }
  };

  const getThemeColors = (style: ToneStyle) => {
    switch (style) {
      case 'spiritual': return {
        bg: 'from-purple-900/30 to-slate-900',
        accent: 'border-purple-500/40 text-purple-300',
        accentBg: 'bg-purple-900/40',
        badge: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
        button: 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20',
        activeIndicator: 'bg-purple-400'
      };
      case 'health': return {
        bg: 'from-emerald-900/30 to-slate-900',
        accent: 'border-emerald-500/40 text-emerald-300',
        accentBg: 'bg-emerald-900/40',
        badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
        button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20',
        activeIndicator: 'bg-emerald-400'
      };
      case 'fengshui': return {
        bg: 'from-amber-900/30 to-slate-900',
        accent: 'border-amber-500/40 text-amber-300',
        accentBg: 'bg-amber-900/40',
        badge: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
        button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/20',
        activeIndicator: 'bg-amber-400'
      };
      case 'life': return {
        bg: 'from-blue-900/30 to-slate-900',
        accent: 'border-blue-500/40 text-blue-300',
        accentBg: 'bg-blue-900/40',
        badge: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
        button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20',
        activeIndicator: 'bg-blue-400'
      };
    }
  };

  const themeColors = getThemeColors(toneStyle);

  // Auto load character counts from presets
  const applyPresetSampleText = (text: string) => {
    setSourceText(text);
    addLog(`Đã tải đoạn văn bản mẫu chủ đề ${getToneStyleLabel(toneStyle)} thành công (${text.length} ký tự).`);
  };

  // Perform split/chunking
  const handleChunkText = async () => {
    if (!sourceText.trim()) {
      alert("Vui lòng nhập hoặc chọn một đoạn văn bản nguồn!");
      return;
    }
    
    setIsChunking(true);
    addLog(`Đang gửi yêu cầu chia đoạn thông minh qua máy chủ (Kích thước lý tưởng: ${targetChunkSize} ký tự)...`);
    
    try {
      const response = await fetch('/api/chunk-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: sourceText, 
          targetSize: targetChunkSize 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể chia đoạn văn bản");
      }

      const data = await response.json();
      const loadedChunks: ChunkState[] = data.chunks.map((txt: string, idx: number) => ({
        index: idx,
        originalText: txt,
        generatedText: '',
        status: 'idle'
      }));

      setChunks(loadedChunks);
      addLog(`Chia tài liệu thành công: Tạo ra ${loadedChunks.length} đoạn văn bản riêng biệt (mỗi đoạn ~${targetChunkSize} ký tự) bọc trọn ý.`);
    } catch (error: any) {
      alert(`Lỗi chia đoạn: ${error.message}`);
      addLog(`[LỖI] Chia đoạn thất bại: ${error.message}`);
    } finally {
      setIsChunking(false);
    }
  };

  // Switch Toggle Active for Speakers
  const toggleSpeakerActive = (id: string) => {
    const activeCount = speakers.filter(s => s.isActive).length;
    
    setSpeakers(prev => {
      const next = prev.map(s => {
        if (s.id === id) {
          if (s.isActive && activeCount <= 1) {
            alert("Phải kích hoạt tối thiểu một người nói (Chuyên gia hoặc Host)!");
            return s;
          }
          return { ...s, isActive: !s.isActive };
        }
        return s;
      });
      try {
        localStorage.setItem(`podcast_speakers_${toneStyle}`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Save changes to speaker attributes
  const updateSpeakerField = (id: string, field: keyof Speaker, value: string) => {
    setSpeakers(prev => {
      const next = prev.map(s => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      });
      try {
        localStorage.setItem(`podcast_speakers_${toneStyle}`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Reset active tone style speakers to original presets
  const handleResetSpeakersToDefault = () => {
    if (confirm(`Bạn có chắc muốn khôi phục thiết lập nhân vật của văn phong "${getToneStyleLabel(toneStyle)}" về mặc định ban đầu không?`)) {
      setSpeakers(STYLE_SPEAKER_PRESETS[toneStyle]);
      try {
        localStorage.removeItem(`podcast_speakers_${toneStyle}`);
      } catch (e) {}
      addLog(`Đã khôi phục thiết lập cấu hình nhân vật mẫu của "${getToneStyleLabel(toneStyle)}" về mặc định.`);
    }
  };

  // Trigger individual chunk rewrite / generate
  const handleGenerateChunk = async (index: number) => {
    const chunk = chunks[index];
    if (!chunk) return;

    // Update status to running
    setChunks(prev => prev.map((c, idx) => idx === index ? { ...c, status: 'running', error: undefined } : c));
    addLog(`Đang sinh kịch bản cho đoạn ${index + 1}/${chunks.length} sử dụng mô hình ${selectedModel}...`);

    // Compile previous text for reference context
    let previousText = '';
    if (index > 0) {
      previousText = chunks
        .slice(0, index)
        .map(c => c.generatedText)
        .filter(Boolean)
        .join('\n\n');
    }

    try {
      const response = await fetch('/api/generate-chunk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chunkText: chunk.originalText,
          chunkIndex: index,
          totalChunks: chunks.length,
          toneStyle,
          speakers,
          expansionRate,
          previousGeneratedText: previousText,
          podcastName,
          ctaInterval,
          model: selectedModel,
          outputLanguage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi phản hồi phát sinh kịch bản");
      }

      const data = await response.json();
      
      setChunks(prev => prev.map((c, idx) => 
        idx === index ? { 
          ...c, 
          generatedText: data.generatedText, 
          status: 'completed',
          retryCount: data.retryCount
        } : c
      ));
      
      addLog(`✓ Đã sinh xong đoạn ${index + 1}/${chunks.length} (${data.generatedText.length} ký tự).`);
      return true;
    } catch (e: any) {
      console.error(e);
      setChunks(prev => prev.map((c, idx) => 
        idx === index ? { 
          ...c, 
          status: 'failed', 
          error: e.message || 'Không kết nối được dịch vụ' 
        } : c
      ));
      addLog(`[LỖI] Đoạn ${index + 1} gặp lỗi: ${e.message}`);
      return false;
    }
  };

  // Pipeline automated execution (run sequentially with delay)
  const stopPipeline = () => {
    stopPipelineRef.current = true;
    setPipelineActive(false);
    setCurrentRunningIndex(null);
    setCountdown(0);
    addLog("Đã gửi hiệu lệnh tạm dừng chuỗi phát sinh tự động.");
  };

  const startPipeline = async () => {
    if (chunks.length === 0) {
      alert("Vui lòng chia đoạn tài liệu nguồn trước!");
      return;
    }

    setPipelineActive(true);
    stopPipelineRef.current = false;
    addLog("Khởi động tự động chạy quy trình kịch bản tuần tự...");

    // Find first unfinished or failed chunk index to resume or start fresh
    let startIndex = chunks.findIndex(c => c.status !== 'completed');
    if (startIndex === -1) {
      // If all completed, start from beginning
      startIndex = 0;
      // Reset all status to idle
      setChunks(prev => prev.map(c => ({ ...c, status: 'idle', generatedText: '' })));
      addLog("Khởi động viết lại toàn bộ kịch bản từ đoạn đầu tiên.");
    }

    for (let i = startIndex; i < chunks.length; i++) {
      if (stopPipelineRef.current) {
        break;
      }

      setCurrentRunningIndex(i);
      
      // Execute generate for current index
      const success = await handleGenerateChunk(i);
      
      if (!success) {
        addLog(`[TẠM DỪNG] Quy trình tuần tự dừng tại đoạn ${i + 1} do lỗi cuộc gọi. Bạn có thể bấm Viết lại hoặc tiếp tục.`);
        setPipelineActive(false);
        setCurrentRunningIndex(null);
        break;
      }

      // If it is not the last chunk, process delay interval countdown
      if (i < chunks.length - 1 && !stopPipelineRef.current) {
        addLog(`Đợi ${delayTime} giây trì hoãn (delay time) để tránh giới hạn tần suất API (Rate Limit)...`);
        
        // Wait and update countdown state
        for (let cd = delayTime; cd > 0; cd--) {
          if (stopPipelineRef.current) break;
          setCountdown(cd);
          await new Promise(r => setTimeout(r, 1000));
        }
        setCountdown(0);
      }
    }

    if (!stopPipelineRef.current) {
      addLog("★ TUYỆT VỜI! Đã hoàn thành phát sinh dịch kịch bản cho tất cả các phần!");
    }
    setPipelineActive(false);
    setCurrentRunningIndex(null);
  };

  // Manual save for single chunk edit
  const handleStartEdit = (index: number, text: string) => {
    setEditingChunkId(index);
    setEditingText(text);
  };

  const handleSaveEdit = (index: number) => {
    setChunks(prev => prev.map((c, idx) => idx === index ? { ...c, generatedText: editingText } : c));
    setEditingChunkId(null);
    addLog(`Đã lưu phiên bản thay đổi tay cho đoạn ${index + 1}.`);
  };

  // Compile the entire script - filtering out section names/chapters so that it's raw text matching the guidelines perfectly
  const getFullCompiledScript = () => {
    return chunks
      .map(c => c.generatedText)
      .filter(Boolean)
      .join('\n\n');
  };

  const activeSpeakersCount = speakers.filter(s => s.isActive).length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog("Đã sao chép kịch bản hoàn thiện vào khay nhớ tạm!");
    alert("Sao chép thành công bản đọc TTS!");
  };

  return (
    <div id="podcast-tool-container" className={`min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 transition-all duration-700`}>
      
      {/* Visual Dynamic Ambiance Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-900 via-slate-950/20 to-transparent pointer-events-none z-0" />
      <div className={`absolute top-10 right-[10%] w-[400px] h-[400px] rounded-full filter blur-[120px] opacity-10 bg-gradient-to-r ${themeColors.bg} pointer-events-none z-0 transition-all duration-1000`} />
      
      <div className="relative max-w-7xl mx-auto px-4 py-8 z-10">
        
        {/* Upper Header */}
        <header id="app-header" className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin" /> {
                  selectedModel === 'gemini-3.5-flash-lite' 
                  ? 'Gemini 3.5 Flash Lite' 
                  : selectedModel === 'gemini-3.1-flash-lite' 
                    ? 'Gemini 3.1 Flash Lite' 
                    : 'Gemini 2.5 Flash'
                } Powered
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                Chuyên gia & Sáng tạo kịch bản
              </span>
            </div>
            
            <h1 id="app-title" className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent">
              Ứng Dụng Chuyên Sâu Viết Kịch Bản Podcast Hội Thoại
            </h1>
            <p id="app-subtitle" className="text-slate-400 text-sm mt-1 max-w-3xl">
              Chuyển đổi tài liệu thuyết giảng độc thoại/bài nói dài từ <span className="text-amber-300 font-medium font-mono">20K - 50K ký tự</span> thành kịch bản hội thoại 2-3 người, phối tác xưng hô thấu tình đạt lý, bám sát văn phong trị trị liệu, thực dưỡng, y học cốt lõi hoặc phong thủy, hoàn toàn dọn sạch các chỉ thị sân khấu thân ái cho đọc thử TTS.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              id="tips-toggle-btn"
              onClick={() => setShowConfigTips(!showConfigTips)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-sm transition"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Tiêu chuẩn Prompt & Mẹo</span>
            </button>
          </div>
        </header>

        {/* Helpful instructions accordion if requested */}
        {showConfigTips && (
          <div id="tips-panel" className="mb-8 p-5 bg-slate-900/80 border border-cyan-500/20 rounded-xl text-slate-300 text-sm leading-relaxed backdrop-blur-md animate-fadeIn">
            <h3 className="text-base font-semibold text-cyan-300 mb-3 flex items-center gap-2">
              💡 Hướng dẫn cấu hình tối ưu hiệu quả sinh kịch bản Podcast
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-100 mb-1">1. Động cơ Chia Đoạn (Churking):</h4>
                <p className="text-slate-400 text-xs mb-3">
                  Văn bản cực dài (20K-50K chữ) sẽ được phân thớ thông minh thông qua API của máy chủ để tách thành từng cụm từ 2000-3000 ký tự mà không ngắt rời câu hay bẻ vụn đoạn văn. Điều này giúp tối ưu hóa ngữ cảnh và không bị tràn bộ nhớ mô hình.
                </p>
                <h4 className="font-medium text-slate-100 mb-1 font-mono">2. Quản lý Xưng Hô (Cách Gọi):</h4>
                <p className="text-slate-400 text-xs text-justify">
                  Xưng hô là điều cốt tủy của Podcast truyền cảm hứng Việt Nam. Từng ô nhân vật cho phép gán: <span className="text-teal-300 font-medium">Bản tự xưng</span> (ví dụ "Thầy"), <span className="text-teal-300 font-medium">Xưng hô đối thoại</span> (ví dụ gọi MC là "đạo hữu Minh Triết") và <span className="text-teal-300 font-medium">Gọi thính giả</span> (như "Đại chúng kính mến!"). Nó giúp Gemini thiết kế câu nói ấm cúng, đồng điệu tuyệt đối.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-100 mb-1">3. TTS Nguyên Bản (Tuyệt đối không chỉ đạo sân khấu):</h4>
                <p className="text-slate-400 text-xs mb-3">
                  Ứng dụng lọc sạch và cấm mô hình trả về các văn cảnh như "(cười nhẹ)", "(tiếng thở)", hay các phân vai đề mục có ngoặc vuông gây nhiễu cho Google/Apple TTS (Text-to-Speech) khi cắm đọc âm thanh thô.
                </p>
                <h4 className="font-medium text-slate-100 mb-1">4. Cơ chế Độc Thoại / Monologue (1 Chuyên Gia):</h4>
                <p className="text-slate-400 text-xs">
                  Nếu bạn tắt đi 2 / 3 nhân vật và chỉ để tích <span className="text-indigo-400 font-semibold font-mono">1 chuyên gia duy nhất hoạt động</span>, trình chuyển kịch bản sẽ tự hiểu và viết Podcast dạng độc thoại chia sẻ độc lập cực kỳ sâu lắng, không vẽ ra Host hỏi đáp rườm rà.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowConfigTips(false)} 
              className="mt-4 text-xs text-slate-400 hover:text-white underline block"
            >
              Đóng hướng dẫn
            </button>
          </div>
        )}

        {/* Dynamic Warning if Source Text length is out of range */}
        {sourceText.length > 50000 && (
          <div className="mb-6 p-4 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <span className="font-semibold block mb-0.5">Cảnh báo Quá Độ Dài Khuyên Dùng</span>
              Tài liệu của bạn đang có <span className="font-bold underline">{sourceText.length.toLocaleString()}</span> ký tự (vượt mức 50,000 ký tự tiêu chuẩn). Hệ thống vẫn tiến hành chia thớ nhưng thời gian có thể kéo dài hơn, khuyên dùng tách nhỏ tệp tin nếu cần kết quả lý tưởng nhất.
            </div>
          </div>
        )}

        {/* UI Container Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Config & Source Inputs (7 cols on Large) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* PANEL 1: SOURCE DOCUMENTS INPUT */}
            <section id="panel-source-input" className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none" />
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">1. Nhập Văn Bản Độc Thoại Gốc</h2>
                    <p className="text-xs text-slate-400">Hỗ trợ các bài viết dài từ 20,000 ký tự đến 50,000 ký tự</p>
                  </div>
                </div>
                
                {/* Character Counter */}
                <div className="text-right">
                  <span className={`text-xs font-mono font-medium px-2 py-1 rounded bg-slate-800 border ${
                    sourceText.length >= 20000 && sourceText.length <= 50000 
                      ? 'text-green-400 border-green-500/20' 
                      : sourceText.length > 0 
                        ? 'text-amber-400 border-amber-500/20' 
                        : 'text-slate-500 border-slate-700/50'
                  }`}>
                    {sourceText.length.toLocaleString()} ký tự
                  </span>
                </div>
              </div>

              {/* Sample loader panel */}
              <div className="mb-4 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400 mb-2 font-medium flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Thử nghiệm nhanh bằng các bài viết mẫu tương thích:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => applyPresetSampleText(SAMPLE_TEXT_SPIRITUAL)}
                    className="px-2 py-1.5 text-xs text-left text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-purple-500/40 hover:bg-purple-950/20 rounded-md transition truncate"
                  >
                    🧘 Tâm Linh & Trị Liệu
                  </button>
                  <button
                    onClick={() => applyPresetSampleText(SAMPLE_TEXT_HEALTH)}
                    className="px-2 py-1.5 text-xs text-left text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-950/20 rounded-md transition truncate"
                  >
                    🌱 Y Học & Thực Dưỡng
                  </button>
                  <button
                    onClick={() => applyPresetSampleText(SAMPLE_TEXT_FENGSUI)}
                    className="px-2 py-1.5 text-xs text-left text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-950/20 rounded-md transition truncate"
                  >
                    ☯ Phong Thủy & Bản Mệnh
                  </button>
                  <button
                    onClick={() => applyPresetSampleText(SAMPLE_TEXT_LIFE)}
                    className="px-2 py-1.5 text-xs text-left text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-blue-500/40 hover:bg-blue-950/20 rounded-md transition truncate"
                  >
                    🤝 Trải Nghiệm Cuộc Sống
                  </button>
                </div>
              </div>

              <textarea
                id="source-textarea"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Dán hoặc gõ văn bản thảo luận, bài thuyết trình, độc thoại dài của bạn tại đây... Hãy thử bấm chọn một bài viết mẫu ở trên để kiểm tra công cụ hoạt động cực nhanh."
                className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 font-sans leading-relaxed resize-y"
              />
              
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Chunk Size slider */}
                <div className="flex-1 max-w-sm">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Kích thước thớ chia (Target Chunk Size)
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">{targetChunkSize} từ/ký tự</span>
                  </div>
                  <input
                    id="chunk-size-range"
                    type="range"
                    min="1000"
                    max="5000"
                    step="100"
                    value={targetChunkSize}
                    onChange={(e) => setTargetChunkSize(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1000 ký tự (nhỏ gọn)</span>
                    <span>5000 ký tự (mở rộng ý)</span>
                  </div>
                </div>

                {/* Chunking trigger */}
                <button
                  id="chunking-action-btn"
                  onClick={handleChunkText}
                  disabled={isChunking || !sourceText}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition cursor-pointer shrink-0 ${
                    sourceText 
                    ? 'bg-slate-100 hover:bg-white text-slate-950 shadow-md shadow-slate-950/40' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isChunking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Đang chia đoạn...</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4 text-slate-950" />
                      <span>Phân đoạn Văn bản nguồn</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* PANEL 2: TONE STYLE AND SPEECH EXPANSION CONFIG */}
            <section id="panel-tone-config" className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm shadow-xl relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">2. Thiết Lập Văn Phong Toàn Thư</h2>
                  <p className="text-xs text-slate-400">Định hình năng lượng, từ ngữ xưng hô chủ đạo cho kịch bản</p>
                </div>
              </div>

              {/* Grid 4 Tone Styles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                
                {/* Tone 1: Spiritual */}
                <div 
                  onClick={() => handleToneStyleChange('spiritual')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    toneStyle === 'spiritual' 
                      ? 'bg-purple-950/20 border-purple-500/80 shadow-md shadow-purple-950/40' 
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded-lg ${toneStyle === 'spiritual' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-900 text-slate-400'}`}>
                      🧘
                    </span>
                    <h3 className={`text-sm font-semibold ${toneStyle === 'spiritual' ? 'text-purple-300' : 'text-slate-200'}`}>
                      Trị Liệu & Thiền Môn
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed text-justify">
                    Văn phong từ tốn, an yên, thâm trầm, sâu sắc, giàu lòng vị tha. Sử dụng ngôn từ thanh lọc, xoa dịu lo âu, nhắc nhở chánh niệm, tỉnh thức.
                  </p>
                </div>

                {/* Tone 2: Health */}
                <div 
                  onClick={() => handleToneStyleChange('health')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    toneStyle === 'health' 
                      ? 'bg-emerald-950/20 border-emerald-500/80 shadow-md shadow-emerald-950/40' 
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded-lg ${toneStyle === 'health' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-400'}`}>
                      🌱
                    </span>
                    <h3 className={`text-sm font-semibold ${toneStyle === 'health' ? 'text-emerald-300' : 'text-slate-200'}`}>
                      Y Học & Thực Dưỡng
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed text-justify">
                    Văn phong khoa học nhưng ấm áp, tin cậy, dễ hiểu. Giải thích cơ chế dưỡng sinh, thảo dược, mẹo cơ thể tự nhiên gần gũi như người thầy thuốc tận tâm.
                  </p>
                </div>

                {/* Tone 3: Feng Shui */}
                <div 
                  onClick={() => handleToneStyleChange('fengshui')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    toneStyle === 'fengshui' 
                      ? 'bg-amber-950/20 border-amber-500/80 shadow-md shadow-amber-950/40' 
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded-lg ${toneStyle === 'fengshui' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-900 text-slate-400'}`}>
                      ☯
                    </span>
                    <h3 className={`text-sm font-semibold ${toneStyle === 'fengshui' ? 'text-amber-300' : 'text-slate-200'}`}>
                      Phong Thủy Cát Hung
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed text-justify">
                    Văn phong uyên bác, trang nghiêm, phân tích logic Ngũ Hành Âm Dương. Tập trung đùa đức năng thắng số, tàng phong tụ khí, trung thực và chiêm nghiệm sâu.
                  </p>
                </div>

                {/* Tone 4: Life/Psychology */}
                <div 
                  onClick={() => handleToneStyleChange('life')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                    toneStyle === 'life' 
                      ? 'bg-blue-950/20 border-blue-500/80 shadow-md shadow-blue-950/40' 
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded-lg ${toneStyle === 'life' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-900 text-slate-400'}`}>
                      🤝
                    </span>
                    <h3 className={`text-sm font-semibold ${toneStyle === 'life' ? 'text-blue-300' : 'text-slate-200'}`}>
                      Tâm Lý Khử Lòng & Cuộc Sống
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed text-justify">
                    Văn phong triết lý, lôi cuốn, thực tế. Kể các câu chuyện sinh động đúc kết lẽ sống nhẹ nhàng, gắn kết trực tiếp cảm tính trái tim người nghe.
                  </p>
                </div>

              </div>

              {/* Character Expansion Percentage selection */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" /> Tỷ Lệ Viết Mở Rộng So Với Gốc
                  </h4>
                  <p className="text-xs text-slate-400">Tuyệt đối không tóm tắt, cho phép tăng chiều sâu hội thoại</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
                  <button
                    onClick={() => setExpansionRate(1.0)}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      expansionRate === 1.0 
                      ? 'bg-slate-800 text-white font-bold' 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    100% (Giữ Đầy Đủ)
                  </button>
                  <button
                    onClick={() => setExpansionRate(1.2)}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      expansionRate === 1.2 
                      ? `${themeColors.badge} font-bold text-white` 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    120% (Chi tiết nhẹ)
                  </button>
                  <button
                    onClick={() => setExpansionRate(1.5)}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      expansionRate === 1.5 
                      ? `${themeColors.badge} font-bold text-white` 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    150% (Phân tích rộng)
                  </button>
                </div>
              </div>

              {/* Gemini Model Selection */}
              <div id="model-selection-wrapper" className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Mô Hình Ngôn Ngữ Gemini
                  </h4>
                  <p className="text-xs text-slate-400">Chọn mô hình phù hợp để tối ưu độ nhạy xưng hô và suy luận</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
                  <button
                    id="model-35-lite"
                    onClick={() => {
                      setSelectedModel('gemini-3.5-flash-lite');
                      try { localStorage.setItem('podcast_selected_model', 'gemini-3.5-flash-lite'); } catch (e) {}
                      addLog("Đã chọn mô hình: Gemini 3.5 Flash Lite");
                    }}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      selectedModel === 'gemini-3.5-flash-lite' 
                      ? 'bg-slate-800 text-cyan-300 font-bold' 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3.5 Flash Lite
                  </button>
                  <button
                    id="model-31-lite"
                    onClick={() => {
                      setSelectedModel('gemini-3.1-flash-lite');
                      try { localStorage.setItem('podcast_selected_model', 'gemini-3.1-flash-lite'); } catch (e) {}
                      addLog("Đã chọn mô hình: Gemini 3.1 Flash Lite");
                    }}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      selectedModel === 'gemini-3.1-flash-lite' 
                      ? 'bg-slate-800 text-cyan-300 font-bold' 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3.1 Flash Lite
                  </button>
                  <button
                    id="model-25"
                    onClick={() => {
                      setSelectedModel('gemini-2.5-flash');
                      try { localStorage.setItem('podcast_selected_model', 'gemini-2.5-flash'); } catch (e) {}
                      addLog("Đã chọn mô hình: Gemini 2.5 Flash");
                    }}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      selectedModel === 'gemini-2.5-flash' 
                      ? 'bg-slate-800 text-cyan-300 font-bold' 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2.5 Flash
                  </button>
                </div>
              </div>

              {/* Podcast Output Language Selection */}
              <div id="language-selection-wrapper" className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-400" /> Ngôn Ngữ Kịch Bản (Output)
                  </h4>
                  <p className="text-xs text-slate-400">Chọn ngôn ngữ xuất bản để AI tự động nhận diện hoặc chuyển ngữ phù hợp</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
                  <button
                    id="lang-auto"
                    onClick={() => {
                      setOutputLanguage('auto');
                      try { localStorage.setItem('podcast_output_language', 'auto'); } catch (e) {}
                      addLog("Đã cấu hình ngôn ngữ: Tự động (Theo văn bản gốc)");
                    }}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      outputLanguage === 'auto' 
                      ? 'bg-slate-800 text-emerald-300 font-bold' 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tự Động (Theo Gốc)
                  </button>
                  <button
                    id="lang-vi"
                    onClick={() => {
                      setOutputLanguage('vi');
                      try { localStorage.setItem('podcast_output_language', 'vi'); } catch (e) {}
                      addLog("Đã cấu hình ngôn ngữ: Luôn viết Tiếng Việt");
                    }}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      outputLanguage === 'vi' 
                      ? 'bg-slate-800 text-emerald-300 font-bold' 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tiếng Việt
                  </button>
                  <button
                    id="lang-en"
                    onClick={() => {
                      setOutputLanguage('en');
                      try { localStorage.setItem('podcast_output_language', 'en'); } catch (e) {}
                      addLog("Đã cấu hình ngôn ngữ: Luôn viết Tiếng Anh");
                    }}
                    className={`px-3 py-1.5 text-xs rounded-md font-medium transition cursor-pointer ${
                      outputLanguage === 'en' 
                      ? 'bg-slate-800 text-emerald-300 font-bold' 
                      : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tiếng Anh
                  </button>
                </div>
              </div>
            </section>

            {/* BRANDING & PROMOTION CONFIGURATIONS */}
            <section id="panel-branding-setup" className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">3. Nhận Diện Kênh & Kêu Gọi Tương Tác</h2>
                  <p className="text-xs text-slate-400">Cấu hình tên thương hiệu/Show và tần suất chèn lời kêu gọi tương tác (Tự động lưu)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Channel/Program column */}
                <div className="space-y-1.5">
                  <label htmlFor="podcast-name-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Tên Chương Trình / Kênh YouTube / Podcast
                  </label>
                  <div className="relative">
                    <input
                      id="podcast-name-input"
                      type="text"
                      className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-200 text-sm px-3.5 py-2.5 rounded-xl transition duration-200 pl-10"
                      placeholder="Ví dụ: Kênh Sách Nói Chữa Lành, Khỏe Đẹp Mỗi Ngày..."
                      value={podcastName}
                      onChange={(e) => handlePodcastNameChange(e.target.value)}
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                      <Tv className="w-4 h-4 text-pink-400" />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Dùng làm ngữ liệu đọc tên Show trực tiếp trong lời đối đáp.</span>
                </div>

                {/* Call-to-action column */}
                <div className="space-y-1.5">
                  <label htmlFor="cta-interval-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Tần Suất Kêu Gọi Tương Tác (CTA)
                  </label>
                  <div className="relative">
                    <select
                      id="cta-interval-select"
                      className="w-full bg-slate-950 border border-slate-850 hover:border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-200 text-sm px-3.5 py-2.5 rounded-xl transition duration-200 cursor-pointer appearance-none pl-10"
                      value={ctaInterval}
                      onChange={(e) => handleCtaIntervalChange(parseInt(e.target.value, 10))}
                    >
                      <option value={0}>Không kêu gọi (Tắt CTA)</option>
                      <option value={2}>Mỗi 2 đoạn hội thoại kêu gọi 1 lần</option>
                      <option value={3}>Mỗi 3 đoạn hội thoại kêu gọi 1 lần (Khuyên dùng)</option>
                      <option value={4}>Mỗi 4 đoạn hội thoại kêu gọi 1 lần</option>
                    </select>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <MessageSquare className="w-4 h-4 text-pink-400" />
                    </div>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                      ▼
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Kêu gọi một cách khéo léo, tự nhiên mà không dập khuôn máy móc.</span>
                </div>
              </div>
            </section>

            {/* PANEL 3: SPEAKER CONFIGURATIONS */}
            <section id="panel-speakers-setup" className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">4. Cấu Hình Từng Nhân Vật & Xưng Hô</h2>
                    <p className="text-xs text-slate-400">Hỗ trợ 2-3 người hoặc độc thoại (tự động lưu vào trình duyệt)</p>
                  </div>
                </div>

                {/* State summary badge & Reset utility */}
                <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
                  <button
                    id="reset-speakers-btn"
                    onClick={handleResetSpeakersToDefault}
                    className="text-[11px] font-medium text-slate-400 hover:text-white bg-slate-950 border border-slate-850 hover:border-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 shrink-0"
                    title="Khôi phục gốc thiết lập mẫu cho văn phong này"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset mặc định
                  </button>
                  <span className={`text-[11px] px-2.5 py-1.5 rounded-full border shrink-0 ${
                    activeSpeakersCount === 1 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                    : 'bg-green-500/10 border-green-500/30 text-green-300'
                  }`}>
                    {activeSpeakersCount === 1 ? 'Độc thoại' : `Hội thoại: ${activeSpeakersCount} người`}
                  </span>
                </div>
              </div>

              {/* 3 Speakers columns layout */}
              <div className="space-y-4">
                {speakers.map((sp, idx) => {
                  const isHost = idx === 0;
                  return (
                    <div 
                      key={sp.id}
                      className={`p-4 rounded-xl border transition-all duration-300 relative ${
                        sp.isActive 
                        ? 'bg-slate-950 border-slate-700 shadow-md' 
                        : 'bg-slate-950/20 border-slate-900 opacity-60'
                      }`}
                    >
                      {/* Speaker header / trigger */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-800/60 mb-4 gap-2">
                        <div className="flex items-center gap-2.5">
                          {/* Checked switch */}
                          <button
                            id={`toggle-speaker-${sp.id}`}
                            onClick={() => toggleSpeakerActive(sp.id)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                              sp.isActive ? 'bg-cyan-500' : 'bg-slate-800'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              sp.isActive ? 'translate-x-4' : 'translate-x-0'
                            }`} />
                          </button>
                          
                          <div className="text-left">
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">
                              Nhân vật {idx + 1} {isHost ? '(Mặc định là Host/MC)' : '(Khách mời chuyên gia)'}
                            </span>
                            <span className={`text-sm font-semibold ${sp.isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                              {sp.name || `Người nói ${idx + 1}`}
                            </span>
                          </div>
                        </div>

                        {/* Status tag */}
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                          sp.isActive 
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          {sp.isActive ? 'Hoạt động' : 'Tạm tắt'}
                        </span>
                      </div>

                      {/* Editing fields (Only enabled if active) */}
                      {sp.isActive && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Col Left: Identity */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-slate-400 block mb-1">Tên nhân vật tiếng Việt</label>
                              <input 
                                type="text"
                                value={sp.name}
                                onChange={(e) => updateSpeakerField(sp.id, 'name', e.target.value)}
                                placeholder="Tên VD: Thầy Pháp Hải, Bác sĩ Hùng..."
                                className="w-full text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-slate-400 block mb-1">Thân phận / Vai trò chức vụ</label>
                              <input 
                                type="text"
                                value={sp.role}
                                onChange={(e) => updateSpeakerField(sp.id, 'role', e.target.value)}
                                placeholder="Ví dụ: Thiền sư chiêm nghim, Chuyên gia thực dưỡng..."
                                className="w-full text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-slate-400 block mb-1">Phong thái / Giọng điệu thiết lập</label>
                              <textarea 
                                value={sp.style}
                                onChange={(e) => updateSpeakerField(sp.id, 'style', e.target.value)}
                                placeholder="Ví dụ: Thâm thâm, đĩnh đạc, phân tích khoa học tâm hồm..."
                                className="w-full h-16 text-xs bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-lg p-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 resize-none"
                              />
                            </div>
                          </div>

                          {/* Col Right: Custom Vietnam Xưng Hô (Critical requested item) */}
                          <div className="space-y-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                            <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                              <Volume2 className="w-3.5 h-3.5" /> Quy định văn cách xưng hô:
                            </span>

                            <div className="grid grid-cols-1 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Tự xưng (Của nhân vật này)</label>
                                <input 
                                  type="text"
                                  value={sp.pronounSelf}
                                  onChange={(e) => updateSpeakerField(sp.id, 'pronounSelf', e.target.value)}
                                  placeholder="Ví dụ: Thầy, Chúng tôi, Tôi, Hoài Anh..."
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500/50"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Xưng kêu đối thoại (gọi người kia)</label>
                                <input 
                                  type="text"
                                  value={sp.pronounOther}
                                  onChange={(e) => updateSpeakerField(sp.id, 'pronounOther', e.target.value)}
                                  placeholder="Ví dụ: Đạo hữu, Host, Bác sĩ Huy..."
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500/50"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Gọi quý độc giả/thính giả nghe</label>
                                <input 
                                  type="text"
                                  value={sp.pronounAudience}
                                  onChange={(e) => updateSpeakerField(sp.id, 'pronounAudience', e.target.value)}
                                  placeholder="Ví dụ: Đại chúng!, Quý thính giả..."
                                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500/50"
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* RIGHT SIDE: Progress timeline & script compiler output (5 cols on Large) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* PANEL 4: CHUNK LIST & AUTO GENERATION TIMER PIPELINE */}
            <section id="panel-writer-queue" className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm shadow-xl space-y-6">
              
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">4. Thớ kịch bản & Tiến trình viết</h2>
                    <p className="text-xs text-slate-400">Theo dõi, tạo hoãn tránh rate limits, viết lại từng phần</p>
                  </div>
                </div>
              </div>

              {/* Delay control for Rate limits */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Thời gian tạo hoãn (Delay Time)
                  </span>
                  <span className="font-mono text-indigo-300 font-bold">{delayTime} giây / đoạn</span>
                </div>
                <input 
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={delayTime}
                  onChange={(e) => setDelayTime(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
                <p className="text-[10px] text-slate-500 italic">
                  * Trực tiếp hỗ trợ tránh nghẹt lỗi phản hồi của Gemini khi viết tự động cho chuỗi đoạn quá nhanh.
                </p>
              </div>

              {/* Pipeline automation active control buttons */}
              {chunks.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2">
                  {pipelineActive ? (
                    <button
                      id="pipeline-stop-btn"
                      onClick={stopPipeline}
                      className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      Tạm dùng chuỗi viết ({countdown > 0 ? `Đang đếm trì hoãn: ${countdown}s` : 'Đang xử lý'})
                    </button>
                  ) : (
                    <button
                      id="pipeline-start-btn"
                      onClick={startPipeline}
                      className={`flex-1 ${themeColors.button} text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md`}
                    >
                      <Play className="w-3.5 h-3.5" />
                      Viết Toàn Bộ Tự Động ({chunks.filter(c => c.status === 'completed').length}/{chunks.length} Xong)
                    </button>
                  )}
                </div>
              )}

              {/* Empty state chunks queue */}
              {chunks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                  <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-400 text-xs px-4">
                    Khu vực xếp hàng các thớ kịch bản rỗng. Hãy điền văn bản và bấm <strong className="text-slate-200">"Phân đoạn Văn bản nguồn"</strong>.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {chunks.map((ch, idx) => {
                    const isRunning = ch.status === 'running' || currentRunningIndex === idx;
                    const isCompleted = ch.status === 'completed';
                    const isFailed = ch.status === 'failed';
                    
                    return (
                      <div 
                        key={ch.index}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          isRunning 
                            ? 'bg-slate-900 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/10' 
                            : isCompleted 
                              ? 'bg-slate-900/30 border-green-500/20' 
                              : isFailed 
                                ? 'bg-red-950/20 border-red-500/30' 
                                : 'bg-slate-950 border-slate-900'
                        }`}
                      >
                        {/* Chunk Info header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              isRunning 
                                ? 'bg-cyan-400 animate-ping' 
                                : isCompleted 
                                  ? 'bg-green-400' 
                                  : isFailed 
                                    ? 'bg-red-400' 
                                    : 'bg-slate-600'
                            }`} />
                            <span className="text-[11px] font-mono font-semibold text-slate-300">
                              Đoạn {idx + 1} / {chunks.length}
                            </span>
                            {ch.retryCount && ch.retryCount > 0 && (
                              <span className="text-[10px] text-amber-500 font-medium animate-pulse ml-1">
                                (Viết lại: {ch.retryCount})
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500">
                              (~{ch.originalText.length} ký tự gốc)
                            </span>
                          </div>

                          {/* Quick single actions */}
                          <div className="flex gap-1">
                            {!isRunning && (
                              <button
                                onClick={() => handleGenerateChunk(idx)}
                                className={`p-1 rounded text-[10px] flex items-center gap-1 transition ${
                                  isCompleted 
                                    ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' 
                                    : isFailed 
                                      ? 'bg-red-900/40 hover:bg-red-900 text-red-100' 
                                      : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 font-medium'
                                }`}
                                title={isCompleted ? "Viết lại phần này" : "Bắt đầu sinh kịch bản cho đoạn này"}
                              >
                                <RefreshCw className="w-2.5 h-2.5" />
                                <span>{isCompleted ? 'Viết lại' : isFailed ? 'Sửa lại' : 'Viết'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Chunk original text snippet accordion */}
                        <div className="text-[10px] line-clamp-2 text-slate-500 bg-slate-950 p-2 rounded mb-2 border border-slate-900 leading-normal italic select-none">
                          {ch.originalText}
                        </div>

                        {/* Status outputs / Error alerts */}
                        {isFailed && ch.error && (
                          <div className="text-[10px] p-2 bg-red-950/40 border border-red-500/20 text-red-300 rounded mb-2">
                            Lỗi phát sinh: {ch.error}
                          </div>
                        )}

                        {/* Generated spoken text result controls */}
                        {isCompleted && ch.generatedText && (
                          <div className="space-y-1.5">
                            {editingChunkId === idx ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full h-32 text-xs bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                                />
                                <div className="flex justify-end gap-1">
                                  <button
                                    onClick={() => setEditingChunkId(null)}
                                    className="px-2 py-1 text-[10px] rounded bg-slate-900 hover:bg-slate-800 text-slate-400 transition"
                                  >
                                    Đóng
                                  </button>
                                  <button
                                    onClick={() => handleSaveEdit(idx)}
                                    className="px-2 py-1 text-[10px] rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold transition"
                                  >
                                    Lưu chỉnh sửa
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1.5 bg-slate-950/80 p-2.5 rounded border border-slate-800/50">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-green-400 flex items-center gap-1 font-semibold">
                                    <CheckCircle className="w-3 h-3" /> Thành công: {ch.generatedText.length.toLocaleString()} ký tự
                                  </span>
                                  <button
                                    onClick={() => handleStartEdit(idx, ch.generatedText)}
                                    className="p-1 rounded bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                                    title="Chỉnh sửa nhanh kịch bản đoạn này"
                                  >
                                    <Edit3 className="w-2.5 h-2.5 text-cyan-400" /> Sửa tay
                                  </button>
                                </div>
                                <div className="flex items-center justify-between text-[9px] pt-1.5 border-t border-slate-900 text-slate-400">
                                  <span>Tỉ lệ giãn nở: <strong className="text-slate-300">{Math.round((ch.generatedText.length / ch.originalText.length) * 100)}%</strong></span>
                                  {(() => {
                                    const chunkRate = ch.generatedText.length / ch.originalText.length;
                                    const isOk = Math.abs(chunkRate - expansionRate) <= 0.15;
                                    return (
                                      <span className={`px-1.5 py-0.5 rounded-sm font-mono ${
                                        isOk ? "bg-green-500/10 text-green-300" : "bg-amber-500/10 text-amber-300"
                                      }`}>
                                        {isOk ? "✓ Khớp mục tiêu" : `Lệch: ${chunkRate > expansionRate ? "+" : ""}${Math.round((chunkRate - expansionRate) * 100)}%`}
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Progress bar animation */}
                        {isRunning && (
                          <div className="space-y-1 mt-2">
                            <div className="flex justify-between text-[9px] text-cyan-400">
                              <span className="flex items-center gap-1">
                                <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Đang dịch qua chuyên mảng...
                              </span>
                              <span>Mô hình đang viết...</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-1.5 rounded-full animate-pulse w-[80%]" />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Console Logs footer for developer feel */}
              <div className="border-t border-slate-800/80 pt-4">
                <span className="text-[9px] tracking-wider text-slate-500 uppercase font-bold block mb-1.5">
                  Nhật ký tinh chỉnh (Live Console Outputs)
                </span>
                <div className="h-28 overflow-y-auto bg-slate-950 rounded-lg p-2.5 border border-slate-900 font-mono text-[9px] text-slate-400 leading-normal space-y-1 leading-relaxed">
                  {logs.length === 0 ? (
                    <div className="text-slate-600 italic">Sẵn sàng chờ tiếp nhận tác vụ...</div>
                  ) : (
                    logs.map((lg, lIdx) => <div key={lIdx}>{lg}</div>)
                  )}
                </div>
              </div>
            </section>

          </div>

        </div>

        {/* COMPILER PANEL: Consolidated complete script */}
        <section id="panel-compiled-script" className="mt-8 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full filter blur-[150px] opacity-5 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  5. Kịch Bản Podcast Đồng Bộ Đầy Đủ (TTS Ready)
                </h2>
                <p className="text-xs text-slate-400">
                  Dành riêng cho máy đọc TTS: Tuyệt đối không chỉ đạo sân khấu, không phân tiêu đề, chương hồi
                </p>
              </div>
            </div>

            {/* Compiled state summary */}
            <div className="flex gap-2">
              <button
                id="compiled-copy-btn"
                onClick={() => copyToClipboard(getFullCompiledScript())}
                disabled={!getFullCompiledScript()}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition uppercase cursor-pointer ${
                  getFullCompiledScript() 
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-950/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Copy className="w-3.5 h-3.5 text-slate-950" />
                <span>Sao chép bản đọc TTS</span>
              </button>
            </div>
          </div>

          {/* Consolidated textarea compiler */}
          {getFullCompiledScript() ? (
            <div className="space-y-4 font-sans">
              
              {/* Real-time Length & Ratio Dashboard */}
              {(() => {
                const totalOrig = chunks.reduce((acc, c) => acc + c.originalText.length, 0);
                const totalGen = chunks.reduce((acc, c) => acc + (c.generatedText ? c.generatedText.length : 0), 0);
                const actualRate = totalOrig > 0 ? totalGen / totalOrig : 0;
                const deviation = actualRate - expansionRate;
                const isWithinBound = Math.abs(deviation) <= 0.15; // ±15% variance threshold
                
                let ratingColor = "text-green-400 border-green-500/20 bg-green-500/5";
                let ratingText = `Khớp tỉ lệ lý tưởng (±15% so với mục tiêu ${Math.round(expansionRate * 100)}%)`;
                if (deviation > 0.15) {
                  ratingColor = "text-amber-400 border-amber-500/20 bg-amber-500/5";
                  ratingText = `Hơi vượt mức đặt (${Math.round((actualRate - expansionRate) * 100)}% dôi dư)`;
                } else if (deviation < -0.15) {
                  ratingColor = "text-indigo-400 border-indigo-500/20 bg-indigo-500/5";
                  ratingText = `Hơi cô đọng (${Math.round((expansionRate - actualRate) * 100)}% dưới mục tiêu)`;
                }

                return (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Tổng ký tự văn bản gốc</span>
                      <span className="text-sm font-mono font-bold text-slate-300 block">{totalOrig.toLocaleString()} ký tự</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Mục tiêu dãn nở ({Math.round(expansionRate * 100)}%)</span>
                      <span className="text-sm font-mono font-bold text-cyan-400 block">~{Math.round(totalOrig * expansionRate).toLocaleString()} ký tự</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Kịch bản thực tế đã viết</span>
                      <span className="text-sm font-mono font-bold text-emerald-400 block">{totalGen.toLocaleString()} ký tự</span>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Tỉ lệ nở lý học thực tế</span>
                      <span className="text-sm font-mono font-bold text-white block">
                        {Math.round(actualRate * 100)}% {actualRate > 0 && <span className="text-[10px] font-normal text-slate-400">({(actualRate).toFixed(2)}x)</span>}
                      </span>
                    </div>
                    
                    {/* Visual progress state representation row */}
                    <div className="col-span-2 lg:col-span-4 pt-2.5 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Trạng thái giãn tỷ lệ gốc (100%)</span>
                          <span>Đạt: {Math.round(actualRate * 100)}% / Mục tiêu: {Math.round(expansionRate * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-905 rounded-full h-1.5 overflow-hidden border border-slate-900">
                          <div 
                            style={{ width: `${Math.min(100, Math.round((actualRate / 2.0) * 100))}%` }} 
                            className={`h-full rounded-full transition-all duration-700 ${
                              isWithinBound 
                                ? "bg-gradient-to-r from-emerald-500 to-teal-400" 
                                : actualRate > expansionRate 
                                  ? "bg-gradient-to-r from-amber-500 to-amber-300 animate-pulse" 
                                  : "bg-gradient-to-r from-indigo-500 to-cyan-400"
                            }`} 
                          />
                        </div>
                      </div>
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded border ${ratingColor} self-end sm:self-center`}>
                        {ratingText}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <textarea
                id="compiled-output-text"
                readOnly
                value={getFullCompiledScript()}
                rows={12}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 placeholder:text-slate-600 leading-relaxed shadow-inner focus:outline-none"
              />

              {/* TTS Compliance checklist */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-300">
                    <span className="font-semibold block mb-0.5">Lọc Chỉ Đạo Sân Khấu</span>
                    Tuyệt đối loại bỏ nhạc nền, biểu thị hành vi, thở dài hay mỉm cười trong ngoặc kép.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-300">
                    <span className="font-semibold block mb-0.5">Xưng Hô Đồng Thời</span>
                    Thiết bị xưng hiệu thống nhất từ đầu đến cuối đối thoại an yên/y khóa/vận số.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-300">
                    <span className="font-semibold block mb-0.5">Nguyên Bản Thuyết Giảng</span>
                    Cam kết bảo toàn trọn vẹn 100% lượng nội dung kiến thức gốc, không cắt ráp thô sơ.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-950 rounded-xl border border-slate-900">
              <Volume2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">Kịch bản chưa được tổng hợp</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-normal">
                Kích hoạt phân đoạn tài liệu và tiến hành khởi chạy viết tự động hoặc đơn lẻ từng thớ kịch bản ở trên để ghi nhận kết quả.
              </p>
            </div>
          )}

        </section>

        {/* Humble Footer */}
        <footer className="mt-16 text-center text-slate-600 text-[11px] border-t border-slate-900 pt-6">
          <p>Thiết kế tinh xảo phục vụ máy đọc TTS Tiếng Việt tự nhiên.</p>
          <p className="mt-1">© Google AI Studio Antigravity Workshop. Mô hình: gemini-3.1-flash-lite</p>
        </footer>

      </div>
    </div>
  );
}
