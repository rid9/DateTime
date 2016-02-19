import * as configuration from "./configuration";

const seconds = 1000;
const minutes = 60 * seconds;

let firstUpdateTimeout: any;
let updateInterval: any;

export function startSchedule(callback: Function) {
    if (configuration.shouldShowFractionalSeconds()) {
        scheduleMillisecondUpdates(callback);
    } else if (configuration.shouldShowSeconds() || configuration.shouldFlashTimeSeparators()) {
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

function scheduleMillisecondUpdates(callback: Function) {
    updateInterval = setInterval(
        callback,
        (1 / configuration.getFractionalSecondPrecision()) * seconds);
}

function scheduleSecondUpdates(callback: Function) {
    updateInterval = setInterval(callback, 1 * seconds);
}

function scheduleMinuteUpdates(callback: Function) {
    firstUpdateTimeout = setTimeout(() => {
        callback();
        updateInterval = setInterval(callback, (1 * minutes));
        firstUpdateTimeout = null;
    }, (1 * minutes) - (new Date().getSeconds() * seconds));
}
