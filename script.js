
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const setBtn = document.getElementById('setBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const flipCard = document.getElementById('flipCard');
const flipInner = document.getElementById('flipInner');
const flipToggle = document.getElementById('flipToggle');
const statusText = document.getElementById('statusText');
const progressCircle = document.getElementById('progressCircle');
const elapsedDisplay = document.getElementById('elapsedDisplay');
const percentDisplay = document.getElementById('percentDisplay');
const endTimeDisplay = document.getElementById('endTimeDisplay');
const timeDisplay = document.getElementById('timeDisplay');

let duration = 0;
let remaining = 0;
let running = false;
let paused = false;
let timerId = null;
let endTimestamp = null;

const CIRC = 2 * Math.PI * 52; 

function formatHMS(sec) {
    sec = Math.max(0, sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return (
        (h < 10 ? '0' : '') + h + ':' +
        (m < 10 ? '0' : '') + m + ':' +
        (s < 10 ? '0' : '') + s
    );
}

function updateUI() {
    // Update main time display
    timeDisplay.textContent = formatHMS(remaining);
    // Update elapsed
    const elapsed = duration - remaining;
    elapsedDisplay.textContent = formatHMS(elapsed);
    // Update percent
    const percent = duration > 0 ? Math.round((elapsed / duration) * 100) : 0;
    percentDisplay.textContent = percent + '%';
    // Update progress ring
    const offset = CIRC * (1 - (elapsed / (duration || 1)));
    progressCircle.style.strokeDashoffset = offset;
    // Update end time
    if (endTimestamp && remaining > 0) {
        const dt = new Date(endTimestamp);
        endTimeDisplay.textContent = dt.toLocaleTimeString();
    } else if (remaining <= 0) {
        endTimeDisplay.textContent = '-';
    } else {
        endTimeDisplay.textContent = '-';
    }
}

function tick() {
    if (!running) return;
    const now = Date.now();
    remaining = Math.max(0, Math.round((endTimestamp - now) / 1000));
    updateUI();
    if (remaining <= 0) {
        clearInterval(timerId);
        timerId = null;
        running = false;
        statusText.textContent = 'Finished!';
        document.title = '🛑 Study session complete';
    } else {
        document.title = formatHMS(remaining) + ' — Study timer';
    }
}

function startTimer() {
    if (duration <= 0) return;
    if (!running) {
        const now = Date.now();
        endTimestamp = now + remaining * 1000;
        running = true;
        paused = false;
        statusText.textContent = 'Running';
        timerId = setInterval(tick, 250);
        tick();
    }
}

function pauseTimer() {
    if (running) {
        clearInterval(timerId);
        timerId = null;
        running = false;
        paused = true;
        statusText.textContent = 'Paused';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    running = false;
    paused = false;
    remaining = duration;
    endTimestamp = null;
    statusText.textContent = 'Ready';
    document.title = 'Study timer';
    updateUI();
}

setBtn.addEventListener('click', () => {
    const h = parseInt(hoursEl.value) || 0;
    const m = parseInt(minutesEl.value) || 0;
    duration = h * 3600 + m * 60;
    if (duration <= 0) {
        alert('Please set a duration > 0');
        return;
    }
    remaining = duration;
    startTimer();
});

pauseBtn.addEventListener('click', () => {
    if (running) pauseTimer();
    else if (paused) startTimer();
    pauseBtn.textContent = running ? 'Pause' : 'Resume';
});

resetBtn.addEventListener('click', () => {
    resetTimer();
});

flipCard.addEventListener('click', () => {
    flipInner.classList.toggle('is-flipped');
    flipToggle.checked = flipInner.classList.contains('is-flipped');
});

flipToggle.addEventListener('change', () => {
    flipInner.classList.toggle('is-flipped', flipToggle.checked);
});

(function () {
    duration = (parseInt(hoursEl.value) || 0) * 3600 + (parseInt(minutesEl.value) || 0) * 60;
    remaining = duration;
    updateUI();
})();

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateUI();
});