var commandName      = "viewbind";
var commandSudo      = false;
var commandHelp      = "Look the settings of the bind.";
var commandUsage     = "[reply]";
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

    var cmdPre = config.getConfig().others.commandPrefix;
    var reply = message.slice(cmdPre.length + commandName.length + 1);

    for (var pattern in botReplies) {
        if (botReplies[pattern].reply == reply) {
            var creater = botReplies[pattern].by;
            var time = botReplies[pattern].created;

            var result  = common.mention(from) + "The info of bind \"" + reply + "\":";
                result += "\nCreater: \x02" + creater + "\x02";
                result += "\nCreated at: \x02" + time + "\x02";
                result += "\nPattern to toogle: \x02" + pattern + "\x02";
                // result += "\n\x02ATTENTION: The timezone of the create time (unix timestamp) may not be the same as the timezone of your country's.\x02";

            common.botSay(target, result, "red");
            return;
        }
    }

    common.botSay(target, common.mention(from) + "The bind with reply \"" + reply + "\" doesn't exist.", "red");
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

