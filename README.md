# Date & Time

Displays a clock and date information in the status bar.

![Screenshot](./images/screenshot.png)

## Configuration Options

|Option                        |Default|Description                                        |Example       |
|------------------------------|-------|---------------------------------------------------|--------------|
|`dateTime.showOnStartup`      |`true` |Show date & time on startup.                       |              |
|`dateTime.use24HourClock`     |`true` |Use a 24 hour clock.                               |**18**:43     |
|`dateTime.showAMPM`           |`false`|Show AM/PM.                                        |7:43 **PM**   |
|`dateTime.showDayOfWeek`      |`false`|Show the day of the week.                          |**Fri** 1 Jul |
|`dateTime.showDayOfMonth`     |`false`|Show the day of the month.                         |Fri **1** Jul |
|`dateTime.showMonth`          |`false`|Show the month.                                    |Fri 1 **Jul** |
|`dateTime.showHours`          |`true` |Show hours.                                        |**18**:43     |
|`dateTime.showMinutes`        |`true` |Show minutes.                                      |18:**43**     |
|`dateTime.showSeconds`        |`false`|Show seconds.                                      |18:43:**12**  |
|`dateTime.padDays`            |`false`|Pad the day of the month with a leading 0.         |Fri **01** Jul|
|`dateTime.padHours`           |`true` |Pad hours with a leading 0.                        |**09**:43     |
|`dateTime.padMinutes`         |`true` |Pad minutes with a leading 0.                      |18:**03**     |
|`dateTime.padSeconds`         |`true` |Pad seconds with a leading 0.                      |18:43:**04**  |
|`dateTime.locale`             |`null` |Date & time locale.                                |es-us         |
|`dateTime.flashTimeSeparators`|`false`|Flash the time separators.                         |              |
|`dateTime.timeSeparator`      |`:`    |Time separator character.                          |              |
|`dateTime.timeSeparatorOff`   |` `    |Flashing time separator character.                 |              |
|`dateTime.customFormat`       |`null` |Use a custom date & time format.                   |              |
|`dateTime.clipboardFormat`    |`null` |Use a custom date & time format when copying.      |              |
|`dateTime.fractionalPrecision`|`null` |Update interval divisor for fractional seconds.    |              |
|`dateTime.statusBarAlignment` |`right`|Status bar alignment, left or right.               |left          |
|`dateTime.statusBarPriority`  |`null` |Status bar priority. Higher means more to the left.|10            |
|`dateTime.displayPrefix`      |`null` |Prepend a string to the displayed time.            |Time:         |
|`dateTime.displaySuffix`      |`null` |Append a string to the displayed time.             |.             |

### Example usage

```javascript
// 28 Feb 18:47
"dateTime.showDayOfMonth": true,
"dateTime.showMonth": true

// 9:30 AM
"dateTime.use24HourClock": false,
"dateTime.showAMPM": true
```

## Custom date & time format

Custom date & time formats can be specified using the [Moment.js syntax](http://momentjs.com/docs/#/displaying/format/).

|                          |Token  |Output                                |
|--------------------------|-------|--------------------------------------|
|Month                     |`M`    |1 2 ... 11 12                         |
|                          |`Mo`   |1st 2nd ... 11th 12th                 |
|                          |`MM`   |01 02 ... 11 12                       |
|                          |`MMM`  |Jan Feb ... Nov Dec                   |
|                          |`MMMM` |January February ... November December|
|Quarter                   |`Q`    |1 2 3 4                               |
|                          |`Qo`   |1st 2nd 3rd 4th                       |
|Day of Month              |`D`    |1 2 ... 30 31                         |
|                          |`Do`   |1st 2nd ... 30th 31st                 |
|                          |`DD`   |01 02 ... 30 31                       |
|Day of Year               |`DDD`  |1 2 ... 364 365                       |
|                          |`DDDo` |1st 2nd ... 364th 365th               |
|                          |`DDDD` |001 002 ... 364 365                   |
|Day of Week               |`d`    |0 1 ... 5 6                           |
|                          |`do`   |0th 1st ... 5th 6th                   |
|                          |`dd`   |Su Mo ... Fr Sa                       |
|                          |`ddd`  |Sun Mon ... Fri Sat                   |
|                          |`dddd` |Sunday Monday ... Friday Saturday     |
|Day of Week (Locale)      |`e`    |0 1 ... 5 6                           |
|Day of Week (ISO)         |`E`    |1 2 ... 6 7                           |
|Week of Year              |`w`    |1 2 ... 52 53                         |
|                          |`wo`   |1st 2nd ... 52nd 53rd                 |
|                          |`ww`   |01 02 ... 52 53                       |
|Week of Year (ISO)        |`W`    |1 2 ... 52 53                         |
|                          |`Wo`   |1st 2nd ... 52nd 53rd                 |
|                          |`WW`   |01 02 ... 52 53                       |
|Year                      |`YY`   |70 71 ... 29 30                       |
|                          |`YYYY` |1970 1971 ... 2029 2030               |
|Week Year                 |`gg`   |70 71 ... 29 30                       |
|                          |`gggg` |1970 1971 ... 2029 2030               |
|Week Year (ISO)           |`GG`   |70 71 ... 29 30                       |
|                          |`GGGG` |1970 1971 ... 2029 2030               |
|AM/PM                     |`A`    |AM PM                                 |
|                          |`a`    |am pm                                 |
|Hour                      |`H`    |0 1 ... 22 23                         |
|                          |`HH`   |00 01 ... 22 23                       |
|                          |`h`    |1 2 ... 11 12                         |
|                          |`hh`   |01 02 ... 11 12                       |
|Minute                    |`m`    |0 1 ... 58 59                         |
|                          |`mm`   |00 01 ... 58 59                       |
|Second                    |`s`    |0 1 ... 58 59                         |
|                          |`ss`   |00 01 ... 58 59                       |
|Fractional Second         |`S`    |0 1 ... 8 9                           |
|                          |`SS`   |00 01 ... 98 99                       |
|                          |`SSS`  |000 001 ... 998 999                   |
|Unix Timestamp            |`X`    |1360013296                            |
|Unix Millisecond Timestamp|`x`    |1360013296123                         |

### Example usage

```javascript
// Friday, January 1st, 2016
"dateTime.customFormat": "dddd, MMMM Do, YYYY"

// 2016-01-01 10:12:03
"dateTime.customFormat": "YYYY-MM-DD HH:mm:ss"
```

## Date & time locale

The locale can be one of:

af, ar-dz, ar-kw, ar-ly, ar-ma, ar-sa, ar-tn, ar, az, be, bg, bm, bn, bo, br, bs, ca, cs, cv, cy, da, de-at, de-ch, de, dv, el, en-SG, en-au, en-ca, en-gb, en-ie, en-il, en-nz, eo, es-do, es-us, es, et, eu, fa, fi, fo, fr-ca, fr-ch, fr, fy, ga, gd, gl, gom-latn, gu, he, hi, hr, hu, hy-am, id, is, it-ch, it, ja, jv, ka, kk, km, kn, ko, ku, ky, lb, lo, lt, lv, me, mi, mk, ml, mn, mr, ms-my, ms, mt, my, nb, ne, nl-be, nl, nn, pa-in, pl, pt-br, pt, ro, ru, sd, se, si, sk, sl, sq, sr-cyrl, sr, ss, sv, sw, ta, te, tet, tg, th, tl-ph, tlh, tr, tzl, tzm-latn, tzm, ug-cn, uk, ur, uz-latn, uz, vi, x-pseudo, yo, zh-cn, zh-hk, zh-tw.
