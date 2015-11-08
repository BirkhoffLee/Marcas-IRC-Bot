var commandName      = "bindlist";
var commandSudo      = false;
var commandHelp      = "Shows the list of bindings.";
var commandUsage     = "";
var commandDisabled  = false;

function bold (str) {
    return "\x02" + str + "\x02";
}

hook.on('common/runCommand', function (from, to, isAdmin, args, message) {
    var target = common.defaultTarget(from, to);

    if (args[0] != commandName || commandDisabled) {
        return;
    }
    if (commandSudo && !isAdmin) {
        console.log("* WARNING: Unauthorized sudo request from %s".red, from);
        common.botSay(target, common.mention(from) + "Access Denied!", "red");
        return;
    }

    if (to.startsWith("#")) {
        common.botSay(target, common.mention(from) + "Bind list is sent as private messages.", "green");
        target = from;
    }

    _async.series([
        function (callback) {
            Client.activateFloodProtection(800);
            callback(null);
        },
        function (callback) {
            database.botReplies.find({}, function (err, docs) {
                if (docs.length != 0) {
                    docs.forEach(function (doc) {
                        var timestamp = bold(doc.created),
                            pattern   = bold(doc.content),
                            todo      = bold(doc.reply  ),
                            by        = bold(doc.by     ),
                            id        = bold(doc._id    );

                        var say  = "Binding "         + id      + ": ";
                            say += "Pattern: '"       + pattern + "';";
                            say += "Do (or reply): '" + todo    + "';";
                            say += "Created by: '"    + by      + "'.";

                        common.botSay(target, say);
                    });
                } else {
                    common.botSay(target, "There seems to be no binding created.", "red");
                }
            });
            callback(null);
        },
        function (callback) {
            Client.activateFloodProtection(config.getConfig().credentials.floodProtectionDelay);
            callback(null);
        }
    ]);
});

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("async");
    config.setConfig(configArr);
});

hook.on('command/help', function (target, isAdmin, args, cmdPrefix) {
    if (typeof commandName  == "undefined" || typeof commandSudo  == "undefined" ||
        typeof commandHelp  == "undefined" || typeof commandUsage == "undefined") {
        return;
    }
    var helpString = cmdPrefix + commandName + ": ";

    if (commandSudo) {
        if (commandDisabled) {
            helpString += "\x02(Needs admin and disabled)\x02";
        } else {
            helpString += "\x02(Needs admin)\x02";
        }
    } else {
        if (commandDisabled) {
            helpString += "\x02(Disabled)\x02";
        }
    }

    helpString += " " + commandHelp;

    if (typeof args[1] != "undefined" && args[1] == commandName) {
        helpString = "\x02" + helpString + "\x02";
        helpString += "\nUsage: " + cmdPrefix + commandName + " " + commandUsage;
        common.botSay(target, helpString);
    }
});

