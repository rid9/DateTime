import * as moment from "moment";
import * as vscode from "vscode";
import * as configuration from "./configuration";
import { FlashState } from "./configuration";
import { startSchedule, stopSchedule } from "./schedule";

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

    moment.locale(configuration.getLocale());
    return moment().format(format);
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
