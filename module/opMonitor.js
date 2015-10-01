function updateOPadmins (from, to, message) {
    if (!config.getConfig().others.channelOpAreAdmin) {
        return;
    }

    if (typeof botBanList != "undefined" && common.inArray(botBanList, from, "case-insensitive")) {
        return;
    }

    for (var channel in Client.chans) {
        for (var user in Client.chans[channel].users) {
            if (Client.chans[channel].users[user] == "@" && !sAdminList[channel].inArray(user, "case-insensitive")) {
                sAdminList[channel].push(user);
            }
        }
    }
}

hook.on('initalize/initalize', function () {
    sAdminList = {};

    config.getConfig().credentials.channels.forEach(function (channel) {
        sAdminList[channel] = [];
    });
});

hook.on('listeners/join', function (from, to, message) {
    updateOPadmins(from, to, message);
});

hook.on('listeners/quit', function (from, to, message) {
    updateOPadmins(from, to, message);
});

hook.on('listeners/kick', function (from, to, message) {
    updateOPadmins(from, to, message);
});

hook.on('listeners/nick', function (from, to, message) {
    updateOPadmins(from, to, message);
});
