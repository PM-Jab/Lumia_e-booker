let timerId: any;
let elapsedTime = 0;
let isRunning = false;

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerId = setInterval(() => {
      elapsedTime += 10; // ms
      //   console.log(elapsedTime);
    }, 10);
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

export { startTimer, stopTimer, resetTimer, getElapsedTime };
