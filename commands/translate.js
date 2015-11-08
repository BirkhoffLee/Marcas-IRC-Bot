var commandName      = "translate";
var commandSudo      = false;
var commandHelp      = "Translating using Baidu. Lang codes: http://goo.gl/G7X10Y";
var commandUsage     = "[originLang] [toLang] [toTranslate]";
var commandDisabled  = false;
var apiURL;

hook.on('initalize/initalize', function () {
    var apiKeysArr = config.getConfig().apiKeys;
    if (typeof apiKeysArr.baidu_translate == "undefined" || apiKeysArr.baidu_translate == "") {
        commandDisabled = true;
        console.log("* WARNING: Baidu Translate API key not given".red);
        return;
    }

   apiURL = "http://openapi.baidu.com/public/2.0/bmt/translate?client_id={apikey}&q={totrans}&from={from}&to={to}".replaceAll("{apikey}", apiKeysArr.baidu_translate, true);
});

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
    if (typeof args[1] == "undefined" || typeof args[2] == "undefined" || typeof args[3] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return false;
    }

    var cmdPre  = config.getConfig().others.commandPrefix;
    var tfrom   = args[1];
    var to      = args[2];
    var totrans = message.slice(cmdPre.length + commandName.length + 1 + tfrom.length + 1 + to.length + 1);

    if (to == "chs") {
        to = "zh";
    } else if (to == "zh") {
        to = "cht";
    }
    if (tfrom == "chs") {
        to = "zh";
    } else if (tfrom == "zh") {
        tfrom = "cht";
    }

    apiURL = apiURL.replaceAll("{totrans}", totrans, true)
                    .replaceAll("{from}", tfrom, true)
                    .replaceAll("{to}", to, true);

    _request(apiURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if (typeof json.error_code != "undefined" || typeof json.trans_result[0].dst == "undefined") {
                common.botSay(target, common.mention(from) + "Something went wrong, try again later :(", "red");
                return;
            }
        } else {
            common.botSay(target, common.mention(from) + "Something went wrong, try again later :(", "red");
            return;
        }

        common.botSay(target, from + ", translate result: " + json.trans_result[0].dst, "blue");
    });
});

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("request");
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

