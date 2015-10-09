var commandName      = "explore";
var commandSudo      = false;
var commandHelp      = "Give you something you may have interest to.";
var commandUsage     = "";
var commandDisabled  = false;

var feedList = [
    "http://feeds.feedburner.com/freegroup/",
    "http://feeds.feedburner.com/soft4funtw",
    "http://chinese.engadget.com/rss.xml",
    "http://www.ithome.com.tw/rss",
    "http://pansci.tw/feed"
    // "https://blog.birkhoff.me/rss/"
];

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("feed-read");
    config.setConfig(configArr);
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

    feedList.forEach(function (feedURL) {
        _feed_read (feedURL, function(err, articles) {
            if (err) {
                console.log("* WARNING: Unable to get the feed info of %s. ".red, feedURL);
                return;
            }
            var i = articles[Math.floor(Math.random() * articles.length)];
            common.botSay(target, "［ \x02" + i.title + "\x02 ］－  \x02" + i.link + "\x02");
        });
    });
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
