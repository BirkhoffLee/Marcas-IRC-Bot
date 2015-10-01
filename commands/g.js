var commandName      = "g";
var commandSudo      = false;
var commandHelp      = "Search something on google.";
var commandUsage     = "[keyword]";
var commandDisabled  = false;

function searchGoogle(keyword, callback){
    _google(keyword, function(err, next, links){
        if (err || typeof links[0] == 'undefined') {
            callback(false);
        } else {
            callback([ links[0].title, links[0].link, links[0].description.slice( 0, 60 ) + "..." ]);
        }
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

    // common.botSay(target, from + ": Please wait, this may take a long time...", "red");

    searchGoogle(param, function(result) {
        if (result === false || result[0] == "" || result[1] == null || result[2] == "") {
            common.botSay(target, common.mention(from) + "Something went wrong, try again later :(", "red");
        } else {
            common.botSay(target, '[ ' + result[0] + ' ] - ' + result[1] + " : \x02" + result[2] + "\x02");
        }
        return;
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

