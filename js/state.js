/* js/state.js */
/* BUILD: 20260303a */
/* 中央状態管理（壊れない構造の核） */

export const appState = {
  /* ===== 基本状態 ===== */
  currentBin: 1,              // 1便 or 2便
  month: null,                // YYYY-MM
  shimeMode: null,            // 25 or 30
  override: false,            // 手動変更フラグ

  /* ===== コースデータ ===== */
  courses: [],                // CSV取り込み後に格納

  /* ===== UI状態 ===== */
  currentRange: "501-510",    // 範囲タブ
  searchKeyword: "",          // 検索
  currentView: "cards"        // cards / paper / data
};
