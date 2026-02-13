const START_DATE = "2022-05-01";

// password = DDMMYYYY จาก START_DATE
function startDateToPass(dateStr){
  const [yyyy, mm, dd] = dateStr.split("-");
  return dd + mm + yyyy;
}
const CORRECT_PASS = startDateToPass(START_DATE);

let typed = "";

// เปลี่ยนหน้า + เปลี่ยนพื้นหลัง
function showScreen(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  document.body.dataset.screen = id;
}

/* เพลง autoplay (muted ก่อน) แล้วดังเมื่อแตะครั้งแรก */
const bgm = document.getElementById("bgm");

window.addEventListener("load", async () => {
  try{
    bgm.volume = 0.35;
    await bgm.play();
  }catch(e){}
});

function enableSoundOnce(){
  bgm.muted = false;
  bgm.volume = 0.35;
  bgm.play().catch(()=>{});
  window.removeEventListener("pointerdown", enableSoundOnce);
  window.removeEventListener("keydown", enableSoundOnce);
}
window.addEventListener("pointerdown", enableSoundOnce);
window.addEventListener("keydown", enableSoundOnce);

// ===== Page 1 keypad =====
const keypad = document.getElementById("keypad");
const passDots = document.getElementById("passDots");
const passMsg = document.getElementById("passMsg");

function updateDots(){
  let display = typed.padEnd(8, "_");
  display = display.slice(0,2) + "/" + display.slice(2,4) + "/" + display.slice(4,8);
  passDots.textContent = display;
}

function addDigit(d){
  if (typed.length < 8){
    typed += d;
    updateDots();
  }
}

// ปุ่ม 1-9
for (let n=1; n<=9; n++){
  const btn = document.createElement("button");
  btn.textContent = n;
  btn.addEventListener("click", () => addDigit(String(n)));
  keypad.appendChild(btn);
}
// ปุ่ม 0
const btn0 = document.createElement("button");
btn0.textContent = "0";
btn0.style.gridColumn = "2";
btn0.addEventListener("click", () => addDigit("0"));
keypad.appendChild(btn0);

// Clear
document.getElementById("clearBtn").addEventListener("click", () => {
  typed = "";
  passMsg.textContent = "";
  updateDots();
});

// Enter
document.getElementById("enterBtn").addEventListener("click", () => {
  if (typed === CORRECT_PASS){
    passMsg.textContent = "";
    showScreen("screen-counter");
    startCounter();
  } else {
    passMsg.textContent = "ทำไมจำไม่ได้ โกดดดๆๆๆ";
    typed = "";
    updateDots();
  }
});

updateDots();

// ===== Page 2 counter =====
let timeId = null;

function startCounter(){
  if (timeId) return;

  const start = new Date(START_DATE + "T00:00:00");

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minsEl = document.getElementById("mins");
  const secsEl = document.getElementById("secs");

  function tick(){
    const now = new Date();
    const diff = Math.max(0, now - start);
    const totalSec = Math.floor(diff/1000);

    const days = Math.floor(totalSec/86400);
    const hours = Math.floor((totalSec%86400)/3600);
    const mins = Math.floor((totalSec%3600)/60);
    const secs = totalSec%60;

    daysEl.textContent = days;
    hoursEl.textContent = String(hours).padStart(2,"0");
    minsEl.textContent = String(mins).padStart(2,"0");
    secsEl.textContent = String(secs).padStart(2,"0");
  }

  tick();
  timeId = setInterval(tick, 1000);
}

// ไปหน้า 3
document.getElementById("toMessageBtn").addEventListener("click", () => {
  showScreen("screen-message");
});

// ไปหน้า 4
document.getElementById("toQuestionBtn").addEventListener("click", () => {
  showScreen("screen-question");
});

// ===== Page 4 =====
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const result = document.getElementById("result");

noBtn.addEventListener("mouseenter", () => {
  const x = Math.floor(Math.random()*200) - 100;
  const y = Math.floor(Math.random()*120) - 60;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

yesBtn.addEventListener("click", () => {
  result.textContent = "💘 Happy Valentine’s Day!";
});


yesBtn.addEventListener("click", () => {
  result.textContent = "💘 Happy Valentine’s Day!";
  result.classList.add("show");

  // ให้หายไปเองใน 2.5 วิ (ถ้าไม่อยากให้หาย ลบ setTimeout ออก)
  setTimeout(() => result.classList.remove("show"), 2500);
});
