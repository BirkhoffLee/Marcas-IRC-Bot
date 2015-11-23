/* global database */

var commandName      = "ban";
var commandSudo      = true;
var commandHelp      = "Add a nickname to the ban list.";
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
    var timestamp = new Date().getTime();
    var data = {
        created: timestamp,
        banNick: banNick,
        by: from
    };

    hook.emit("command/ban", data);

    database.botBanList.find ({ "banNick": banNick }, function (err, docs) {
        if (docs != []) {
            database.botBanList.insert (data, function (err, newDocs) {
                if (err) {
                    util.log("* WARNING: Baning failed. Error information: ".red);
                    util.log(err);

                    common.botSay(target, common.mention(from) + "Baning failed!", "red");
                } else {
                    common.botSay(target, common.mention(from) + "Baning succeed!", "gray");
                }
            });

            common.reloadBotBanList();
        } else {
            common.botSay(target, common.mention(from) + "Already banned " + banNick + "!", "red");
        }
    });
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

