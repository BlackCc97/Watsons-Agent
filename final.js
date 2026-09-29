const calendarPage = document.getElementById("calendarPage");
const dashboardPage = document.getElementById("dashboardPage");
const dashboardMoreDrawer = document.getElementById("dashboardMoreDrawer");
const dashboardRankingList = document.getElementById("dashboardRankingList");
const dashboardIssueList = document.getElementById("dashboardIssueList");
const dashboardStructureValue = document.getElementById("dashboardStructureValue");
const dashboardTimeValue = document.getElementById("dashboardTimeValue");
const dashboardDrillBack = document.querySelector(".dashboard-drill-back");
const dashboardIdentityChoices = document.getElementById("dashboardIdentityChoices");
const dashboardPersonnelList = document.getElementById("dashboardPersonnelList");
const calendarGrid = document.getElementById("calendarGrid");
const calendarToggle = document.getElementById("calendarToggle");
const modeMenu = document.getElementById("modeMenu");
const modeLabel = document.getElementById("modeLabel");
const addAdHocButton = document.getElementById("addAdHocButton");
const detailAdHocBadge = document.getElementById("detailAdHocBadge");
const adHocCheckItemSearch = document.getElementById("adHocCheckItemSearch");
const adHocCheckItems = document.getElementById("adHocCheckItems");
const adHocCheckItemCount = document.getElementById("adHocCheckItemCount");
const amReportEntry = document.getElementById("amHistoryReportEntry");
const memberPanel = document.getElementById("memberPanel");
const teamControl = document.getElementById("teamControl");
const memberSummary = document.getElementById("memberSummary");
const allTasksButton = document.getElementById("allTasksButton");
const taskList = document.getElementById("taskList");
const teamStatusFilter = document.getElementById("teamStatusFilter");
const scoreValue = document.getElementById("scoreValue");
const scoreLabel = document.getElementById("scoreLabel");
const scoreInput = document.getElementById("scoreInput");
const visualScoreModal = document.getElementById("visualScoreModal");
const optionalStageModal = document.getElementById("optionalStageModal");
const visualScoreValue = document.getElementById("visualScoreValue");
const visualScoreLabel = document.getElementById("visualScoreLabel");
const visualScoreSubmit = document.getElementById("visualScoreSubmit");
const moduleScoreOptions = document.querySelectorAll("[data-module-score]");
const reportViewButtons = document.querySelectorAll("[data-report-view]");
const reportPanels = document.querySelectorAll("[data-report-panel]");
const mineReportFilter = document.querySelector(".mine-filter");
const allReportFilter = document.querySelector(".all-filter");
const generatedReportPage = document.getElementById("generatedReportPage");
const reportDetailActions = generatedReportPage?.querySelector("[data-report-detail-actions]");
const scoreLabels = {
  1: "很不满意",
  2: "不太满意",
  3: "基本满意",
  4: "比较满意",
  5: "十分满意",
};
let selectedVisualScore = null;
let answerStage = "required";
let optionalReturnPage = null;
let relatedCheckItemsBackPage = "amHistoryReport";
let draftTaskTagFilters = [];
let appliedTaskTagFilters = [];
let generatedReportBackPage = "reportList";
let currentUserRole = "CM";
let hasAccessibleAmReport = true;
let selectedAdHocCheckItems = [];

const visitReportAnswers = [
  {
    name: "门店运营",
    items: [
      { number: 1, title: "访店回顾", required: true, result: "通过", tone: "pass", answer: "上次调整项已逐一复核", note: "2 项历史调整均已完成并通过批核。", sections: [{ type: "result", title: "检查结果", value: "通过", tone: "pass", text: "上次调整项已逐一复核，2 项历史调整均已完成并通过批核。" }] },
      { number: 2, title: "门店标签", required: true, result: "需调整", tone: "adjust", answer: "门店标签存在边角卷起", note: "入口活动标签需重新补贴并复核。", photos: [{ photoClass: "store-b" }], sections: [{ type: "result", title: "检查结果", value: "需调整", tone: "adjust", text: "入口服务标签缺失，活动标签边角卷起，需要重新补贴并复核。", photos: [{ photoClass: "store-b" }] }] },
      { number: 3, title: "动线设计", required: true, result: "通过", tone: "pass", answer: "主通道及收银区动线通畅", note: "未发现货架或物料遮挡。", sections: [{ type: "result", title: "检查结果", value: "通过", tone: "pass", text: "主通道及收银区动线通畅，未发现货架或物料遮挡。" }] },
      { number: 4, title: "视觉陈列-促销陈列", required: true, result: "需调整", tone: "adjust", answer: "部分促销商品未处于主视觉区域", note: "建议按促销优先级调整陈列位置。", photos: [{ photoClass: "store-a" }, { photoClass: "store-c" }], sections: [{ type: "result", title: "检查结果", value: "需调整", tone: "adjust", text: "部分促销商品未放置在主视觉区域，建议按促销优先级调整陈列位置。", photos: [{ photoClass: "store-a" }, { photoClass: "store-c" }] }] },
      { number: 5, title: "视觉陈列-货架陈列", required: true, result: "需调整", tone: "adjust", answer: "货架中段排面不够饱满", note: "补齐缺货排面并复核价格标签。", photos: [{ photoClass: "store-b" }, { photoClass: "store-a" }], sections: [
        { type: "detail-items", title: "检查细项", questions: [
          { title: "货架商品排面是否饱满？", mode: "单选", choices: ["饱满", "局部缺货", "严重缺货"], selected: ["局部缺货"], photos: [{ photoClass: "store-b" }, { photoClass: "store-a" }] },
          { title: "价签与促销物料是否准确？", mode: "多选", choices: ["价签与商品陈列位置不一致", "促销活动物料存在缺失", "重点商品未按陈列标准摆放"], selected: ["价签与商品陈列位置不一致", "重点商品未按陈列标准摆放"], photos: [] },
        ] },
        { type: "result", title: "检查结果", value: "需调整", tone: "adjust", text: "货架中段排面不够饱满，部分重点商品未按促销优先级陈列，需要补齐并复核。", photos: [{ photoClass: "store-b" }, { photoClass: "store-a" }] },
      ] },
      { type: "module-score", title: "视觉陈列模块评分", result: "5 分 · 十分满意" },
    ],
  },
  {
    name: "外部环境",
    items: [
      { number: 6, title: "店铺周边指示", required: true, result: "通过", tone: "pass", answer: "外围导视完整清晰", note: "商场入口与楼层指引均可正常识别。", sections: [{ type: "result", title: "检查结果", value: "通过", tone: "pass", text: "外围导视完整清晰，商场入口与楼层指引均可正常识别。" }] },
      { number: 7, title: "业主活动资源", required: false, result: "通过", tone: "pass", answer: "已确认本月商场活动资源", note: "资源位排期与门店计划一致。", sections: [{ type: "result", title: "检查结果", value: "通过", tone: "pass", text: "已确认本月商场活动资源，资源位排期与门店计划一致。" }] },
      { number: 8, title: "竞争对手", required: false, result: "通过", tone: "pass", answer: "完成同楼层重点竞品观察", note: "竞品本周无新增大型促销活动。", sections: [{ type: "result", title: "检查结果", value: "通过", tone: "pass", text: "完成同楼层重点竞品观察，竞品本周无新增大型促销活动。" }] },
      { number: 9, title: "门店续约", required: true, result: "通过", tone: "pass", answer: "续约资料状态正常", note: "当前无临期或待补充资料。", sections: [{ type: "result", title: "检查结果", value: "通过", tone: "pass", text: "续约资料状态正常，当前无临期或待补充资料。" }] },
    ],
  },
  {
    name: "BA管理",
    items: [
      { number: 10, title: "BA能力-岗位技能", required: true, result: "需调整", tone: "adjust", answer: "服务型 BA 对当期服务主题与促销规则掌握不足", note: "需要补充培训并复核服务销售表现。", sections: [
        { type: "detail-items", title: "检查细项", questions: [
          { title: "BA岗位技能表现", mode: "单选", choices: ["马上调整", "存在不足", "有待提升", "基本满意", "十分满意"], selected: ["存在不足"], text: "可补充记录服务型 BA 的技能熟练度、服务主题掌握情况和销售表现观察。", photos: [], showPhotoEmpty: false },
        ] },
        { type: "result", title: "检查结果", value: "需调整", tone: "adjust", text: "服务型 BA 对当期服务主题与促销规则掌握不足，需要补充培训并复核服务销售表现。" },
      ] },
    ],
  },
  {
    name: "店长管理能力",
    items: [
      {
        number: 11,
        title: "店长管理能力",
        required: true,
        result: "通过",
        tone: "pass",
        answer: "店长能够结合门店经营重点跟进标签与陈列执行",
        note: "已结合门店标签、促销陈列和货架陈列情况完成管理动作复核。",
        relatedItems: [
          {
            number: 1,
            title: "门店标签",
            category: "门店运营",
            required: true,
            result: "通过",
            tone: "pass",
            answer: "门店标签完整清晰",
            sections: [{ type: "result", title: "检查结果", value: "通过", tone: "pass", text: "门店标签完整清晰，入口与服务指引均可正常识别。", photos: [{ photoClass: "store-a" }] }],
          },
          {
            number: 2,
            title: "视觉陈列-促销陈列",
            category: "门店运营",
            required: true,
            result: "需调整",
            tone: "adjust",
            answer: "部分促销商品未处于主视觉区域",
            sections: [{ type: "result", title: "检查结果", value: "需调整", tone: "adjust", text: "部分促销商品未放置在主视觉区域，建议按促销优先级调整陈列位置。", photos: [{ photoClass: "store-c" }] }],
          },
          {
            number: 3,
            title: "视觉陈列-货架陈列",
            category: "门店运营",
            required: true,
            result: "需调整",
            tone: "adjust",
            answer: "货架中段排面不够饱满",
            sections: [{ type: "result", title: "检查结果", value: "需调整", tone: "adjust", text: "货架中段排面不够饱满，需要补齐并复核。", photos: [{ photoClass: "store-b" }, { photoClass: "store-a" }] }],
          },
          {
            number: 4,
            title: "店铺周边指示",
            category: "外部环境",
            required: true,
            result: "通过",
            tone: "pass",
            answer: "外围导视完整清晰",
            sections: [{ type: "result", title: "检查结果", value: "通过", tone: "pass", text: "外围导视完整清晰，商场入口与楼层指引均可正常识别。", photos: [] }],
          },
        ],
        sections: [
          { type: "detail-items", title: "检查细项", questions: [
            { title: "店长是否能清晰说明当前门店经营重点？", mode: "单选", choices: ["清晰说明", "部分了解", "不了解"], selected: ["清晰说明"], photos: [{ photoClass: "store-a" }, { photoClass: "store-b" }] },
            { title: "店长是否能按要求跟进标签与陈列执行？", mode: "单选", choices: ["已完成跟进", "部分完成", "尚未跟进"], selected: ["已完成跟进"], text: "店长已完成门店标签、促销陈列和货架陈列的现场复核，并安排后续跟进。", photos: [], choiceLayout: "stacked", showPhotoEmpty: false },
          ] },
          { type: "result", title: "检查结果", value: "通过", tone: "pass", text: "店长能够结合门店经营重点跟进标签与陈列执行。", photos: [] },
        ],
      },
    ],
  },
]; 

const amVisitReportAnswers = visitReportAnswers;
const relatedItems = visitReportAnswers[3].items[0].relatedItems;
const relatedCheckItemAnswers = ["门店运营", "外部环境"]
  .map((name) => ({ name, items: relatedItems.filter((item) => item.category === name) }))
  .filter((module) => module.items.length);
const adHocCheckItemCatalog = visitReportAnswers.flatMap((module) =>
  module.items
    .filter((item) => Number.isFinite(item.number))
    .map((item) => ({
      id: `${module.name}-${item.number}`,
      title: item.title,
      module: module.name,
      required: item.required,
    })),
);

const pages = {
  calendar: calendarPage,
  dashboard: dashboardPage,
  tasks: document.getElementById("taskListPage"),
  detail: document.getElementById("detailPage"),
  preview: document.getElementById("previewPage"),
  catalog: document.getElementById("catalogPage"),
  reviewIssue: document.getElementById("visitReviewIssuePage"),
  reviewClean: document.getElementById("visitReviewCleanPage"),
  tagQuestion: document.getElementById("tagQuestionPage"),
  shelfQuestion: document.getElementById("shelfQuestionPage"),
  baQuestion: document.getElementById("baQuestionPage"),
  storeManagerQuestion: document.getElementById("storeManagerQuestionPage"),
  ownerResourceQuestion: document.getElementById("ownerResourceQuestionPage"),
  competitorQuestion: document.getElementById("competitorQuestionPage"),
  reportPreview: document.getElementById("reportPreviewPage"),
  editResult: document.getElementById("editResultPage"),
  submitDone: document.getElementById("submitDonePage"),
  reportGeneration: document.getElementById("reportGenerationPage"),
  reportList: document.getElementById("reportListPage"),
  rectificationDetail: document.getElementById("rectificationDetailPage"),
  generatedReport: generatedReportPage,
  amHistoryReport: document.getElementById("amHistoryReportPage"),
  relatedCheckItems: document.getElementById("relatedCheckItemsPage"),
  editReport: document.getElementById("editReportPage"),
  publishSuccess: document.getElementById("publishSuccessPage"),
};

const tagByDay = {
  4: [{ id: "#3678", status: "green" }],
  6: [
    { id: "#3621", status: "orange" },
    { id: "#3699", status: "red" },
    { id: "#3655", status: "blue" },
  ],
  10: [
    { id: "#3633", status: "orange" },
    { id: "#3644", status: "green" },
  ],
  13: [{ id: "#3601", status: "orange" }],
  17: [{ id: "#3712", status: "orange" }],
  19: [{ id: "#3720", status: "green" }],
  23: [{ id: "#3735", status: "orange" }],
  27: [{ id: "#3741", status: "orange" }],
};

const mineTasks = [
  task("#3621", "待访店", "orange", "上海南京东路店", "2025年6月6日", "2025年6月20日", "张小明"),
  task("#3699", "即将逾期", "red", "上海五角场店", "2025年6月6日", "2025年6月12日", "张小明"),
  task("#3655", "执行中", "blue", "上海静安寺店", "2025年6月6日", "2025年6月20日", "张小明"),
  task("#3678", "已完成", "green", "上海中山公园店", "2025年6月4日", "2025年6月18日", "张小明"),
];

let adHocTasks = [];
let adHocTaskSequence = 1;
let activeTaskId = null;

const dashboardRankingData = {
  coverage: [
    ["张小明", "99%", "82 家应访店", "high"],
    ["Linney", "96%", "71 家应访店", "high"],
    ["李四", "91%", "58 家应访店", "medium"],
    ["王洋", "87%", "46 家应访店", "medium"],
  ],
  rectification: [
    ["张小明", "88%", "完成 108 项", "high"],
    ["Linney", "76%", "完成 64 项", "medium"],
    ["李四", "69%", "完成 52 项", "medium"],
    ["王洋", "61%", "完成 38 项", "low"],
  ],
};

const dashboardIssueData = [
  ["货架排面不饱满", 43],
  ["促销物料缺失", 42],
  ["门店标签卷边", 41],
  ["会员转化话术未执行", 37],
  ["周边导视不清晰", 34],
  ["员工服务流程不完整", 31],
  ["重点商品未按标准陈列", 29],
  ["店长跟进记录不完整", 27],
  ["活动资源未及时确认", 24],
  ["价格标签位置错误", 21],
];

const dashboardPersonnelByIdentity = {
  SOC: ["Yolanda Yin", "刘芳", "黄国庆", "何淑慈"],
  CM: ["刘芳", "黄国庆", "何淑慈", "王伟"],
  AM: ["张小明", "Linney", "李四", "王洋"],
  STORE: ["上海南京东路店", "上海五角场店", "上海静安寺店", "上海中山公园店"],
};

let dashboardArchitecture = {
  identity: "CM",
  selectedPeople: dashboardPersonnelByIdentity.CM.slice(),
};
let draftDashboardArchitecture = JSON.parse(JSON.stringify(dashboardArchitecture));

let dashboardFilters = {
  structure: "CM · 4人",
  time: "近14天",
  customStart: "2026-09-16",
  customEnd: "2026-09-29",
  plan: "全部计划",
  role: ["AM", "CM"],
  storeType: ["实体店"],
  template: ["全部模板"],
  taskType: ["循环"],
};
let draftDashboardFilters = JSON.parse(JSON.stringify(dashboardFilters));
let dashboardRankingView = "coverage";
let dashboardDrillLevel = 0;

const teamSingleTasks = [
  task("#3621", "待访店", "orange", "上海南京东路店", "2025年6月6日", "2025年6月20日", "李四"),
  task("#3699", "即将逾期", "red", "上海五角场店", "2025年6月6日", "2025年6月12日", "李四"),
  task("#3655", "执行中", "blue", "上海静安寺店", "2025年6月6日", "2025年6月20日", "李四"),
  task("#3678", "已完成", "green", "上海中山公园店", "2025年6月6日", "2025年6月4日", "李四", "实际访店日期"),
];

const teamMultiBaseTasks = [
  task("#3621", "待访店", "orange", "上海南京东路店", "2025年6月6日", "2025年6月20日", "张伟"),
  task("#3699", "即将逾期", "red", "上海五角场店", "2025年6月6日", "2025年6月12日", "王洋"),
  task("#3655", "执行中", "blue", "上海静安寺店", "2025年6月6日", "2025年6月20日", "王洋"),
  task("#3680", "待访店", "orange", "上海人民广场店", "2025年6月6日", "2025年6月20日", "张伟"),
  task("#3678", "已完成", "green", "上海中山公园店", "2025年6月6日", "2025年6月20日", "王洋"),
];

let mode = "mine";
let expanded = false;
let selectedMembers = [];
let statusFilter = "all";

function task(id, label, status, shop, suggestedDate, deadlineDate, visitor, deadlineLabel = "任务截止日期") {
  return { id, label, status, shop, suggestedDate, deadlineDate, visitor, deadlineLabel };
}

function showPage(pageName) {
  closeVisitDateDrawer();
  closeTaskTagFilter();
  closeStoreTags();
  closeAdHocTaskDrawer();
  closeDashboardFilterDrawer();
  closeOptionalStageModal();
  Object.entries(pages).forEach(([name, page]) => {
    page.hidden = name !== pageName;
  });

  const page = pages[pageName];
  if (detailAdHocBadge) detailAdHocBadge.hidden = !adHocTasks.some((item) => item.id === activeTaskId);
  renderActiveAdHocDetail();
  updateAmReportEntryVisibility();
  const scrollArea = page.querySelector(".content, .calendar-content, .detail-content");
  if (scrollArea) scrollArea.scrollTop = 0;
  if (pageName === "reportList") setReportListView("mine");
  if (pageName === "dashboard") renderDashboard();
  setActiveTab(pageName);
}

function renderDashboard() {
  if (!dashboardPage) return;
  if (dashboardStructureValue) dashboardStructureValue.textContent = dashboardStructureLabel(dashboardArchitecture);
  if (dashboardTimeValue) dashboardTimeValue.textContent = dashboardTimeLabel(dashboardFilters);
  if (dashboardDrillBack) dashboardDrillBack.hidden = dashboardDrillLevel === 0;
  if (dashboardRankingList) {
    dashboardRankingList.innerHTML = dashboardRankingData[dashboardRankingView]
      .map(([name, value, detail, tone], index) => `
        <button class="dashboard-ranking-row" type="button" data-action="drill-dashboard-region" data-drill="forward" data-region="${name}">
          <span class="dashboard-rank-number ${index < 3 ? "top" : ""}">${index + 1}</span>
          <span class="dashboard-ranking-name"><strong>${name}</strong><small>${detail}</small></span>
          <span class="dashboard-ranking-value"><b class="${tone}">${value}</b><i>›</i></span>
        </button>
      `)
      .join("");
  }
  if (dashboardIssueList) {
    const max = dashboardIssueData[0][1];
    dashboardIssueList.innerHTML = dashboardIssueData
      .map(([name, count], index) => `
        <div class="dashboard-issue-row">
          <span class="dashboard-issue-rank">${String(index + 1).padStart(2, "0")}</span>
          <div class="dashboard-issue-main"><strong>${name}</strong><span class="dashboard-issue-track"><i style="width:${Math.round((count / max) * 100)}%"></i></span></div>
          <b>${count}</b>
        </div>
      `)
      .join("");
  }
  document.querySelectorAll("[data-action='switch-dashboard-ranking']").forEach((button) => {
    button.classList.toggle("active", button.dataset.ranking === dashboardRankingView);
  });
}

function dashboardTimeLabel(filters) {
  if (filters.time !== "自定义") return filters.time;
  const start = filters.customStart?.slice(5).replace("-", ".");
  const end = filters.customEnd?.slice(5).replace("-", ".");
  return start && end ? `${start}-${end}` : "自定义";
}

function dashboardStructureLabel(architecture) {
  return `${architecture.identity} · ${architecture.selectedPeople.length}人`;
}

function renderDashboardPersonnel() {
  if (!dashboardPersonnelList) return;
  const identity = draftDashboardArchitecture.identity;
  const selectedPeople = draftDashboardArchitecture.selectedPeople;
  const people = dashboardPersonnelByIdentity[identity] || [];

  dashboardIdentityChoices?.querySelectorAll("[data-identity]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.identity === identity);
  });

  dashboardPersonnelList.innerHTML = people
    .map((person) => `
      <label class="dashboard-person-row">
        <input type="checkbox" data-dashboard-person="${escapeReportText(person)}" ${selectedPeople.includes(person) ? "checked" : ""}>
        <span>${escapeReportText(person)}</span>
        <i aria-hidden="true">›</i>
      </label>
    `)
    .join("");
}

function chooseDashboardIdentity(identity) {
  if (!dashboardPersonnelByIdentity[identity]) return;
  draftDashboardArchitecture = {
    identity,
    selectedPeople: dashboardPersonnelByIdentity[identity].slice(),
  };
  renderDashboardPersonnel();
}

function toggleDashboardPerson(person, checked) {
  const allPeople = dashboardPersonnelByIdentity[draftDashboardArchitecture.identity] || [];
  if (!allPeople.includes(person)) return;
  if (!checked && draftDashboardArchitecture.selectedPeople.length === 1) {
    renderDashboardPersonnel();
    return;
  }
  draftDashboardArchitecture.selectedPeople = checked
    ? [...new Set([...draftDashboardArchitecture.selectedPeople, person])]
    : draftDashboardArchitecture.selectedPeople.filter((item) => item !== person);
  renderDashboardPersonnel();
}

function openDashboardMoreDrawer() {
  if (!dashboardMoreDrawer) return;
  draftDashboardFilters = JSON.parse(JSON.stringify(dashboardFilters));
  draftDashboardArchitecture = JSON.parse(JSON.stringify(dashboardArchitecture));
  dashboardMoreDrawer.hidden = false;
  renderDashboardPersonnel();
  syncDashboardFilterChoices();
}

function closeDashboardFilterDrawer() {
  if (dashboardMoreDrawer) dashboardMoreDrawer.hidden = true;
}

function syncDashboardFilterChoices() {
  document.querySelectorAll("[data-action='choose-dashboard-filter']").forEach((button) => {
    const key = button.dataset.filterKey;
    const value = button.dataset.filterValue;
    const selected = Array.isArray(draftDashboardFilters[key]) ? draftDashboardFilters[key].includes(value) : draftDashboardFilters[key] === value;
    button.classList.toggle("selected", selected);
  });
  const customDateRange = document.querySelector("[data-dashboard-custom-date]");
  if (customDateRange) customDateRange.hidden = draftDashboardFilters.time !== "自定义";
  document.querySelectorAll("[data-dashboard-date]").forEach((input) => {
    input.value = draftDashboardFilters[input.dataset.dashboardDate] || "";
  });
}

function chooseDashboardFilter(button) {
  const key = button.dataset.filterKey;
  const value = button.dataset.filterValue;
  if (key === "time") {
    draftDashboardFilters.time = value;
  } else {
    const current = Array.isArray(draftDashboardFilters[key]) ? draftDashboardFilters[key] : [];
    if (current.includes(value)) {
      if (current.length > 1) draftDashboardFilters[key] = current.filter((item) => item !== value);
    } else {
      draftDashboardFilters[key] = [...current.filter((item) => item !== "全部计划" && item !== "全部模板"), value];
    }
  }
  syncDashboardFilterChoices();
}

function resetDashboardFilters() {
  dashboardArchitecture = {
    identity: "CM",
    selectedPeople: dashboardPersonnelByIdentity.CM.slice(),
  };
  draftDashboardArchitecture = JSON.parse(JSON.stringify(dashboardArchitecture));
  draftDashboardFilters = {
    structure: dashboardStructureLabel(dashboardArchitecture),
    time: "近14天",
    customStart: "2026-09-16",
    customEnd: "2026-09-29",
    plan: "全部计划",
    role: ["AM", "CM"],
    storeType: ["实体店"],
    template: ["全部模板"],
    taskType: ["循环"],
  };
  renderDashboardPersonnel();
  syncDashboardFilterChoices();
}

function applyDashboardFilters() {
  dashboardArchitecture = JSON.parse(JSON.stringify(draftDashboardArchitecture));
  dashboardFilters = JSON.parse(JSON.stringify(draftDashboardFilters));
  dashboardFilters.structure = dashboardStructureLabel(dashboardArchitecture);
  closeDashboardFilterDrawer();
  dashboardDrillLevel = 0;
  renderDashboard();
}

function drillDashboardRegion(button) {
  dashboardDrillLevel = button.dataset.drill === "back" ? 0 : 1;
  renderDashboard();
}

function renderActiveAdHocDetail() {
  const count = document.getElementById("detailPreviewCount");
  const hint = document.getElementById("detailPreviewHint");
  const item = adHocTasks.find((taskItem) => taskItem.id === activeTaskId);
  if (!count || !hint) return;
  if (!item?.selectedCheckItems?.length) {
    count.textContent = "8 项";
    hint.textContent = "查看此次访店需要完成的测评项目及数量";
    return;
  }
  count.textContent = `${item.selectedCheckItems.length} 项`;
  hint.textContent = "查看此次临时访店已选择的检查项目";
}

function setActiveTab(pageName) {
  const reportPages = ["reportList", "generatedReport", "amHistoryReport", "relatedCheckItems", "editReport", "publishSuccess"];
  let activeTab = "calendar";

  if (pageName === "dashboard") activeTab = "dashboard";
  if (reportPages.includes(pageName)) activeTab = "report";

  document.querySelectorAll(".tabbar .tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === activeTab);
  });
}

function setReportListView(view) {
  reportViewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.reportView === view);
  });
  reportPanels.forEach((panel) => {
    panel.hidden = panel.dataset.reportPanel !== view;
  });
  if (mineReportFilter && allReportFilter) {
    mineReportFilter.hidden = view !== "mine";
    allReportFilter.hidden = view !== "all";
  }
}

function setReportDetailMode(mode) {
  const readonly = mode === "readonly";
  generatedReportPage?.classList.toggle("report-readonly", readonly);
  if (reportDetailActions) reportDetailActions.hidden = readonly;
}

function updateAmReportEntryVisibility() {
  if (!amReportEntry) return;
  amReportEntry.hidden = currentUserRole !== "CM" || !hasAccessibleAmReport;
}

function resetReportPublishAction() {
  const publishButton = reportDetailActions?.querySelector("[data-action='publish-report']");
  if (publishButton) publishButton.hidden = true;
}

function escapeReportText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function reportQuestionBadge(required) {
  return `<span class="question-type-badge ${required ? "required" : "optional"}">${required ? "必检" : "可选"}</span>`;
}

function reportPhotoThumbs(photos = []) {
  if (!photos.length) return "";
  const thumbs = photos.map((photo, index) => {
    const photoClass = String(photo.photoClass || "").replace(/[^a-z0-9-]/gi, "");
    return `<span class="thumb ${photoClass}" aria-label="现场照片${index + 1}"></span>`;
  }).join("");
  return `<div class="report-answer-photos">${thumbs}</div>`;
}

function renderReportChoice(choice, selected) {
  const isSelected = selected.includes(choice);
  return `<button type="button" class="choice ${isSelected ? "active" : ""}">${escapeReportText(choice)}</button>`;
}

function renderReportDetailItems(section) {
  const questions = section.questions.map((question, index) => `
    <div class="report-detail-question">
      <div class="detail-question-head"><strong>${index + 1}. ${escapeReportText(question.title)}</strong><span>${escapeReportText(question.mode)}</span></div>
      <div class="choice-row ${question.mode === "多选" ? "multi" : ""} ${question.choiceLayout === "stacked" ? "stacked" : ""}">${question.choices.map((choice) => renderReportChoice(choice, question.selected)).join("")}</div>
      ${question.text ? `<div class="input-box tall">${escapeReportText(question.text)}</div>` : ""}
      ${question.photos.length
        ? `<div class="photo-upload uploaded"><div class="upload-status">当前已上传 ${question.photos.length} 张图片</div>${reportPhotoThumbs(question.photos)}</div>`
        : question.photoText ? `<div class="input-box photo-text-box">${escapeReportText(question.photoText)}</div>`
          : question.photoPlaceholder === "icon" ? `<div class="photo-upload empty photo-icon-only"><span class="camera-icon" aria-label="现场图片"></span></div>`
            : question.showPhotoEmpty === false ? "" : `<div class="photo-upload empty"><span class="camera-icon"></span>未上传现场图片</div>`}
    </div>
  `).join("");
  return `<section class="report-answer-section"><div class="section-title">${escapeReportText(section.title)}</div>${questions}</section>`;
}

function renderReportResult(section) {
  const passActive = section.value === "通过";
  const adjustActive = section.value === "需调整";
  return `
    <section class="report-answer-section">
      <div class="section-title">${escapeReportText(section.title)}</div>
      <div class="report-result-options">
        <div class="report-result-option ${passActive ? "active pass" : ""}">通过 ${passActive ? "<span>✓</span>" : ""}</div>
        <div class="report-result-option ${adjustActive ? "active adjust" : ""}">需调整 ${adjustActive ? "<span>✓</span>" : ""}</div>
      </div>
      <div class="input-box tall">${escapeReportText(section.text)}</div>
      ${section.photos?.length ? `<div class="photo-upload uploaded"><div class="upload-status">当前已上传 ${section.photos.length} 张图片</div>${reportPhotoThumbs(section.photos)}</div>` : ""}
    </section>
  `;
}

function renderReportScore(section) {
  return `
    <section class="report-answer-section">
      <div class="section-title">${escapeReportText(section.title)}</div>
      <div class="report-score-card">
        <div class="score10-top"><div class="score-label-group"><strong>评分</strong><small>${escapeReportText(section.label)}</small></div><span>${escapeReportText(section.score)}</span></div>
        <div class="input-box tall">${escapeReportText(section.text)}</div>
      </div>
    </section>
  `;
}

function renderInlineModuleScore(section) {
  return `
    <section class="report-answer-section inline-module-score">
      <div class="report-module-score"><span>${escapeReportText(section.title)}</span><strong>${escapeReportText(section.result)}</strong></div>
    </section>
  `;
}

function renderRelatedCheckLink(item, options = {}) {
  if (!options.showRelatedLink || !item.relatedItems?.length) return "";
  const relatedBackPage = options.relatedBackPage || "amHistoryReport";
  return `<button class="related-check-link" type="button" data-action="open-related-check-items" data-related-back="${relatedBackPage}"><span>查看上次访店情况</span><i>›</i></button>`;
}

function renderReportAnswerSections(item, options = {}) {
  const sections = item.sections || [];
  const sectionMarkup = sections.map((section) => {
    if (section.type === "detail-items") return renderReportDetailItems(section);
    if (section.type === "score") return renderReportScore(section);
    return renderReportResult(section);
  }).join("");
  return `${renderRelatedCheckLink(item, options)}${sectionMarkup}`;
}

function renderReportInlineModuleScore(item) {
  return `
    <div class="report-module-score">
      <span>${escapeReportText(item.title)}</span>
      <strong>${escapeReportText(item.result)}</strong>
    </div>
  `;
}

function printablePhotoThumbs(photos = []) {
  if (!photos.length) return "";
  return `<div class="print-photos">${photos.map((photo) => `<span class="${String(photo.photoClass || "").replace(/[^a-z0-9-]/gi, "")}"></span>`).join("")}</div>`;
}

function renderPrintableChoice(choice, selected) {
  const active = selected.includes(choice);
  return `<span class="print-choice ${active ? "active" : ""}">${escapeReportText(choice)}</span>`;
}

function renderPrintableDetailItems(section) {
  const questions = section.questions.map((question, index) => `
    <div class="print-detail-question">
      <div class="print-question-head"><strong>${index + 1}. ${escapeReportText(question.title)}</strong><span>${escapeReportText(question.mode)}</span></div>
      <div class="print-choice-row">${question.choices.map((choice) => renderPrintableChoice(choice, question.selected)).join("")}</div>
      ${question.text ? `<div class="print-input">${escapeReportText(question.text)}</div>` : ""}
      ${question.photos.length ? `<p class="print-upload-status">当前已上传 ${question.photos.length} 张图片</p>${printablePhotoThumbs(question.photos)}` : question.showPhotoEmpty === false ? "" : `<p class="print-upload-status">未上传现场图片</p>`}
    </div>
  `).join("");
  return `<section class="print-answer-section"><h3>${escapeReportText(section.title)}</h3>${questions}</section>`;
}

function renderPrintableResult(section) {
  const passActive = section.value === "通过";
  const adjustActive = section.value === "需调整";
  return `
    <section class="print-answer-section">
      <h3>${escapeReportText(section.title)}</h3>
      <div class="print-result-options">
        <span class="${passActive ? "active pass" : ""}">通过</span>
        <span class="${adjustActive ? "active adjust" : ""}">需调整</span>
      </div>
      <div class="print-input">${escapeReportText(section.text)}</div>
      ${section.photos?.length ? `<p class="print-upload-status">当前已上传 ${section.photos.length} 张图片</p>${printablePhotoThumbs(section.photos)}` : ""}
    </section>
  `;
}

function renderPrintableScore(section) {
  return `
    <section class="print-answer-section">
      <h3>${escapeReportText(section.title)}</h3>
      <div class="print-score-row"><strong>评分</strong><span>${escapeReportText(section.score)} · ${escapeReportText(section.label)}</span></div>
      <div class="print-input">${escapeReportText(section.text)}</div>
    </section>
  `;
}

function renderPrintableInlineModuleScore(section) {
  return `<div class="module-score inline"><span>${escapeReportText(section.title)}</span><strong>${escapeReportText(section.result)}</strong></div>`;
}

function renderPrintableAnswerSections(item) {
  const sections = item.sections || [];
  return sections.map((section) => {
    if (section.type === "detail-items") return renderPrintableDetailItems(section);
    if (section.type === "score") return renderPrintableScore(section);
    return renderPrintableResult(section);
  }).join("");
}

function renderVisitResultDetail(containerId = "visitResultModules", answers = visitReportAnswers, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = answers.map((module) => {
    const questionCount = module.items.filter((item) => item.type !== "module-score").length;
    const rows = module.items.map((item) => {
      if (item.type === "module-score") return renderReportInlineModuleScore(item);
      const detailId = `${containerId}-answer-${item.number}`;
      return `
        <article class="report-answer-row">
          <button class="report-answer-toggle" type="button" data-action="toggle-report-answer" aria-expanded="true" aria-controls="${detailId}">
            <span class="report-answer-number">${String(item.number).padStart(2, "0")}</span>
            <span class="report-answer-title"><strong>${escapeReportText(item.title)}</strong>${reportQuestionBadge(item.required)}</span>
            <span class="report-answer-result ${item.tone}">${escapeReportText(item.result)}</span>
            <span class="report-answer-chevron" aria-hidden="true">›</span>
          </button>
          <div id="${detailId}" class="report-answer-detail">
            ${renderReportAnswerSections(item, options)}
          </div>
        </article>`;
    }).join("");

    return `<section class="visit-result-module"><div class="visit-result-module-title"><strong>${escapeReportText(module.name)}</strong><span>${questionCount} 项</span></div>${rows}</section>`;
  }).join("");
}

function toggleReportAnswer(target) {
  const detailId = target.getAttribute("aria-controls");
  const detail = detailId ? document.getElementById(detailId) : null;
  if (!detail) return;
  const expanded = target.getAttribute("aria-expanded") === "true";
  target.setAttribute("aria-expanded", String(!expanded));
  detail.hidden = expanded;
}

function buildPrintableReportHtml() {
  const reportSections = `
    <section class="print-card">
      <h2>AI总结</h2>
      <p>门店整体执行良好，春季新品陈列和服务礼仪表现稳定，需重点跟进三处视觉陈列及物料完整性问题。</p>
      <p>建议将新品体验桌向主通道前移，并在收银区增加会员换购提示，提升高峰时段转化效率。</p>
    </section>
    <section class="print-card">
      <h2>访店亮点</h2>
      <p>1. 门店春季新品陈列严格执行 POG 阵列图手册，视觉动线流畅。</p>
      <p>2. 前台员工服务礼仪标准，主动招呼率达 100%。</p>
      ${printablePhotoThumbs([{ photoClass: "store-a" }])}
    </section>
    <section class="print-card">
      <h2>需调整内容</h2>
      <p>1. 入口活动标签边角卷起，需重新补贴并复核。</p>
      <p>2. 促销商品未放置在主视觉区域，部分促销标签缺失。</p>
      <p>3. 货架中段排面不够饱满，需按促销优先级补齐。</p>
      ${printablePhotoThumbs([{ photoClass: "store-b" }, { photoClass: "store-a" }, { photoClass: "store-c" }])}
    </section>
  `;

  const resultSections = visitReportAnswers.map((module) => {
    const rows = module.items.map((item) => {
      if (item.type === "module-score") return renderPrintableInlineModuleScore(item);
      return `<article class="answer expanded"><div class="answer-head"><strong>${item.number}. ${escapeReportText(item.title)}</strong><span class="${item.tone}">${escapeReportText(item.result)}</span></div><p><b>${item.required ? "必检" : "可选"}</b>　${escapeReportText(item.answer)}</p><div class="answer-detail-print">${renderPrintableAnswerSections(item)}</div></article>`;
    }).join("");
    return `<section><h2>${escapeReportText(module.name)}</h2>${rows}</section>`;
  }).join("");

  return `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>访店报告 - BJ远洋乐堤港</title><style>
    *{box-sizing:border-box}body{margin:0;color:#1d2939;background:#fff;font:14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif}.page{width:210mm;min-height:297mm;margin:auto;padding:16mm}header{padding-bottom:14px;border-bottom:2px solid #2f6df6}h1{margin:0 0 8px;font-size:26px}header p{margin:2px 0;color:#667085}.print-card{margin:16px 0;padding:14px 16px;background:#f8fafc;border:1px solid #e4e9f2;border-radius:8px;break-inside:avoid}.print-card h2,section h2{margin:0 0 8px;font-size:17px}.print-card p{margin:4px 0}.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:5px 28px;margin-top:12px}.meta span{color:#667085}.answer{padding:10px 0;border-top:1px solid #e4e9f2;break-inside:avoid}.answer-head,.module-score{display:flex;justify-content:space-between;gap:20px}.answer p{margin:5px 0}.answer b{color:#159654;background:#e9f6ef;border-radius:999px;padding:2px 8px;font-size:12px}.pass{color:#079455}.score{color:#2f6df6}.adjust{color:#d92d20}.module-score{margin:8px 0;padding:10px 12px;background:#f5f7fb}.module-score strong{color:#2f6df6}.answer-detail-print{margin-top:8px;padding:9px;border:1px solid #e4e9f2;border-radius:8px;background:#f8fafc}.print-answer-section{margin-top:8px;padding:9px;border:1px solid #e9edf5;border-radius:8px;background:#fff}.print-answer-section:first-child{margin-top:0}.print-answer-section h3{margin:0 0 7px;font-size:13px}.print-question-head,.print-score-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.print-question-head span,.print-upload-status{color:#667085;font-size:12px}.print-choice-row,.print-result-options,.print-photos{display:flex;flex-wrap:wrap;gap:7px;margin-top:7px}.print-choice,.print-result-options span{padding:4px 8px;border-radius:999px;background:#f2f4f7;color:#667085;font-size:12px}.print-choice.active,.print-result-options .active.pass{background:#e9f6ef;color:#159654;font-weight:800}.print-result-options .active.adjust{background:#fff0f0;color:#d92d20;font-weight:800}.print-input{margin-top:7px;padding:8px;border:1px solid #dbe2ec;border-radius:6px;background:#fff;color:#475467}.print-score-row span{color:#2f6df6;font-weight:900}.print-photos span{width:54px;height:54px;border-radius:8px;background:linear-gradient(135deg,#dce6f5,#b8c9e5);display:block}.print-photos .store-a{background:linear-gradient(135deg,#e84d4f,#ffb347 48%,#f7f0d7)}.print-photos .store-b{background:linear-gradient(135deg,#f5a1c7,#e14956 50%,#f6d7bd)}.print-photos .store-c{background:linear-gradient(135deg,#7a3ff2,#e9d8ff 52%,#98b66e)}@page{size:A4;margin:0}@media print{.page{width:auto;min-height:auto;margin:0}}
  </style></head><body><main class="page"><header><h1>访店报告详情</h1><p>BJ远洋乐堤港 · 2026-02-02</p><div class="meta"><div><span>计划编号：</span>PLN-2026001</div><div><span>门店编号：</span>2749</div><div><span>门店名称：</span>BJ远洋乐堤港</div><div><span>访店人员：</span>张访店</div><div><span>检查模板：</span>2026Q1常规循环访店AM</div><div><span>模板类型：</span>循环周期任务</div></div></header>${reportSections}<section><h2>访店结果详情</h2>${resultSections}</section></main></body></html>`;
}

function downloadVisitReport() {
  const blob = new Blob([buildPrintableReportHtml()], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "访店报告-BJ远洋乐堤港-2026-02-02.html";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function render() {
  const isTeam = mode === "team";
  modeLabel.textContent = isTeam ? "查看团队日历" : "查看我的日历";
  if (addAdHocButton) addAdHocButton.hidden = mode !== "mine";
  teamControl.hidden = !isTeam;
  allTasksButton.hidden = isTeam;
  teamStatusFilter.hidden = !isTeam;

  if (!isTeam) {
    memberSummary.textContent = "选择成员";
  } else if (selectedMembers.length) {
    memberSummary.textContent = `选择成员：${selectedMembers.join("、")}`;
  } else {
    memberSummary.textContent = "选择成员";
  }

  calendarToggle.innerHTML = expanded
    ? '<span class="toggle-label">收起日历（查看近两周）</span><span class="toggle-icon up" aria-hidden="true"></span>'
    : '<span class="toggle-icon" aria-hidden="true"></span><span class="toggle-label">展开全部日历（查看本月）</span>';
  renderCalendar();
  renderTasks();
}

function renderCalendar() {
  const days = expanded ? range(2, 30) : range(2, 15);
  const useDots = mode === "team" && selectedMembers.length !== 1;
  const hideTaskMarks = mode === "team" && selectedMembers.length === 0;

  calendarGrid.innerHTML = days
    .map((day) => {
      const weekend = day % 7 === 0 || day % 7 === 1;
      const muted = [14, 21, 28].includes(day);
      const tags = hideTaskMarks ? [] : calendarTagsForDay(day);
      return `
        <div class="day-cell ${weekend ? "weekend" : ""} ${muted ? "muted" : ""} ${day === 6 ? "selected" : ""}">
          <div class="day-number">${day}</div>
          ${useDots ? renderDots(tags) : renderTags(tags)}
        </div>
      `;
    })
    .join("");
}

function calendarTagsForDay(day) {
  const adHocTags = adHocTasks
    .filter((item) => Number(item.visitDateIso?.slice(-2)) === day)
    .map((item) => ({ id: item.id, status: item.status }));
  return [...(tagByDay[day] || []), ...adHocTags];
}

function renderTags(tags) {
  if (!tags.length) return "";
  return `<div class="tag-stack">${tags.map((item) => `<span class="calendar-tag ${item.status}">${item.id}</span>`).join("")}</div>`;
}

function renderDots(tags) {
  if (!tags.length) return "";
  const colors = tags.map((item) => (item.status === "green" ? "green" : item.status === "red" ? "red" : "orange"));
  return `<div class="dot-stack">${colors.map((color) => `<span class="dot ${color}"></span>`).join("")}</div>`;
}

function renderTasks() {
  const tasks = currentTasks();
  taskList.hidden = tasks.length === 0;
  renderStatusFilter(currentTasks(false));
  taskList.innerHTML = tasks
    .map(
      (item) => `
        <article class="calendar-task ${item.kind === "adhoc" ? "adhoc-task" : ""}">
          ${item.kind === "adhoc" ? '<span class="task-corner-badge">临访</span>' : ""}
          <span class="status-badge ${item.status}">${item.label}</span>
          <div class="task-main">
            <div class="task-title"><span class="task-id">${item.id}</span><span class="shop-name">${item.shop}</span></div>
            <div class="task-meta">
              <span>建议访店日期： ${item.suggestedDate}</span>
              <span>${item.deadlineLabel}： ${item.deadlineDate}</span>
              <span>访店人： ${item.visitor}</span>
            </div>
          </div>
          <button class="task-detail-btn" type="button" data-action="open-detail" data-task-id="${item.id}">查看详情</button>
        </article>
      `,
    )
    .join("");
}

function renderStatusFilter(tasks) {
  if (!teamStatusFilter) return;
  const counts = {
    all: tasks.length,
    red: tasks.filter((item) => item.status === "red").length,
    orange: tasks.filter((item) => item.status === "orange").length,
    blue: tasks.filter((item) => item.status === "blue").length,
    green: tasks.filter((item) => item.status === "green").length,
  };

  teamStatusFilter.querySelectorAll("[data-status-filter]").forEach((button) => {
    const key = button.dataset.statusFilter;
    button.classList.toggle("active", key === statusFilter);
    const count = button.querySelector("span");
    if (count) count.textContent = counts[key] ?? 0;
  });
}

function currentTasks(applyFilter = true) {
  if (mode !== "team") return [...mineTasks, ...adHocTasks];

  let tasks;
  if (selectedMembers.length === 1) {
    tasks = teamSingleTasks.map((item) => ({ ...item, visitor: selectedMembers[0] }));
  } else {
    const members = selectedMembers.length ? selectedMembers : ["张伟", "王洋", "李四"];
    tasks = teamMultiBaseTasks.map((item, index) => ({ ...item, visitor: members[index % members.length] }));
  }

  if (!applyFilter || statusFilter === "all") return tasks;
  return tasks.filter((item) => item.status === statusFilter);
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function clearMemberChecks() {
  memberPanel.querySelectorAll(".level-3 input").forEach((input) => {
    input.checked = false;
  });
}

function applyMembers() {
  selectedMembers = Array.from(memberPanel.querySelectorAll(".level-3 input:checked")).map((input) => input.value);
  memberPanel.hidden = true;
  render();
}

function toggleSection(target) {
  const section = target.closest("[data-collapse-section]");
  if (!section) return;
  section.classList.toggle("is-collapsed");
}

function toggleDesc(target) {
  const wrap = target.closest(".desc-wrap");
  const desc = wrap?.querySelector(".desc");
  if (!desc) return;

  const collapsed = desc.classList.toggle("clamped");
  target.textContent = collapsed ? "展开" : "收起";
}

function toggleReviewState() {
  const issueVisible = !pages.reviewIssue.hidden;
  showPage(issueVisible ? "reviewClean" : "reviewIssue");
}

function toggleRectify(target) {
  const card = target.closest("[data-rectify-card]");
  if (!card) return;
  card.classList.toggle("is-expanded");
}

function selectScore(target) {
  const score = Number(target.dataset.score);
  document.querySelectorAll(".score-option").forEach((option) => {
    option.classList.toggle("active", option === target);
  });

  if (scoreValue) scoreValue.textContent = `${score} 分`;
  if (scoreLabel) scoreLabel.textContent = scoreLabels[score] || "";
  if (!scoreInput) return;

  if (score <= 2) {
    scoreInput.placeholder = "请说明需调整的方向";
    scoreInput.required = true;
    scoreInput.classList.add("is-required");
    scoreInput.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    scoreInput.placeholder = "请留下您对此项的洞察";
    scoreInput.required = false;
    scoreInput.classList.remove("is-required");
  }
}

function openVisualScoreModal() {
  selectedVisualScore = null;
  moduleScoreOptions.forEach((option) => option.classList.remove("active"));
  if (visualScoreValue) visualScoreValue.textContent = "--";
  if (visualScoreLabel) visualScoreLabel.textContent = "";
  if (visualScoreSubmit) visualScoreSubmit.disabled = true;
  if (visualScoreModal) visualScoreModal.hidden = false;
}

function openOptionalStageModal() {
  answerStage = "required";
  if (optionalStageModal) optionalStageModal.hidden = false;
}

function closeOptionalStageModal() {
  if (optionalStageModal) optionalStageModal.hidden = true;
}

function startOptionalStage() {
  answerStage = "optional";
  optionalReturnPage = null;
  closeOptionalStageModal();
  showPage("ownerResourceQuestion");
}

function skipOptionalStage() {
  answerStage = "preview";
  optionalReturnPage = null;
  closeOptionalStageModal();
  showPage("reportPreview");
}

function openOptionalQuestion(pageName) {
  if (answerStage === "required") {
    optionalReturnPage = pages.storeManagerQuestion?.hidden === false ? "storeManagerQuestion" : "baQuestion";
  }
  showPage(pageName);
}

function completeOptionalQuestion(nextPageName) {
  if (answerStage === "required" && optionalReturnPage) {
    const returnPage = optionalReturnPage;
    optionalReturnPage = null;
    showPage(returnPage);
    return;
  }

  if (nextPageName) {
    answerStage = "optional";
    showPage(nextPageName);
    return;
  }

  answerStage = "preview";
  showPage("reportPreview");
}

function selectModuleScore(target) {
  const score = Number(target.dataset.moduleScore);
  selectedVisualScore = score;
  moduleScoreOptions.forEach((option) => {
    option.classList.toggle("active", option === target);
  });
  if (visualScoreValue) visualScoreValue.textContent = scoreLabels[score] || "";
  if (visualScoreLabel) visualScoreLabel.textContent = "";
  if (visualScoreSubmit) visualScoreSubmit.disabled = false;
}

function submitVisualScore() {
  if (!selectedVisualScore) return;
  if (visualScoreModal) visualScoreModal.hidden = true;
  showPage("baQuestion");
}

function closeVisitDateDrawer() {
  const drawer = document.getElementById("visitDateDrawer");
  const error = document.getElementById("visitDateError");
  if (drawer) drawer.hidden = true;
  if (error) error.hidden = true;
}

function visibleAdHocCheckItems() {
  const keyword = (adHocCheckItemSearch?.value || "").trim().toLowerCase();
  if (!keyword) return adHocCheckItemCatalog;
  return adHocCheckItemCatalog.filter((item) => `${item.title} ${item.module}`.toLowerCase().includes(keyword));
}

function renderAdHocCheckItems() {
  if (!adHocCheckItems) return;
  const visibleItems = visibleAdHocCheckItems();
  const groups = visibleItems.reduce((result, item) => {
    if (!result[item.module]) result[item.module] = [];
    result[item.module].push(item);
    return result;
  }, {});

  adHocCheckItems.innerHTML = Object.keys(groups).length
    ? Object.entries(groups)
        .map(
          ([moduleName, items]) => `
            <section class="ad-hoc-check-group">
              <h3>${escapeReportText(moduleName)}</h3>
              <div class="ad-hoc-check-group-items">
                ${items
                  .map(
                    (item) => `
                      <label class="ad-hoc-check-item ${selectedAdHocCheckItems.includes(item.id) ? "is-selected" : ""}" data-action="toggle-ad-hoc-check-item" data-check-item-id="${escapeReportText(item.id)}">
                        <input type="checkbox" ${selectedAdHocCheckItems.includes(item.id) ? "checked" : ""} aria-label="选择${escapeReportText(item.title)}" />
                        <span class="ad-hoc-check-box" aria-hidden="true">✓</span>
                        <span class="ad-hoc-check-copy"><strong>${escapeReportText(item.title)}</strong></span>
                      </label>
                    `,
                  )
                  .join("")}
              </div>
            </section>
          `,
        )
        .join("")
    : '<p class="ad-hoc-check-empty">没有匹配的检查项</p>';

  if (adHocCheckItemCount) adHocCheckItemCount.textContent = `已选 ${selectedAdHocCheckItems.length} 项`;
  const selectAllButton = document.querySelector("[data-action='select-all-ad-hoc-check-items']");
  const allVisibleSelected = visibleItems.length > 0 && visibleItems.every((item) => selectedAdHocCheckItems.includes(item.id));
  if (selectAllButton) selectAllButton.textContent = allVisibleSelected ? "取消全选" : "全选";
  const submitButton = document.querySelector("[data-action='submit-ad-hoc-task']");
  if (submitButton) submitButton.disabled = selectedAdHocCheckItems.length === 0;
}

function toggleAdHocCheckItem(target) {
  const itemId = target.dataset.checkItemId;
  if (!itemId) return;
  selectedAdHocCheckItems = selectedAdHocCheckItems.includes(itemId)
    ? selectedAdHocCheckItems.filter((id) => id !== itemId)
    : [...selectedAdHocCheckItems, itemId];
  const error = document.getElementById("adHocCheckItemError");
  if (error) error.hidden = true;
  renderAdHocCheckItems();
}

function selectAllAdHocCheckItems() {
  const visibleItems = visibleAdHocCheckItems();
  const allVisibleSelected = visibleItems.length > 0 && visibleItems.every((item) => selectedAdHocCheckItems.includes(item.id));
  selectedAdHocCheckItems = allVisibleSelected
    ? selectedAdHocCheckItems.filter((id) => !visibleItems.some((item) => item.id === id))
    : [...new Set([...selectedAdHocCheckItems, ...visibleItems.map((item) => item.id)])];
  renderAdHocCheckItems();
}

function openAdHocTaskDrawer() {
  const drawer = document.getElementById("adHocTaskDrawer");
  const date = document.getElementById("adHocVisitDate");
  const error = document.getElementById("adHocTaskError");
  const checkItemError = document.getElementById("adHocCheckItemError");
  if (!drawer) return;
  if (date && !date.value) date.value = "2025-06-06";
  if (error) error.hidden = true;
  if (checkItemError) checkItemError.hidden = true;
  selectedAdHocCheckItems = [];
  if (adHocCheckItemSearch) adHocCheckItemSearch.value = "";
  renderAdHocCheckItems();
  drawer.hidden = false;
}

function closeAdHocTaskDrawer() {
  const drawer = document.getElementById("adHocTaskDrawer");
  const error = document.getElementById("adHocTaskError");
  if (drawer) drawer.hidden = true;
  if (error) error.hidden = true;
}

function formatIsoDate(value) {
  const [year, month, day] = value.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

function submitAdHocTask() {
  const store = document.getElementById("adHocStore");
  const date = document.getElementById("adHocVisitDate");
  const error = document.getElementById("adHocTaskError");
  const checkItemError = document.getElementById("adHocCheckItemError");
  if (!store || !date) return;

  if (!date.value || date.value < "2025-06-06" || date.value > "2025-06-20") {
    if (error) error.hidden = false;
    return;
  }
  if (!selectedAdHocCheckItems.length) {
    if (checkItemError) checkItemError.hidden = false;
    return;
  }

  adHocTasks.unshift({
    id: `#临访${String(adHocTaskSequence++).padStart(3, "0")}`,
    label: "待访店",
    status: "orange",
    shop: store.value,
    suggestedDate: formatIsoDate(date.value),
    deadlineDate: formatIsoDate(date.value),
    visitor: "张小明",
    deadlineLabel: "任务截止日期",
    kind: "adhoc",
    kindLabel: "临访任务",
    selfCheck: true,
    visitDateIso: date.value,
    selectedCheckItems: [...selectedAdHocCheckItems],
  });

  closeAdHocTaskDrawer();
  render();
}

function startActiveVisit() {
  const item = adHocTasks.find((taskItem) => taskItem.id === activeTaskId);
  if (!item || item.status !== "orange") return;
  item.status = "blue";
  item.label = "执行中";
  render();
}

function openVisitDateDrawer() {
  const drawer = document.getElementById("visitDateDrawer");
  const suggestedDate = document.getElementById("suggestedVisitDate");
  const currentDate = document.getElementById("drawerCurrentVisitDate");
  const newDate = document.getElementById("newVisitDate");
  const reason = document.getElementById("visitDateReason");

  if (!drawer || !suggestedDate || !currentDate || !newDate) return;
  currentDate.textContent = suggestedDate.textContent;
  if (!newDate.value || newDate.value === suggestedDate.textContent) newDate.value = suggestedDate.textContent;
  drawer.hidden = false;
  reason?.focus();
}

function createVisitDateHistoryItem(oldDate, newDate, reason) {
  const item = document.createElement("div");
  item.className = "history-item";

  [["原建议访店日期", oldDate], ["修改后访店日期", newDate]].forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "history-date-row";
    const labelNode = document.createElement("span");
    const valueNode = document.createElement("strong");
    labelNode.textContent = label;
    valueNode.textContent = value;
    row.append(labelNode, valueNode);
    item.append(row);
  });

  const reasonNode = document.createElement("p");
  reasonNode.textContent = `修改原因：${reason}`;
  item.append(reasonNode);
  return item;
}

function submitVisitDateChange() {
  const newDate = document.getElementById("newVisitDate");
  const reason = document.getElementById("visitDateReason");
  const suggestedDate = document.getElementById("suggestedVisitDate");
  const currentDate = document.getElementById("drawerCurrentVisitDate");
  const history = document.getElementById("visitDateHistory");
  const error = document.getElementById("visitDateError");
  const historyToggle = document.querySelector("[data-action='toggle-date-history']");
  const reasonValue = reason?.value.trim() || "";

  if (!newDate?.value || !reasonValue || !suggestedDate || !history) {
    if (error) {
      error.textContent = newDate?.value ? "请输入修改原因" : "请选择修改后访店日期";
      error.hidden = false;
    }
    (newDate?.value ? reason : newDate)?.focus();
    return;
  }

  if (newDate.value === suggestedDate.textContent) {
    if (error) {
      error.textContent = "修改后日期需与当前日期不同";
      error.hidden = false;
    }
    newDate.focus();
    return;
  }

  const oldDate = suggestedDate.textContent;
  const updatedDate = newDate.value;
  suggestedDate.textContent = updatedDate;
  if (currentDate) currentDate.textContent = updatedDate;
  history.prepend(createVisitDateHistoryItem(oldDate, updatedDate, reasonValue));

  if (historyToggle) {
    const countLabel = historyToggle.querySelector("span:nth-child(2)");
    if (countLabel) countLabel.textContent = `${history.children.length} 条记录`;
  }
  if (error) error.hidden = true;
  reason.value = "";
  closeVisitDateDrawer();
}

function toggleVisitDateHistory(target) {
  const history = document.getElementById("visitDateHistory");
  if (!history) return;
  history.hidden = !history.hidden;
  target.setAttribute("aria-expanded", String(!history.hidden));
}

function selectedTaskTagOptions() {
  return Array.from(document.querySelectorAll("[data-tag-option]"));
}

function updateTaskTagOptions() {
  const query = document.getElementById("taskTagSearch")?.value.trim() || "";
  selectedTaskTagOptions().forEach((option) => {
    const selected = draftTaskTagFilters.includes(option.dataset.tagOption);
    const matches = !query || option.dataset.tagOption.includes(query);
    option.classList.toggle("is-selected", selected);
    option.hidden = !matches;
    option.setAttribute("aria-pressed", String(selected));
  });
}

function applyTaskTagFilterToCards() {
  document.querySelectorAll("#taskListPage .task-card").forEach((card) => {
    const tags = (card.dataset.storeTags || "").split("|").filter(Boolean);
    card.hidden = appliedTaskTagFilters.length > 0 && !appliedTaskTagFilters.some((tag) => tags.includes(tag));
  });
  document.querySelectorAll(".task-tag-chip[data-tag-option]").forEach((chip) => {
    chip.classList.toggle("is-selected", appliedTaskTagFilters.includes(chip.dataset.tagOption));
  });
  const count = document.getElementById("taskTagFilterCount");
  if (count) {
    count.hidden = appliedTaskTagFilters.length === 0;
    count.textContent = String(appliedTaskTagFilters.length);
  }
}

function quickTaskTagFilter(target) {
  const tag = target.dataset.tagOption;
  if (!tag) return;
  appliedTaskTagFilters = appliedTaskTagFilters.length === 1 && appliedTaskTagFilters[0] === tag ? [] : [tag];
  draftTaskTagFilters = [...appliedTaskTagFilters];
  updateTaskTagOptions();
  applyTaskTagFilterToCards();
}

function switchTaskStatusTab(target) {
  document.querySelectorAll("[data-task-status-tab]").forEach((button) => {
    button.classList.toggle("is-active", button === target);
  });
  applyTaskTagFilterToCards();
}

function openTaskTagFilter() {
  const drawer = document.getElementById("taskTagFilterDrawer");
  const search = document.getElementById("taskTagSearch");
  if (!drawer) return;
  draftTaskTagFilters = [...appliedTaskTagFilters];
  if (search) search.value = "";
  updateTaskTagOptions();
  drawer.hidden = false;
  search?.focus();
}

function closeTaskTagFilter() {
  const drawer = document.getElementById("taskTagFilterDrawer");
  if (drawer) drawer.hidden = true;
}

function toggleTaskTagFilter(target) {
  const tag = target.dataset.tagOption;
  if (!tag) return;
  draftTaskTagFilters = draftTaskTagFilters.includes(tag)
    ? draftTaskTagFilters.filter((item) => item !== tag)
    : [...draftTaskTagFilters, tag];
  updateTaskTagOptions();
}

function clearTaskTagFilter() {
  draftTaskTagFilters = [];
  appliedTaskTagFilters = [];
  updateTaskTagOptions();
  applyTaskTagFilterToCards();
}

function confirmTaskTagFilter() {
  appliedTaskTagFilters = [...draftTaskTagFilters];
  applyTaskTagFilterToCards();
  closeTaskTagFilter();
}

function openStoreTags(target) {
  const drawer = document.getElementById("storeTagDrawer");
  const name = document.getElementById("storeTagStoreName");
  const list = document.getElementById("storeTagList");
  if (!drawer || !list) return;
  const tags = (target.dataset.storeTags || "").split("|").filter(Boolean);
  if (name) name.textContent = target.dataset.storeName || "";
  list.innerHTML = tags.map((tag) => `<span>${escapeReportText(tag)}</span>`).join("");
  drawer.hidden = false;
}

function closeStoreTags() {
  const drawer = document.getElementById("storeTagDrawer");
  if (drawer) drawer.hidden = true;
}

function revealPublishReportAction() {
  const publishButton = reportDetailActions?.querySelector("[data-action='publish-report']");
  if (publishButton) publishButton.hidden = false;
}

document.addEventListener("click", (event) => {
  const scoreTarget = event.target.closest("[data-score]");
  if (scoreTarget) {
    selectScore(scoreTarget);
    return;
  }

  const moduleScoreTarget = event.target.closest("[data-module-score]");
  if (moduleScoreTarget) {
    selectModuleScore(moduleScoreTarget);
    return;
  }

  const reportViewTarget = event.target.closest("[data-report-view]");
  if (reportViewTarget) {
    setReportListView(reportViewTarget.dataset.reportView || "mine");
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;

  if (action === "open-dashboard") {
    showPage("dashboard");
    return;
  }

  if (action === "back-from-dashboard") {
    showPage("calendar");
    return;
  }

  if (action === "refresh-dashboard") {
    renderDashboard();
    return;
  }

  if (action === "open-dashboard-filter-drawer") {
    openDashboardMoreDrawer();
    return;
  }

  if (action === "close-dashboard-filter-drawer") {
    closeDashboardFilterDrawer();
    return;
  }

  if (action === "choose-dashboard-filter") {
    chooseDashboardFilter(actionTarget);
    return;
  }

  if (action === "choose-dashboard-identity") {
    chooseDashboardIdentity(actionTarget.dataset.identity);
    return;
  }

  if (action === "reset-dashboard-filters") {
    resetDashboardFilters();
    return;
  }

  if (action === "apply-dashboard-filters") {
    applyDashboardFilters();
    return;
  }

  if (action === "switch-dashboard-ranking") {
    dashboardRankingView = actionTarget.dataset.ranking || "coverage";
    renderDashboard();
    return;
  }

  if (action === "drill-dashboard-region") {
    drillDashboardRegion(actionTarget);
    return;
  }

  if (action === "open-detail") {
    activeTaskId = actionTarget.dataset.taskId || null;
  }

  if (action === "start-visit") {
    startActiveVisit();
  }

  if (action === "toggle-report-answer") {
    toggleReportAnswer(actionTarget);
    return;
  }

  if (action === "open-task-tag-filter") {
    openTaskTagFilter();
    return;
  }

  if (action === "quick-task-tag-filter") {
    quickTaskTagFilter(actionTarget);
    return;
  }

  if (action === "switch-task-status-tab") {
    switchTaskStatusTab(actionTarget);
    return;
  }

  if (action === "close-task-tag-filter") {
    closeTaskTagFilter();
    return;
  }

  if (action === "toggle-task-tag-filter") {
    toggleTaskTagFilter(actionTarget);
    return;
  }

  if (action === "clear-task-tag-filter") {
    clearTaskTagFilter();
    return;
  }

  if (action === "apply-task-tag-filter") {
    confirmTaskTagFilter();
    return;
  }

  if (action === "toggle-store-tags") {
    openStoreTags(actionTarget);
    return;
  }

  if (action === "close-store-tags") {
    closeStoreTags();
    return;
  }

  if (action === "download-visit-report") {
    downloadVisitReport();
    return;
  }

  if (action === "toggle-calendar-mode") {
    modeMenu.hidden = !modeMenu.hidden;
    return;
  }

  if (action === "open-ad-hoc-drawer") {
    openAdHocTaskDrawer();
    return;
  }

  if (action === "close-ad-hoc-drawer") {
    closeAdHocTaskDrawer();
    return;
  }

  if (action === "submit-ad-hoc-task") {
    submitAdHocTask();
    return;
  }

  if (action === "toggle-ad-hoc-check-item") {
    toggleAdHocCheckItem(actionTarget);
    return;
  }

  if (action === "select-all-ad-hoc-check-items") {
    selectAllAdHocCheckItems();
    return;
  }

  if (action === "toggle-expand") {
    expanded = !expanded;
    render();
    return;
  }

  if (action === "toggle-member-panel") {
    memberPanel.hidden = !memberPanel.hidden;
    return;
  }

  if (action === "close-member-panel") {
    memberPanel.hidden = true;
    return;
  }

  if (action === "apply-members") {
    applyMembers();
    return;
  }

  if (action === "filter-status") {
    statusFilter = actionTarget.dataset.statusFilter || "all";
    render();
    return;
  }

  if (action === "open-date-drawer") {
    openVisitDateDrawer();
    return;
  }

  if (action === "close-date-drawer") {
    closeVisitDateDrawer();
    return;
  }

  if (action === "submit-date-change") {
    submitVisitDateChange();
    return;
  }

  if (action === "toggle-date-history") {
    toggleVisitDateHistory(actionTarget);
    return;
  }

  if (action === "toggle-section") {
    toggleSection(actionTarget);
    return;
  }

  if (action === "toggle-desc") {
    toggleDesc(actionTarget);
    return;
  }

  if (action === "toggle-review-state") {
    toggleReviewState();
    return;
  }

  if (action === "toggle-rectify") {
    toggleRectify(actionTarget);
    return;
  }

  if (action === "open-generated-report-readonly") {
    generatedReportBackPage = "reportList";
    setReportDetailMode("readonly");
    showPage("generatedReport");
    return;
  }

  if (action === "open-generated-report") {
    generatedReportBackPage = "reportList";
    setReportDetailMode("editable");
    resetReportPublishAction();
    showPage("generatedReport");
    return;
  }

  if (action === "open-previous-visit-report") {
    generatedReportBackPage = "detail";
    setReportDetailMode("readonly");
    showPage("generatedReport");
    return;
  }

  if (action === "open-am-history-report") {
    showPage("amHistoryReport");
    return;
  }

  if (action === "back-from-am-history-report") {
    showPage("detail");
    return;
  }

  if (action === "open-related-check-items") {
    relatedCheckItemsBackPage = actionTarget.dataset.relatedBack || "amHistoryReport";
    showPage("relatedCheckItems");
    return;
  }

  if (action === "back-from-related-check-items") {
    showPage(relatedCheckItemsBackPage);
    relatedCheckItemsBackPage = "amHistoryReport";
    return;
  }

  if (action === "back-from-generated-report") {
    showPage(generatedReportBackPage);
    generatedReportBackPage = "reportList";
    return;
  }

  if (action === "open-edit-report") {
    revealPublishReportAction();
    showPage("editReport");
    return;
  }

  if (action === "open-visual-score-modal") {
    openVisualScoreModal();
    return;
  }

  if (action === "submit-visual-score") {
    submitVisualScore();
    return;
  }

  if (action === "open-optional-stage-modal") {
    openOptionalStageModal();
    return;
  }

  if (action === "start-optional-stage") {
    startOptionalStage();
    return;
  }

  if (action === "skip-optional-stage") {
    skipOptionalStage();
    return;
  }

  if (action === "open-owner-resource-question") {
    openOptionalQuestion("ownerResourceQuestion");
    return;
  }

  if (action === "open-competitor-question") {
    openOptionalQuestion("competitorQuestion");
    return;
  }

  if (action === "complete-owner-resource-question") {
    completeOptionalQuestion("competitorQuestion");
    return;
  }

  if (action === "complete-competitor-question") {
    completeOptionalQuestion(null);
    return;
  }

  const routes = {
    "open-dashboard": "dashboard",
    "back-from-dashboard": "calendar",
    "open-task-list": "tasks",
    "open-detail": "detail",
    "back-to-calendar": "calendar",
    "open-preview": "preview",
    "start-visit": "reviewIssue",
    "open-catalog": "catalog",
    "open-review-issue": "reviewIssue",
    "open-review-clean": "reviewClean",
    "open-tag-question": "tagQuestion",
    "open-shelf-question": "shelfQuestion",
    "open-ba-question": "baQuestion",
    "open-store-manager-question": "storeManagerQuestion",
    "open-report-preview": "reportPreview",
    "open-edit-result": "editResult",
    "open-submit-done": "submitDone",
    "open-report-list": "reportList",
    "open-rectification-detail": "rectificationDetail",
    "publish-report": "publishSuccess",
    "submit-final": "submitDone",
  };

  if (routes[action]) {
    showPage(routes[action]);
  }
});

modeMenu.addEventListener("click", (event) => {
  const option = event.target.closest("[data-mode]");
  if (!option) return;

  modeMenu.hidden = true;
  if (option.dataset.mode === "mine") {
    mode = "mine";
    expanded = false;
    selectedMembers = [];
    clearMemberChecks();
  } else {
    mode = "team";
    expanded = false;
  }
  render();
});

document.addEventListener("click", (event) => {
  if (!modeMenu.hidden && !event.target.closest(".mode-menu") && !event.target.closest("[data-action='toggle-calendar-mode']")) {
    modeMenu.hidden = true;
  }
});

document.addEventListener("change", (event) => {
  const dashboardDateInput = event.target.closest("[data-dashboard-date]");
  if (dashboardDateInput) {
    draftDashboardFilters[dashboardDateInput.dataset.dashboardDate] = dashboardDateInput.value;
    return;
  }
  const personInput = event.target.closest("[data-dashboard-person]");
  if (!personInput) return;
  toggleDashboardPerson(personInput.dataset.dashboardPerson, personInput.checked);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeVisitDateDrawer();
  closeTaskTagFilter();
  closeStoreTags();
  closeAdHocTaskDrawer();
});

document.getElementById("taskTagSearch")?.addEventListener("input", updateTaskTagOptions);
adHocCheckItemSearch?.addEventListener("input", renderAdHocCheckItems);

renderVisitResultDetail("visitResultModules", visitReportAnswers, { showRelatedLink: true, relatedBackPage: "generatedReport" });
renderVisitResultDetail("amVisitResultModules", amVisitReportAnswers, { showRelatedLink: true, relatedBackPage: "amHistoryReport" });
renderVisitResultDetail("relatedCheckItemsModules", relatedCheckItemAnswers);
renderDashboardPersonnel();
renderAdHocCheckItems();
render();
showPage("calendar");
