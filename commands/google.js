var commandName      = "google";
var commandSudo      = false;
var commandHelp      = "Search something on google.";
var commandUsage     = "[keyword]";
var commandDisabled  = false;

function searchGoogle(keyword, callback){
    _google(keyword, function(err, next, links){
        if (err) {
            callback(false);
            return;
        }

        var result = [];

        if (typeof links[0] != 'undefined') {
            if (typeof links[0].title == 'undefined') {
                return;
            }
            if (typeof links[0].link == 'undefined') {
                return;
            }
            if (typeof links[0].description == 'undefined') {
                return;
            }

            result.push([links[0].title, links[0].link, links[0].description]);
        }

        if (typeof links[1] != 'undefined') {
            if (typeof links[1].title == 'undefined') {
                return;
            }
            if (typeof links[1].link == 'undefined') {
                return;
            }
            if (typeof links[1].description == 'undefined') {
                return;
            }
            result.push([links[1].title, links[1].link, links[1].description]);
        }

        callback(result);
    });
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
    if (typeof args[1] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return false;
    }

    var cmdPre = config.getConfig().others.commandPrefix;
    var param  = message.slice(cmdPre.length + commandName.length + 1);

    searchGoogle(param, function(result) {
        if (result === false) {
            common.botSay(target, common.mention(from) + "Something went wrong, try again later :(", "red");
            return;
        }

        if (result.length == 0) {
            common.botSay(target, common.mention(from) + "Sorry, I cannot find anything about it on Google.", "red");
            return;
        }

        result.forEach(function (resInfo) {
            common.botSay(target, '[ ' + resInfo[0] + ' ] - ' + resInfo[1] + " : \x02" + resInfo[2] + "\x02", "", 2);
            return;
        });
    });
});

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("request");
    configArr.necessaryModule.push("google");
    config.setConfig(configArr);
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

