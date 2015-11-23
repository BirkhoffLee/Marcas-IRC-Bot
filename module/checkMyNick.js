/* global Client */

hook.on("listeners/join", function (channel, nick, message) {
    if (nick == Client.nick && nick != config.getConfig().credentials.userName) {
        var configArr = config.getConfig();
        configArr.credentials.userName = Client.nick;
        config.setConfig(configArr);
    }
});
