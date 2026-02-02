// ✅ 自由日：2026/07/12 00:00（台北時間 +08:00）
const DEFAULT_TARGET_ISO = "2026-07-12T00:00:00+08:00";
const STORAGE_KEY = "freedom_day_target_iso";

const els = {
  d: document.getElementById("d"),
  h: document.getElementById("h"),
  m: document.getElementById("m"),
  s: document.getElementById("s"),
  status: document.getElementById("status"),
  hint: document.getElementById("targetHint"),
  setBtn: document.getElementById("setBtn"),
  resetBtn: document.getElementById("resetBtn"),
};

function pad2(n){ return String(n).padStart(2, "0"); }

function getTargetISO(){
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_TARGET_ISO;
}

function setTargetISO(iso){
  localStorage.setItem(STORAGE_KEY, iso);
}

function formatTarget(iso){
  const dt = new Date(iso);
  return dt.toLocaleString("zh-Hant", {
    year:"numeric", month:"2-digit", day:"2-digit",
    hour:"2-digit", minute:"2-digit"
  });
}

function update(){
  const now = new Date();
  const targetISO = getTargetISO();
  const target = new Date(targetISO);

  els.hint.textContent = `目標：${formatTarget(targetISO)}`;

  const diff = target - now;

  if (Number.isNaN(target.getTime())) {
    els.status.textContent = "⚠️ 日期格式錯誤，請重新設定。";
    return;
  }

  if (diff <= 0) {
    els.d.textContent = "00";
    els.h.textContent = "00";
    els.m.textContent = "00";
    els.s.textContent = "00";
    els.status.textContent = "🎉 自由日到了！";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  els.d.textContent = pad2(days);
  els.h.textContent = pad2(hours);
  els.m.textContent = pad2(minutes);
  els.s.textContent = pad2(seconds);

  els.status.textContent = `系統時間：${now.toLocaleTimeString("zh-Hant")}｜運作中`;
}

els.setBtn.addEventListener("click", () => {
  const current = getTargetISO();
  const dt = new Date(current);
  const defaultInput =
    `${dt.getFullYear()}-${pad2(dt.getMonth()+1)}-${pad2(dt.getDate())} ${pad2(dt.getHours())}:${pad2(dt.getMinutes())}`;

  const input = prompt("輸入自由日（台北時間）\n格式：YYYY-MM-DD HH:mm", defaultInput);
  if (!input) return;

  const cleaned = input.trim().replace(" ", "T") + ":00+08:00";
  const test = new Date(cleaned);

  if (Number.isNaN(test.getTime())) {
    alert("格式錯誤，請用 YYYY-MM-DD HH:mm");
    return;
  }
  setTargetISO(cleaned);
  update();
});

els.resetBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  update();
});

update();
setInterval(update, 1000);

// 讓它可離線、也更像 App（快取資源）
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
