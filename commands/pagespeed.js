var commandName      = "pagespeed";
var commandSudo      = false;
var commandHelp      = "Get the PageSpeed score of the website by Google.";
var commandUsage     = "[url]";
var commandDisabled  = false;

var apiURL;

hook.on('initalize/initalize', function () {
    var apiKeysArr = config.getConfig().apiKeys;
    if (typeof apiKeysArr.pagespeed == "undefined" || apiKeysArr.pagespeed == "") {
        commandDisabled = true;
        util.log("* WARNING: Pagespeed API key not given".red);
        return;
    }

    apiURL = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed?&locale=zh_TW&screenshot=false&fields=ruleGroups&key=' + apiKeysArr.pagespeed + '&url=';
});

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

    _request(apiURL + args[1], function(err, response, body) {
        if (err || response.statusCode != 200 || typeof JSON.parse(body).ruleGroups.SPEED.score == "undefined") {
            common.botSay(target, common.mention(from) + "Something went wrong, try again later :(", "red");
            return;
        }

        var score = JSON.parse(body).ruleGroups.SPEED.score;
        common.botSay(target, common.mention(from) + "The PageSpeed score of \"" + args[1] + "\" is: " + score + '/100');
    });
});

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("request");
    config.setConfig(configArr);
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

