hook.on('listeners/message', function (from, to, message) {
    if (common.isBanned(from)) {
        return;
    }

    console.log("* CHAT: %s => %s: %s", from, to, message);
    common.parseChat(from, to, message);
});
