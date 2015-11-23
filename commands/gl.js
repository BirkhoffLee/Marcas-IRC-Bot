var commandName      = "gl";
var commandSudo      = false;
var commandHelp      = "Shorten a URL. (goo.gl)";
var commandUsage     = "[url]";
var commandDisabled  = false;
var apiURL;

hook.on('initalize/initalize', function () {
    var apiKeysArr = config.getConfig().apiKeys;
    if (typeof apiKeysArr.goo_gl == "undefined" || apiKeysArr.goo_gl == "") {
        commandDisabled = true;
        util.log("* WARNING: goo.gl API key not given".red);
        return;
    }

   apiURL = 'https://www.googleapis.com/urlshortener/v1/url?key=' + apiKeysArr.goo_gl;
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

    var data = {
        uri: apiURL,
        json: {
            "longUrl": args[1]
        }
    };

    _request.post(data, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            common.botSay(target, common.mention(from) + "\x02Shortened URL:\x02 " + body.id, "blue");
        } else {
            common.botSay(target, common.mention(from) + "Something went wrong, try again later :(", "red");
        }
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

