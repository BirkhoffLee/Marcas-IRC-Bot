var commandName      = "togglelist";
var commandSudo      = true;
var commandHelp      = "Shows the toggle features status.";
var commandUsage     = "";
var commandDisabled  = false;

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
        common.botSay(target, common.mention(from) + "Status list is sent as private messages.", "green");
        target = from;
    }

    database.toggle.find({}, function (err, docs) {
        if (docs.length != 0) {
            docs.forEach(function (doc) {
                common.botSay(target, "Feature \"" + doc.name + "\" is \x02" + doc.status.toString().replace("true", "on").replace("false", "off") + "\x02.");
            });
        }
    });
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
