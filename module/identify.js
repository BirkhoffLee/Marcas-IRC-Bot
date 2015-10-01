/**
 * IRC Server nick identify
 *
 * A boy IRC bot, Marcas.
 */

hook.on('initalize/initalize', function () {
    var configArr = config.getConfig();
    configArr.others.identified = false;
    configArr.others.sentIdentify = false;
    config.setConfig(configArr);
});

hook.on('listeners/join', function (channel, nick, message) {
    if (nick == config.botName) {
        if (!config.getConfig().others.sentIdentify && botConfig.identify != "") {
            var configArr = config.getConfig();
            configArr.others.sentIdentify = true;
            config.setConfig(configArr);

            common.botSay("NickServ", "identify " + botConfig.identify, "none");
        }
    }
});

hook.on('listeners/notice', function (nick, to, text, message) {
    if (to == config.botName && nick == "NickServ" && !config.getConfig().others.sentIdentify) {

        if (text.startsWith("You are now identified for")) {

            var configArr = config.getConfig();
            configArr.others.identified = true;
            config.setConfig(configArr);
            console.log( " * Identified.".red );

        } else if (!text.startsWith("This nickname is registered. Please choose ")) {

            var warn = "WARNING: NickServ sent a message: " + text;
            config.getConfig().others.admin.forEach(function (admin) {
                console.log( (" * " + warn).red );
                common.botSay(admin, warn, "red");
            });

        }

        return;
    }
});
