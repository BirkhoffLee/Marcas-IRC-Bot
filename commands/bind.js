var commandName      = "bind";
var commandSudo      = true;
var commandHelp      = "Add a binding.";
var commandUsage     = "[key] [value]";
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
    if (typeof args[1] == "undefined" || typeof args[2] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return false;
    }

    var cmdPre = config.getConfig().others.commandPrefix;
    var key    = args[1];
    var value  = message.slice(cmdPre.length + commandName.length + 1 + args[1].length + 1);

    hook.emit("command/bind", key);

    if (key.slice(0, 1) == cmdPre) {
        common.botSay(target, "The first character of the content cannot be the prefix of commands! Binding action cancelled.", "red");
    } else {
        var timestamp = new Date().getTime();
        var data = {
            created: timestamp,
            content : key,
            reply : value,
            by: from
        };

        database.botReplies.insert (data, function (err, newDocs) {
            if (err) {
                console.log("* WARNING: Binding failed. Error information: ".red);
                console.log(err);

                common.botSay(target, common.mention(from) + "Binding failed!", "red");
            } else {
                common.botSay(target, common.mention(from) + "Binding succeed!", "gray");
            }
        });
    }

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

