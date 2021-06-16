import { env, StatusBarAlignment, workspace } from "vscode";

export enum FlashState {
    On = 1,
    Off = 2,
}

let cache: {
    format: {
        [FlashState.On]: string | null;
        [FlashState.Off]: string | null;
    };
    configuration: {
        [key: string]: any;
    };
} = getDefaultCache();

function getDefaultCache() {
    return {
        format: {
            [FlashState.On]: null,
            [FlashState.Off]: null,
        },
        configuration: {},
    };
}

export function preCache() {
    if (!cache.format[FlashState.On]) {
        getFormat(FlashState.On);
    }

    if (!cache.format[FlashState.Off] && shouldFlashTimeSeparators()) {
        getFormat(FlashState.Off);
    }
}

export function clearCache() {
    cache = getDefaultCache();
}

function getConfiguration(property: string) {
    if (!cache.configuration.hasOwnProperty(property)) {
        cache.configuration[property] = workspace.getConfiguration("dateTime")[
            property
        ];
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

    if (flashState === FlashState.On) {
        return format;
    } else {
        const reSeparator = getFormatTimeSeparatorRegExp();
        return format.replace(reSeparator, "$1" + getTimeSeparatorOff());
    }
}

export function getLocale(): string {
    return getConfiguration("locale") || env.language;
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
    const customFormat = getCustomFormat(FlashState.On);
    if (customFormat && customFormat.indexOf("s") > -1) {
        return true;
    }
    return getConfiguration("showSeconds");
}

export function shouldShowFractionalSeconds(): boolean {
    return getFormat(FlashState.On).indexOf("S") > -1;
}

export function getFractionalPrecision(): number {
    let precision: number = getConfiguration("fractionalPrecision");

    if (typeof precision !== "number") {
        const format = getFormat(FlashState.On);
        precision = Math.pow(10, (format.match(/S/g) || []).length);
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

export function howManyMonthsBefore(): number {
    return getConfiguration("monthsBefore");
}

export function howManyMonthsAfter(): number {
    return getConfiguration("monthsAfter");
}

export function howManyMonthsPerRow(): number {
    return getConfiguration("monthsPerRow");
}

export function howMuchHorizontalPadding(): number {
    return getConfiguration("extraHorizontalSpace");
}

export function howMuchVerticalPadding(): number {
    return getConfiguration("extraVerticalSpace");
}

export function weekStartsOn(): number {
    return getConfiguration("weekStartsOn");
}

export function getFormat(flashState: FlashState): string {
    if (!cache.format[flashState]) {
        cache.format[flashState] =
            getCustomFormat(flashState) || composeFormat(flashState);
    }

    return cache.format[flashState]!;
}

export function hasFormat(): boolean {
    return getFormat(FlashState.On).length > 0;
}

function composeFormat(flashState: FlashState): string {
    const separator =
        flashState === FlashState.On
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

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
