# Date & Time

Date & Time support for Visual Studio Code.

![Screenshot](./images/screenshot.png)

## Configuration Options

|Option                        |Type   |Default|Description                                                                                                  |
|------------------------------|-------|-------|-------------------------------------------------------------------------------------------------------------|
|`dateTime.showOnStartup`      |boolean|`true` |Show Date & Time when Visual Studio Code starts up.                                                          |
|`dateTime.use24HourClock`     |boolean|`true` |Use a 24 hour clock.                                                                                         |
|`dateTime.showAMPM`           |boolean|`false`|Show AM/PM.                                                                                                  |
|`dateTime.showDayOfWeek`      |boolean|`false`|Show the day of the week.                                                                                    |
|`dateTime.showDayOfMonth`     |boolean|`false`|Show the day of the month.                                                                                   |
|`dateTime.showMonth`          |boolean|`false`|Show the month.                                                                                              |
|`dateTime.showHours`          |boolean|`true` |Show hours.                                                                                                  |
|`dateTime.showMinutes`        |boolean|`true` |Show minutes.                                                                                                |
|`dateTime.showSeconds`        |boolean|`false`|Show seconds.                                                                                                |
|`dateTime.padDays`            |boolean|`false`|Pad the day of the month with a leading 0.                                                                   |
|`dateTime.padHours`           |boolean|`true` |Pad hours with a leading 0.                                                                                  |
|`dateTime.padMinutes`         |boolean|`true` |Pad minutes with a leading 0.                                                                                |
|`dateTime.padSeconds`         |boolean|`true` |Pad seconds with a leading 0.                                                                                |
|`dateTime.flashTimeSeparators`|boolean|`false`|Flash the time separators.                                                                                   |
|`dateTime.timeSeparator`      |string |`:`    |Time separator character.                                                                                    |
|`dateTime.timeSeparatorOff`   |string |` `    |Flashing time separator character.                                                                           |
|`dateTime.customFormat`       |string |`null` |Use a custom Date & Time format. See http://momentjs.com/docs/#/displaying/format/ for options.              |
|`dateTime.fractionalPrecision`|number |`null` |Number by which the update interval is divided, if the format contains fractional seconds. Between 1 and 100.|
