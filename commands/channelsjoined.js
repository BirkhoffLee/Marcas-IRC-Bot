var commandName      = "channelsjoined";
var commandSudo      = false;
var commandHelp      = "Show the channel IDs that I have been joined.";
var commandUsage     = "";
var commandDisabled  = false;

// http://stackoverflow.com/questions/19371416/replace-multiple-occurrence-in-string
function allButLast(haystack, needle, replacer, ignoreCase) {
    var n0, n1, n2;
    needle = new RegExp(needle, ignoreCase ? 'i' : '');
    replacer = replacer || '';
    n0 = n1 = n2 = haystack;
    do {
        n2 = n1; n1 = n0;
        n0 = n0.replace(needle, replacer);
    } while (n0 !== n1);
    return n2;
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

    if (Client.chans.length == 1) {
        var result = common.mention(from) + "I have joined " + Client.chans + " .";
    } else {
        var channels = "";

        for (var channel in Client.chans) {
            channels += ", and " + channel; // #ysitd, and #birkhoff, and #foobar
        }

        channels = channels.slice(6);
        channels = allButLast(channels, ", and ", ', ', 1);

        var result = common.mention(from) + "I have joined these channels: \x02" + channels + "\x02.";
    }

    common.botSay(target, result);
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

