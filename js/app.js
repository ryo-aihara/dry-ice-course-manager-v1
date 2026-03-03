/* js/app.js */
/* BUILD: 20260303a */

import { appState } from "./state.js";

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
    if (appState.shimeMode !== 25) {
      confirmModeChange(25);
    }
  });

  btn30.addEventListener("click", () => {
    if (appState.shimeMode !== 30) {
      confirmModeChange(30);
    }
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
   UI更新
================================= */

function updateUI() {
  updateBinUI();
  updateModeUI();

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
