var commandName      = "uptime";
var commandSudo      = false;
var commandHelp      = "Show my up time.";
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
    var startTime  = config.getConfig().others.startTime;
    var nowTime    = new Date().getTime() / 1000;

    var seconds = Math.floor(nowTime - startTime);
    var days = Math.floor((seconds % 31536000) / 86400);
    var hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var seconds = (((seconds % 31536000) % 86400) % 3600) % 60;

    var minuteText = (minutes > 1) ? " minutes" : " minute";
    var hourText = (hours > 1) ? " hours " : " hour ";
    var dayText   = (days > 1) ? " days " : " day ";

    var uptime = days + dayText + hours + hourText + minutes + minuteText;

    var uptimeText = "My up time: " + uptime + ".";

    common.botSay(target, uptimeText);
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

