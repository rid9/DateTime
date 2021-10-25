import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import timezone from "dayjs/plugin/timezone";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import * as vscode from "vscode";
import * as configuration from "./configuration";
import { FlashState } from "./configuration";
import { startSchedule, stopSchedule } from "./schedule";

dayjs.extend(weekday);
dayjs.extend(weekYear);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
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

        const result = boundOldFormat(
            formatStr || "YYYY-MM-DDTHH:mm:ssZ"
        ).replace(
            /Mo|Qo|DDDD|DDDo|DDD|do|e|E|Wo|gggg|gg|GGGG|GG|SSS|SS|S/g,
            (match) => {
                switch (match) {
                    case "Mo":
                        return ordinal(this.get("month") + 1);
                    case "Qo":
                        return ordinal(parseInt(boundOldFormat("Q"), 10));
                    case "DDD":
                        return this.dayOfYear().toString();
                    case "DDDo":
                        return ordinal(this.dayOfYear());
                    case "DDDD":
                        return this.dayOfYear().toString().padStart(3, "0");
                    case "do":
                        return ordinal(parseInt(boundOldFormat("d"), 10));
                    case "e":
                        return this.weekday().toString();
                    case "E":
                        return this.isoWeekday().toString();
                    case "Wo":
                        return ordinal(parseInt(boundOldFormat("W"), 10));
                    case "gg":
                        return this.weekYear().toString().slice(-2);
                    case "GG":
                        return this.isoWeekYear().toString().slice(-2);
                    case "SSS":
                        return this.get("millisecond").toString();
                    case "SS":
                        return Math.floor(
                            this.get("millisecond") / 10
                        ).toString();
                    case "S":
                        return Math.floor(
                            this.get("millisecond") / 100
                        ).toString();
                    default:
                        return match;
                }
            }
        );

        return boundOldFormat(result);
    };
});

enum FormatType {
    Status,
    Clipboard,
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
        getDateTimeText(FlashState.On, FormatType.Clipboard)
    );
}

function getDateTimeText(
    flashState: FlashState,
    formatType: FormatType
): string {
    let format: string | undefined;

    if (formatType === FormatType.Clipboard) {
        format =
            configuration.getCustomFormat(FlashState.On, "clipboardFormat") ||
            undefined;
    }

    if (!format) {
        format = configuration.getFormat(flashState);
    }

    dayjs.locale(configuration.getLocale());

    return (
        configuration.getDisplayPrefix() +
        dayjs().format(format) +
        configuration.getDisplaySuffix()
    );
}

let currentFlashState: FlashState;
function updateDateTime() {
    if (configuration.hasFormat()) {
        let flashState: FlashState;

        if (configuration.shouldFlashTimeSeparators()) {
            flashState = currentFlashState =
                currentFlashState === FlashState.On
                    ? FlashState.Off
                    : FlashState.On;
        } else {
            flashState = FlashState.On;
        }

        let shouldShow = false;
        if (!isStatusBarVisible) {
            createStatusBarItem();
            shouldShow = true;
        }

        if (!statusBarItem) {
            return;
        }

        statusBarItem.text = getDateTimeText(flashState, FormatType.Status);

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
