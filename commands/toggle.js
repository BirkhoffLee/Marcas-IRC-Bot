var commandName      = "toggle";
var commandSudo      = true;
var commandHelp      = "Toggle features.";
var commandUsage     = "[toggleName]";
var commandDisabled  = false;

hook.on('initalize/initalize', function () {
    toggleList = config.getConfig().others.toggleList;
});

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

    var name = args[1];
    if (typeof toggleList[name] == "undefined") {
        common.botSay(target, common.mention(from) + "Feature not found.", "red");
        return;
    }

    if (toggleList[name] == true) {
        toggleList[name] = false;
    } else {
        toggleList[name] = true;
    }
    common.botSay(target, common.mention(from) + "The value of '" + name + "' changed to " + toggleList[name].toString() + ".", "blue");
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
