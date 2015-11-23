hook.on('listeners/message', function (from, to, message) {
    if (common.isBanned(from)) {
        return;
    }

    util.log("* CHAT: " + from + " => " + to + ": " + message);
    common.parseChat(from, to, message);
});
