var commandName      = "unban";
var commandSudo      = true;
var commandHelp      = "Remove a nickname from the ban list.";
var commandUsage     = "[nick]";
var commandDisabled  = false;

hook.on('common/runCommand', function (from, to, isAdmin, args, message) {
    var target = common.defaultTarget(from, to);

    if (args[0] != commandName || commandDisabled) {
        return;
    }

    if (commandSudo && !isAdmin) {
        util.log(("* WARNING: Unauthorized sudo request from " + from).red);
        common.botSay(target, common.mention(from) + "Access Denied!", "red");
        return;
    }
    if (typeof args[1] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return false;
    }

    var banNick = args[1];

    hook.emit("command/unban", banNick);

    database.botBanList.remove ({ banNick: banNick }, {}, function (err, numRemoved) {
        if (err) {
            util.log("* WARNING: Unbaning failed. Error information: ".red);
            util.log(err);

            common.botSay(target, common.mention(from) + "Unbaning failed!", "red");
        } else if (numRemoved == 0) {
            common.botSay(target, common.mention(from) + "This nick doesn't exist in the ban list.", "gray");
        } else {
            common.botSay(target, common.mention(from) + "Unbaning succeed!", "gray");
        }
    });

    common.reloadBotBanList();
});

hook.on('command/help', function (target, isAdmin, args, cmdPrefix) {
    /* DO NOT TOUCH THIS */
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

