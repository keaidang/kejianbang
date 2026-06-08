// app.js - Core Interactive Logic & API Connections

// ==========================================
// 0. Configuration & Global State
// ==========================================
const DASHSCOPE_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
let DASHSCOPE_API_KEY = "sk-b0d611826846463d8b7c3a78ce680d9b"; // Default pre-seeded key

// 0.1 Default Database Mock Data (China's Rivers)
const DATABASE = {
  course_title: "中国主要河流地理特征介绍",
  course_badge: "AI 互动课",
  api_key: "sk-b0d611826846463d8b7c3a78ce680d9b",
  course_code: "GEO-101",
  teacher_name: "李明 老师",
  students: [
    { id: "2026001", name: "张三" },
    { id: "2026002", name: "李四" },
    { id: "2026003", name: "王五" }
  ],
  
  // Dynamic Segment Categories:
  // - distribution (水系分布)
  // - landform (河流地貌)
  // - ecology (生态价值)
  // - conservation (保护治理)
  segments: [
    { 
      time: 64, 
      title: "中国河流总体特征", 
      color: "green", 
      categories: "distribution", 
      tags: ["流域分布", "径流差异"], 
      desc: "我国河流地势西高东低，东流入海。外流区占陆地面积的2/3左右，内流区占1/3左右。河流水文特征深受季风气候影响，南方河流流量大、汛期长、含沙量小且无结冰期，北方相反。" 
    },
    { 
      time: 129, 
      title: "中国七大水系概况", 
      color: "purple", 
      categories: "distribution", 
      tags: ["七大水系", "区域作用"], 
      desc: "包括长江水系、黄河水系、珠江水系、淮河水系、海河水系、辽河水系和松花江水系，这七大江河流域构成了我国主要的工农业生产与生态环境用水骨架。" 
    },
    { 
      time: 236, 
      title: "黄河的治理措施", 
      color: "pink", 
      categories: "conservation", 
      tags: ["黄河治理", "小浪底水利枢纽"], 
      desc: "黄河治理以“泥沙”为核心。在中游黄土高原实施退耕还林、植树造林，保持水土；在下游通过小浪底水利枢纽进行水沙联调，冲刷下游河道阻碍地上悬河持续抬高。" 
    },
    { 
      time: 415, 
      title: "中国典型河流地貌", 
      color: "pink", 
      categories: "landform", 
      tags: ["峡谷地貌", "三角洲地貌"], 
      desc: "通过流水地质作用塑造地貌。上游河流落差大，下切侵蚀剧烈，形成深切的V型谷（如长江三峡）；下游水流缓慢，搬运能力下降，泥沙堆积形成平原与河口三角洲。" 
    },
    { 
      time: 541, 
      title: "河流价值与保护治理", 
      color: "orange", 
      categories: "ecology conservation", 
      tags: ["生态价值", "保护措施"], 
      desc: "中国河流存在水土资源匹配失衡问题，同时具备高航运与发电价值。当前面临水土流失、水体污染等挑战，我国推行河长制、长江十年禁渔、南水北调工程进行综合治理。" 
    },
    { 
      time: 635, 
      title: "河流保护面临的挑战与治理措施", 
      color: "green", 
      categories: "conservation", 
      tags: ["水土流失", "水体污染", "湿地锐减", "河长制", "十年禁渔", "海绵城市", "南水北调"], 
      desc: "全面剖析流域生态系统退化成因。推行地方首长责任制的“河长制”，退耕还林还草，控制沿江工业排污；通过海绵城市建设提升都市雨水净化与回渗能力。" 
    },
    { 
      time: 769, 
      title: "河流保护治理的未来展望", 
      color: "purple", 
      categories: "conservation", 
      tags: ["国家水网", "节水改造", "生态流量", "智慧水利"], 
      desc: "我国正全力规划“国家水网”宏观调水框架。推进灌区防渗等节水改造，严格保障各大江河的生态流量基线，并利用大数据、遥感等手段建设数字化“智慧水利”体系。" 
    }
  ],

  transcripts: [
    { time: 0, text: "大家好，欢迎来到本期课件帮互动地理课堂。" },
    { time: 10, text: "今天我们将一起深入探索中国主要河流的地理特征。" },
    { time: 22, text: "本节课共分为四个核心部分：总体特征、七大水系、典型河流以及治理保护。" },
    { time: 64, text: "首先，我们来看一下中国河流的总体地理特征。" },
    { time: 80, text: "我国的地势西高东低，呈明显的三级阶梯状分布特征。" },
    { time: 98, text: "这种西高东低的地势，决定了我国大多数主要江河的流向为自西向东，最终注入太平洋。" },
    { time: 129, text: "接下来，我们进入第二部分：中国七大水系分布与概况。" },
    { time: 145, text: "大家可以在图表上看到，我国的七大水系包括：长江、黄河、珠江、淮河、海河、辽河和松花江。" },
    { time: 170, text: "这七大江河流域构成了我国主要的工农业生产与生态环境用水骨架。" },
    { time: 195, text: "长江作为第一大河，流域面积广阔，径流量巨大，具有极高的航运价值。" },
    { time: 230, text: "而黄河中游流经黄土高原，携带了大量泥沙，导致下游河床抬高形成地上悬河。" },
    { time: 274, text: "南方的珠江水系年径流量仅次于长江，水流稳定，是我国南部的水运大动脉。" },
    { time: 312, text: "北方的松花江水系，由于纬度较高，冰雪融水显著，每年有明显的春汛和夏汛双汛期。" },
    { time: 345, text: "淮河流域则是我国南北地理与气候的重要过渡带，防洪抗旱任务尤为艰巨。" },
    { time: 375, text: "海河与辽河流域水资源总量较为短缺，近年来依托跨流域调水工程缓解了用水紧张。" },
    { time: 415, text: "现在，我们进行第三部分：中国典型河流导学——长江与黄河的生命历程。" },
    { time: 440, text: "我们将追踪一滴水从青藏高原的雪山源头出发，经过激流峡谷，在中下游冲积平原堆积的演变。" },
    { time: 470, text: "流水在不同的流段展现出不同的地质力量，塑造了壶口瀑布、三峡大峡谷以及广袤的冲积三角洲。" },
    { time: 510, text: "这就是河流的生老病死，它们以特有的脉动塑造了中华文明的生存根基。" },
    { time: 541, text: "最后，我们要探讨的是河流的生态价值与开发治理保护措施。" },
    { time: 570, text: "河流为我们提供了源源不断的清洁能源、灌溉水源和防洪安全。" },
    { time: 600, text: "但也面临着水体污染、水土流失、湿地萎缩等生态赤字问题。" },
    { time: 640, text: "推行‘河长制’，实施黄河高质量发展规划与‘长江十年禁渔’，是保障大江大河碧水常流的关键。" },
    { time: 700, text: "感谢同学们的认真聆听，请大家继续在右侧的研学空间进行随堂练习与闪卡温习！" }
  ],

  slides: [
    {
      time: 0,
      title: "中国主要河流地理特征介绍",
      bullets: ["主讲人：智能教师", "课件帮·AI互动地理课堂", "探讨：地势、水系与生态治理"]
    },
    {
      time: 33,
      title: "目录 / CONTENTS",
      bullets: ["01 中国河流总体特征", "02 七大水系分类详述", "03 典型河流生命史", "04 河流的生态保护与协同治理"]
    },
    {
      time: 64,
      title: "01 我国河流的总体特征",
      bullets: ["受西高东低地势影响，多大江大河东流入海", "外流区（流入海洋，占2/3）与内流区（占1/3）", "秦岭-淮河一线：南北方河流水文特征的地理分界"]
    },
    {
      time: 129,
      title: "02 中国主要七大水系分布",
      bullets: ["三大流域区：太平洋、印度洋与北冰洋流域", "七大主力：长江、黄河、珠江、淮河、海河、辽河、松花江", "水系网络构成了中国宏观的水土与人文走廊"]
    },
    {
      time: 195,
      title: "长江水系详述 —— 黄金水道",
      bullets: ["发源于唐古拉山，流经11省区，注入东海", "第一大河：长度、径流量、流域面积均居全国首位", "上游富水能（三峡大坝），中下游宜航运"]
    },
    {
      time: 230,
      title: "黄河水系详述 —— 母亲河之殇",
      bullets: ["发源于巴颜喀拉山，流经9省区，注入渤海", "中游流经黄土高原，携带巨量泥沙（含沙量世界之最）", "下游流速变缓，泥沙淤积，形成“地上悬河”"]
    },
    {
      time: 274,
      title: "珠江水系详述 —— 南方水运命脉",
      bullets: ["由西江、北江、东江汇合而成，注入南海", "年径流量仅次于长江（黄河的6倍），通航价值高", "水网纵横交错，是粤港澳大湾区生命线"]
    },
    {
      time: 312,
      title: "北方的松花江与春汛夏汛",
      bullets: ["黑龙江最大支流，流经东北湿地与黑土地", "纬度高，结冰期长（达5个月），春季积雪融化形成春汛", "夏季受锋面雨带影响产生夏汛，双汛期显著"]
    },
    {
      time: 415,
      title: "03 典型河流的生命演变过程",
      bullets: ["上游：落差大，流水侵蚀切割作用，形成V型谷", "中游：河道渐宽，流水搬运作用，泥沙随水流下泄", "下游：平原开阔，流水堆积作用，造就冲积扇与三角洲"]
    },
    {
      time: 541,
      title: "04 江河开发利用与流域保护",
      bullets: ["开发：防洪、水力发电、农业灌溉、工业供水", "挑战：过度取水导致断流，工业污染，生物多样性锐减", "保护：全面推行“河长制”，退田还湖，绿色协同发展"]
    }
  ],

  mindmap: {
    nodes: [
      { id: "root", label: "中国河流地理特征", x: 40, y: 150, type: "root", time: 0 },
      { id: "c1", label: "一、河流总体特征", x: 200, y: 50, type: "child", time: 64 },
      { id: "c1-1", label: "外流区 (太平洋/印度洋/北冰洋)", x: 380, y: 30, type: "leaf", time: 80 },
      { id: "c1-2", label: "内流区 (高山融雪/内陆湖泊)", x: 380, y: 70, type: "leaf", time: 104 },
      { id: "c2", label: "二、七大水系分布", x: 200, y: 180, type: "child", time: 129 },
      { id: "c2-1", label: "长江水系 (第一大河/水能宝库)", x: 380, y: 120, type: "leaf", time: 195 },
      { id: "c2-2", label: "黄河水系 (含沙量大/地上悬河)", x: 380, y: 155, type: "leaf", time: 230 },
      { id: "c2-3", label: "珠江水系 (高径流量/航运发达)", x: 380, y: 190, type: "leaf", time: 274 },
      { id: "c2-4", label: "松花江水系 (纬度高/春夏双汛)", x: 380, y: 225, type: "leaf", time: 312 },
      { id: "c2-5", label: "淮河/海河/辽河 (缺水/过渡带)", x: 380, y: 260, type: "leaf", time: 345 },
      { id: "c3", label: "三、典型河流生命史", x: 200, y: 310, type: "child", time: 415 },
      { id: "c3-1", label: "流水作用 (侵蚀/搬运/堆积)", x: 380, y: 300, type: "leaf", time: 440 },
      { id: "c3-2", label: "河道形态 (三峡/悬河/三角洲)", x: 380, y: 335, type: "leaf", time: 470 },
      { id: "c4", label: "四、生态价值与治理", x: 200, y: 400, type: "child", time: 541 },
      { id: "c4-1", label: "开发价值 (灌溉/发电/航运)", x: 380, y: 385, type: "leaf", time: 570 },
      { id: "c4-2", label: "保护治理 (河长制/十年禁渔)", x: 380, y: 420, type: "leaf", time: 640 }
    ],
    links: [
      { from: "root", to: "c1" },
      { from: "root", to: "c2" },
      { from: "root", to: "c3" },
      { from: "root", to: "c4" },
      { from: "c1", to: "c1-1" },
      { from: "c1", to: "c1-2" },
      { from: "c2", to: "c2-1" },
      { from: "c2", to: "c2-2" },
      { from: "c2", to: "c2-3" },
      { from: "c2", to: "c2-4" },
      { from: "c2", to: "c2-5" },
      { from: "c3", to: "c3-1" },
      { from: "c3", to: "c3-2" },
      { from: "c4", to: "c4-1" },
      { from: "c4", to: "c4-2" }
    ]
  },

  quiz: [
    {
      q: "中国三大流域区中，占陆地面积比例最小的是哪一个？",
      options: ["太平洋流域", "印度洋流域", "北冰洋流域", "大西洋流域"],
      answer: 2,
      hint: "唯一流向北冰洋的是额尔齐斯河，流经新疆西北部。",
      explanation: "正确答案是北冰洋流域。我国外流区面积占全国的2/3，其中太平洋流域占外流区面积的58.2%，印度洋流域占6.4%，北冰洋流域仅占0.5%（主要由额尔齐斯河注入），其面积占比最小。"
    },
    {
      q: "被称为“地上悬河”的是黄河的哪一个河段？",
      options: ["源头段", "上游段", "中游段", "下游段"],
      answer: 3,
      hint: "泥沙在河道变宽、流速减慢的平原河段大量沉积。",
      explanation: "正确答案是下游段。黄河在中游流经黄土高原携带了世界最多的泥沙，到了下游华北平原流速骤降，泥沙淤积，致使下游河床平均每年升高，高出两岸地面数米，成为“地上悬河”。"
    },
    {
      q: "我国年径流量最大、流域面积最广的河流是？",
      options: ["黄河", "长江", "珠江", "黑龙江"],
      answer: 1,
      hint: "全长6300余千米，水能丰沛，被誉为“黄金水道”。",
      explanation: "正确答案是长江。长江全长居世界第三、全国第一，流域面积180万平方千米，年平均径流量近1万亿立方米，约占全国江河径流总量的36%，是当之无愧的我国最大河流。"
    },
    {
      q: "我国唯一流入北冰洋的河流是？",
      options: ["额尔齐斯河", "塔里木河", "澜沧江", "雅鲁藏布江"],
      answer: 0,
      hint: "流经新疆阿尔泰地区，出国后流入叶尼塞河注入北冰洋。",
      explanation: "正确答案是额尔齐斯河。它是我国唯一流入北冰洋的河流，源于阿尔泰山西南坡，出境流入哈萨克斯坦、俄罗斯，注入叶尼塞河的支流鄂毕河，最后汇入北冰洋。"
    },
    {
      q: "关于我国内流河和外流河水文特征的叙述，正确的是？",
      options: [
        "北方外流河流量大，汛期长，含沙量小",
        "南方外流河流量大，汛期长，结冰期长",
        "内流河水源主要来自高山冰雪融水，夏季进入汛期",
        "外流河水源主要来自地下水补给"
      ],
      answer: 2,
      hint: "内流河地处干旱温带沙漠气候区，极少依赖季风降雨。",
      explanation: "正确答案是：内流河水源主要来自高山冰雪融水，夏季进入汛期。我国西部干旱区内流河因降水极少，河流水源几乎全部依赖夏季高山冰雪融化，气温越高融水量越大，流量也就越大。"
    }
  ],

  flashcards: [
    {
      q: "中国三大流域区中，面积占比最小的是哪一个？",
      a: "北冰洋流域。\n\n解析：中国外流区可分为三大流域：太平洋流域（占外流区总面积的58%）、印度洋流域（占6.4%） and 北冰洋流域（仅占约0.5%，只有额尔齐斯河一条河）。因此北冰洋流域在我国境内占比最小。"
    },
    {
      q: "什么是“外流河”与“外流区”？",
      a: "外流河：直接或间接流入海洋的河流（如长江、黄河、珠江、雅鲁藏布江）。\n\n外流区：外流河的集水区域（流域），占我国陆地总面积的2/3左右，防洪灌溉价值极高。"
    },
    {
      q: "什么是“内流河”与“内流区”？",
      a: "内流河：最终未流入海洋，而是消失在内陆荒漠或注入内陆湖泊的河流（如塔里木河）。\n\n内流区：内流河的集水区域，占我国陆地总面积的1/3左右，水源以高山冰雪融水为主。"
    },
    {
      q: "我国河流南北方水文特征存在巨大差异的主导因素是什么？",
      a: "季风气候带来的降雨量和气温差异。\n\n南方雨季长、气温高，河流径流量大、无结冰期；北方冬季寒冷且雨季短，河流径流量较小、有结冰期。"
    },
    {
      q: "长江水系的三大地理特称是什么？",
      a: "1. 长度最长（6300余千米）\n2. 径流量最大（近1万亿立方米）\n3. 流域面积最广（180万平方公里）。\n\n另外具有极高的水能价值和黄金通航航运价值。"
    }
  ]
};

// 0.2 Local Storage Config Loading Logic
let courseData = null;
const storedConfig = localStorage.getItem("edustudio_course_config");
if (storedConfig) {
  try {
    courseData = JSON.parse(storedConfig);
    
    // BACKWARD COMPATIBILITY: Inject default segments if absent in legacy configs
    if (!courseData.segments) {
      courseData.segments = JSON.parse(JSON.stringify(DATABASE.segments));
    }
    if (!courseData.course_code) {
      courseData.course_code = DATABASE.course_code;
    }
    if (!courseData.teacher_name) {
      courseData.teacher_name = DATABASE.teacher_name;
    }
    if (!courseData.students) {
      courseData.students = JSON.parse(JSON.stringify(DATABASE.students));
    }
  } catch (e) {
    console.error("解析本地持久化课件配置失败，使用默认中国河流数据: ", e);
    courseData = JSON.parse(JSON.stringify(DATABASE));
  }
} else {
  courseData = JSON.parse(JSON.stringify(DATABASE));
}

if (courseData.api_key) {
  DASHSCOPE_API_KEY = courseData.api_key;
}

const state = {
  activeDrawer: null,
  videoLoaded: true, 
  currentTime: 0,
  duration: 833, 
  currentSegmentIndex: -1,
  activeSlideIndex: 0,
  pptSyncEnabled: true,
  quizInstantFeedback: true,
  quizCurrentIndex: 0,
  quizScore: 0,
  quizAnswers: Array(courseData.quiz.length).fill(null),
  cardCurrentIndex: 0,
  cardMasteredCount: 0,
  cardFuzzyCount: 0,
  cardStatus: Array(courseData.flashcards.length).fill(null),
  isFullScreenMindmap: false,
  activeCategoryFilter: "all", // Filter tags: 'all', 'distribution', 'landform', 'ecology', 'conservation'
  currentViewMode: "slices" // Dual modes: 'slices' or 'intro'
};

// ==========================================
// 1. Initial DOM Selection & Setup
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Sync Header title & badge from course configurations
  document.querySelector(".course-title").innerText = courseData.course_title || "中国主要河流地理特征介绍";
  const badgeEl = document.querySelector(".course-badge");
  if (badgeEl) {
    badgeEl.innerHTML = `<i data-lucide="sparkles" style="width: 13px; height: 13px;"></i> ${courseData.course_badge || "AI 互动课"}`;
  }

  // Initialize Lucide icons
  lucide.createIcons();
  
  // Selection
  const video = document.getElementById("main-video");
  const uploadZone = document.getElementById("upload-zone");
  const videoFileInput = document.getElementById("video-file-input");
  const playerContainer = document.getElementById("player-container");
  
  // Custom Controls
  const playPauseBtn = document.getElementById("play-pause-btn");
  const currentTimeSpan = document.getElementById("current-time");
  const durationTimeSpan = document.getElementById("duration-time");
  const volumeBar = document.getElementById("volume-bar");
  const muteBtn = document.getElementById("mute-btn");
  const speedToggleBtn = document.getElementById("speed-toggle-btn");
  const speedDropdown = document.getElementById("speed-dropdown");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const progressContainer = document.getElementById("video-progress-container");
  const progressFill = document.getElementById("video-progress-fill");
  const progressHandle = document.getElementById("video-progress-handle");
  
  // Timeline Scrubber
  const timelineScrubber = document.getElementById("timeline-scrubber");
  const timelineHead = document.getElementById("timeline-head");
  
  // Tabs and Drawer Triggers
  const tabBtnContent = document.getElementById("tab-btn-content");
  const tabBtnDiscuss = document.getElementById("tab-btn-discuss");
  const paneContent = document.getElementById("pane-content");
  const paneDiscuss = document.getElementById("pane-discuss");
  const toolCards = document.querySelectorAll(".tool-card");
  const appDrawers = document.querySelectorAll(".app-drawer");
  
  // Sidebar quick nav links
  const drawerNavItems = document.querySelectorAll(".drawer-nav-item");
  const topicSearchInput = document.getElementById("topic-search-input");

  // ==========================================
  // 1.5 Student Login & Authorization Logic
  // ==========================================
  const loginOverlay = document.getElementById("student-login-overlay");
  const loginSubmitBtn = document.getElementById("login-submit-btn");
  const loginStudentId = document.getElementById("login-student-id");
  const loginStudentName = document.getElementById("login-student-name");
  const loginCourseCode = document.getElementById("login-course-code");
  const loginErrorMsg = document.getElementById("login-error-msg");
  const loginAdminBtn = document.getElementById("login-admin-btn");
  
  const headerStudentInfo = document.getElementById("header-student-info");
  const headerStudentId = document.getElementById("header-student-id");
  const headerStudentName = document.getElementById("header-student-name");
  const headerTeacherName = document.getElementById("header-teacher-name");
  const headerLogoutBtn = document.getElementById("header-logout-btn");

  function checkLoginState() {
    const loggedInUserStr = sessionStorage.getItem("edustudio_logged_in_user");
    if (loggedInUserStr) {
      try {
        const user = JSON.parse(loggedInUserStr);
        // Fill header left data
        headerStudentId.innerText = user.id;
        headerStudentName.innerText = user.name;
        headerTeacherName.innerText = courseData.teacher_name || "未知老师";
        
        // Show info & hide overlay
        headerStudentInfo.style.display = "flex";
        loginOverlay.style.display = "none";
      } catch (e) {
        showLoginOverlay();
      }
    } else {
      showLoginOverlay();
    }
  }

  function showLoginOverlay() {
    headerStudentInfo.style.display = "none";
    loginOverlay.style.display = "flex";
    
    // Pause video playback if it's playing
    if (state.videoLoaded && video && !video.paused) {
      video.pause();
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
        lucide.createIcons();
      }
    }
    // Pre-fill Course ID input with configured course code if available
    if (loginCourseCode && !loginCourseCode.value) {
      loginCourseCode.value = courseData.course_code || "";
    }
    lucide.createIcons();
  }

  function handleStudentLogin() {
    const studentIdVal = loginStudentId.value.trim();
    const studentNameVal = loginStudentName.value.trim();
    const courseCodeVal = loginCourseCode.value.trim();

    if (!studentIdVal || !studentNameVal || !courseCodeVal) {
      showLoginError("请填写完整的登录信息！");
      return;
    }

    // 1. Verify Course Code
    const currentCourseCode = (courseData.course_code || "GEO-101").trim();
    if (courseCodeVal.toLowerCase() !== currentCourseCode.toLowerCase()) {
      showLoginError("课程编号错误，无法进入该课程！");
      return;
    }

    // 2. Verify Student ID and Name in students database
    const roster = courseData.students || [];
    const matched = roster.find(stu => stu.id.trim() === studentIdVal);

    if (!matched) {
      showLoginError("您的学号未被录入本课程，请联系授课老师！");
      return;
    }

    if (matched.name.trim() !== studentNameVal) {
      showLoginError("学号与姓名匹配失败，请重新输入！");
      return;
    }

    // Pass
    loginErrorMsg.style.display = "none";
    const userSession = { id: studentIdVal, name: studentNameVal };
    sessionStorage.setItem("edustudio_logged_in_user", JSON.stringify(userSession));
    
    checkLoginState();
    
    // Auto start playing
    if (state.videoLoaded && video) {
      video.play().catch(err => console.log("Auto-play blocked: ", err));
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
        lucide.createIcons();
      }
    }
  }

  function showLoginError(msg) {
    loginErrorMsg.innerText = `✗ ${msg}`;
    loginErrorMsg.style.display = "flex";
    
    // Shake CSS animation trigger
    loginErrorMsg.style.animation = "none";
    loginErrorMsg.offsetHeight; // force reflow
    loginErrorMsg.style.animation = "shake 0.2s ease-in-out 2";
  }

  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", handleStudentLogin);
  }

  [loginStudentId, loginStudentName, loginCourseCode].forEach(input => {
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          handleStudentLogin();
        }
      });
    }
  });

  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("edustudio_logged_in_user");
      if (loginStudentId) loginStudentId.value = "";
      if (loginStudentName) loginStudentName.value = "";
      showLoginOverlay();
    });
  }

  if (loginAdminBtn) {
    loginAdminBtn.addEventListener("click", () => {
      adminPasswordInput.value = "";
      passwordModal.style.display = "flex";
      adminPasswordInput.focus();
    });
  }

  // Run initial login check
  checkLoginState();

  // ==========================================
  // 2. Video Player Event Listeners & Control
  // ==========================================
  
  uploadZone.addEventListener("click", () => {
    videoFileInput.click();
  });

  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = "var(--color-primary)";
    uploadZone.style.backgroundColor = "rgba(99, 102, 241, 0.05)";
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.style.borderColor = "var(--border-color)";
    uploadZone.style.backgroundColor = "transparent";
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      loadLocalVideo(files[0]);
    }
  });

  videoFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      loadLocalVideo(e.target.files[0]);
    }
  });

  // Skip uploader button
  const skipBtn = document.createElement("button");
  skipBtn.innerText = "直接使用默认测试视频体验 ➔";
  skipBtn.style.cssText = "margin-top: 14px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: white; padding: 6px 16px; border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: 500; transition: var(--transition-fast);";
  skipBtn.addEventListener("mouseover", () => skipBtn.style.background = "rgba(255,255,255,0.25)");
  skipBtn.addEventListener("mouseout", () => skipBtn.style.background = "rgba(255,255,255,0.15)");
  skipBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hideUploadZone();
  });
  uploadZone.appendChild(skipBtn);

  function loadLocalVideo(file) {
    const fileUrl = URL.createObjectURL(file);
    video.src = fileUrl;
    video.load();
    hideUploadZone();
  }

  function hideUploadZone() {
    uploadZone.style.display = "none";
    video.play().catch(err => console.log("Auto-play blocked: ", err));
    playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
    lucide.createIcons();
    state.videoLoaded = true;
  }

  playPauseBtn.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  function togglePlay() {
    if (!state.videoLoaded) return;
    if (video.paused || video.ended) {
      video.play();
      playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
    } else {
      video.pause();
      playPauseBtn.innerHTML = '<i data-lucide="play"></i>';
    }
    lucide.createIcons();
  }

  video.addEventListener("timeupdate", () => {
    state.currentTime = video.currentTime;
    state.duration = video.duration || state.duration;

    // 1. Text Time
    currentTimeSpan.innerText = formatTime(state.currentTime);
    durationTimeSpan.innerText = formatTime(state.duration);

    // 2. Custom Scrubber
    const progressPercent = (state.currentTime / state.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;

    // 3. Red Pin Playhead Scrubber position
    timelineHead.style.left = `${progressPercent}%`;

    // 4. Highlight current active segment card
    updateSegmentHighlighting(state.currentTime);

    // 5. Slides sync
    if (state.pptSyncEnabled) {
      updatePPTSlidesHighlighting(state.currentTime);
    }

    // 6. Mindmap nodes highlight
    updateMindmapHighlighting(state.currentTime);
  });

  video.addEventListener("loadedmetadata", () => {
    state.duration = video.duration;
    durationTimeSpan.innerText = formatTime(state.duration);
    
    // Redraw timeline on metadata load to ensure length is exact
    renderTimelineBar(state.activeCategoryFilter);
  });

  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  progressContainer.addEventListener("click", (e) => {
    if (!state.videoLoaded) return;
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * state.duration;
  });

  timelineScrubber.addEventListener("click", (e) => {
    if (!state.videoLoaded) return;
    const rect = timelineScrubber.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * state.duration;
  });

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    if (video.muted) {
      muteBtn.innerHTML = '<i data-lucide="volume-x"></i>';
      volumeBar.value = 0;
    } else {
      muteBtn.innerHTML = '<i data-lucide="volume-2"></i>';
      volumeBar.value = video.volume;
    }
    lucide.createIcons();
  });

  volumeBar.addEventListener("input", (e) => {
    video.volume = e.target.value;
    video.muted = (e.target.value == 0);
    if (video.muted) {
      muteBtn.innerHTML = '<i data-lucide="volume-x"></i>';
    } else {
      muteBtn.innerHTML = '<i data-lucide="volume-2"></i>';
    }
    lucide.createIcons();
  });

  speedToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    speedDropdown.classList.toggle("show");
  });

  document.addEventListener("click", () => {
    speedDropdown.classList.remove("show");
  });

  document.querySelectorAll(".speed-opt").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".speed-opt").forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      const speed = parseFloat(opt.dataset.speed);
      video.playbackRate = speed;
      speedToggleBtn.innerText = `${speed}x`;
      speedDropdown.classList.remove("show");
    });
  });

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch(err => {
        alert(`全屏切换失败: ${err.message}`);
      });
      fullscreenBtn.innerHTML = '<i data-lucide="minimize"></i>';
    } else {
      document.exitFullscreen();
      fullscreenBtn.innerHTML = '<i data-lucide="maximize"></i>';
    }
    lucide.createIcons();
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      fullscreenBtn.innerHTML = '<i data-lucide="maximize"></i>';
      lucide.createIcons();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      togglePlay();
    }
  });


  // ==========================================
  // 3. Right Sidebar Tab Navigation
  // ==========================================
  tabBtnContent.addEventListener("click", () => switchTab(tabBtnContent, paneContent));
  tabBtnDiscuss.addEventListener("click", () => switchTab(tabBtnDiscuss, paneDiscuss));

  function switchTab(btn, pane) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    pane.classList.add("active");
    if (pane === paneDiscuss) {
      updateCommentClockBadge();
    }
  }


  // ==========================================
  // 4. Slide-Over Drawers Panel Management
  // ==========================================
  
  toolCards.forEach(card => {
    card.addEventListener("click", () => {
      const targetDrawerId = card.dataset.drawer;
      openDrawer(targetDrawerId);
    });
  });

  document.querySelectorAll(".back-to-apps-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      closeAllDrawers();
    });
  });

  drawerNavItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetDrawerId = item.dataset.target;
      openDrawer(targetDrawerId);
    });
  });

  function openDrawer(drawerId) {
    closeAllDrawers();
    const targetDrawer = document.getElementById(drawerId);
    if (targetDrawer) {
      targetDrawer.classList.add("active");
      state.activeDrawer = drawerId;
      document.querySelectorAll(".drawer-nav-item").forEach(item => {
        item.classList.remove("active");
        if (item.dataset.target === drawerId) {
          item.classList.add("active");
        }
      });
      if (drawerId === "drawer-mindmap") {
        setTimeout(renderMindmapSVG, 100); 
      }
    }
  }

  function closeAllDrawers() {
    appDrawers.forEach(drawer => drawer.classList.remove("active"));
    state.activeDrawer = null;
    
    // If student is not logged in, show student login overlay again
    const loggedInUser = sessionStorage.getItem("edustudio_logged_in_user");
    if (!loggedInUser) {
      showLoginOverlay();
    }
  }


  // ==========================================
  // 5. Dynamic Segments list & Timeline Bar rendering
  // ==========================================
  const segmentsContainer = document.getElementById("segments-list-container");

  // Render segments cards dynamically
  function renderSegmentsList() {
    segmentsContainer.innerHTML = "";
    
    // Sort segments chronologically
    const sortedSegments = [...courseData.segments].sort((a, b) => a.time - b.time);
    const filter = state.activeCategoryFilter;
    const searchVal = topicSearchInput.value.toLowerCase().trim();

    sortedSegments.forEach((seg, index) => {
      const isCategoryMatch = filter === "all" || seg.categories.split(" ").includes(filter);
      const isSearchMatch = !searchVal || seg.title.toLowerCase().includes(searchVal) || seg.desc.toLowerCase().includes(searchVal);

      if (!isCategoryMatch || !isSearchMatch) return; // Hidden by filters

      const card = document.createElement("div");
      card.className = `segment-item seg-${seg.color}-item`;
      card.dataset.start = seg.time;
      card.dataset.id = index;

      // Collapsed Tags
      const subTagsHTML = (seg.tags || []).map(t => `<span class="seg-subtag">${t}</span>`).join("");
      
      // Expanded Hashtags (with # prefix)
      const expandedTagsHTML = (seg.tags || []).map(t => `<span class="exp-tag"># ${t}</span>`).join("");

      card.innerHTML = `
        <div class="segment-header">
          <div class="segment-title-wrapper">
            <span class="segment-dot dot-${seg.color}"></span>
            <h4 class="segment-title">${seg.title}</h4>
            <div class="segment-tags">
              ${subTagsHTML}
            </div>
          </div>
          <div class="segment-meta">
            <span class="segment-time">${formatTime(seg.time)}</span>
            <i data-lucide="chevron-down" class="segment-chevron"></i>
          </div>
        </div>
        <div class="segment-body" style="display: none;">
          <div class="expanded-tags-row">
            ${expandedTagsHTML}
          </div>
          <p class="segment-desc">${seg.desc}</p>
        </div>
      `;

      // Accordion click toggle
      const header = card.querySelector(".segment-header");
      header.addEventListener("click", () => {
        const isExpanded = card.classList.contains("expanded");
        
        // Collapse all others
        document.querySelectorAll(".segment-item").forEach(item => {
          item.classList.remove("expanded");
          item.querySelector(".segment-body").style.display = "none";
        });

        if (!isExpanded) {
          card.classList.add("expanded");
          card.querySelector(".segment-body").style.display = "block";
          
          // Seek video player
          if (state.videoLoaded) {
            video.currentTime = seg.time;
          }
        }
      });

      segmentsContainer.appendChild(card);
    });

    lucide.createIcons();
  }

  // Draw timeline colored sectors dynamically
  function renderTimelineBar() {
    // Keep only the scrubber pointer head
    const pointer = document.getElementById("timeline-head");
    const container = document.getElementById("timeline-scrubber");
    
    // Clear everything except pointer container
    container.innerHTML = `<div class="timeline-scrubber-overlay"><div class="timeline-playhead" id="timeline-head"></div></div>`;
    const overlay = container.querySelector(".timeline-scrubber-overlay");
    const newPointer = container.querySelector("#timeline-head");
    
    // Re-link pointer state
    const progressPercent = (state.currentTime / state.duration) * 100;
    newPointer.style.left = `${progressPercent}%`;

    const sortedSegments = [...courseData.segments].sort((a, b) => a.time - b.time);
    if (sortedSegments.length === 0) return;

    const filter = state.activeCategoryFilter;

    // Loop to draw segmented divs
    sortedSegments.forEach((seg, idx) => {
      const segStart = seg.time;
      const segEnd = (idx < sortedSegments.length - 1) ? sortedSegments[idx + 1].time : state.duration;
      const segDur = Math.max(segEnd - segStart, 1);
      
      const flexWeight = Math.max(Math.round(segDur), 1);
      const isVisible = filter === "all" || seg.categories.split(" ").includes(filter);

      const div = document.createElement("div");
      div.className = `timeline-segment ${isVisible ? `seg-${seg.color}` : 'seg-empty'}`;
      div.style.flexGrow = flexWeight;
      div.title = `${seg.title} (${formatTime(segStart)} - ${formatTime(segEnd)})`;

      container.insertBefore(div, overlay);
    });
  }

  // Tags filter clicks
  const tagPills = document.querySelectorAll(".tag-pill");
  tagPills.forEach(pill => {
    pill.addEventListener("click", () => {
      tagPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      
      state.activeCategoryFilter = pill.dataset.tag;
      renderSegmentsList();
      renderTimelineBar();
    });
  });

  topicSearchInput.addEventListener("input", () => {
    renderSegmentsList();
  });

  function updateSegmentHighlighting(time) {
    const sorted = [...courseData.segments].sort((a, b) => a.time - b.time);
    let activeIdx = -1;

    for (let i = 0; i < sorted.length; i++) {
      if (time >= sorted[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }

    if (activeIdx !== -1 && activeIdx !== state.currentSegmentIndex) {
      state.currentSegmentIndex = activeIdx;
      
      // Auto expand matches in UI
      const cards = segmentsContainer.querySelectorAll(".segment-item");
      cards.forEach(card => {
        const startSec = parseInt(card.dataset.start);
        const match = (startSec === sorted[activeIdx].time);
        
        card.classList.remove("active-segment");
        if (match) {
          card.classList.add("active-segment");
          card.classList.add("expanded");
          card.querySelector(".segment-body").style.display = "block";
          card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          card.classList.remove("expanded");
          card.querySelector(".segment-body").style.display = "none";
        }
      });
    }
  }

  // ==========================================
  // 5.5 Dual Mode Toggle Slices vs Intro card
  // ==========================================
  const btnToggleSlices = document.getElementById("btn-toggle-slices");
  const btnToggleIntro = document.getElementById("btn-toggle-intro");
  const leftTagsBar = document.getElementById("left-tags-bar");
  const leftTimelineBar = document.getElementById("left-timeline-bar");
  const introCardContainer = document.getElementById("intro-card-container");

  btnToggleSlices.addEventListener("click", () => switchViewMode("slices"));
  btnToggleIntro.addEventListener("click", () => switchViewMode("intro"));

  function switchViewMode(mode) {
    state.currentViewMode = mode;
    
    // Style toggle
    btnToggleSlices.classList.remove("active");
    btnToggleIntro.classList.remove("active");
    
    if (mode === "slices") {
      btnToggleSlices.classList.add("active");
      leftTagsBar.style.display = "flex";
      leftTimelineBar.style.display = "flex";
      segmentsContainer.style.display = "flex";
      introCardContainer.style.display = "none";
    } else {
      btnToggleIntro.classList.add("active");
      leftTagsBar.style.display = "none";
      leftTimelineBar.style.display = "none";
      segmentsContainer.style.display = "none";
      introCardContainer.style.display = "flex";
      
      // Set description text dynamically
      document.getElementById("intro-course-desc").innerText = `关于《${courseData.course_title}》的课件说明：\n\n本播放器为个人学习定制版，包含视频原文、AI交互对话、随堂问卷、闪卡归纳及SVG思维节点联动。本节视频系统地介绍了大河流域的水文地理特征分布，管理员可通过后台面板自主替换并设置全新的课件字幕、题目、甚至重设视频关键进度分点。`;
    }
  }

  // Trigger default renders on load
  renderSegmentsList();
  renderTimelineBar();


  // ==========================================
  // 6. Drawer Panel 1: Video Transcript (视频原文)
  // ==========================================
  const transcriptBox = document.getElementById("transcript-container-box");

  function renderTranscript() {
    transcriptBox.innerHTML = "";
    courseData.transcripts.forEach((line, index) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "transcript-line";
      lineDiv.dataset.time = line.time;
      lineDiv.dataset.index = index;

      lineDiv.innerHTML = `
        <span class="transcript-stamp">${formatTime(line.time)}</span>
        <span class="transcript-text">${line.text}</span>
      `;

      lineDiv.addEventListener("click", () => {
        if (state.videoLoaded) {
          video.currentTime = line.time;
          video.play();
        }
      });

      transcriptBox.appendChild(lineDiv);
    });
  }

  renderTranscript();

  video.addEventListener("timeupdate", () => {
    if (state.activeDrawer !== "drawer-transcript") return;
    
    const time = video.currentTime;
    let activeIndex = -1;

    for (let i = 0; i < courseData.transcripts.length; i++) {
      if (time >= courseData.transcripts[i].time) {
        activeIndex = i;
      } else {
        break;
      }
    }

    if (activeIndex !== -1) {
      const lines = transcriptBox.querySelectorAll(".transcript-line");
      lines.forEach(line => line.classList.remove("current-playing"));
      
      const activeLine = lines[activeIndex];
      if (activeLine) {
        activeLine.classList.add("current-playing");
        transcriptBox.parentElement.scrollTo({
          top: activeLine.offsetTop - (transcriptBox.parentElement.clientHeight / 2) + (activeLine.clientHeight / 2),
          behavior: "smooth"
        });
      }
    }
  });


  // ==========================================
  // 7. Drawer Panel 2: AI Assistant (AI 助教)
  // ==========================================
  const aiChatBox = document.getElementById("ai-chat-box");
  const aiMessagesContainer = document.getElementById("ai-messages-container");
  const aiUserInput = document.getElementById("ai-user-input");
  const aiSendBtn = document.getElementById("ai-send-btn");
  const aiWelcomeScreen = document.getElementById("ai-welcome-screen");
  
  document.querySelectorAll(".ai-suggest-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const q = btn.innerText;
      aiUserInput.value = q;
      submitAIQuestion();
    });
  });

  aiSendBtn.addEventListener("click", submitAIQuestion);
  aiUserInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      submitAIQuestion();
    }
  });

  function buildSystemPrompt() {
    let summaryStr = `你是一名专业的地理老师和AI助教。你正在为学生讲解‘${courseData.course_title}’互动课。以下是本课程的视频分段和大纲，请结合这些内容和你的专业地理知识回答学生的问题。如果回答中能引导学生去视频的某个时间点观看，那就更好了。
视频课程分段大纲与字幕序列如下：\n`;
    
    courseData.transcripts.forEach(line => {
      summaryStr += `[时间：${formatTime(line.time)} (${line.time}秒)]：${line.text}\n`;
    });

    summaryStr += `\n回答准则：使用亲切、科学的中文进行回复。保持段落美观、言简意赅。如果可以直接为学生跳转进度，可以通过返回含有[seek:秒数]格式的标识来指示，例如提示跳转到1分4秒可以说：‘你可以看看 [seek:64] 处的讲解。’`;
    return summaryStr;
  }

  const chatHistory = [
    { role: "system", content: buildSystemPrompt() }
  ];

  function appendChatMessage(role, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${role === 'user' ? 'student' : 'assistant'}`;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "chat-bubble";
    
    let htmlContent = text.replace(/\[seek:(\d+)\]/g, (match, seconds) => {
      const timeStr = formatTime(parseInt(seconds));
      return `<button class="comment-time-badge" style="border:none; cursor:pointer;" onclick="document.getElementById('main-video').currentTime=${seconds};">${timeStr}</button>`;
    });

    bubbleDiv.innerHTML = htmlContent;

    const avatarDiv = document.createElement("div");
    avatarDiv.className = "chat-avatar";
    avatarDiv.innerHTML = role === 'user' ? '<i data-lucide="user" style="width:14px;height:14px;"></i>' : '<i data-lucide="sparkles" style="width:14px;height:14px;color:var(--color-cat-green);"></i>';

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    
    aiMessagesContainer.appendChild(msgDiv);
    lucide.createIcons();

    aiChatBox.scrollTo({
      top: aiChatBox.scrollHeight,
      behavior: "smooth"
    });
  }

  async function submitAIQuestion() {
    const text = aiUserInput.value.trim();
    if (!text) return;

    aiWelcomeScreen.style.display = "none";
    appendChatMessage('user', text);
    chatHistory.push({ role: "user", content: text });
    aiUserInput.value = "";
    aiSendBtn.disabled = true;

    // Loader
    const loaderDiv = document.createElement("div");
    loaderDiv.className = "chat-msg assistant";
    loaderDiv.id = "ai-loader-bubble";
    loaderDiv.innerHTML = `
      <div class="chat-avatar"><i data-lucide="sparkles" style="width:14px;height:14px;color:var(--color-cat-green)"></i></div>
      <div class="chat-bubble">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    aiMessagesContainer.appendChild(loaderDiv);
    lucide.createIcons();
    aiChatBox.scrollTo({ top: aiChatBox.scrollHeight, behavior: "smooth" });

    try {
      if (!DASHSCOPE_API_KEY) {
        throw new Error("No API Key configured");
      }

      const response = await fetch(DASHSCOPE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DASHSCOPE_API_KEY}`
        },
        body: JSON.stringify({
          model: "qwen3-vl-plus",
          messages: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices[0].message.content;

      const loader = document.getElementById("ai-loader-bubble");
      if (loader) loader.remove();

      appendChatMessage('assistant', reply);
      chatHistory.push({ role: "assistant", content: reply });

    } catch (error) {
      console.warn("AI API request failed: ", error);
      
      const loader = document.getElementById("ai-loader-bubble");
      if (loader) loader.remove();

      const mockReply = generateFallbackAIAnswer(text);
      appendChatMessage('assistant', `【Qwen3 API 连接离线/提示：已自动启用本地备用知识引擎】\n\n${mockReply}`);
      chatHistory.push({ role: "assistant", content: mockReply });
    } finally {
      aiSendBtn.disabled = false;
    }
  }

  function generateFallbackAIAnswer(query) {
    const q = query.toLowerCase();
    
    // Look up in captions for keyword matches
    let closestCaption = null;
    let matchTime = 0;
    
    for (let line of courseData.transcripts) {
      if (q.includes(line.text.substring(0, 4)) || line.text.includes(q)) {
        closestCaption = line.text;
        matchTime = line.time;
        break;
      }
    }

    if (closestCaption) {
      return `关于您问的这个问题，我们在课件中提到了：\n“${closestCaption}”\n您可以通过点击时间戳 [seek:${matchTime}] 直接跳转重温该片段的老师讲解。`;
    }

    if (q.includes("总体") || q.includes("特征") || q.includes("地理特征")) {
      return `中国主要河流的总体特征包括西高东低的地势引起的东流入海，以及外流区与内流区的宏观差异。您可以点击时间轴上的 [seek:64] 处观看总体特征的详细切片介绍。`;
    }
    if (q.includes("水系") || q.includes("七大水系")) {
      return `我国主要有长江、黄河、珠江、松花江、海河、辽河、淮河七大水系。想了解它们的空间分布格局，推荐跳转至 [seek:129] 获取大纲。`;
    }
    if (q.includes("保护") || q.includes("治理") || q.includes("禁渔") || q.includes("河长制")) {
      return `为了维护江河生态，我国正推行“河长制”和联合监管治理（如长江十年禁渔、黄河水沙联调）。这部分内容可以在视频的 [seek:541] 找到。`;
    }

    return `您好！我是您的 AI 助教。您可以向我提问关于本课程标题：“${courseData.course_title}”相关的地理考点，我会为您解答。`;
  }


  // ==========================================
  // 8. Drawer Panel 3: PowerPoint Slides (演示文稿)
  // ==========================================
  const pptDropZone = document.getElementById("ppt-drop-zone");
  const pptFileInput = document.getElementById("ppt-file-input");
  const pptSlidesContainer = document.getElementById("ppt-slides-container-box");
  const pptSlidesCount = document.getElementById("ppt-slides-count");
  const pptSyncToggle = document.getElementById("ppt-sync-toggle");
  const pptSyncSlider = document.getElementById("ppt-sync-slider");

  let localPPTSlides = []; 

  pptSyncToggle.addEventListener("change", (e) => {
    state.pptSyncEnabled = e.target.checked;
    pptSyncSlider.style.backgroundColor = state.pptSyncEnabled ? "var(--color-cat-orange)" : "#ccc";
  });
  pptSyncSlider.style.backgroundColor = "var(--color-cat-orange)";

  pptDropZone.addEventListener("click", () => {
    pptFileInput.click();
  });

  pptDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    pptDropZone.style.borderColor = "var(--color-cat-orange)";
    pptDropZone.style.backgroundColor = "var(--color-cat-orange-light)";
  });

  pptDropZone.addEventListener("dragleave", () => {
    pptDropZone.style.borderColor = "var(--border-color)";
    pptDropZone.style.backgroundColor = "#fbfbfb";
  });

  pptDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      loadLocalPPTImages(files);
    }
  });

  pptFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      loadLocalPPTImages(e.target.files);
    }
  });

  function loadLocalPPTImages(fileList) {
    const imageFiles = Array.from(fileList).filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    localPPTSlides = imageFiles.map((file, idx) => {
      const segmentStep = Math.floor(state.duration / imageFiles.length);
      return {
        time: idx * segmentStep,
        url: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, "") 
      };
    });

    renderPPTSlidesList();
  }

  function generateVectorSVGBase64(slideData, pageIndex) {
    const gradients = [
      { c1: "#1e293b", c2: "#0f172a" }, 
      { c1: "#334155", c2: "#1e293b" }, 
      { c1: "#064e3b", c2: "#022c22" }, 
      { c1: "#4c1d95", c2: "#2e1065" }, 
      { c1: "#1e1b4b", c2: "#311042" }, 
      { c1: "#7c2d12", c2: "#431407" }, 
      { c1: "#14532d", c2: "#052e16" }, 
      { c1: "#172554", c2: "#0c183e" }, 
      { c1: "#831843", c2: "#4a0422" }, 
      { c1: "#78350f", c2: "#451a03" }  
    ];
    
    const grad = gradients[pageIndex % gradients.length];
    const bulletLines = slideData.bullets || [];

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
        <defs>
          <linearGradient id="g_${pageIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${grad.c1}" />
            <stop offset="100%" stop-color="${grad.c2}" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g_${pageIndex})" />
        
        <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
          <line x1="100" y1="0" x2="100" y2="450" /><line x1="200" y1="0" x2="200" y2="450" /><line x1="300" y1="0" x2="300" y2="450" />
          <line x1="400" y1="0" x2="400" y2="450" /><line x1="500" y1="0" x2="500" y2="450" /><line x1="600" y1="0" x2="600" y2="450" />
          <line x1="700" y1="0" x2="700" y2="450" /><line x1="0" y1="100" x2="800" y2="100" /><line x1="0" y1="200" x2="800" y2="200" />
          <line x1="0" y1="300" x2="800" y2="300" /><line x1="0" y1="400" x2="800" y2="400" />
        </g>
        
        <text x="60" y="80" fill="var(--color-cat-orange)" font-family="Outfit, sans-serif" font-weight="700" font-size="20" letter-spacing="2">GEOGRAPHY PPT SLIDES</text>
        <line x1="60" y1="100" x2="740" y2="100" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
        
        <text x="60" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="34" width="680">${slideData.title}</text>
        
        <g transform="translate(60, 220)">
          ${bulletLines.map((b, i) => `
            <circle cx="10" cy="${i * 45 + 10}" r="5" fill="var(--color-cat-orange)" />
            <text x="30" y="${i * 45 + 16}" fill="#cbd5e1" font-family="system-ui, sans-serif" font-weight="500" font-size="19">${b}</text>
          `).join('')}
        </g>
        
        <text x="60" y="410" fill="rgba(255,255,255,0.3)" font-family="system-ui" font-size="12">P.${pageIndex + 1} / ${courseData.slides.length}</text>
        <text x="740" y="410" fill="rgba(255,255,255,0.3)" font-family="system-ui" font-size="12" text-anchor="end">课件帮·AI互动</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  function renderPPTSlidesList() {
    pptSlidesContainer.innerHTML = "";
    
    const activeList = localPPTSlides.length > 0 ? localPPTSlides : courseData.slides;
    pptSlidesCount.innerText = `共 ${activeList.length} 页课件`;

    activeList.forEach((slide, idx) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = `slide-card ${idx === 0 ? 'active-slide' : ''}`;
      slideDiv.dataset.time = slide.time;
      slideDiv.dataset.index = idx;

      const imgSrc = slide.url ? slide.url : generateVectorSVGBase64(slide, idx);

      slideDiv.innerHTML = `
        <div class="slide-header-bar">
          <span class="slide-page-num">P.${idx + 1}</span>
          <span class="slide-time-badge">${formatTime(slide.time)}</span>
        </div>
        <div class="slide-image-wrapper">
          <img src="${imgSrc}" class="slide-img" alt="PPT Slide ${idx + 1}">
        </div>
      `;

      slideDiv.addEventListener("click", () => {
        if (state.videoLoaded) {
          video.currentTime = slide.time;
          video.play();
        }
      });

      pptSlidesContainer.appendChild(slideDiv);
    });
  }

  renderPPTSlidesList();

  function updatePPTSlidesHighlighting(time) {
    const list = localPPTSlides.length > 0 ? localPPTSlides : courseData.slides;
    let activeIdx = -1;

    for (let i = 0; i < list.length; i++) {
      if (time >= list[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }

    if (activeIdx !== -1 && activeIdx !== state.activeSlideIndex) {
      state.activeSlideIndex = activeIdx;
      
      const cards = pptSlidesContainer.querySelectorAll(".slide-card");
      cards.forEach(c => c.classList.remove("active-slide"));
      
      const activeCard = cards[activeIdx];
      if (activeCard) {
        activeCard.classList.add("active-slide");
        pptSlidesContainer.parentElement.scrollTo({
          top: activeCard.offsetTop - (pptSlidesContainer.parentElement.clientHeight / 2) + (activeCard.clientHeight / 2),
          behavior: "smooth"
        });
      }
    }
  }


  // ==========================================
  // 9. Drawer Panel 4: Mindmap (思维导图)
  // ==========================================
  const mindmapSvg = document.getElementById("mindmap-svg-element");
  const mindmapViewport = document.getElementById("mindmap-viewport-group");
  const linksGroup = document.getElementById("mindmap-links-group");
  const nodesGroup = document.getElementById("mindmap-nodes-group");
  const frame = document.getElementById("mindmap-canvas-frame");

  let zoomState = { x: 10, y: 15, scale: 0.82 };
  let isDraggingMap = false;
  let dragStart = { x: 0, y: 0 };

  function updateViewportTransform() {
    mindmapViewport.setAttribute("transform", `translate(${zoomState.x}, ${zoomState.y}) scale(${zoomState.scale})`);
  }

  document.getElementById("map-zoom-in").addEventListener("click", () => {
    zoomState.scale = Math.min(zoomState.scale + 0.1, 2.5);
    updateViewportTransform();
  });

  document.getElementById("map-zoom-out").addEventListener("click", () => {
    zoomState.scale = Math.max(zoomState.scale - 0.1, 0.4);
    updateViewportTransform();
  });

  document.getElementById("map-zoom-reset").addEventListener("click", () => {
    zoomState = { x: 10, y: 15, scale: 0.82 };
    updateViewportTransform();
  });

  document.getElementById("map-fullscreen").addEventListener("click", () => {
    state.isFullScreenMindmap = !state.isFullScreenMindmap;
    if (state.isFullScreenMindmap) {
      frame.style.position = "fixed";
      frame.style.top = "0";
      frame.style.left = "0";
      frame.style.width = "100vw";
      frame.style.height = "100vh";
      frame.style.zIndex = "999";
      document.getElementById("map-fullscreen").innerHTML = '<i data-lucide="minimize-2" style="width:14px;height:14px"></i>';
    } else {
      frame.style.position = "relative";
      frame.style.width = "100%";
      frame.style.height = "100%";
      frame.style.zIndex = "1";
      document.getElementById("map-fullscreen").innerHTML = '<i data-lucide="maximize-2" style="width:14px;height:14px"></i>';
    }
    lucide.createIcons();
  });

  frame.addEventListener("mousedown", (e) => {
    if (e.target.closest(".map-ctrl-btn")) return;
    isDraggingMap = true;
    dragStart = { x: e.clientX - zoomState.x, y: e.clientY - zoomState.y };
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDraggingMap) return;
    zoomState.x = e.clientX - dragStart.x;
    zoomState.y = e.clientY - dragStart.y;
    updateViewportTransform();
  });

  document.addEventListener("mouseup", () => {
    isDraggingMap = false;
  });

  frame.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomIntensity = 0.05;
    if (e.deltaY < 0) {
      zoomState.scale = Math.min(zoomState.scale + zoomIntensity, 2.5);
    } else {
      zoomState.scale = Math.max(zoomState.scale - zoomIntensity, 0.4);
    }
    updateViewportTransform();
  }, { passive: false });

  function renderMindmapSVG() {
    linksGroup.innerHTML = "";
    nodesGroup.innerHTML = "";

    // 1. Render Lines
    courseData.mindmap.links.forEach(link => {
      const fromNode = courseData.mindmap.nodes.find(n => n.id === link.from);
      const toNode = courseData.mindmap.nodes.find(n => n.id === link.to);
      if (!fromNode || !toNode) return;

      const fromX = fromNode.x + (fromNode.type === "root" ? 150 : 120);
      const fromY = fromNode.y + (fromNode.type === "root" ? 20 : 17);
      const toX = toNode.x;
      const toY = toNode.y + (toNode.type === "root" ? 20 : 17);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${fromX} ${fromY} C ${(fromX + toX)/2} ${fromY}, ${(fromX + toX)/2} ${toY}, ${toX} ${toY}`);
      path.setAttribute("class", "map-link");
      path.dataset.from = link.from;
      path.dataset.to = link.to;

      linksGroup.appendChild(path);
    });

    // 2. Render Nodes
    courseData.mindmap.nodes.forEach(node => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "map-node");
      g.setAttribute("transform", `translate(${node.x}, ${node.y})`);
      g.dataset.time = node.time;
      g.dataset.id = node.id;

      const width = node.type === "root" ? 160 : (node.type === "child" ? 130 : 200);
      const height = node.type === "root" ? 40 : 32;

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", width);
      rect.setAttribute("height", height);
      
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", 12);
      text.setAttribute("y", height/2 + 5);
      text.setAttribute("class", "map-text");
      text.textContent = node.label;
      
      if (node.type === "root") {
        rect.setAttribute("stroke", "var(--color-primary)");
        rect.setAttribute("stroke-width", "2");
        text.setAttribute("font-weight", "700");
      }

      g.appendChild(rect);
      g.appendChild(text);

      if (node.type !== "root") {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", width - 20);
        circle.setAttribute("cy", height/2);
        circle.setAttribute("r", 8);
        circle.setAttribute("class", "map-play-icon");
        
        const playSym = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        playSym.setAttribute("points", `${width - 22},${height/2 - 4} ${width - 22},${height/2 + 4} ${width - 15},${height/2}`);
        playSym.setAttribute("fill", "white");
        playSym.setAttribute("style", "pointer-events: none;");

        const timeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        timeText.setAttribute("x", width - 48);
        timeText.setAttribute("y", height/2 + 4);
        timeText.setAttribute("class", "map-time");
        timeText.textContent = formatTime(node.time);

        g.appendChild(timeText);
        g.appendChild(circle);
        g.appendChild(playSym);

        circle.addEventListener("click", (e) => {
          e.stopPropagation();
          if (state.videoLoaded) {
            video.currentTime = node.time;
            video.play();
          }
        });
      }

      g.addEventListener("click", () => {
        if (state.videoLoaded) {
          video.currentTime = node.time;
          video.play();
        }
      });

      nodesGroup.appendChild(g);
    });

    updateViewportTransform();
  }

  function updateMindmapHighlighting(time) {
    if (state.activeDrawer !== "drawer-mindmap") return;

    let activeNodeId = "root";
    let maxTime = -1;
    courseData.mindmap.nodes.forEach(node => {
      if (time >= node.time && node.time > maxTime) {
        maxTime = node.time;
        activeNodeId = node.id;
      }
    });

    const svgNodes = nodesGroup.querySelectorAll(".map-node");
    svgNodes.forEach(n => {
      n.classList.remove("active-node");
      if (n.dataset.id === activeNodeId) {
        n.classList.add("active-node");
      }
    });

    const svgLinks = linksGroup.querySelectorAll(".map-link");
    svgLinks.forEach(l => {
      l.classList.remove("active-link");
      if (l.dataset.to === activeNodeId || l.dataset.from === activeNodeId) {
        l.classList.add("active-link");
      }
    });
  }


  // ==========================================
  // 10. Drawer Panel 5: Classroom Quiz (随堂练习)
  // ==========================================
  const quizActiveView = document.getElementById("quiz-active-view");
  const quizResultsView = document.getElementById("quiz-results-view");
  const quizProgressIndicator = document.getElementById("quiz-progress-indicator");
  const quizCurrentNumText = document.getElementById("quiz-current-num");
  const quizTotalNumText = document.getElementById("quiz-total-num");
  const quizQuestionText = document.getElementById("quiz-question-text");
  const quizOptionsBox = document.getElementById("quiz-options-box");
  const quizExplanationBox = document.getElementById("quiz-explanation-box");
  const quizExplanationText = document.getElementById("quiz-explanation-text");
  const explanationOutcomeTitle = document.getElementById("explanation-outcome-title");
  
  const quizPrevBtn = document.getElementById("quiz-prev-btn");
  const quizNextBtn = document.getElementById("quiz-next-btn");
  const quizRestartBtn = document.getElementById("quiz-restart-btn");
  const quizInstantToggle = document.getElementById("quiz-instant-toggle");
  const quizInstantSlider = document.getElementById("quiz-instant-slider");

  quizInstantToggle.addEventListener("change", (e) => {
    state.quizInstantFeedback = e.target.checked;
    quizInstantSlider.style.backgroundColor = state.quizInstantFeedback ? "var(--color-primary)" : "#ccc";
  });
  quizInstantSlider.style.backgroundColor = "var(--color-primary)";

  // Setup total count
  quizTotalNumText.innerText = courseData.quiz.length;

  function loadQuizQuestion(index) {
    const qData = courseData.quiz[index];
    if (!qData) return;

    quizExplanationBox.style.display = "none";

    const progressPercent = ((index + 1) / courseData.quiz.length) * 100;
    quizProgressIndicator.style.width = `${progressPercent}%`;
    quizCurrentNumText.innerText = index + 1;

    quizQuestionText.innerText = qData.q;
    quizExplanationText.innerText = qData.explanation;

    quizOptionsBox.innerHTML = "";
    qData.options.forEach((optText, optIdx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      
      const badge = String.fromCharCode(65 + optIdx); 
      btn.innerHTML = `
        <span class="option-badge">${badge}</span>
        <span class="option-text">${optText}</span>
      `;

      const previousSelection = state.quizAnswers[index];
      if (previousSelection !== null) {
        if (optIdx === previousSelection) {
          btn.classList.add("selected");
        }
        
        if (state.quizInstantFeedback) {
          if (optIdx === qData.answer) {
            btn.classList.add("correct");
          } else if (optIdx === previousSelection) {
            btn.classList.add("incorrect");
          }
          btn.disabled = true; 
        }
      }

      btn.addEventListener("click", () => {
        if (state.quizAnswers[index] !== null) return; 
        
        state.quizAnswers[index] = optIdx;
        
        const currentOpts = quizOptionsBox.querySelectorAll(".quiz-option");
        currentOpts.forEach(o => o.classList.remove("selected"));
        btn.classList.add("selected");

        if (state.quizInstantFeedback) {
          if (optIdx === qData.answer) {
            btn.classList.add("correct");
            explanationOutcomeTitle.innerText = "✓ 回答正确";
            explanationOutcomeTitle.style.color = "#10b981";
            state.quizScore += 10; 
          } else {
            btn.classList.add("incorrect");
            explanationOutcomeTitle.innerText = `✗ 回答错误 (正确答案: ${String.fromCharCode(65 + qData.answer)})`;
            explanationOutcomeTitle.style.color = "#ef4444";
            currentOpts[qData.answer].classList.add("correct");
          }
          quizExplanationBox.style.display = "flex";
          currentOpts.forEach(o => o.disabled = true);
        }
      });

      quizOptionsBox.appendChild(btn);
    });

    if (state.quizAnswers[index] !== null && state.quizInstantFeedback) {
      const prevAns = state.quizAnswers[index];
      if (prevAns === qData.answer) {
        explanationOutcomeTitle.innerText = "✓ 回答正确";
        explanationOutcomeTitle.style.color = "#10b981";
      } else {
        explanationOutcomeTitle.innerText = `✗ 回答错误 (正确答案: ${String.fromCharCode(65 + qData.answer)})`;
        explanationOutcomeTitle.style.color = "#ef4444";
      }
      quizExplanationBox.style.display = "flex";
    }

    quizPrevBtn.disabled = index === 0;
    
    if (index === courseData.quiz.length - 1) {
      quizNextBtn.innerText = "提交结果";
    } else {
      quizNextBtn.innerText = "下一题";
    }
  }

  quizPrevBtn.addEventListener("click", () => {
    if (state.quizCurrentIndex > 0) {
      state.quizCurrentIndex--;
      loadQuizQuestion(state.quizCurrentIndex);
    }
  });

  quizNextBtn.addEventListener("click", () => {
    if (state.quizAnswers[state.quizCurrentIndex] === null) {
      alert("请先选择您的答案！");
      return;
    }

    if (state.quizCurrentIndex < courseData.quiz.length - 1) {
      state.quizCurrentIndex++;
      loadQuizQuestion(state.quizCurrentIndex);
    } else {
      showQuizResults();
    }
  });

  document.getElementById("quiz-hint-btn").addEventListener("click", () => {
    const qData = courseData.quiz[state.quizCurrentIndex];
    alert(`💡 答题提示:\n\n${qData.hint}`);
  });

  function showQuizResults() {
    quizActiveView.style.display = "none";
    quizResultsView.style.display = "flex";

    let score = 0;
    state.quizAnswers.forEach((ans, idx) => {
      if (ans === courseData.quiz[idx].answer) {
        score += 10;
      }
    });

    const correctCount = score / 10;
    const maxPossibleScore = courseData.quiz.length * 10;
    const finalPercent = Math.round((score / maxPossibleScore) * 100);
    
    const resultsScoreRing = document.getElementById("results-score-ring");
    resultsScoreRing.style.background = `radial-gradient(white 55%, transparent 56%), conic-gradient(var(--color-primary) ${finalPercent}%, #e2e8f0 ${finalPercent}%)`;

    document.getElementById("results-score-num").innerText = score;
    document.getElementById("results-stats-text").innerText = `答对 ${correctCount} 题 / 共 ${courseData.quiz.length} 题`;

    const resultsTitleText = document.getElementById("results-title-text");
    if (finalPercent >= 90) {
      resultsTitleText.innerText = "太棒了！测试成绩优秀！";
      resultsTitleText.style.color = "var(--color-cat-green)";
    } else if (finalPercent >= 60) {
      resultsTitleText.innerText = "合格通过，继续努力！";
      resultsTitleText.style.color = "var(--color-cat-orange)";
    } else {
      resultsTitleText.innerText = "不及格，建议重修课件！";
      resultsTitleText.style.color = "#ef4444";
    }
  }

  quizRestartBtn.addEventListener("click", () => {
    state.quizCurrentIndex = 0;
    state.quizScore = 0;
    state.quizAnswers = Array(courseData.quiz.length).fill(null);
    
    quizActiveView.style.display = "flex";
    quizResultsView.style.display = "none";
    loadQuizQuestion(0);
  });

  loadQuizQuestion(0);


  // ==========================================
  // 11. Drawer Panel 6: Flashcards (记忆闪卡)
  // ==========================================
  const flashcardFlipTrigger = document.getElementById("flashcard-flip-trigger");
  const flashcardInnerBox = document.getElementById("flashcard-inner-box");
  const cardFrontText = document.getElementById("card-front-text");
  const cardBackText = document.getElementById("card-back-text");
  const cardCurrentNumText = document.getElementById("card-current-num");
  const cardTotalNumText = document.getElementById("card-total-num");
  const cardProgressIndicator = document.getElementById("card-progress-indicator");
  
  const cardFuzzyBtn = document.getElementById("card-action-fuzzy");
  const cardKnowBtn = document.getElementById("card-action-know");
  const flashcardActiveView = document.getElementById("flashcard-active-view");
  const flashcardCompleteView = document.getElementById("flashcard-complete-view");
  const cardRestartBtn = document.getElementById("card-restart-btn");

  cardTotalNumText.innerText = courseData.flashcards.length;

  flashcardFlipTrigger.addEventListener("click", () => {
    flashcardFlipTrigger.classList.toggle("flipped");
  });

  function loadFlashcard(index) {
    const card = courseData.flashcards[index];
    if (!card) return;

    flashcardFlipTrigger.classList.remove("flipped");

    setTimeout(() => {
      cardFrontText.innerText = card.q;
      cardBackText.innerText = card.a;
    }, 150);

    const progressPercent = ((index + 1) / courseData.flashcards.length) * 100;
    cardProgressIndicator.style.width = `${progressPercent}%`;
    cardCurrentNumText.innerText = index + 1;
  }

  cardFuzzyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    state.cardStatus[state.cardCurrentIndex] = "fuzzy";
    advanceFlashcards();
  });

  cardKnowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    state.cardStatus[state.cardCurrentIndex] = "know";
    advanceFlashcards();
  });

  function advanceFlashcards() {
    if (state.cardCurrentIndex < courseData.flashcards.length - 1) {
      state.cardCurrentIndex++;
      loadFlashcard(state.cardCurrentIndex);
    } else {
      showFlashcardsComplete();
    }
  }

  function showFlashcardsComplete() {
    flashcardActiveView.style.display = "none";
    flashcardCompleteView.style.display = "flex";

    let knows = 0;
    let fuzzies = 0;
    state.cardStatus.forEach(status => {
      if (status === "know") knows++;
      else fuzzies++;
    });

    const percent = Math.round((knows / courseData.flashcards.length) * 100);
    document.getElementById("card-results-ring").style.background = `conic-gradient(#a855f7 ${percent}%, #e2e8f0 ${percent}%)`;
    document.getElementById("card-results-stats-text").innerText = `轻松掌握: ${knows} 张 / 模糊待温习: ${fuzzies} 张`;
  }

  cardRestartBtn.addEventListener("click", () => {
    state.cardCurrentIndex = 0;
    state.cardStatus = Array(courseData.flashcards.length).fill(null);
    
    flashcardActiveView.style.display = "flex";
    flashcardCompleteView.style.display = "none";
    loadFlashcard(0);
  });

  loadFlashcard(0);


  // ==========================================
  // 12. Discussion Comment Board (课程讨论)
  // ==========================================
  const commentTextInput = document.getElementById("comment-text-input");
  const commentTimeBtn = document.getElementById("comment-time-btn");
  const commentTimestamp = document.getElementById("comment-timestamp");
  const submitCommentBtn = document.getElementById("submit-comment-btn");
  const commentsListBox = document.getElementById("comments-list-box");

  let commentTimeAnchor = 0;

  function updateCommentClockBadge() {
    if (state.videoLoaded) {
      commentTimeAnchor = Math.floor(video.currentTime);
      commentTimestamp.innerText = formatTime(commentTimeAnchor);
    }
  }

  commentTimeBtn.addEventListener("click", () => {
    updateCommentClockBadge();
  });

  submitCommentBtn.addEventListener("click", () => {
    const text = commentTextInput.value.trim();
    if (!text) return;

    const node = document.createElement("div");
    node.className = "comment-node";
    
    const timeVal = commentTimeAnchor;
    const author = "我 (学生)";
    const initial = author.substring(0, 1);

    node.innerHTML = `
      <div class="comment-avatar" style="background-color: var(--color-primary-light); color: var(--color-primary);">${initial}</div>
      <div class="comment-content">
        <div class="comment-header-row">
          <span class="comment-author">${author}</span>
          <span class="comment-time-badge" data-time="${timeVal}">${formatTime(timeVal)}</span>
        </div>
        <p class="comment-text">${text}</p>
        <span class="comment-date">刚刚</span>
      </div>
    `;

    node.querySelector(".comment-time-badge").addEventListener("click", () => {
      if (state.videoLoaded) {
        video.currentTime = timeVal;
        video.play();
      }
    });

    commentsListBox.insertBefore(node, commentsListBox.firstChild);
    commentTextInput.value = "";
  });

  document.querySelectorAll(".comments-list .comment-time-badge").forEach(badge => {
    badge.addEventListener("click", () => {
      if (state.videoLoaded) {
        const seconds = parseInt(badge.dataset.time);
        video.currentTime = seconds;
        video.play();
      }
    });
  });


  // ==========================================
  // 13. Admin Configuration Panel Interface Logic
  // ==========================================
  const adminLoginBtn = document.getElementById("admin-login-btn");
  const passwordModal = document.getElementById("password-modal");
  const passwordCancelBtn = document.getElementById("password-cancel-btn");
  const passwordConfirmBtn = document.getElementById("password-confirm-btn");
  const adminPasswordInput = document.getElementById("admin-password-input");

  // Form Elements
  const adminCourseTitle = document.getElementById("admin-course-title");
  const adminCourseBadge = document.getElementById("admin-course-badge");
  const adminApiKey = document.getElementById("admin-api-key");
  const adminCaptionsList = document.getElementById("admin-captions-list");
  const adminSegmentsList = document.getElementById("admin-segments-list");
  const adminSlidesList = document.getElementById("admin-slides-list");
  const adminMindmapList = document.getElementById("admin-mindmap-list");
  const adminQuizzesList = document.getElementById("admin-quizzes-list");
  const adminFlashcardsList = document.getElementById("admin-flashcards-list");
  const adminPptFiles = document.getElementById("admin-ppt-files");
  const adminCourseCode = document.getElementById("admin-course-code");
  const adminTeacherName = document.getElementById("admin-teacher-name");
  const adminStudentsList = document.getElementById("admin-students-list");
  
  // Dynamic add buttons
  const adminAddCaptionBtn = document.getElementById("admin-add-caption-btn");
  const adminAddSegmentBtn = document.getElementById("admin-add-segment-btn");
  const adminAddQuizBtn = document.getElementById("admin-add-quiz-btn");
  const adminAddCardBtn = document.getElementById("admin-add-card-btn");
  const adminAddStudentBtn = document.getElementById("admin-add-student-btn");
  const adminSaveConfigBtn = document.getElementById("admin-save-config-btn");
  const adminResetDataBtn = document.getElementById("admin-reset-data-btn");

  adminLoginBtn.addEventListener("click", () => {
    adminPasswordInput.value = "";
    passwordModal.style.display = "flex";
    adminPasswordInput.focus();
  });

  passwordCancelBtn.addEventListener("click", () => {
    passwordModal.style.display = "none";
  });

  passwordConfirmBtn.addEventListener("click", verifyPassword);
  adminPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") verifyPassword();
  });

  // Admin accordion fold/unfold toggles
  const adminSecHeaders = document.querySelectorAll(".admin-sec-header");
  adminSecHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const parentSec = header.closest(".admin-sec");
      const isActive = parentSec.classList.contains("active");
      
      // Close all other sections
      document.querySelectorAll(".admin-sec").forEach(sec => {
        sec.classList.remove("active");
      });
      
      // Open the clicked one if it was closed
      if (!isActive) {
        parentSec.classList.add("active");
      }
    });
  });

  function verifyPassword() {
    const pw = adminPasswordInput.value.trim();
    if (pw === "admin") {
      passwordModal.style.display = "none";
      if (loginOverlay) {
        loginOverlay.style.display = "none";
      }
      openDrawer("drawer-admin");
      loadAdminConfigData();
    } else {
      alert("密码错误，默认密码为：admin");
    }
  }

  function loadAdminConfigData() {
    adminCourseTitle.value = courseData.course_title || "";
    adminCourseBadge.value = courseData.course_badge || "";
    adminApiKey.value = courseData.api_key || "";
    adminCourseCode.value = courseData.course_code || "";
    adminTeacherName.value = courseData.teacher_name || "";

    renderAdminCaptions();
    renderAdminSegments();
    renderAdminSlides();
    renderAdminMindmap();
    renderAdminQuizzes();
    renderAdminFlashcards();
    renderAdminStudents();

    lucide.createIcons();
  }

  // 13.1 Edit Subtitles list
  function renderAdminCaptions() {
    adminCaptionsList.innerHTML = "";
    courseData.transcripts.forEach((caption, idx) => {
      const row = document.createElement("div");
      row.className = "admin-item-row admin-caption-row";
      row.innerHTML = `
        <input type="number" class="cap-time" value="${caption.time}" style="width: 70px;" placeholder="秒">
        <input type="text" class="cap-text" value="${caption.text}" style="flex: 1;" placeholder="字幕行文本内容...">
        <button class="admin-trash-btn" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
      `;
      adminCaptionsList.appendChild(row);
    });
  }

  // 13.1.2 Edit Students list
  function renderAdminStudents() {
    adminStudentsList.innerHTML = "";
    const roster = courseData.students || [];
    roster.forEach((student, idx) => {
      const row = document.createElement("div");
      row.className = "admin-item-row admin-student-row";
      row.innerHTML = `
        <input type="text" class="stu-id" value="${student.id}" style="width: 120px;" placeholder="学号">
        <input type="text" class="stu-name" value="${student.name}" style="flex: 1;" placeholder="姓名">
        <button class="admin-trash-btn" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
      `;
      adminStudentsList.appendChild(row);
    });
  }

  if (adminAddStudentBtn) {
    adminAddStudentBtn.addEventListener("click", () => {
      const row = document.createElement("div");
      row.className = "admin-item-row admin-student-row";
      row.innerHTML = `
        <input type="text" class="stu-id" value="" style="width: 120px;" placeholder="学号">
        <input type="text" class="stu-name" value="" style="flex: 1;" placeholder="姓名">
        <button class="admin-trash-btn" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
      `;
      adminStudentsList.appendChild(row);
      lucide.createIcons();
    });
  }

  adminAddCaptionBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "admin-item-row admin-caption-row";
    row.innerHTML = `
      <input type="number" class="cap-time" value="0" style="width: 70px;" placeholder="秒">
      <input type="text" class="cap-text" value="" style="flex: 1;" placeholder="新字幕行内容...">
      <button class="admin-trash-btn" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
    `;
    adminCaptionsList.appendChild(row);
    lucide.createIcons();
  });

  // 13.1.5 Edit Segments list (Timeline Sectors)
  function renderAdminSegments() {
    adminSegmentsList.innerHTML = "";
    courseData.segments.forEach((seg, idx) => {
      const card = document.createElement("div");
      card.className = "admin-form-group admin-segment-row";
      card.style.cssText = "border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background-color: white; position: relative; margin-bottom: 8px;";
      
      const tagsText = (seg.tags || []).join(", ");
      
      card.innerHTML = `
        <button class="admin-trash-btn" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
        <span style="font-size: 11px; font-weight:700; color: var(--color-primary)">分段重点 #${idx + 1}</span>
        
        <div style="display: grid; grid-template-columns: 80px 1fr; gap: 8px; margin-top: 6px;">
          <div>
            <label style="font-size:11px;">触发秒数</label>
            <input type="number" class="seg-time" value="${seg.time}">
          </div>
          <div>
            <label style="font-size:11px;">分段标题</label>
            <input type="text" class="seg-title" value="${seg.title}">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
          <div>
            <label style="font-size:11px;">颜色主题</label>
            <select class="seg-color-theme">
              <option value="green" ${seg.color === 'green' ? 'selected' : ''}>绿色 (Green)</option>
              <option value="purple" ${seg.color === 'purple' ? 'selected' : ''}>紫色 (Purple)</option>
              <option value="pink" ${seg.color === 'pink' ? 'selected' : ''}>粉色 (Pink)</option>
              <option value="orange" ${seg.color === 'orange' ? 'selected' : ''}>橙色 (Orange)</option>
              <option value="blue" ${seg.color === 'blue' ? 'selected' : ''}>蓝色 (Blue)</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px;">关联分类 (空格分隔)</label>
            <input type="text" class="seg-categories" value="${seg.categories}" placeholder="例如: distribution conservation">
          </div>
        </div>

        <div class="admin-form-group" style="margin-top: 6px;">
          <label>展示标签 (逗号分隔)</label>
          <input type="text" class="seg-tags-input" value="${tagsText}" placeholder="例如: 流域分布, 径流差异">
        </div>

        <div class="admin-form-group" style="margin-top: 6px;">
          <label>详细要点介绍/解析</label>
          <textarea class="seg-desc" style="height: 50px;">${seg.desc || ''}</textarea>
        </div>
      `;
      adminSegmentsList.appendChild(card);
    });
  }

  adminAddSegmentBtn.addEventListener("click", () => {
    const card = document.createElement("div");
    card.className = "admin-form-group admin-segment-row";
    card.style.cssText = "border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background-color: white; position: relative; margin-bottom: 8px;";
    
    card.innerHTML = `
      <button class="admin-trash-btn" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
      <span style="font-size: 11px; font-weight:700; color: var(--color-primary)">新知识切片</span>
      
      <div style="display: grid; grid-template-columns: 80px 1fr; gap: 8px; margin-top: 6px;">
        <div>
          <label style="font-size:11px;">触发秒数</label>
          <input type="number" class="seg-time" value="0">
        </div>
        <div>
          <label style="font-size:11px;">分段标题</label>
          <input type="text" class="seg-title" value="">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
        <div>
          <label style="font-size:11px;">颜色主题</label>
          <select class="seg-color-theme">
            <option value="green">绿色 (Green)</option>
            <option value="purple">紫色 (Purple)</option>
            <option value="pink">粉色 (Pink)</option>
            <option value="orange">橙色 (Orange)</option>
            <option value="blue">蓝色 (Blue)</option>
          </select>
        </div>
        <div>
          <label style="font-size:11px;">关联分类 (空格分隔)</label>
          <input type="text" class="seg-categories" value="distribution" placeholder="例如: distribution conservation">
        </div>
      </div>

      <div class="admin-form-group" style="margin-top: 6px;">
        <label>展示标签 (逗号分隔)</label>
        <input type="text" class="seg-tags-input" value="" placeholder="例如: 流域分布, 径流差异">
      </div>

      <div class="admin-form-group" style="margin-top: 6px;">
        <label>详细要点介绍/解析</label>
        <textarea class="seg-desc" style="height: 50px;"></textarea>
      </div>
    `;
    adminSegmentsList.appendChild(card);
    lucide.createIcons();
  });

  // 13.2 Edit Slides list
  function renderAdminSlides() {
    adminSlidesList.innerHTML = "";
    courseData.slides.forEach((slide, idx) => {
      const card = document.createElement("div");
      card.className = "admin-form-group admin-slide-row";
      card.style.cssText = "border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background-color: white; position: relative;";
      
      const bulletsText = (slide.bullets || []).join("\n");
      const imgBase64 = slide.url ? `<img src="${slide.url}" style="width: 80px; aspect-ratio:16/9; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">` : `<span>(矢量图预置)</span>`;

      card.innerHTML = `
        <button class="admin-trash-btn" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
        <div style="display: flex; gap: 10px; margin-bottom: 8px;">
          ${imgBase64}
          <div style="flex: 1;">
            <label style="font-size: 11px;">P.${idx + 1} 触发时间轴秒数</label>
            <input type="number" class="slide-time" value="${slide.time}" style="width: 90px; margin-top: 4px;">
          </div>
        </div>
        <div class="admin-form-group">
          <label>幻灯片标题</label>
          <input type="text" class="slide-title" value="${slide.title}">
        </div>
        <div class="admin-form-group" style="margin-top: 6px;">
          <label>要点内容 (每行一条)</label>
          <textarea class="slide-bullets" style="height: 50px;">${bulletsText}</textarea>
        </div>
      `;
      adminSlidesList.appendChild(card);
    });
  }

  const adminPptUploaderZone = document.getElementById("admin-ppt-uploader-zone");
  adminPptUploaderZone.addEventListener("click", () => adminPptFiles.click());
  
  function compressImage(file, maxWidth = 800, maxHeight = 450, quality = 0.7) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  adminPptFiles.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    if (files.length === 0) return;

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      try {
        const compressedUrl = await compressImage(file);
        const rowTime = Math.floor((state.duration / files.length) * idx);
        
        const card = document.createElement("div");
        card.className = "admin-form-group admin-slide-row";
        card.dataset.localUrl = compressedUrl; 
        card.style.cssText = "border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background-color: white; position: relative;";
        
        card.innerHTML = `
          <button class="admin-trash-btn" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
          <div style="display: flex; gap: 10px; margin-bottom: 8px;">
            <img src="${compressedUrl}" style="width: 80px; aspect-ratio:16/9; object-fit: cover; border-radius: 4px; border: 1px solid var(--border-color);">
            <div style="flex: 1;">
              <label style="font-size: 11px;">新上传 触发秒数</label>
              <input type="number" class="slide-time" value="${rowTime}" style="width: 90px; margin-top: 4px;">
            </div>
          </div>
          <div class="admin-form-group">
            <label>幻灯片标题</label>
            <input type="text" class="slide-title" value="${file.name.replace(/\.[^/.]+$/, "")}">
          </div>
          <div class="admin-form-group" style="margin-top: 6px;">
            <label>要点内容 (每行一条)</label>
            <textarea class="slide-bullets" style="height: 50px;" placeholder="要点 1&#10;要点 2"></textarea>
          </div>
        `;
        adminSlidesList.appendChild(card);
        lucide.createIcons();
      } catch (err) {
        console.error("读取 or 压缩PPT文件失败:", err);
      }
    }
  });

  // 13.3 Edit Mindmap list
  function renderAdminMindmap() {
    adminMindmapList.innerHTML = "";
    courseData.mindmap.nodes.forEach((node, idx) => {
      if (node.type === "root") return;
      const row = document.createElement("div");
      row.className = "admin-item-row admin-mindmap-row";
      row.dataset.id = node.id;
      row.dataset.x = node.x;
      row.dataset.y = node.y;
      row.dataset.type = node.type;

      row.innerHTML = `
        <span style="font-size: 11px; font-weight:700; width: 40px; color: var(--text-secondary);">${node.id}</span>
        <input type="text" class="map-label" value="${node.label}" style="flex: 1;" placeholder="节点名称">
        <input type="number" class="map-time-val" value="${node.time}" style="width: 70px;" placeholder="时间(秒)">
      `;
      adminMindmapList.appendChild(row);
    });
  }

  // 13.4 Edit Quizzes list
  function renderAdminQuizzes() {
    adminQuizzesList.innerHTML = "";
    courseData.quiz.forEach((qItem, idx) => {
      const card = document.createElement("div");
      card.className = "admin-form-group admin-quiz-row";
      card.style.cssText = "border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background-color: white; position: relative;";

      card.innerHTML = `
        <button class="admin-trash-btn" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
        <span style="font-size: 11px; font-weight:700; color: var(--color-primary)">Q.${idx + 1} 随堂测试题</span>
        <div class="admin-form-group" style="margin-top: 6px;">
          <label>题目问题描述</label>
          <input type="text" class="quiz-q" value="${qItem.q}">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px;">
          <div><label style="font-size: 11px">A 选项</label><input type="text" class="quiz-opt-a" value="${qItem.options[0]}"></div>
          <div><label style="font-size: 11px">B 选项</label><input type="text" class="quiz-opt-b" value="${qItem.options[1]}"></div>
          <div><label style="font-size: 11px">C 选项</label><input type="text" class="quiz-opt-c" value="${qItem.options[2]}"></div>
          <div><label style="font-size: 11px">D 选项</label><input type="text" class="quiz-opt-d" value="${qItem.options[3]}"></div>
        </div>
        <div class="admin-form-group" style="margin-top: 6px;">
          <label>正确答案选项</label>
          <select class="quiz-correct">
            <option value="0" ${qItem.answer === 0 ? 'selected' : ''}>A</option>
            <option value="1" ${qItem.answer === 1 ? 'selected' : ''}>B</option>
            <option value="2" ${qItem.answer === 2 ? 'selected' : ''}>C</option>
            <option value="3" ${qItem.answer === 3 ? 'selected' : ''}>D</option>
          </select>
        </div>
        <div class="admin-form-group" style="margin-top: 6px;">
          <label>做题提示 (Hint)</label>
          <input type="text" class="quiz-hint" value="${qItem.hint || ''}">
        </div>
        <div class="admin-form-group" style="margin-top: 6px;">
          <label>题目解析说明 (Explanation)</label>
          <textarea class="quiz-explanation" style="height: 50px;">${qItem.explanation || ''}</textarea>
        </div>
      `;
      adminQuizzesList.appendChild(card);
    });
  }

  adminAddQuizBtn.addEventListener("click", () => {
    const card = document.createElement("div");
    card.className = "admin-form-group admin-quiz-row";
    card.style.cssText = "border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background-color: white; position: relative;";

    card.innerHTML = `
      <button class="admin-trash-btn" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
      <span style="font-size: 11px; font-weight:700; color: var(--color-primary)">新测试题</span>
      <div class="admin-form-group" style="margin-top: 6px;">
        <label>题目问题描述</label>
        <input type="text" class="quiz-q" value="">
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px;">
        <div><label style="font-size: 11px">A 选项</label><input type="text" class="quiz-opt-a" value=""></div>
        <div><label style="font-size: 11px">B 选项</label><input type="text" class="quiz-opt-b" value=""></div>
        <div><label style="font-size: 11px">C 选项</label><input type="text" class="quiz-opt-c" value=""></div>
        <div><label style="font-size: 11px">D 选项</label><input type="text" class="quiz-opt-d" value=""></div>
      </div>
      <div class="admin-form-group" style="margin-top: 6px;">
        <label>正确答案选项</label>
        <select class="quiz-correct">
          <option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option>
        </select>
      </div>
      <div class="admin-form-group" style="margin-top: 6px;">
        <label>做题提示 (Hint)</label>
        <input type="text" class="quiz-hint" value="">
      </div>
      <div class="admin-form-group" style="margin-top: 6px;">
        <label>题目解析说明 (Explanation)</label>
        <textarea class="quiz-explanation" style="height: 50px;"></textarea>
      </div>
    `;
    adminQuizzesList.appendChild(card);
    lucide.createIcons();
  });

  // 13.5 Edit Flashcards list
  function renderAdminFlashcards() {
    adminFlashcardsList.innerHTML = "";
    courseData.flashcards.forEach((card, idx) => {
      const box = document.createElement("div");
      box.className = "admin-form-group admin-card-row";
      box.style.cssText = "border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background-color: white; position: relative;";

      box.innerHTML = `
        <button class="admin-trash-btn" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
        <span style="font-size: 11px; font-weight:700; color: #a855f7">闪卡 P.${idx + 1}</span>
        <div class="admin-form-group" style="margin-top: 6px;">
          <label>卡片正面问题 / 考点</label>
          <input type="text" class="card-q" value="${card.q}">
        </div>
        <div class="admin-form-group" style="margin-top: 6px;">
          <label>卡片反面解答 / 说明</label>
          <textarea class="card-a" style="height: 50px;">${card.a}</textarea>
        </div>
      `;
      adminFlashcardsList.appendChild(box);
    });
  }

  adminAddCardBtn.addEventListener("click", () => {
    const box = document.createElement("div");
    box.className = "admin-form-group admin-card-row";
    box.style.cssText = "border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background-color: white; position: relative;";

    box.innerHTML = `
      <button class="admin-trash-btn" style="position: absolute; top: 10px; right: 10px;" onclick="this.parentElement.remove()"><i data-lucide="trash-2" style="width: 14px; height: 14px"></i></button>
      <span style="font-size: 11px; font-weight:700; color: #a855f7">新记忆闪卡</span>
      <div class="admin-form-group" style="margin-top: 6px;">
        <label>卡片正面问题 / 考点</label>
        <input type="text" class="card-q" value="">
      </div>
      <div class="admin-form-group" style="margin-top: 6px;">
        <label>卡片反面解答 / 说明</label>
        <textarea class="card-a" style="height: 50px;"></textarea>
      </div>
    `;
    adminFlashcardsList.appendChild(box);
    lucide.createIcons();
  });

  // 13.6 Save configs to browser Local Storage
  adminSaveConfigBtn.addEventListener("click", () => {
    const nextConfig = {
      course_title: adminCourseTitle.value.trim(),
      course_badge: adminCourseBadge.value.trim(),
      api_key: adminApiKey.value.trim(),
      course_code: adminCourseCode.value.trim(),
      teacher_name: adminTeacherName.value.trim(),
      students: [],
      transcripts: [],
      segments: [],
      slides: [],
      mindmap: { nodes: [], links: [] },
      quiz: [],
      flashcards: []
    };

    // Collect student roster
    document.querySelectorAll(".admin-student-row").forEach(row => {
      const id = row.querySelector(".stu-id").value.trim();
      const name = row.querySelector(".stu-name").value.trim();
      if (id && name) {
        nextConfig.students.push({ id, name });
      }
    });

    // Collect captions
    document.querySelectorAll(".admin-caption-row").forEach(row => {
      const time = parseInt(row.querySelector(".cap-time").value) || 0;
      const text = row.querySelector(".cap-text").value.trim();
      if (text) {
        nextConfig.transcripts.push({ time, text });
      }
    });
    nextConfig.transcripts.sort((a, b) => a.time - b.time);

    // Collect segments (Timeline sectors)
    document.querySelectorAll(".admin-segment-row").forEach(row => {
      const time = parseInt(row.querySelector(".seg-time").value) || 0;
      const title = row.querySelector(".seg-title").value.trim();
      const color = row.querySelector(".seg-color-theme").value;
      const categories = row.querySelector(".seg-categories").value.trim();
      const tags = row.querySelector(".seg-tags-input").value.split(",").map(t => t.trim()).filter(t => t.length > 0);
      const desc = row.querySelector(".seg-desc").value.trim();

      if (title) {
        nextConfig.segments.push({ time, title, color, categories, tags, desc });
      }
    });
    nextConfig.segments.sort((a, b) => a.time - b.time);

    // Collect slides
    document.querySelectorAll(".admin-slide-row").forEach(row => {
      const time = parseInt(row.querySelector(".slide-time").value) || 0;
      const title = row.querySelector(".slide-title").value.trim();
      const bullets = row.querySelector(".slide-bullets").value.split("\n").map(b => b.trim()).filter(b => b.length > 0);
      
      const localUrl = row.dataset.localUrl;
      const originalSlide = courseData.slides.find(s => s.title === title);
      
      nextConfig.slides.push({
        time,
        title,
        bullets,
        url: localUrl ? localUrl : (originalSlide ? originalSlide.url : undefined)
      });
    });
    nextConfig.slides.sort((a, b) => a.time - b.time);

    // Collect Mindmap nodes
    const rootNode = courseData.mindmap.nodes.find(n => n.id === "root");
    nextConfig.mindmap.nodes.push(rootNode);

    document.querySelectorAll(".admin-mindmap-row").forEach(row => {
      const id = row.dataset.id;
      const x = parseInt(row.dataset.x);
      const y = parseInt(row.dataset.y);
      const type = row.dataset.type;
      
      const label = row.querySelector(".map-label").value.trim();
      const time = parseInt(row.querySelector(".map-time-val").value) || 0;

      nextConfig.mindmap.nodes.push({ id, label, x, y, type, time });
    });
    nextConfig.mindmap.links = courseData.mindmap.links;

    // Collect Quizzes
    document.querySelectorAll(".admin-quiz-row").forEach(row => {
      const q = row.querySelector(".quiz-q").value.trim();
      const options = [
        row.querySelector(".quiz-opt-a").value.trim(),
        row.querySelector(".quiz-opt-b").value.trim(),
        row.querySelector(".quiz-opt-c").value.trim(),
        row.querySelector(".quiz-opt-d").value.trim()
      ];
      const answer = parseInt(row.querySelector(".quiz-correct").value);
      const hint = row.querySelector(".quiz-hint").value.trim();
      const explanation = row.querySelector(".quiz-explanation").value.trim();

      if (q && options.every(o => o.length > 0)) {
        nextConfig.quiz.push({ q, options, answer, hint, explanation });
      }
    });

    // Collect Flashcards
    document.querySelectorAll(".admin-card-row").forEach(row => {
      const q = row.querySelector(".card-q").value.trim();
      const a = row.querySelector(".card-a").value.trim();
      if (q && a) {
        nextConfig.flashcards.push({ q, a });
      }
    });

    // Save
    localStorage.setItem("edustudio_course_config", JSON.stringify(nextConfig));
    alert("配置修改保存成功！页面即将重新载入更新视图。");
    location.reload();
  });

  adminResetDataBtn.addEventListener("click", () => {
    if (confirm("确定要删除所有自定义内容并恢复出厂默认课件配置吗？")) {
      localStorage.removeItem("edustudio_course_config");
      alert("已成功恢复出厂数据，即将刷新。");
      location.reload();
    }
  });

});
