import * as configuration from "./configuration";

const seconds = 1000;
const minutes = 60 * seconds;

let firstUpdateTimeout: any;
let updateInterval: any;

export function startSchedule(callback: () => void) {
    const format = configuration.getFormat(configuration.FlashState.On);

    if (
        configuration.shouldShowFractionalSeconds() ||
        format.indexOf("x") > -1
    ) {
        scheduleMillisecondUpdates(callback);
    } else if (
        configuration.shouldShowSeconds() ||
        configuration.shouldFlashTimeSeparators() ||
        format.indexOf("X") > -1
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

function scheduleMillisecondUpdates(callback: () => void) {
    updateInterval = setInterval(
        callback,
        (1 / configuration.getFractionalPrecision()) * seconds
    );
}

function scheduleSecondUpdates(callback: () => void) {
    updateInterval = setInterval(callback, 1 * seconds);
}

function scheduleMinuteUpdates(callback: () => void) {
    firstUpdateTimeout = setTimeout(() => {
        callback();
        updateInterval = setInterval(callback, 1 * minutes);
        firstUpdateTimeout = null;
    }, 1 * minutes - new Date().getSeconds() * seconds);
}
