import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import * as vscode from "vscode";
import * as configuration from "./configuration";
import { FlashState } from "./configuration";
import { startSchedule, stopSchedule } from "./schedule";

const reEscape = /(\[.+?\])/;
const reFormat = /Mo|Qo|DDDD|DDDo?|do|eo?|Eo?|Wo|gggg|gg|GGGG|GG|SSS|SS|S/g;

function formatReplace(
    formatStr: string,
    ordinal: (number: number) => string,
    dayjs: dayjs.Dayjs,
    boundOldFormat: (template?: string | undefined) => string
): string {
    return formatStr.replace(reFormat, (match) => {
        switch (match) {
            case "Mo":
                return ordinal(dayjs.get("month") + 1);
            case "Qo":
                return ordinal(parseInt(boundOldFormat("Q"), 10));
            case "DDD":
                return dayjs.dayOfYear().toString();
            case "DDDo":
                return ordinal(dayjs.dayOfYear());
            case "DDDD":
                return dayjs.dayOfYear().toString().padStart(3, "0");
            case "do":
                return ordinal(parseInt(boundOldFormat("d"), 10));
            case "e":
                return dayjs.weekday().toString();
            case "eo":
                return ordinal(dayjs.weekday());
            case "E":
                return dayjs.isoWeekday().toString();
            case "Eo":
                return ordinal(dayjs.isoWeekday());
            case "Wo":
                return ordinal(parseInt(boundOldFormat("W"), 10));
            case "gg":
                return dayjs.weekYear().toString().slice(-2);
            case "GG":
                return dayjs.isoWeekYear().toString().slice(-2);
            case "SSS":
                return dayjs.get("millisecond").toString().padStart(3, "0");
            case "SS":
                return Math.floor(dayjs.get("millisecond") / 10)
                    .toString()
                    .padStart(2, "0");
            case "S":
                return Math.floor(dayjs.get("millisecond") / 100).toString();
            default:
                return match;
        }
    });
}

dayjs.extend(weekday);
dayjs.extend(weekYear);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(dayOfYear);
dayjs.extend(advancedFormat);
dayjs.extend((_option, dayjsClass) => {
    const oldFormat = dayjsClass.prototype.format;

    dayjsClass.prototype.format = function (
        this: Dayjs,
        formatStr: string
    ): string {
        const ordinal = (this as any).$locale().ordinal as (
            number: number
        ) => string;

        const boundOldFormat = oldFormat.bind(this);

        if (!this.isValid()) {
            return boundOldFormat(formatStr);
        }

        let result = "";

        const split = formatStr.split(reEscape);
        for (let i = 0, len = split.length; i < len; i += 2) {
            result +=
                formatReplace(split[i], ordinal, this, boundOldFormat) +
                (split[i + 1] || "");
        }

        return boundOldFormat(result);
    };
});

enum FormatType {
    status,
    clipboard,
}

let statusBarItem: vscode.StatusBarItem | undefined;

let isRunning = false;
let isStatusBarVisible = false;

function scheduleUpdates() {
    startSchedule(updateDateTime);
}

function showDateTime() {
    if (isRunning) {
        return;
    }

    isRunning = true;
    updateDateTime();
    scheduleUpdates();
}

function removeDateTime() {
    stopSchedule();
    removeStatusBarItem();
    isRunning = false;
}

function copyDateTime() {
    vscode.env.clipboard.writeText(
        getDateTimeText(FlashState.on, FormatType.clipboard)
    );
}

function getDateTimeText(
    flashState: FlashState,
    formatType: FormatType
): string {
    let format: string | undefined;

    if (formatType === FormatType.clipboard) {
        format =
            configuration.getCustomFormat(FlashState.on, "clipboardFormat") ||
            undefined;
    }

    if (!format) {
        format = configuration.getFormat(flashState);
    }

    let time;

    const timeZone = configuration.getTimeZone();
    if (typeof timeZone === "string") {
        time = dayjs()
            .locale(configuration.getLocale())
            .tz(timeZone)
            .format(format);
    } else {
        time = dayjs()
            .locale(configuration.getLocale())
            .format(format);
    }

    return (
        configuration.getDisplayPrefix() +
        time +
        configuration.getDisplaySuffix()
    );
}

let currentFlashState: FlashState;
function updateDateTime() {
    if (configuration.hasFormat()) {
        let flashState: FlashState;

        if (configuration.shouldFlashTimeSeparators()) {
            flashState = currentFlashState =
                currentFlashState === FlashState.on
                    ? FlashState.off
                    : FlashState.on;
        } else {
            flashState = FlashState.on;
        }

        let shouldShow = false;
        if (!isStatusBarVisible) {
            createStatusBarItem();
            shouldShow = true;
        }

        if (!statusBarItem) {
            return;
        }

        statusBarItem.text = getDateTimeText(flashState, FormatType.status);

        if (shouldShow) {
            statusBarItem.show();
        }
    } else {
        if (isStatusBarVisible) {
            removeStatusBarItem();
        }
    }
}

function createStatusBarItem() {
    statusBarItem = vscode.window.createStatusBarItem(
        configuration.getStatusBarAlignment(),
        configuration.getStatusBarPriority()
    );
    statusBarItem.command = "dateTime.copy";
    isStatusBarVisible = true;
}

function removeStatusBarItem() {
    if (statusBarItem) {
        statusBarItem.hide();
        statusBarItem.dispose();
        statusBarItem = undefined;
    }
    isStatusBarVisible = false;
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("dateTime.show", showDateTime)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("dateTime.hide", removeDateTime)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand("dateTime.copy", copyDateTime)
    );

    updateDateTime();

    if (!statusBarItem) {
        return;
    }

    context.subscriptions.push(statusBarItem);

    configuration.preCache();

    if (configuration.shouldShowOnStartup()) {
        vscode.commands.executeCommand("dateTime.show");
    }
}

export function deactivate() {
    removeDateTime();
}

vscode.workspace.onDidChangeConfiguration(() => {
    if (isRunning) {
        removeStatusBarItem();
        configuration.clearCache();
        updateDateTime();
        configuration.preCache();
        stopSchedule();
        scheduleUpdates();
    }
});
