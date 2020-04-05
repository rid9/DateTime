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
    const cp = require('child_process');
    let cf = '.vscal.md';
    cp.execSync('MON=$(date +%-m); DAY=$(date +%-d); cd /tmp; cal -h -m $(expr $MON - 1) > .vscal-1.txt; cal -h -m $(expr $MON + 1) > .vscal-3.txt; (cal -h -m $MON | sed "s/ $DAY /\[$DAY\]/") > .vscal-2.md; paste -d \\\\0 .vscal-1.txt .vscal-2.md .vscal-3.txt > '+cf+'; rm -f .vscal-*');
    let months = configuration.howManyMonthsCalendar();
    if (3 < months) {
        cp.execSync('MON=$(date +%-m); cd /tmp; echo "" > .vscal-n.txt; cal -m $(expr $MON + 2) -A '+String(months-4)+' > .vscal-2.txt; cat '+cf+' .vscal-n.txt .vscal-2.txt > .vscal2.md; rm -f .vscal-*');
        cf = '.vscal2.md';
    }
    let calendar = Uri.file('/tmp/'+cf);
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