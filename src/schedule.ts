import * as configuration from "./configuration";

const seconds = 1000;
const minutes = 60 * seconds;

let firstUpdateTimeout: any;
let updateInterval: any;

export function startSchedule(callback: (...args: any[]) => void) {
    if (configuration.shouldShowFractionalSeconds()) {
        scheduleMillisecondUpdates(callback);
    } else if (
        configuration.shouldShowSeconds() ||
        configuration.shouldFlashTimeSeparators()
    ) {
        scheduleSecondUpdates(callback);
    } else {
        scheduleMinuteUpdates(callback);
    }
}

export function stopSchedule() {
    if (firstUpdateTimeout) {
        clearTimeout(firstUpdateTimeout);
        firstUpdateTimeout = null;
    }

    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

function scheduleMillisecondUpdates(callback: (...args: any[]) => void) {
    updateInterval = setInterval(
        callback,
        (1 / configuration.getFractionalPrecision()) * seconds
    );
}

function scheduleSecondUpdates(callback: (...args: any[]) => void) {
    updateInterval = setInterval(callback, 1 * seconds);
}

function scheduleMinuteUpdates(callback: (...args: any[]) => void) {
    firstUpdateTimeout = setTimeout(() => {
        callback();
        updateInterval = setInterval(callback, 1 * minutes);
        firstUpdateTimeout = null;
    }, 1 * minutes - new Date().getSeconds() * seconds);
}
