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
        util.log(("* WARNING: Unauthorized sudo request from " + from).red);
        common.botSay(target, common.mention(from) + "Access Denied!", "red");
        return;
    }

    var startTime  = config.getConfig().others.startTime;
    var nowTime    = new Date().getTime() / 1000;

    var seconds = Math.floor(nowTime - startTime);
    var weeks = Math.floor((seconds % 31536000) / 86400 / 7);
    var days = Math.floor((seconds % 31536000) / 86400 % 7);
    var hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var seconds = (((seconds % 31536000) % 86400) % 3600) % 60;

    var minuteText = (minutes > 1) ? " minutes" : " minute";
    var hourText   = (hours   > 1) ? " hours"   : " hour";
    var dayText    = (days    > 1) ? " days"    : " day";
    var weekText   = (weeks   > 1) ? " weeks"   : " week";
    var uptime     = [];
    var uptimeText = "";

    if (weeks != 0) {
        uptime.push(weeks + weekText);
    }
    if (days != 0 || weeks != 0) {
        uptime.push(days + dayText);
    }
    if (hours != 0 || days != 0 || weeks != 0) {
        uptime.push(hours + hourText);
    }
    if (minutes != 0 || hours != 0 || days != 0 || weeks != 0) {
        uptime.push(minutes + minuteText);
    }
    if (minutes == 0 && hours == 0 && days == 0 && weeks == 0) {
        uptime    = [];
        uptime[0] = "less than a minute";
    }
    if (uptime.length >= 2) {
        uptime.splice(-1, 0, "and");
    }
    var uptimeText = "I've been here for " + uptime.join(", ").replace(", and, ", " and ") + ".";

    common.botSay(target, uptimeText);
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

