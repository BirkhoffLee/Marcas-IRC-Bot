var commandName      = "explore";
var commandSudo      = false;
var commandHelp      = "Give you something you may have interest to.";
var commandUsage     = "";
var commandDisabled  = false;
var shortenURL       = true;
var shortenAPIURL;

var feedList = [
    "http://feeds.feedburner.com/freegroup/",
    "http://feeds.feedburner.com/soft4funtw",
    "http://chinese.engadget.com/rss.xml",
    "http://www.ithome.com.tw/rss",
    "http://pansci.tw/feed"
];

function randArray (data) {
    /* from: http://www.uw3c.com/jsviews/js39.html */
    var arrlen = data.length;
    var try1 = new Array();
    for(var i = 0;i < arrlen; i++){
        try1[i] = i;
    }
    var try2 = new Array();
    for(var i = 0;i < arrlen; i++){
        try2[i] = try1.splice(Math.floor(Math.random() * try1.length),1);
    }
    var try3 = new Array();
    for(var i = 0; i < arrlen; i++){
        try3[i] = data[try2[i]];
    }
    return try3;
}

hook.on('initalize/initalize', function () {
    var apiKeysArr = config.getConfig().apiKeys;
    if (typeof apiKeysArr.goo_gl == "undefined" || apiKeysArr.goo_gl == "") {
        commandDisabled = true;
        console.log("* WARNING: goo.gl API key not given".red);
        return;
    }

   shortenAPIURL = 'https://www.googleapis.com/urlshortener/v1/url?key=' + apiKeysArr.goo_gl;
});

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("feed-read");
    configArr.necessaryModule.push("request");
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

    if (to.startsWith("#")) {
        common.botSay(target, common.mention(from) + "Explore data are sent as private messages.", "green");
    }

    randArray(feedList).forEach(function (feedURL) {
        _feed_read (feedURL, function(err, articles) {
            if (err) {
                console.log("* WARNING: Unable to get the feed info of %s. ".red, feedURL);
                return;
            }
            var i = articles[Math.floor(Math.random() * articles.length)];
            if (shortenURL) {
                var data = {
                    uri: shortenAPIURL.trim(),
                    json: {
                        "longUrl": i.link.trim()
                    }
                };

                _request.post(data, function(err, response, body) {
                    if (!err && response.statusCode == 200 && typeof body.id != "undefined") {
                        if (to.startsWith("#")) {
                            common.botSay(from, "［ \x02" + i.title + "\x02 ］－  \x02" + body.id + "\x02");
                        } else {
                            common.botSay(target, "［ \x02" + i.title + "\x02 ］－  \x02" + body.id + "\x02");
                        }
                    }
                });
            } else if (to.startsWith("#")) {
                common.botSay(from, "［ \x02" + i.title + "\x02 ］－  \x02" + i.link + "\x02");
            } else {
                common.botSay(target, "［ \x02" + i.title + "\x02 ］－  \x02" + i.link + "\x02");
            }
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
