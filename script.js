function showTab(id, btn) {
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    btn.classList.add("active");
}

let clockInterval;
let is24Hour = false;

function updateClock() {
    let now = new Date();
    let h = now.getHours();
    let ampm = h >= 12 ? "PM" : "AM";

    if (!is24Hour) h = h % 12 || 12;

    document.getElementById("time").innerText =
        `${String(h).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;

    document.getElementById("ampm").innerText = is24Hour ? "24 HOUR FORMAT" : ampm;

    document.getElementById("date").innerText =
        now.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

function startClock() {
    if (!clockInterval) {
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
    }
}

function stopClock() {
    clearInterval(clockInterval);
    clockInterval = null;
}

function toggleFormat() {
    is24Hour = !is24Hour;
    updateClock();
}

function toggleTheme() {
    document.body.classList.toggle("light");
}

let swInterval;
let swStart = 0;
let swElapsed = 0;

function updateStopwatch() {
    let t = swElapsed + performance.now() - swStart;
    let h = Math.floor(t / 3600000);
    let m = Math.floor(t / 60000) % 60;
    let s = Math.floor(t / 1000) % 60;
    let ms = Math.floor(t / 10) % 100;

    document.getElementById("stopwatchDisplay").innerText =
        `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

    document.getElementById("milliseconds").innerText =
        String(ms).padStart(2,"0");
}

function startStopwatch() {
    if (!swInterval) {
        swStart = performance.now();
        swInterval = setInterval(updateStopwatch, 10);
    }
}

function pauseStopwatch() {
    if (swInterval) {
        swElapsed += performance.now() - swStart;
        clearInterval(swInterval);
        swInterval = null;
        updateStopwatch();
    }
}

function resetStopwatch() {
    clearInterval(swInterval);
    swInterval = null;
    swElapsed = 0;
    updateStopwatch();
}

let alarmInterval;
let alarmSound;
let alarmAudio;

function playAlarmSound() {
    try {
        alarmAudio = new (window.AudioContext || window.webkitAudioContext)();
        let oscillator = alarmAudio.createOscillator();
        let gain = alarmAudio.createGain();

        oscillator.connect(gain);
        gain.connect(alarmAudio.destination);
        oscillator.frequency.value = 800;
        gain.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(alarmAudio.currentTime + 0.5);

        oscillator.onended = () => alarmAudio.close();
    } catch (e) {}
}

function setAlarm() {
    let value = document.getElementById("alarmTime").value;

    if (!value) {
        alert("Select alarm time!");
        return;
    }

    cancelAlarm();

    document.getElementById("alarmStatus").innerText = "Alarm set for " + value;

    alarmInterval = setInterval(() => {
        let now = new Date();
        let current = String(now.getHours()).padStart(2,"0") + ":" +
            String(now.getMinutes()).padStart(2,"0");

        if (current === value && now.getSeconds() === 0) {
            cancelAlarm();
            document.getElementById("alarmStatus").innerText = "Alarm Ringing!";
            playAlarmSound();
            alarmSound = setInterval(playAlarmSound, 1000);
        }
    }, 500);
}

function cancelAlarm() {
    clearInterval(alarmInterval);
    alarmInterval = null;
    dismissAlarm();
    document.getElementById("alarmStatus").innerText = "No alarm set";
}

function dismissAlarm() {
    clearInterval(alarmSound);
    alarmSound = null;
}

let timerInterval;
let timerRemaining = 0;
let timerEnd = 0;

function timerDisplay() {
    let t = Math.ceil(timerRemaining / 1000);
    let h = Math.floor(t / 3600);
    let m = Math.floor(t / 60) % 60;
    let s = t % 60;

    document.getElementById("timerDisplay").innerText =
        `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function startTimer() {
    if (timerInterval) return;

    if (timerRemaining <= 0) {
        let h = Number(document.getElementById("hours").value || 0);
        let m = Number(document.getElementById("minutes").value || 0);
        let s = Number(document.getElementById("seconds").value || 0);

        if (![h,m,s].every(Number.isInteger) || h < 0 || m < 0 || m > 59 || s < 0 || s > 59) {
            alert("Enter valid time!");
            return;
        }

        timerRemaining = (h * 3600 + m * 60 + s) * 1000;
    }

    if (timerRemaining <= 0) {
        alert("Set timer first!");
        return;
    }

    timerEnd = Date.now() + timerRemaining;

    timerInterval = setInterval(() => {
        timerRemaining = Math.max(0, timerEnd - Date.now());
        timerDisplay();

        if (timerRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Timer Finished!");
        }
    }, 100);
}

function pauseTimer() {
    if (timerInterval) {
        timerRemaining = Math.max(0, timerEnd - Date.now());
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplay();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRemaining = 0;
    timerDisplay();
}

startClock();
updateStopwatch();
timerDisplay();