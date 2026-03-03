/* js/app.js */
/* BUILD: 20260303a */
/* Phase 1: 基本状態管理 + 月チェック + 便トグル + 期トグル */

const BUILD_ID = "20260303a";

/* ===============================
   初期状態
================================= */

const state = {
  currentBin: 1,         // 1便 or 2便
  month: null,           // YYYY-MM
  shimeMode: null,       // 25 or 30
  override: false        // OVERRIDE表示用
};

/* ===============================
   初期化
================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMonth();
  initBinToggle();
  initModeToggle();
  updateUI();
});

/* ===============================
   月チェック（毎月1日基準）
================================= */

function initMonth() {
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);

  const savedMonth = localStorage.getItem("savedMonth");
  const savedMode = localStorage.getItem("shimeMode");

  state.month = currentMonth;

  if (savedMonth !== currentMonth) {
    // 月が変わった
    localStorage.setItem("savedMonth", currentMonth);
    state.shimeMode = null;
    showMonthSelection();
  } else {
    state.shimeMode = savedMode ? Number(savedMode) : null;
  }
}

/* ===============================
   月初期選択
================================= */

function showMonthSelection() {
  const choice = confirm("新しい月です。\n25期ならOK、30期ならキャンセルを押してください。");

  if (choice) {
    setMode(25, false);
  } else {
    setMode(30, false);
  }
}

/* ===============================
   便トグル
================================= */

function initBinToggle() {
  const bin1Btn = document.getElementById("bin1Btn");
  const bin2Btn = document.getElementById("bin2Btn");

  bin1Btn.addEventListener("click", () => {
    state.currentBin = 1;
    updateBinUI();
  });

  bin2Btn.addEventListener("click", () => {
    state.currentBin = 2;
    updateBinUI();
  });
}

function updateBinUI() {
  const bin1Btn = document.getElementById("bin1Btn");
  const bin2Btn = document.getElementById("bin2Btn");

  bin1Btn.classList.toggle("active", state.currentBin === 1);
  bin2Btn.classList.toggle("active", state.currentBin === 2);
}

/* ===============================
   期トグル（25/30）
================================= */

function initModeToggle() {
  const btn25 = document.getElementById("mode25Btn");
  const btn30 = document.getElementById("mode30Btn");

  btn25.addEventListener("click", () => {
    if (state.shimeMode !== 25) {
      confirmModeChange(25);
    }
  });

  btn30.addEventListener("click", () => {
    if (state.shimeMode !== 30) {
      confirmModeChange(30);
    }
  });
}

function confirmModeChange(newMode) {
  const ok = confirm(`期を ${newMode} に変更します。\n再計算が行われます。よろしいですか？`);
  if (!ok) return;

  setMode(newMode, true);
}

function setMode(mode, isOverride) {
  state.shimeMode = mode;
  state.override = isOverride;

  localStorage.setItem("shimeMode", mode);

  updateUI();
}

function updateModeUI() {
  const btn25 = document.getElementById("mode25Btn");
  const btn30 = document.getElementById("mode30Btn");

  btn25.classList.toggle("active", state.shimeMode === 25);
  btn30.classList.toggle("active", state.shimeMode === 30);
}

/* ===============================
   UI更新
================================= */

function updateUI() {
  updateBinUI();
  updateModeUI();

  const monthPill = document.getElementById("monthPill");
  const modePill = document.getElementById("modePill");
  const overridePill = document.getElementById("overridePill");

  monthPill.textContent = `MONTH: ${state.month}`;
  modePill.textContent = `MODE: ${state.shimeMode ?? "--"}`;

  if (state.override) {
    overridePill.classList.remove("hidden");
  } else {
    overridePill.classList.add("hidden");
  }
}
