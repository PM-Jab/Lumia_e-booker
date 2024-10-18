let timerId: any;
let elapsedTime = 0;
let isRunning = false;

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    console.log("Timer started");
    timerId = setInterval(() => {
      elapsedTime += 50; // ms
      //   console.log(elapsedTime);
    }, 50);
  }
}

function forceSetElapsedTime(sec: number) {
  if (isRunning) {
    elapsedTime = sec * 1000;
  }
}

function stopTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerId);
  }
}

function resetTimer() {
  stopTimer();
  elapsedTime = 0;
  console.log("Timer reset to 0");
}

function getElapsedTime() {
  return elapsedTime;
}

export {
  startTimer,
  stopTimer,
  resetTimer,
  getElapsedTime,
  forceSetElapsedTime,
};
