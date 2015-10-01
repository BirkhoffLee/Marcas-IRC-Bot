var commandName      = "wiki";
var commandSudo      = false;
var commandHelp      = "Search something on English Wikipedia.";
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

    // common.botSay(target, from + ": Please wait, this may take a long time...", "red");

    var request = _request;
    var cmdPre = config.getConfig().others.commandPrefix;
    var param  = message.slice(cmdPre.length + commandName.length + 1);
    var baseurl = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=";
    var triggerKey = [" may refer to:", "This is a redirect from a title with another method of capitalisation."];
    var titleDetect = " - Wikipedia, the free encyclopedia";
    var searchPrefix = "site:en.wikipedia.org intitle:";
    var error0 = "Sorry, I found nothing about \x02\"{keyword}\"\x02 on English Wikipedia.";
    var error1 = error0 + " But I found something like \x02\"{keyword}\"\x02. Check it out by yourself on English Wikipedia!";
    var error2 = "Sorry, please check it out by yourself on English Wikipedia!";
    var originParam = param;

    request (baseurl + param, function(error, response, str) {
        str = JSON.parse(str);
        if (typeof str.query.pages['-1'] !== 'undefined') {
            common.botSay(target, error0.replace("{keyword}", param), "red");
            return false;
        }

        for (var pageID in str.query.pages) {
            var result = str.query.pages[pageID].extract.split('\n')[0];

            if (result.slice(-14) == triggerKey[0] || result.slice(0, 70) == triggerKey[1] || result == "") {
                // Try get the correct keyword from google and wiki it again
                searchGoogle(searchPrefix + param, function(googleResult) {
                    if (googleResult === false) {
                        common.botSay(target, error1.replaceAll("{keyword}", param), "red");
                        return false;
                    }

                    param = googleResult[0].split(titleDetect)[0];
                    request (baseurl + param, function(error, response, str) {
                        str = JSON.parse(str);
                        if (typeof str.query.pages['-1'] !== 'undefined') {
                            common.botSay(target, error0.replace("{keyword}", originParam), "red");
                            return false;
                        }

                        for (var pageID in str.query.pages) {
                            var result = str.query.pages[pageID].extract.split('\n')[0];
                            if (result.slice(-14) == triggerKey[0] || result.slice(0, 70) == triggerKey[1]) {
                                common.botSay(target, error2, "red");
                            } else {
                                common.botSay(target, result.slice(0, 243) + "...");
                            }
                        }
                    });
                });
            } else {
                common.botSay(target, result.slice(0, 243) + "...");
            }
            break;
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

