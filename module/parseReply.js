hook.on('common/parseChat', function (from, to, message) {
    if (typeof botReplies == "undefined") {
        return;
    }

    for (var pattern in botReplies) {
        hook.emit("module/parseReply", pattern);

        if (new RegExp(pattern, 'i').exec(message) !== null) {
            var target = common.defaultTarget(from, to);

            console.log("* AUTO-REPLY: %s is match with pattern %s", message, pattern);
            common.botSay(target, botReplies[pattern].reply);
        }
    }
});
