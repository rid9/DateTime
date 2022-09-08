import { env, StatusBarAlignment, workspace } from "vscode";

export enum FlashState {
    on = 1,
    off = 2,
}

let cache: {
    format: {
        [FlashState.on]: string | null;
        [FlashState.off]: string | null;
    };
    configuration: {
        [key: string]: any;
    };
} = getDefaultCache();

function getDefaultCache() {
    return {
        format: {
            [FlashState.on]: null,
            [FlashState.off]: null,
        },
        configuration: {},
    };
}

export function preCache() {
    if (!cache.format[FlashState.on]) {
        getFormat(FlashState.on);
    }

    if (!cache.format[FlashState.off] && shouldFlashTimeSeparators()) {
        getFormat(FlashState.off);
    }
}

export function clearCache() {
    cache = getDefaultCache();
}

function getConfiguration(property: string) {
    if (!cache.configuration.hasOwnProperty(property)) {
        cache.configuration[property] =
            workspace.getConfiguration("dateTime")[property];
    }
    return cache.configuration[property];
}

export function shouldShowOnStartup(): boolean {
    return getConfiguration("showOnStartup");
}

export function getCustomFormat(
    flashState: FlashState,
    property = "customFormat"
): string | null {
    const format = getConfiguration(property);

    if (!format) {
        return null;
    }

    if (flashState === FlashState.on) {
        return format;
    } else {
        const reSeparator = getFormatTimeSeparatorRegExp();
        return format.replace(reSeparator, "$1" + getTimeSeparatorOff());
    }
}

export function hasCustomFormat(): boolean {
    return getCustomFormat(FlashState.on) !== null;
}

export function getLocale(): string {
    return getConfiguration("locale") || env.language;
}

export function getTimeZone(): string|null {
    return getConfiguration("timeZone") || null;
}

const timeCharacters = "HhmSs";
function getFormatTimeSeparatorRegExp(): RegExp {
    const separator = escapeRegExp(getTimeSeparator());
    return new RegExp(
        `([${timeCharacters}]+[^${timeCharacters}${separator}]*)${separator}`,
        "g"
    );
}

export function shouldShowHours(): boolean {
    return getConfiguration("showHours");
}

export function shouldShowMinutes(): boolean {
    return getConfiguration("showMinutes");
}

export function shouldShowSeconds(): boolean {
    const customFormat = getCustomFormat(FlashState.on);
    if (customFormat && customFormat.indexOf("s") > -1) {
        return true;
    }
    return getConfiguration("showSeconds");
}

export function shouldShowFractionalSeconds(): boolean {
    return getFormat(FlashState.on).indexOf("S") > -1;
}

export function getFractionalPrecision(): number {
    let precision: number = getConfiguration("fractionalPrecision");

    if (typeof precision !== "number") {
        const format = getFormat(FlashState.on);

        let exponent = (format.match(/S/g) || []).length;

        if (exponent === 0) {
            exponent = format.indexOf("x") > -1 ? 3 : 0;
        }

        precision = Math.pow(10, exponent);
    }

    if (precision < 1) {
        precision = 1;
    } else if (precision > 100) {
        precision = 100;
    }

    return precision;
}

export function shouldShowDayOfWeek(): boolean {
    return getConfiguration("showDayOfWeek");
}

export function shouldShowDayOfMonth(): boolean {
    return getConfiguration("showDayOfMonth");
}

export function shouldShowMonth(): boolean {
    return getConfiguration("showMonth");
}

export function shouldUse24HourClock(): boolean {
    return getConfiguration("use24HourClock");
}

export function shouldShowAMPM(): boolean {
    return getConfiguration("showAMPM");
}

export function shouldPadHours(): boolean {
    return getConfiguration("padHours");
}

export function shouldPadMinutes(): boolean {
    return getConfiguration("padMinutes");
}

export function shouldPadSeconds(): boolean {
    return getConfiguration("padSeconds");
}

export function shouldPadDays(): boolean {
    return getConfiguration("padDays");
}

export function getTimeSeparator(): string {
    return getConfiguration("timeSeparator");
}

export function getTimeSeparatorOff(): string {
    return getConfiguration("timeSeparatorOff");
}

export function shouldFlashTimeSeparators(): boolean {
    return getConfiguration("flashTimeSeparators");
}

export function getFormat(flashState: FlashState): string {
    if (!cache.format[flashState]) {
        cache.format[flashState] =
            getCustomFormat(flashState) || composeFormat(flashState);
    }

    return cache.format[flashState]!;
}

export function hasFormat(): boolean {
    return getFormat(FlashState.on).length > 0;
}

function composeFormat(flashState: FlashState): string {
    const separator =
        flashState === FlashState.on
            ? getTimeSeparator()
            : getTimeSeparatorOff();

    let format = "";

    if (shouldShowHours()) {
        if (shouldUse24HourClock()) {
            format += shouldPadHours() ? "HH" : "H";
        } else {
            format += shouldPadHours() ? "hh" : "h";
        }
    }

    if (shouldShowMinutes()) {
        format +=
            (shouldShowHours() ? separator : "") +
            (shouldPadMinutes() ? "mm" : "m");
    }

    if (shouldShowSeconds()) {
        format +=
            (shouldShowHours() || shouldShowMinutes() ? separator : "") +
            (shouldPadSeconds() ? "ss" : "s");
    }

    if (shouldShowAMPM()) {
        format += " A";
    }

    if (shouldShowMonth()) {
        format = "MMM " + format;
    }

    if (shouldShowDayOfMonth()) {
        format = (shouldPadDays() ? "DD" : "D") + " " + format;
    }

    if (shouldShowDayOfWeek()) {
        format = "ddd " + format;
    }

    return format;
}

export function getStatusBarAlignment(): StatusBarAlignment {
    return getConfiguration("statusBarAlignment") === "left"
        ? StatusBarAlignment.Left
        : StatusBarAlignment.Right;
}

export function getStatusBarPriority(): number {
    const configuredPriority = getConfiguration("statusBarPriority");
    if (typeof configuredPriority === "number") {
        return configuredPriority;
    }

    switch (getStatusBarAlignment()) {
        case StatusBarAlignment.Left:
            return 100_000;

        case StatusBarAlignment.Right:
            return -100_000;
    }
}

export function getDisplayPrefix(): string {
    return getConfiguration("displayPrefix") || "";
}

export function getDisplaySuffix(): string {
    return getConfiguration("displaySuffix") || "";
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
