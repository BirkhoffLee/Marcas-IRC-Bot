var commandName      = "wiki";
var commandSudo      = false;
var commandHelp      = "Search something on Chinese Wikipedia.";
var commandUsage     = "[keyword]";
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
    if (typeof args[1] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return false;
    }

    var cmdPre   = config.getConfig().others.commandPrefix;
    var toSearch = message.slice(cmdPre.length + commandName.length + 1);

    // From: https://github.com/james58899/oktw/blob/master/modules/wiki.js
    var search = "https://zh.wikipedia.org/w/api.php?format=json&action=query&list=search&srlimit=1&srprop&continue&srsearch=" + encodeURI(toSearch);
    _request (search, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            if (typeof JSON.parse(body).query.search[0] != "undefined" && typeof JSON.parse(body).query.search[0].title != "undefined") {
                var title = JSON.parse(body).query.search[0].title;
            } else {
                common.botSay(target, common.mention(from) + "\x02Sorry, I found nothing about that on Chinese Wikipedia.\x02", "red");
                return;
            }

            var options = {
                url: "https://zh.wikipedia.org/w/api.php?format=json&utf8&action=query&prop=extracts&exintro&explaintext&exchars=130&redirects&titles=" + encodeURI(title),
                gzip: true,
                headers: {
                    "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3"
                }
            };
            _request(options, function(err, response, body) {
                if (!err && response.statusCode == 200) {
                    var data = JSON.parse(body);
                    if (Object.keys(data.query.pages)) {
                        var firstResult = Object.keys(data.query.pages);
                        common.botSay(target, data.query.pages[firstResult[0]].extract + '\nhttp://zh.wikipedia.org/wiki/' + title.replace(/\s/g, '_'));
                    } else {
                        common.botSay(target, common.mention(from) + "Sorry, I found nothing about that on Chinese Wikipedia.");
                        return;
                    }
                } else {
                    common.botSay(target, common.mention(from) + "Sorry, I found nothing about that on Chinese Wikipedia.");
                    return;
                }
            })
         }
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

