var commandName      = "reversedns";
var commandSudo      = false;
var commandHelp      = "Get reverse (PTR) record from IPv4/IPv6 addresses.";
var commandUsage     = "[A-IPv4-or-IPv6-address]";
var commandDisabled  = false;

var apiURL           = "http://api.statdns.com/x/{ip}";
var header           = {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                            'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3'
                       };

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

    _request({
        url: apiURL.replaceAll("{ip}", args[1], true).trim(),
        headers: header,
        timeout: 6000,
        gzip: true,
        encoding: null
    }, function(err, response, body) {
        if (err) {
            common.botSay(target, common.mention(from) + "Something went wrong, try again later :(", "red");
            return;
        }
        var result = JSON.parse(body.toString());
        if (typeof result.message != "undefined") {
            common.botSay(target, common.mention(from) + result.message + ".", "red");
            return;
        }
        if (typeof result.answer != "undefined" && typeof result.answer[0] != "undefined" && typeof result.answer[0].rdata != "undefined") {
            common.botSay(target, common.mention(from) + "The PTR record of \x02" + args[1] + "\x02 is \x02" + result.answer[0].rdata + "\x02");
            return;
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
