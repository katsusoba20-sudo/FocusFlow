let timerInterval = null;
let remainingTime = 0;
let isRunning = false;

self.onmessage = function (e) {
    const { action, payload } = e.data;

    switch (action) {
        case 'START':
            if (!isRunning) {
                remainingTime = payload.time;
                isRunning = true;
                timerInterval = setInterval(() => {
                    remainingTime--;
                    self.postMessage({ action: 'TICK', time: remainingTime });

                    if (remainingTime <= 0) {
                        clearInterval(timerInterval);
                        isRunning = false;
                        self.postMessage({ action: 'COMPLETE' });
                    }
                }, 1000);
            }
            break;

        case 'PAUSE':
            clearInterval(timerInterval);
            isRunning = false;
            break;

        case 'RESUME':
            if (!isRunning && remainingTime > 0) {
                isRunning = true;
                timerInterval = setInterval(() => {
                    remainingTime--;
                    self.postMessage({ action: 'TICK', time: remainingTime });

                    if (remainingTime <= 0) {
                        clearInterval(timerInterval);
                        isRunning = false;
                        self.postMessage({ action: 'COMPLETE' });
                    }
                }, 1000);
            }
            break;

        case 'STOP':
        case 'RESET':
            clearInterval(timerInterval);
            isRunning = false;
            remainingTime = payload ? payload.time : 0;
            self.postMessage({ action: 'TICK', time: remainingTime }); // Update UI immediately
            break;
    }
};
