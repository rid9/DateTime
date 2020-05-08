var fs = require("fs");

var packageDescription = require("./package.json");
var packageProperties = packageDescription.contributes.configuration.properties;

var markdownText = "";

// Title

markdownText += "# " + packageDescription.displayName + "\n\n";

// Description

markdownText += packageDescription.description + "\n\n";
markdownText += "![Screenshot](./images/screenshot.png)\n\n";

// Options

markdownText += "## Configuration Options\n\n";

var field = function (parameters) {
    parameters.maximumLength = 0;
    return parameters;
};

var fields = [
    field({ title: "Option", name: "name", isCode: true }),
    field({ title: "Default", name: "default", isCode: true }),
    field({ title: "Description", name: "description" }),
    field({ title: "Example", name: "dateTime_example" }),
];

fields.forEach(function (field) {
    field.maximumLength = field.title.length;
});

var renderValue = function (value) {
    if (value === void 0) {
        return "";
    } else if (value === null) {
        return "null";
    } else if (typeof value === "boolean") {
        return value ? "true" : "false";
    } else {
        return value.toString();
    }
};

var properties = Object.keys(packageProperties).map(function (key) {
    var property = {};

    fields.forEach(function (field, index) {
        var rawProperty = packageProperties[key];
        var value = renderValue(index === 0 ? key : rawProperty[field.name]);

        if (field.isCode) {
            value = "`" + value + "`";
        }

        var length = value.length;
        if (length > field.maximumLength) {
            field.maximumLength = length;
        }

        property[field.name] = value;
    });

    return property;
});

var pad = function (value, length, character) {
    length -= value.length;
    for (var i = 0; i < length; i++) {
        value += character;
    }
    return value;
};

markdownText += "|";
fields.forEach(function (field) {
    markdownText += pad(field.title, field.maximumLength, " ");
    markdownText += "|";
});
markdownText += "\n";

markdownText += "|";
fields.forEach(function (field) {
    markdownText += pad(
        "",
        Math.max(field.title.length, field.maximumLength),
        "-"
    );
    markdownText += "|";
});
markdownText += "\n";

properties.forEach(function (property) {
    markdownText += "|";
    fields.forEach(function (field) {
        markdownText += pad(property[field.name], field.maximumLength, " ");
        markdownText += "|";
    });
    markdownText += "\n";
});

markdownText +=
    "" +
    `
### Example usage

\`\`\`javascript
// 28 Feb 18:47
"dateTime.showDayOfMonth": true,
"dateTime.showMonth": true

// 9:30 AM
"dateTime.use24HourClock": false,
"dateTime.showAMPM": true
\`\`\`

## Custom date & time format

Custom date & time formats can be specified using the [Moment.js syntax](http://momentjs.com/docs/#/displaying/format/).

|                          |Token  |Output                                |
|--------------------------|-------|--------------------------------------|
|Month                     |\`M\`    |1 2 ... 11 12                         |
|                          |\`Mo\`   |1st 2nd ... 11th 12th                 |
|                          |\`MM\`   |01 02 ... 11 12                       |
|                          |\`MMM\`  |Jan Feb ... Nov Dec                   |
|                          |\`MMMM\` |January February ... November December|
|Quarter                   |\`Q\`    |1 2 3 4                               |
|                          |\`Qo\`   |1st 2nd 3rd 4th                       |
|Day of Month              |\`D\`    |1 2 ... 30 31                         |
|                          |\`Do\`   |1st 2nd ... 30th 31st                 |
|                          |\`DD\`   |01 02 ... 30 31                       |
|Day of Year               |\`DDD\`  |1 2 ... 364 365                       |
|                          |\`DDDo\` |1st 2nd ... 364th 365th               |
|                          |\`DDDD\` |001 002 ... 364 365                   |
|Day of Week               |\`d\`    |0 1 ... 5 6                           |
|                          |\`do\`   |0th 1st ... 5th 6th                   |
|                          |\`dd\`   |Su Mo ... Fr Sa                       |
|                          |\`ddd\`  |Sun Mon ... Fri Sat                   |
|                          |\`dddd\` |Sunday Monday ... Friday Saturday     |
|Day of Week (Locale)      |\`e\`    |0 1 ... 5 6                           |
|Day of Week (ISO)         |\`E\`    |1 2 ... 6 7                           |
|Week of Year              |\`w\`    |1 2 ... 52 53                         |
|                          |\`wo\`   |1st 2nd ... 52nd 53rd                 |
|                          |\`ww\`   |01 02 ... 52 53                       |
|Week of Year (ISO)        |\`W\`    |1 2 ... 52 53                         |
|                          |\`Wo\`   |1st 2nd ... 52nd 53rd                 |
|                          |\`WW\`   |01 02 ... 52 53                       |
|Year                      |\`YY\`   |70 71 ... 29 30                       |
|                          |\`YYYY\` |1970 1971 ... 2029 2030               |
|Week Year                 |\`gg\`   |70 71 ... 29 30                       |
|                          |\`gggg\` |1970 1971 ... 2029 2030               |
|Week Year (ISO)           |\`GG\`   |70 71 ... 29 30                       |
|                          |\`GGGG\` |1970 1971 ... 2029 2030               |
|AM/PM                     |\`A\`    |AM PM                                 |
|                          |\`a\`    |am pm                                 |
|Hour                      |\`H\`    |0 1 ... 22 23                         |
|                          |\`HH\`   |00 01 ... 22 23                       |
|                          |\`h\`    |1 2 ... 11 12                         |
|                          |\`hh\`   |01 02 ... 11 12                       |
|Minute                    |\`m\`    |0 1 ... 58 59                         |
|                          |\`mm\`   |00 01 ... 58 59                       |
|Second                    |\`s\`    |0 1 ... 58 59                         |
|                          |\`ss\`   |00 01 ... 58 59                       |
|Fractional Second         |\`S\`    |0 1 ... 8 9                           |
|                          |\`SS\`   |00 01 ... 98 99                       |
|                          |\`SSS\`  |000 001 ... 998 999                   |
|Unix Timestamp            |\`X\`    |1360013296                            |
|Unix Millisecond Timestamp|\`x\`    |1360013296123                         |

### Example usage

\`\`\`javascript
// Friday, January 1st, 2016
"dateTime.customFormat": "dddd, MMMM Do, YYYY"

// 2016-01-01 10:12:03
"dateTime.customFormat": "YYYY-MM-DD HH:mm:ss"
\`\`\`

## Date & time locale

The locale can be one of:

${fs
    .readdirSync("./node_modules/moment/locale")
    .map((fileName) => fileName.replace(/\.js$/, ""))
    .join(", ")}.
`;

fs.writeFileSync("./README.md", markdownText);
