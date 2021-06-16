import * as moment from "moment";
import * as vscode from "vscode";

import { window, commands, workspace, ExtensionContext, StatusBarItem, StatusBarAlignment, Uri } from 'vscode';

import * as configuration from "./configuration";
import { FlashState } from "./configuration";
import { startSchedule, stopSchedule } from "./schedule";

enum FormatType {
    Status,
    Clipboard,
}

let statusBarItem: StatusBarItem | null;

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
    const path = require('path'); // issue#1 https://github.com/mameen/vscal2/issues/1
    let p = path.dirname(process.execPath);
    fs.writeFile(`${p}/calendar.md`, data, (err: any) => {
        if (err) {throw err;}
    });
    let calendar = Uri.file(`${p}/calendar.md`);

    window.showTextDocument(calendar);
}

function copyDateTime() {
    vscode.env.clipboard.writeText(
        getDateTimeText(FlashState.On, FormatType.Clipboard)
    );
}

function getDateTimeText(flashState: FlashState,
    formatType: FormatType): string {
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
    // I prefer to open the calendar with a command
    // statusBarItem.command = 'extension.calendar';
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
    let showCalendarCommand = commands.registerCommand('extension.calendar', () => {
		const cp = require('child_process');
		cp.exec('MON=$(date +%-m); DAY=$(date +%-d); cd /tmp; cal -h -m $(expr $MON - 1) > .vscal-1.txt; cal -h -m $(expr $MON + 1) > .vscal-3.txt; (cal -h -m $MON | sed "s/ $DAY /\[$DAY\]/") > .vscal-2.md; paste .vscal-1.txt .vscal-2.md .vscal-3.txt > .vscal.md ; rm -f .vscal-[123]*', 2000);
		let calendar = Uri.file('/tmp/.vscal.md');
		window.showTextDocument(calendar);
	});
    let copyDateTimeCommand = commands.registerCommand("dateTime.copy", copyDateTime);

    context.subscriptions.push(showDateTimeCommand);
    context.subscriptions.push(hideDateTimeCommand);
    context.subscriptions.push(showCalendarCommand);
    context.subscriptions.push(copyDateTimeCommand);

    updateDateTime();

    if (!statusBarItem) {
        return;
    }

    context.subscriptions.push(statusBarItem);

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
