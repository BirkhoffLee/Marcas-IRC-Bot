var commandName      = "unbind";
var commandSudo      = true;
var commandHelp      = "Remove a binding. Use viewbind command to get TIMESTAMP.";
var commandUsage     = "[TIMESTAMP]";
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
    if (typeof args[1] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return false;
    }

    database.botReplies.remove ({ created: parseInt(args[1]) }, {}, function (err, numRemoved) {
        if (err) {
            console.log("* WARNING: Uninding failed. Error information: ".red);
            console.log(err);

            common.botSay(target, common.mention(from) + "Unbinding failed!", "red");
        } else if (numRemoved == 0) {
            common.botSay(target, common.mention(from) + "This binding doesn't exist.", "gray");
        } else {
            common.botSay(target, common.mention(from) + "Unbinding succeed!", "gray");
        }
    });

    common.reloadBotReplies();
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

