/* js/app.js */
/* BUILD: 20260303a */

import { appState } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  initMonth();
  initBinToggle();
  initModeToggle();
  initRangeTabs();
  initSearch();
  initViewTabs();
  updateUI();
});

/* ===============================
   月管理（毎月1日基準）
================================= */
function initMonth() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);

  const savedMonth = localStorage.getItem("savedMonth");
  const savedMode = localStorage.getItem("shimeMode");

  appState.month = currentMonth;

  if (savedMonth !== currentMonth) {
    localStorage.setItem("savedMonth", currentMonth);
    appState.shimeMode = null;
    showMonthSelection();
  } else {
    appState.shimeMode = savedMode ? Number(savedMode) : null;
  }
}

function showMonthSelection() {
  const choice = confirm(
    "新しい月です。\n25期ならOK、30期ならキャンセルを押してください。"
  );

  if (choice) setMode(25, false);
  else setMode(30, false);
}

/* ===============================
   便トグル
================================= */
function initBinToggle() {
  const bin1Btn = document.getElementById("bin1Btn");
  const bin2Btn = document.getElementById("bin2Btn");

  bin1Btn.addEventListener("click", () => {
    appState.currentBin = 1;
    updateUI();
  });

  bin2Btn.addEventListener("click", () => {
    appState.currentBin = 2;
    updateUI();
  });
}

/* ===============================
   期トグル
================================= */
function initModeToggle() {
  const btn25 = document.getElementById("mode25Btn");
  const btn30 = document.getElementById("mode30Btn");

  btn25.addEventListener("click", () => {
    if (appState.shimeMode !== 25) confirmModeChange(25);
  });

  btn30.addEventListener("click", () => {
    if (appState.shimeMode !== 30) confirmModeChange(30);
  });
}

function confirmModeChange(newMode) {
  const ok = confirm(
    `期を ${newMode} に変更します。\n再計算が行われます。よろしいですか？`
  );
  if (!ok) return;
  setMode(newMode, true);
}

function setMode(mode, isOverride) {
  appState.shimeMode = mode;
  appState.override = isOverride;
  localStorage.setItem("shimeMode", mode);
  updateUI();
}

/* ===============================
   範囲タブ（501-510 / 601-619 / 621-648）
================================= */
function initRangeTabs() {
  const tab501 = document.getElementById("tab501");
  const tab601 = document.getElementById("tab601");
  const tab621 = document.getElementById("tab621");

  tab501.addEventListener("click", () => setRange("501-510"));
  tab601.addEventListener("click", () => setRange("601-619"));
  tab621.addEventListener("click", () => setRange("621-648"));
}

function setRange(rangeKey) {
  appState.currentRange = rangeKey;
  // 範囲変更時は検索クリア（仕様）
  appState.searchKeyword = "";
  const input = document.getElementById("courseSearch");
  if (input) input.value = "";
  updateUI();
}

/* ===============================
   検索（前方一致想定：まずは入力保持だけ）
================================= */
function initSearch() {
  const input = document.getElementById("courseSearch");
  const clearBtn = document.getElementById("clearSearch");

  input.addEventListener("input", () => {
    // 数字以外除去（事故防止）
    const cleaned = (input.value || "").replace(/[^\d]/g, "");
    if (cleaned !== input.value) input.value = cleaned;

    appState.searchKeyword = cleaned;
    updateUI();
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    appState.searchKeyword = "";
    updateUI();
  });
}

/* ===============================
   ビュー切替（カード/紙/データ）
================================= */
function initViewTabs() {
  const vCards = document.getElementById("viewCards");
  const vPaper = document.getElementById("viewPaper");
  const vData = document.getElementById("viewData");

  vCards.addEventListener("click", () => setView("cards"));
  vPaper.addEventListener("click", () => setView("paper"));
  vData.addEventListener("click", () => setView("data"));
}

function setView(viewKey) {
  appState.currentView = viewKey;
  updateUI();
}

/* ===============================
   UI更新
================================= */
function updateUI() {
  updateBinUI();
  updateModeUI();
  updateRangeUI();
  updateViewUI();
  updateStatusPills();
  updatePlaceholder();
}

function updateStatusPills() {
  const monthPill = document.getElementById("monthPill");
  const modePill = document.getElementById("modePill");
  const overridePill = document.getElementById("overridePill");

  monthPill.textContent = `MONTH: ${appState.month}`;
  modePill.textContent = `MODE: ${appState.shimeMode ?? "--"}`;
  overridePill.classList.toggle("hidden", !appState.override);
}

function updateBinUI() {
  const bin1Btn = document.getElementById("bin1Btn");
  const bin2Btn = document.getElementById("bin2Btn");

  bin1Btn.classList.toggle("active", appState.currentBin === 1);
  bin2Btn.classList.toggle("active", appState.currentBin === 2);
}

function updateModeUI() {
  const btn25 = document.getElementById("mode25Btn");
  const btn30 = document.getElementById("mode30Btn");

  btn25.classList.toggle("active", appState.shimeMode === 25);
  btn30.classList.toggle("active", appState.shimeMode === 30);
}

function updateRangeUI() {
  const tab501 = document.getElementById("tab501");
  const tab601 = document.getElementById("tab601");
  const tab621 = document.getElementById("tab621");

  tab501.classList.toggle("active", appState.currentRange === "501-510");
  tab601.classList.toggle("active", appState.currentRange === "601-619");
  tab621.classList.toggle("active", appState.currentRange === "621-648");
}

function updateViewUI() {
  const vCards = document.getElementById("viewCards");
  const vPaper = document.getElementById("viewPaper");
  const vData = document.getElementById("viewData");

  vCards.classList.toggle("active", appState.currentView === "cards");
  vPaper.classList.toggle("active", appState.currentView === "paper");
  vData.classList.toggle("active", appState.currentView === "data");
}

function updatePlaceholder() {
  // いまはコンテンツ未実装なので「状態が反映されてる」ことだけ見せる
  const phTitle = document.querySelector(".placeholder .phTitle");
  const phText = document.querySelector(".placeholder .phText");
  if (!phTitle || !phText) return;

  phTitle.textContent = "準備OK（ナビ動作確認）";

  const lines = [
    `BIN: ${appState.currentBin}`,
    `MODE: ${appState.shimeMode ?? "--"}${appState.override ? " (OVERRIDE)" : ""}`,
    `RANGE: ${appState.currentRange}`,
    `SEARCH: ${appState.searchKeyword || "(none)"}`,
    `VIEW: ${appState.currentView}`
  ];

  phText.innerHTML = lines.map((s) => `${escapeHtml(s)}`).join("<br/>");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
