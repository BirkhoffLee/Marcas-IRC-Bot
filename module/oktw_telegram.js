hook.on('listeners/message', function (from, to, message) {
    var result = new RegExp("^<(.*?)>: (.*?)$", 'i').exec(message);
    if (from == "oktw" && result !== null) {
        from = result[1]; message = result[2];

        console.log("* TELEGRAM_CHAT: %s => %s: %s", from, to, message);
        common.parseChat(from, to, message);
        return;
    }
});
