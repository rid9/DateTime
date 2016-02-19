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

var fields = [
    { title: 'Option', name: 'name', maximumLength: 0, isCode: true },
    { title: 'Type', name: 'type', maximumLength: 0 },
    { title: 'Default', name: 'default', maximumLength: 0, isCode: true },
    { title: 'Description', name: 'description', maximumLength: 0 },
];

fields.forEach(function(field) {
    field.maximumLength = field.title.length;
});

var renderValue = function(value) {
    if (value === null) {
        return 'null';
    } else if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    } else {
        return value.toString();
    }
}

var properties = Object.keys(packageProperties).map(function(key) {
    var property = {};

    fields.forEach(function(field, index) {
        var rawProperty = packageProperties[key];
        var value = renderValue(index === 0 ? key : rawProperty[field.name]);

        if (rawProperty.minimum && rawProperty.maximum && field.name === 'description') {
            value += " Between " + rawProperty.minimum + " and " + rawProperty.maximum + ".";
        }

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

var pad = function(value, length, character) {
    length -= value.length;
    for (var i = 0; i < length; i++) {
        value += character;
    }
    return value;
}

markdownText += "|";
fields.forEach(function(field) {
    markdownText += pad(field.title, field.maximumLength, " ");
    markdownText += "|";
});
markdownText += "\n";

markdownText += "|";
fields.forEach(function(field) {
    markdownText += pad("", Math.max(field.title.length, field.maximumLength), "-");
    markdownText += "|";
});
markdownText += "\n";

properties.forEach(function(property) {
    markdownText += "|";
    fields.forEach(function(field) {
        markdownText += pad(property[field.name], field.maximumLength, " ");
        markdownText += "|";
    });
    markdownText += "\n";
});

require("fs").writeFileSync("./README.md", markdownText);
