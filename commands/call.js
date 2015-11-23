var commandName      = "call";
var commandSudo      = false;
var commandHelp      = "Mention someone.";
var commandUsage     = "[toMention]";
var commandDisabled  = false;
var mentionTimes     = 2;

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

    var nick = args[1];

    if (!to.startsWith("#")) {
        common.botSay(target, common.mention(from) + "Sorry, this command is not executed from PMs.", "red");
        return;
    }
    if (common.isBanned(nick)) {
        common.botSay(target, common.mention(from) + "Sorry, but " + nick + " is in my ban list.", "red");
        return;
    }
    if (typeof Client.chans[to].users[nick] == "undefined") {
        common.botSay(target, common.mention(from) + "Sorry, but I found that " + nick + " has not joined this channel yet.", "red");
        return;
    }

    var mentionText = common.mention(nick) + "\x02" + from + "\x02 is calling you!";
    for (var i = 0; i < mentionTimes; i++) {
        common.botSay(to, mentionText);
    }
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

