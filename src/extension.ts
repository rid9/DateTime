/// <reference path="../typings/vscode-typings.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

import * as moment from "moment";

import { window, commands, workspace, ExtensionContext, StatusBarItem, StatusBarAlignment, Uri } from 'vscode';

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

function showMonthlyCalendar() {
    // extension settings
    let numMonthsToShowBefore = configuration.howManyMonthsBefore();
    let numMonthsToShowAfter = configuration.howManyMonthsAfter();
    let numMonthsPerRow = configuration.howManyMonthsPerRow();
    let extraHorizontalSpace = configuration.howMuchHorizontalPadding();
    let extraVerticalSpace = configuration.howMuchVerticalPadding();
    let weekStartsOn = configuration.weekStartsOn();

    const c = require('./cal');
    let data : string = c.createFile(numMonthsToShowBefore, numMonthsToShowAfter, numMonthsPerRow, extraHorizontalSpace, extraVerticalSpace, weekStartsOn);
    const fs = require('fs');
    const path = require('path');
    let p = path.dirname(process.execPath);
    fs.writeFile(`${p}/calendar.md`, data, (err: any) => {
        if (err) {throw err;}
    });
    let calendar = Uri.file(`${p}/calendar.md`);

    window.showTextDocument(calendar);
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
    statusBarItem.command = 'extension.calendar';
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
    let showCalendarCommand = commands.registerCommand('extension.calendar', showMonthlyCalendar);

    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(showDateTimeCommand);
    context.subscriptions.push(hideDateTimeCommand);
    context.subscriptions.push(showCalendarCommand);

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