// app.js - Core Interactive Logic & API Connections

// ==========================================
// 0. Configuration & Global State
// ==========================================
const DASHSCOPE_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
let DASHSCOPE_API_KEY = "sk-b0d611826846463d8b7c3a78ce680d9b"; // Pre-seeded key

const state = {
  activeDrawer: null,
  videoLoaded: true, // Default video is loaded
  currentTime: 0,
  duration: 833, // 13:53 in seconds
  currentSegmentIndex: -1,
  activeSlideIndex: 0,
  pptSyncEnabled: true,
  quizInstantFeedback: true,
  quizCurrentIndex: 0,
  quizScore: 0,
  quizAnswers: Array(10).fill(null), // Stores user selections
  cardCurrentIndex: 0,
  cardMasteredCount: 0,
  cardFuzzyCount: 0,
  cardStatus: Array(10).fill(null), // 'know' or 'fuzzy'
  isFullScreenMindmap: false
};

// Course Mock Database
const DATABASE = {
  // Captions Database
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
    { time: 700, text: "感谢同学们的认真聆听，请大家继续在右侧的研学空间进行随堂练习和闪卡温习！" }
  ],

  // PowerPoint Mock slides (using SVG vector slides, fully responsive)
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

  // Mindmap SVG Data Tree Nodes
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

  // Classroom Quiz Questions
  quiz: [
    {
      q: "中国三大流域区中，占陆地面积比例最小的是哪一个？",
      options: ["太平洋流域", "印度洋流域", "北冰洋流域", "大西洋流域"],
      answer: 2, // 0-indexed: C
      hint: "唯一流向北冰洋的是额尔齐斯河，流经新疆西北部。",
      explanation: "正确答案是北冰洋流域。我国外流区面积占全国的2/3，其中太平洋流域占外流区面积的58.2%，印度洋流域占6.4%，北冰洋流域仅占0.5%（主要由额尔齐斯河注入），其面积占比最小。"
    },
    {
      q: "被称为“地上悬河”的是黄河的哪一个河段？",
      options: ["源头段", "上游段", "中游段", "下游段"],
      answer: 3, // D
      hint: "泥沙在河道变宽、流速减慢的平原河段大量沉积。",
      explanation: "正确答案是下游段。黄河在中游流经黄土高原携带了世界最多的泥沙，到了下游华北平原流速骤降，泥沙淤积，致使下游河床平均每年升高，高出两岸地面数米，成为“地上悬河”。"
    },
    {
      q: "我国年径流量最大、流域面积最广的河流是？",
      options: ["黄河", "长江", "珠江", "黑龙江"],
      answer: 1, // B
      hint: "全长6300余千米，水能丰沛，被誉为“黄金水道”。",
      explanation: "正确答案是长江。长江全长居世界第三、全国第一，流域面积180万平方千米，年平均径流量近1万亿立方米，约占全国江河径流总量的36%，是当之无愧的我国最大河流。"
    },
    {
      q: "我国唯一流入北冰洋的河流是？",
      options: ["额尔齐斯河", "塔里木河", "澜沧江", "雅鲁藏布江"],
      answer: 0, // A
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
      answer: 2, // C
      hint: "内流河地处干旱温带沙漠气候区，极少依赖季风降雨。",
      explanation: "正确答案是：内流河水源主要来自高山冰雪融水，夏季进入汛期。我国西部干旱区内流河因降水极少，河流水源几乎全部依赖夏季高山冰雪融化，气温越高融水量越大，流量也就越大。"
    },
    {
      q: "水能资源极度丰富，被誉为“天然水能宝库”的是长江的哪个河段？",
      options: ["上游河段", "中游河段", "下游河段", "长江三角洲"],
      answer: 0, // A
      hint: "流经横断山区，地势落差极大，大坝多数分布于此。",
      explanation: "正确答案是上游河段。长江自源头下泻至宜昌为上游，流经第一二级阶梯交界处，落差高达数千米，集中了长江流域90%以上的水能资源，著名的三峡工程和溪洛渡大坝均在此段。"
    },
    {
      q: "我国最长的内流河是哪一条？",
      options: ["额尔齐斯河", "塔里木河", "弱水", "疏勒河"],
      answer: 1, // B
      hint: "流经塔里木盆地边缘，哺育了绿洲文明。",
      explanation: "正确答案是塔里木河。塔里木河全长2179千米，是我国第一大、世界第五大内流河，流域内降水稀少，主要由天山和昆仑山的冰雪融水补给。"
    },
    {
      q: "珠江水系之所以航运价值极高，其主要原因不包括？",
      options: [
        "年径流量巨大，仅次于长江，水深流稳",
        "冬季不结冰，全年可通航",
        "流经经济活跃的珠三角及两广腹地",
        "中上游落差极高，水流湍急，河道狭窄"
      ],
      answer: 3, // D
      hint: "水流湍急、落差大和河道狭窄不利于船舶通航。",
      explanation: "正确答案是：中上游落差极高，水流湍急，河道狭窄。航运需要稳定的水量和宽平的河道；湍急狭窄的河道只适合发展水力发电，相反是航运的障碍因素。"
    },
    {
      q: "近年来，为保护长江生态环境实施的“十年大计”是？",
      options: ["全面退田还湖", "长江流域重点水域“十年禁渔”", "南水北调中线工程", "沿江重工业全部搬迁"],
      answer: 1, // B
      hint: "旨在给长江生态休养生息的时间，挽救濒危鱼类资源。",
      explanation: "正确答案是长江流域重点水域“十年禁渔”。为挽救长江流域严重衰退的渔业资源和生物多样性，中国政府自2021年1月1日0时起实施了长江重点水域十年全面禁渔，属于历史上力度最大的生态保护行动。"
    },
    {
      q: "目前在我国各大流域推行的、由地方党政首长负责河流生态保护的机制是？",
      options: ["环保警察制", "河长制", "环境终身追责制", "流域协同监察制"],
      answer: 1, // B
      hint: "“每条河流都有人管”的责任管理机制。",
      explanation: "正确答案是“河长制”。河长制是指由各级党政主要负责人担任“河长”，负责辖区内河流的污染防治、资源保护、水安全及生态治理，把环境保护任务直接挂钩党政一把手的管理机制。"
    }
  ],

  // Flashcards Dataset
  flashcards: [
    {
      q: "中国三大流域区中，面积占比最小的是哪一个？",
      a: "北冰洋流域。\n\n解析：中国外流区可分为三大流域：太平洋流域（占外流区总面积的58%）、印度洋流域（占6.4%）和北冰洋流域（仅占约0.5%，只有额尔齐斯河一条河）。因此北冰洋流域在我国境内占比最小。"
    },
    {
      q: "什么是“外流河”与“外流区”？",
      a: "外流河：直接或间接流入海洋的河流（如长江、黄河、珠江、雅鲁藏布江）。\n\n外流区：外流河的集水区域（流域），占我国陆地总面积的2/3左右，径流量占全国江河总径流量的95%以上。"
    },
    {
      q: "什么是“内流河”与“内流区”？",
      a: "内流河：最终未流入海洋，而是注入内陆湖泊或消失在沙漠、荒漠中的河流（如塔里木河、弱水）。\n\n内流区：内流河的集水区域，占我国陆地总面积的1/3左右，但水资源总量较少。"
    },
    {
      q: "我国河流南北方水文特征存在巨大差异的主导因素是什么？",
      a: "季风气候带来的降雨量和气温差异。\n\n南方受季风雨带控制时间长，气温高，河流径流量大、汛期长、含沙量小、无结冰期；北方雨季短且寒冷，河流径流量较小、汛期短、含沙量大、冬季有结冰期。"
    },
    {
      q: "长江水系的三大地理特称是什么？",
      a: "1. 长度最长（6300余千米）\n2. 径流量最大（近1万亿立方米，占全国河川径流的36%）\n3. 流域面积最广（180万平方公里）。\n\n另外具有极高的水能开发价值（“水能宝库”）和水运商业价值（“黄金水道”）。"
    },
    {
      q: "黄河中下游水沙演变的主要地理灾害是什么？",
      a: "“地上悬河”。\n\n黄河中游流经黄土高原携带了极高浓度的泥沙；进入下游平原后流速变缓，泥沙大量淤积导致河床年年抬升，形成堤防高出两岸民宅地面的“地上悬河”，极易发生决口决堤灾害。"
    },
    {
      q: "珠江水系的主要分布、水量特点及经济价值？",
      a: "主要分布于华南粤桂等省区，由西江、北江、东江汇合而成。\n\n水量极大（年径流量仅次于长江，是黄河的6倍），含沙量低，四季通航。它连接了粤港澳大湾区，航运和水资源支撑价值极高。"
    },
    {
      q: "松花江水系的双汛期水文特征是如何形成的？",
      a: "1. 春汛：每年4-5月气温回升，冬季积雪融化流入河道形成。\n2. 夏汛：7-8月受东南夏季风影响，产生集中强降水形成。\n\n松花江纬度高，冬季结冰期长达5个月，航运在冬夏间切换。"
    },
    {
      q: "流水地质作用如何塑造河流的三段地貌？",
      a: "1. 上游：落差高，流水侵蚀切割为主，塑造深切V型谷（如三峡）。\n2. 中游：地形过渡，流水以搬运和轻度侵蚀为主，河床拓宽。\n3. 下游：平原地形，水流速极缓，流水堆积作用为主，泥沙下沉形成冲积扇、冲积平原和河口三角洲。"
    },
    {
      q: "什么是“河长制”？其核心工作是什么？",
      a: "河长制是党政主要负责人直接出任所辖江河段“河长”，负责该河流管理保护工作的机制。\n\n核心任务：水资源保护、水域岸线管理、水污染防治、水环境治理、水生态修复和执法监督，从体制上解决“环保踢皮球”的顽疾。"
    }
  ]
};

// ==========================================
// 1. Initial DOM Selection & Setup
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
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
  const backToAppsBtns = document.querySelectorAll(".back-to-apps-btn");
  
  // Sidebar quick nav links
  const drawerNavItems = document.querySelectorAll(".drawer-nav-item");

  // ==========================================
  // 2. Video Player Event Listeners & Control
  // ==========================================
  
  // Click on video container to upload if not loaded
  uploadZone.addEventListener("click", () => {
    videoFileInput.click();
  });

  // Handle Drag & Drop video file
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

  // Select video file from input
  videoFileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      loadLocalVideo(e.target.files[0]);
    }
  });

  // Double click to skip upload zone and use default nature video stream
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
    video.play().catch(err => console.log("Auto-play blocked, user interaction required: ", err));
    playPauseBtn.innerHTML = '<i data-lucide="pause"></i>';
    lucide.createIcons();
    state.videoLoaded = true;
  }

  // Play / Pause Toggle
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

  // Update Time displays during playback
  video.addEventListener("timeupdate", () => {
    state.currentTime = video.currentTime;
    state.duration = video.duration || state.duration;

    // 1. Update text timestamp
    currentTimeSpan.innerText = formatTime(state.currentTime);
    durationTimeSpan.innerText = formatTime(state.duration);

    // 2. Update controls progress bar scrubber
    const progressPercent = (state.currentTime / state.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;

    // 3. Update timeline playhead
    timelineHead.style.left = `${progressPercent}%`;

    // 4. Highlight active segment card in left list
    updateSegmentHighlighting(state.currentTime);

    // 5. Highlight and scroll active PPT slide
    if (state.pptSyncEnabled) {
      updatePPTSlidesHighlighting(state.currentTime);
    }

    // 6. Highlight active SVG node in mindmap
    updateMindmapHighlighting(state.currentTime);
  });

  // Load duration on meta load
  video.addEventListener("loadedmetadata", () => {
    state.duration = video.duration;
    durationTimeSpan.innerText = formatTime(state.duration);
  });

  // Time format helper (MM:SS)
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Handle manual scrubber seek in player
  progressContainer.addEventListener("click", (e) => {
    if (!state.videoLoaded) return;
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * state.duration;
  });

  // Handle Timeline multi-colored bar click to seek
  timelineScrubber.addEventListener("click", (e) => {
    if (!state.videoLoaded) return;
    const rect = timelineScrubber.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * state.duration;
  });

  // Mute / Unmute
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

  // Volume bar slide
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

  // Speed selector popup toggle
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

  // Fullscreen toggle
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

  // Spacebar to play/pause when page focused (avoid key events on inputs)
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
    
    // Auto sync discuss tab clock indicator
    if (pane === paneDiscuss) {
      updateCommentClockBadge();
    }
  }


  // ==========================================
  // 4. Slide-Over Drawers Panel Management
  // ==========================================
  
  // Click on a grid card tool
  toolCards.forEach(card => {
    card.addEventListener("click", () => {
      const targetDrawerId = card.dataset.drawer;
      openDrawer(targetDrawerId);
    });
  });

  // Click on drawer back/应用 button
  backToAppsBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      closeAllDrawers();
    });
  });

  // Click sidebar icon links inside active drawer
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
      
      // Update sidebar navigation icons
      document.querySelectorAll(".drawer-nav-item").forEach(item => {
        item.classList.remove("active");
        if (item.dataset.target === drawerId) {
          item.classList.add("active");
        }
      });

      // Special action on open drawer
      if (drawerId === "drawer-mindmap") {
        setTimeout(renderMindmapSVG, 100); // Wait for drawer transition to complete so measurements are accurate
      }
    }
  }

  function closeAllDrawers() {
    appDrawers.forEach(drawer => drawer.classList.remove("active"));
    state.activeDrawer = null;
  }


  // ==========================================
  // 5. Left Knowledge Segment Highlights
  // ==========================================
  const segmentItems = document.querySelectorAll(".segment-item");
  
  segmentItems.forEach((item, index) => {
    // Chevron click opens accordion
    const header = item.querySelector(".segment-header");
    header.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = item.classList.contains("expanded");
      
      // Close all first
      segmentItems.forEach(i => i.classList.remove("expanded"));
      
      // Toggle current
      if (!isExpanded) {
        item.classList.add("expanded");
      }
      
      // Click header title to seek video to starting point
      if (state.videoLoaded) {
        const startTime = parseInt(item.dataset.start);
        video.currentTime = startTime;
      }
    });
  });

  // Filter segment cards based on search / tags
  const topicSearchInput = document.getElementById("topic-search-input");
  const tagPills = document.querySelectorAll(".tag-pill");

  topicSearchInput.addEventListener("input", filterSegmentsAndDrawers);
  tagPills.forEach(pill => {
    pill.addEventListener("click", () => {
      tagPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      filterSegmentsAndDrawers();
    });
  });

  function filterSegmentsAndDrawers() {
    const searchVal = topicSearchInput.value.toLowerCase().trim();
    const activePill = document.querySelector(".tag-pill.active");
    const activeCategory = activePill ? activePill.dataset.tag : "all";

    segmentItems.forEach(item => {
      const title = item.querySelector(".segment-title").innerText.toLowerCase();
      const body = item.querySelector(".segment-body").innerText.toLowerCase();
      const categoryString = item.dataset.tagCategory || "";
      
      const matchesSearch = !searchVal || title.includes(searchVal) || body.includes(searchVal);
      const matchesCategory = activeCategory === "all" || categoryString.split(" ").includes(activeCategory);

      if (matchesSearch && matchesCategory) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  function updateSegmentHighlighting(time) {
    let activeIndex = -1;
    
    // Segments times: 0:00 (0), 1:04 (64), 2:09 (129), 6:55 (415), 9:01 (541)
    if (time >= 0 && time < 64) activeIndex = 0;
    else if (time >= 64 && time < 129) activeIndex = 1;
    else if (time >= 129 && time < 415) activeIndex = 2;
    else if (time >= 415) activeIndex = 3;

    if (activeIndex !== state.currentSegmentIndex) {
      state.currentSegmentIndex = activeIndex;
      segmentItems.forEach((item, idx) => {
        item.classList.remove("active-segment");
        if (idx === activeIndex) {
          item.classList.add("active-segment");
          item.classList.add("expanded");
          // Auto scroll list slightly to highlight
          item.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          item.classList.remove("expanded");
        }
      });
    }
  }


  // ==========================================
  // 6. Drawer Panel 1: Video Transcript (视频原文)
  // ==========================================
  const transcriptBox = document.getElementById("transcript-container-box");

  function renderTranscript() {
    transcriptBox.innerHTML = "";
    DATABASE.transcripts.forEach((line, index) => {
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

  // Scroll and highlight captions synchronised with video time
  video.addEventListener("timeupdate", () => {
    if (state.activeDrawer !== "drawer-transcript") return;
    
    const time = video.currentTime;
    let activeIndex = -1;

    // Find the caption currently spoken
    for (let i = 0; i < DATABASE.transcripts.length; i++) {
      if (time >= DATABASE.transcripts[i].time) {
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
        // Center the active line in container
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
  
  // Suggested Questions click
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

  // System instructions context for Course
  const aiSystemPrompt = `你是一名专业的地理老师和AI助教。你正在为学生讲解‘中国主要河流地理特征介绍’互动课。以下是本课程的视频分段和大纲，请结合这些内容和你的专业地理知识回答学生的问题。如果回答中能引导学生去视频的某个时间点观看，那就更好了。
视频课程分段大纲如下：
1. 00:00 - 01:04：中国河流总体特征（讲解地势西高东低、外流区占2/3、内流区占1/3，以及季风气候对南北河流流量、汛期、含沙量、结冰期的影响）。
2. 01:04 - 02:09：中国七大水系概况（讲解长江、黄河、珠江、淮河、海河、辽河、松花江水系的分布）。
3. 02:09 - 06:55：七大水系详情（包括长江防洪发电与三峡工程、黄河多沙与中游黄土高原水土流失、下游地上悬河、珠江的高航运价值与粤港澳大湾区水源支柱）。
4. 06:55 - 09:01：中国典型河流导学（重点分析长江黄河的发源地、流经地形区、侵蚀搬运和堆积作用塑造的地貌，如长江三峡、黄河壶口瀑布）。
5. 09:01 - 13:53：河流价值与保护治理（讲解河流的灌溉、航运、防洪、发电经济价值，以及水体污染、水土流失等面临的挑战，介绍河长制、长江十年禁渔和黄河流域生态高质量发展）。
回答准则：使用亲切、科学的中文进行回复。保持段落美观、言简意赅。如果可以直接为学生跳转进度，可以通过返回含有[seek:秒数]格式的标识来指示，例如提到黄河泥沙在02:30可以说：‘关于黄河泥沙的成因你可以看看 [seek:150] 处的讲解。’`;

  const chatHistory = [
    { role: "system", content: aiSystemPrompt }
  ];

  function appendChatMessage(role, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${role === 'user' ? 'student' : 'assistant'}`;

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "chat-bubble";
    
    // Parse timestamps [seek:120] to clickable buttons
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

    // Scroll chat area
    aiChatBox.scrollTo({
      top: aiChatBox.scrollHeight,
      behavior: "smooth"
    });
  }

  async function submitAIQuestion() {
    const text = aiUserInput.value.trim();
    if (!text) return;

    // Hide welcome screen on first question
    aiWelcomeScreen.style.display = "none";

    // User Message
    appendChatMessage('user', text);
    chatHistory.push({ role: "user", content: text });
    aiUserInput.value = "";
    aiSendBtn.disabled = true;

    // Typing Loader Message
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

      // API call to Tongyi Qwen on Dashscope
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

      // Remove loader
      const loader = document.getElementById("ai-loader-bubble");
      if (loader) loader.remove();

      // Append assistant answer
      appendChatMessage('assistant', reply);
      chatHistory.push({ role: "assistant", content: reply });

    } catch (error) {
      console.warn("AI API request failed or CORS issue. Falling back to local educational mock engine: ", error);
      
      // Remove loader
      const loader = document.getElementById("ai-loader-bubble");
      if (loader) loader.remove();

      // Trigger educational fallback generator
      const mockReply = generateFallbackAIAnswer(text);
      appendChatMessage('assistant', `【Qwen3 API 连接离线/提示：已自动启用本地备用知识引擎】\n\n${mockReply}`);
      chatHistory.push({ role: "assistant", content: mockReply });
    } finally {
      aiSendBtn.disabled = false;
    }
  }

  // Fallback Rule Engine for local answers if API fails (guarantees a flawless demo offline)
  function generateFallbackAIAnswer(query) {
    const q = query.toLowerCase();
    
    if (q.includes("总体") || q.includes("特征") || q.includes("地理特征")) {
      return "中国河流的总体地理特征非常鲜明：\n1. **流向东流**：受西高东低的三级阶梯地势影响，我国绝大多数河流（如长江、黄河、珠江）发源于西部，向东注入太平洋。\n2. **外流区与内流区**：外流区面积约占2/3（降水充足，外流河流量大且稳定），内流区占1/3（多位于西北干旱带，河水依靠冰雪融水补给，易季节性断流）。\n3. **南北差异明显**：秦岭-淮河以北的河流径流量小、汛期短、含沙量大且冬季有冰期；以南河流流量大、汛期长、无冰期。\n\n关于这一特征，推荐您观看视频 [seek:64] 处的详细动画剖析。";
    }
    
    if (q.includes("水系") || q.includes("七大水系") || q.includes("长江") || q.includes("黄河") || q.includes("珠江")) {
      return "我国著名的七大水系包括：长江、黄河、珠江、松花江、淮河、海河和辽河。\n- **长江** [seek:195]：长度和流量居首，被称为“黄金水道”，水能极其丰沛。\n- **黄河** [seek:230]：母亲河，中游流经黄土高原带走巨量泥沙，下游泥沙淤积抬高形成了“地上悬河”。\n- **珠江** [seek:274]：年流量仅次于长江，是粤港澳大湾区的命脉，航运极度发达。\n- **松花江** [seek:312]：纬度最高，结冰期长，有春汛和夏汛两个汛期。\n\n想了解各大水系的宏观分布，可点击视频 [seek:129] 获取大纲。";
    }

    if (q.includes("保护") || q.includes("治理") || q.includes("污染") || q.includes("挑战") || q.includes("禁渔")) {
      return "我国河流在开发过程中面临着水体污染、水土流失、河道淤积以及湿地生态退化等多重挑战。\n\n目前主要的应对和保护治理措施包括：\n1. **全面推行“河长制”**：明确地方首长为河流生态的第一责任人，保障河道监督管理。\n2. **长江十年禁渔** [seek:640]：给长江生态休养生息的黄金期，保育生物多样性。\n3. **流域协同协同整治**：实施黄河流域生态保护和高质量发展规划，进行水沙联调与中游黄土林草绿化。\n\n欢迎去视频的 [seek:541] 重新复习我国的流域治理政策。";
    }

    if (q.includes("三大流域") || q.includes("最小")) {
      return "我国的外流河分属于三大洋流域区：\n1. **太平洋流域**（占外流区总面积约58%，包括长江、黄河、珠江等）。\n2. **印度洋流域**（占6.4%，如雅鲁藏布江、怒江等）。\n3. **北冰洋流域**（仅占0.5%，只有额尔齐斯河一条河）。\n\n因此，北冰洋流域是我国三大流域区中面积占比最小的。您可以点击 [seek:80] 处看到三大流域的比例图表。";
    }

    return "您好！我是这门河流地理课的 AI 助教。关于中国河流的特征、七大水系（长江、黄河、珠江等）、河流水文特性或者河流防洪生态治理的提问，我都能为您解答！您可以输入更具体的关键词，或者点击我上方推荐的问题卡片。";
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

  let localPPTSlides = []; // Custom loaded images

  // Checkbox toggle styles sync
  pptSyncToggle.addEventListener("change", (e) => {
    state.pptSyncEnabled = e.target.checked;
    pptSyncSlider.style.backgroundColor = state.pptSyncEnabled ? "var(--color-cat-orange)" : "#ccc";
  });
  // Initial switch color
  pptSyncSlider.style.backgroundColor = "var(--color-cat-orange)";

  // Click file uploader inside PPT panel
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

    // Create URLs for all files
    localPPTSlides = imageFiles.map((file, idx) => {
      // Interpolate timestamps evenly based on total count vs video duration
      const segmentStep = Math.floor(state.duration / imageFiles.length);
      return {
        time: idx * segmentStep,
        url: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, "") // Strip extension
      };
    });

    renderPPTSlidesList();
  }

  // Generate vector slides dynamically when no local images are loaded
  function generateVectorSVGBase64(slideData, pageIndex) {
    const bulletListHTML = slideData.bullets.map(b => `&lt;li&gt;${b}&lt;/li&gt;`).join('');
    
    // Choose beautiful gradient matching page number
    const gradients = [
      { c1: "#1e293b", c2: "#0f172a" }, // Dark title
      { c1: "#334155", c2: "#1e293b" }, // TOC
      { c1: "#064e3b", c2: "#022c22" }, // Green characteristics
      { c1: "#4c1d95", c2: "#2e1065" }, // Purple systems
      { c1: "#1e1b4b", c2: "#311042" }, // Indigo Yangtze
      { c1: "#7c2d12", c2: "#431407" }, // Orange Yellow River
      { c1: "#14532d", c2: "#052e16" }, // Green Pearl River
      { c1: "#172554", c2: "#0c183e" }, // Blue Northern rivers
      { c1: "#831843", c2: "#4a0422" }, // Pink Erosion
      { c1: "#78350f", c2: "#451a03" }  // Amber Conservation
    ];
    
    const grad = gradients[pageIndex % gradients.length];

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
        <defs>
          <linearGradient id="g_${pageIndex}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${grad.c1}" />
            <stop offset="100%" stop-color="${grad.c2}" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g_${pageIndex})" />
        
        <!-- Grid overlay -->
        <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
          <line x1="100" y1="0" x2="100" y2="450" />
          <line x1="200" y1="0" x2="200" y2="450" />
          <line x1="300" y1="0" x2="300" y2="450" />
          <line x1="400" y1="0" x2="400" y2="450" />
          <line x1="500" y1="0" x2="500" y2="450" />
          <line x1="600" y1="0" x2="600" y2="450" />
          <line x1="700" y1="0" x2="700" y2="450" />
          <line x1="0" y1="100" x2="800" y2="100" />
          <line x1="0" y1="200" x2="800" y2="200" />
          <line x1="0" y1="300" x2="800" y2="300" />
          <line x1="0" y1="400" x2="800" y2="400" />
        </g>
        
        <!-- Content -->
        <text x="60" y="80" fill="var(--color-cat-orange)" font-family="Outfit, sans-serif" font-weight="700" font-size="20" letter-spacing="2">GEOGRAPHY PPT SLIDES</text>
        <line x1="60" y1="100" x2="740" y2="100" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
        
        <text x="60" y="160" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="800" font-size="34" width="680">${slideData.title}</text>
        
        <!-- Bullets -->
        <g transform="translate(60, 220)">
          ${slideData.bullets.map((b, i) => `
            <circle cx="10" cy="${i * 45 + 10}" r="5" fill="var(--color-cat-orange)" />
            <text x="30" y="${i * 45 + 16}" fill="#cbd5e1" font-family="system-ui, sans-serif" font-weight="500" font-size="19">${b}</text>
          `).join('')}
        </g>
        
        <!-- Footer -->
        <text x="60" y="410" fill="rgba(255,255,255,0.3)" font-family="system-ui" font-size="12">P.${pageIndex + 1} / 10</text>
        <text x="740" y="410" fill="rgba(255,255,255,0.3)" font-family="system-ui" font-size="12" text-anchor="end">课件帮·AI互动</text>
      </svg>
    `;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  function renderPPTSlidesList() {
    pptSlidesContainer.innerHTML = "";
    
    // Choose active list
    const activeList = localPPTSlides.length > 0 ? localPPTSlides : DATABASE.slides;
    pptSlidesCount.innerText = `共 ${activeList.length} 页课件`;

    activeList.forEach((slide, idx) => {
      const slideDiv = document.createElement("div");
      slideDiv.className = `slide-card ${idx === 0 ? 'active-slide' : ''}`;
      slideDiv.dataset.time = slide.time;
      slideDiv.dataset.index = idx;

      // Image source
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

  // Pre-load default slide deck
  renderPPTSlidesList();

  function updatePPTSlidesHighlighting(time) {
    const list = localPPTSlides.length > 0 ? localPPTSlides : DATABASE.slides;
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
        // Scroll container to center slide card
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

  // Pan and Zoom Matrix values
  let zoomState = { x: 10, y: 15, scale: 0.82 };
  let isDraggingMap = false;
  let dragStart = { x: 0, y: 0 };

  // Set transform
  function updateViewportTransform() {
    mindmapViewport.setAttribute("transform", `translate(${zoomState.x}, ${zoomState.y}) scale(${zoomState.scale})`);
  }

  // Zoom handlers
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

  // Drag pan handlers
  frame.addEventListener("mousedown", (e) => {
    if (e.target.closest(".map-ctrl-btn")) return; // Skip controls
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

  // Scroll wheel zoom
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

  // Render Mindmap SVG Nodes
  function renderMindmapSVG() {
    linksGroup.innerHTML = "";
    nodesGroup.innerHTML = "";

    // 1. Render Lines (Bezier Curves)
    DATABASE.mindmap.links.forEach(link => {
      const fromNode = DATABASE.mindmap.nodes.find(n => n.id === link.from);
      const toNode = DATABASE.mindmap.nodes.find(n => n.id === link.to);
      if (!fromNode || !toNode) return;

      const fromX = fromNode.x + (fromNode.type === "root" ? 150 : 120);
      const fromY = fromNode.y + (fromNode.type === "root" ? 20 : 17);
      const toX = toNode.x;
      const toY = toNode.y + (toNode.type === "root" ? 20 : 17);

      // Bezier curve path
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${fromX} ${fromY} C ${(fromX + toX)/2} ${fromY}, ${(fromX + toX)/2} ${toY}, ${toX} ${toY}`);
      path.setAttribute("class", "map-link");
      path.dataset.from = link.from;
      path.dataset.to = link.to;

      linksGroup.appendChild(path);
    });

    // 2. Render Nodes
    DATABASE.mindmap.nodes.forEach(node => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "map-node");
      g.setAttribute("transform", `translate(${node.x}, ${node.y})`);
      g.dataset.time = node.time;
      g.dataset.id = node.id;

      const width = node.type === "root" ? 160 : (node.type === "child" ? 130 : 200);
      const height = node.type === "root" ? 40 : 32;

      // Card boundary box
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("width", width);
      rect.setAttribute("height", height);
      
      // Node text label
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

      // Play timestamp icon wrapper for non-root nodes
      if (node.type !== "root") {
        // Play icon circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", width - 20);
        circle.setAttribute("cy", height/2);
        circle.setAttribute("r", 8);
        circle.setAttribute("class", "map-play-icon");
        
        // Chevron play path inside circle
        const playSym = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        playSym.setAttribute("points", `${width - 22},${height/2 - 4} ${width - 22},${height/2 + 4} ${width - 15},${height/2}`);
        playSym.setAttribute("fill", "white");
        playSym.setAttribute("style", "pointer-events: none;");

        // Small time text badge
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

      // Seek on card node click
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
    
    // Find highest node time less than or equal to current time
    let maxTime = -1;
    DATABASE.mindmap.nodes.forEach(node => {
      if (time >= node.time && node.time > maxTime) {
        maxTime = node.time;
        activeNodeId = node.id;
      }
    });

    // Toggle active stroke highlight in SVG nodes
    const svgNodes = nodesGroup.querySelectorAll(".map-node");
    svgNodes.forEach(n => {
      n.classList.remove("active-node");
      if (n.dataset.id === activeNodeId) {
        n.classList.add("active-node");
      }
    });

    // Highlight connecting links
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

  // Instant Feedback slider style sync
  quizInstantToggle.addEventListener("change", (e) => {
    state.quizInstantFeedback = e.target.checked;
    quizInstantSlider.style.backgroundColor = state.quizInstantFeedback ? "var(--color-primary)" : "#ccc";
  });
  // Initial switch color
  quizInstantSlider.style.backgroundColor = "var(--color-primary)";

  // Setup total count
  quizTotalNumText.innerText = DATABASE.quiz.length;

  function loadQuizQuestion(index) {
    const qData = DATABASE.quiz[index];
    if (!qData) return;

    // Reset explanation
    quizExplanationBox.style.display = "none";

    // Progress percentage
    const progressPercent = ((index + 1) / DATABASE.quiz.length) * 100;
    quizProgressIndicator.style.width = `${progressPercent}%`;
    quizCurrentNumText.innerText = index + 1;

    // Texts
    quizQuestionText.innerText = qData.q;
    quizExplanationText.innerText = qData.explanation;

    // Options Rendering
    quizOptionsBox.innerHTML = "";
    qData.options.forEach((optText, optIdx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      
      const badge = String.fromCharCode(65 + optIdx); // A, B, C, D
      btn.innerHTML = `
        <span class="option-badge">${badge}</span>
        <span class="option-text">${optText}</span>
      `;

      // Check if user already made choice previously for this question
      const previousSelection = state.quizAnswers[index];
      if (previousSelection !== null) {
        if (optIdx === previousSelection) {
          btn.classList.add("selected");
        }
        
        // Show correct / incorrect colors if already submitted previously
        if (state.quizInstantFeedback) {
          if (optIdx === qData.answer) {
            btn.classList.add("correct");
          } else if (optIdx === previousSelection) {
            btn.classList.add("incorrect");
          }
          btn.disabled = true; // Block edits
        }
      }

      // Option click handle
      btn.addEventListener("click", () => {
        if (state.quizAnswers[index] !== null) return; // Ignore if already answered
        
        // Store answer
        state.quizAnswers[index] = optIdx;
        
        // Highlight active clicked
        const currentOpts = quizOptionsBox.querySelectorAll(".quiz-option");
        currentOpts.forEach(o => o.classList.remove("selected"));
        btn.classList.add("selected");

        if (state.quizInstantFeedback) {
          // Compute correct/incorrect instantly
          if (optIdx === qData.answer) {
            btn.classList.add("correct");
            explanationOutcomeTitle.innerText = "✓ 回答正确";
            explanationOutcomeTitle.style.color = "#10b981";
            state.quizScore += 10; // 10 pts per correct
          } else {
            btn.classList.add("incorrect");
            explanationOutcomeTitle.innerText = `✗ 回答错误 (正确答案: ${String.fromCharCode(65 + qData.answer)})`;
            explanationOutcomeTitle.style.color = "#ef4444";
            
            // Highlight actual correct option in green
            currentOpts[qData.answer].classList.add("correct");
          }

          // Show explanation drawer
          quizExplanationBox.style.display = "flex";
          
          // Lock options
          currentOpts.forEach(o => o.disabled = true);
        }
      });

      quizOptionsBox.appendChild(btn);
    });

    // Show explanation if already chosen
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

    // Navigation buttons lock
    quizPrevBtn.disabled = index === 0;
    
    // Change text of 'Next' button on last page
    if (index === DATABASE.quiz.length - 1) {
      quizNextBtn.innerText = "提交结果";
    } else {
      quizNextBtn.innerText = "下一题";
    }
  }

  // Prev / Next button listeners
  quizPrevBtn.addEventListener("click", () => {
    if (state.quizCurrentIndex > 0) {
      state.quizCurrentIndex--;
      loadQuizQuestion(state.quizCurrentIndex);
    }
  });

  quizNextBtn.addEventListener("click", () => {
    // If not instant feedback, calculate score on submit
    if (state.quizAnswers[state.quizCurrentIndex] === null) {
      alert("请先选择您的答案！");
      return;
    }

    if (state.quizCurrentIndex < DATABASE.quiz.length - 1) {
      state.quizCurrentIndex++;
      loadQuizQuestion(state.quizCurrentIndex);
    } else {
      showQuizResults();
    }
  });

  // Hint button shows description alert
  document.getElementById("quiz-hint-btn").addEventListener("click", () => {
    const qData = DATABASE.quiz[state.quizCurrentIndex];
    alert(`💡 答题提示:\n\n${qData.hint}`);
  });

  function showQuizResults() {
    quizActiveView.style.display = "none";
    quizResultsView.style.display = "flex";

    // Recalculate score for accuracy (in case instant feedback was toggled mid-test)
    let score = 0;
    state.quizAnswers.forEach((ans, idx) => {
      if (ans === DATABASE.quiz[idx].answer) {
        score += 10;
      }
    });

    const correctCount = score / 10;
    
    // Set score ring styling using conic-gradient
    const resultsScoreRing = document.getElementById("results-score-ring");
    resultsScoreRing.style.background = `radial-gradient(white 55%, transparent 56%), conic-gradient(var(--color-primary) ${score}%, #e2e8f0 ${score}%)`;

    document.getElementById("results-score-num").innerText = score;
    document.getElementById("results-stats-text").innerText = `答对 ${correctCount} 题 / 共 ${DATABASE.quiz.length} 题`;

    // Dynamic headers based on score
    const resultsTitleText = document.getElementById("results-title-text");
    if (score >= 90) {
      resultsTitleText.innerText = "太棒了！地理学霸！";
      resultsTitleText.style.color = "var(--color-cat-green)";
    } else if (score >= 60) {
      resultsTitleText.innerText = "合格通过，继续加油！";
      resultsTitleText.style.color = "var(--color-cat-orange)";
    } else {
      resultsTitleText.innerText = "不及格，建议重修本课！";
      resultsTitleText.style.color = "#ef4444";
    }
  }

  // Restart quiz
  quizRestartBtn.addEventListener("click", () => {
    state.quizCurrentIndex = 0;
    state.quizScore = 0;
    state.quizAnswers = Array(DATABASE.quiz.length).fill(null);
    
    quizActiveView.style.display = "flex";
    quizResultsView.style.display = "none";
    loadQuizQuestion(0);
  });

  // Load question 1
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

  cardTotalNumText.innerText = DATABASE.flashcards.length;

  // 3D flip card toggle
  flashcardFlipTrigger.addEventListener("click", () => {
    flashcardFlipTrigger.classList.toggle("flipped");
  });

  function loadFlashcard(index) {
    const card = DATABASE.flashcards[index];
    if (!card) return;

    // Reset flip
    flashcardFlipTrigger.classList.remove("flipped");

    // Timeout delay so texts update while card is facing front
    setTimeout(() => {
      cardFrontText.innerText = card.q;
      cardBackText.innerText = card.a;
    }, 150);

    // Progress bar
    const progressPercent = ((index + 1) / DATABASE.flashcards.length) * 100;
    cardProgressIndicator.style.width = `${progressPercent}%`;
    cardCurrentNumText.innerText = index + 1;
  }

  // Record selection and advance to next card
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
    // If not final card, go next
    if (state.cardCurrentIndex < DATABASE.flashcards.length - 1) {
      state.cardCurrentIndex++;
      loadFlashcard(state.cardCurrentIndex);
    } else {
      showFlashcardsComplete();
    }
  }

  function showFlashcardsComplete() {
    flashcardActiveView.style.display = "none";
    flashcardCompleteView.style.display = "flex";

    // Compute stats
    let knows = 0;
    let fuzzies = 0;
    state.cardStatus.forEach(status => {
      if (status === "know") knows++;
      else fuzzies++;
    });

    const percent = Math.round((knows / DATABASE.flashcards.length) * 100);
    document.getElementById("card-results-ring").style.background = `conic-gradient(#a855f7 ${percent}%, #e2e8f0 ${percent}%)`;
    document.getElementById("card-results-stats-text").innerText = `轻松掌握: ${knows} 张 / 模糊待温习: ${fuzzies} 张`;
  }

  cardRestartBtn.addEventListener("click", () => {
    state.cardCurrentIndex = 0;
    state.cardStatus = Array(DATABASE.flashcards.length).fill(null);
    
    flashcardActiveView.style.display = "flex";
    flashcardCompleteView.style.display = "none";
    loadFlashcard(0);
  });

  // Load first flashcard
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

  // Sync comment time badge
  function updateCommentClockBadge() {
    if (state.videoLoaded) {
      commentTimeAnchor = Math.floor(video.currentTime);
      commentTimestamp.innerText = formatTime(commentTimeAnchor);
    }
  }

  // Update clock when clicking clock badge button in box
  commentTimeBtn.addEventListener("click", () => {
    updateCommentClockBadge();
  });

  // Submit comment
  submitCommentBtn.addEventListener("click", () => {
    const text = commentTextInput.value.trim();
    if (!text) return;

    // Create comment node
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

    // Add click handle to seek video
    node.querySelector(".comment-time-badge").addEventListener("click", () => {
      if (state.videoLoaded) {
        video.currentTime = timeVal;
        video.play();
      }
    });

    // Insert at top of list
    commentsListBox.insertBefore(node, commentsListBox.firstChild);
    
    // Clear input
    commentTextInput.value = "";
  });

  // Bind comment time badge clicks on pre-existing messages
  document.querySelectorAll(".comments-list .comment-time-badge").forEach(badge => {
    badge.addEventListener("click", () => {
      if (state.videoLoaded) {
        const seconds = parseInt(badge.dataset.time);
        video.currentTime = seconds;
        video.play();
      }
    });
  });

});
