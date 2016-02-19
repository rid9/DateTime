/// <reference path="../typings/vscode-typings.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

import * as moment from "moment";

import { window, commands, workspace, ExtensionContext, StatusBarItem, StatusBarAlignment } from "vscode";

import * as configuration from "./configuration";
import { FlashState } from "./configuration";
import { startSchedule, stopSchedule } from "./schedule";

let statusBarItem: StatusBarItem;

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

function getDateTimeText(flashState: FlashState): string {
    return moment().format(configuration.getFormat(flashState));
}

let currentFlashState: FlashState;
function updateDateTime() {
    if (configuration.hasFormat()) {
        let flashState: FlashState;

        if (configuration.shouldFlashTimeSeparators()) {
            flashState = currentFlashState = currentFlashState === FlashState.On
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

        statusBarItem.text = getDateTimeText(flashState);

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
    statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
    isStatusBarVisible = true;
}

function removeStatusBarItem() {
    if (statusBarItem) {
        statusBarItem.hide();
        statusBarItem.dispose();
        statusBarItem = null;
    }
    isStatusBarVisible = false;
}

export function activate(context: ExtensionContext) {
    let showDateTimeCommand = commands.registerCommand("dateTime.show", showDateTime);
    let hideDateTimeCommand = commands.registerCommand("dateTime.hide", removeDateTime);

    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(showDateTimeCommand);
    context.subscriptions.push(hideDateTimeCommand);

    configuration.preCache();

    if (configuration.shouldShowOnStartup()) {
        commands.executeCommand("dateTime.show");
    }
}

export function deactivate() {
    removeDateTime();
}

workspace.onDidChangeConfiguration(() => {
    if (isRunning) {
        configuration.clearCache();
        updateDateTime();
        configuration.preCache();
        stopSchedule();
        scheduleUpdates();
    }
});