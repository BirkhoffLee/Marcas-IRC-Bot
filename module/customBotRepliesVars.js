/* global botReplies */

hook.on('common/reloadBotReplies', function (created, pattern, reply, by) {
    pattern = pattern.replaceAll("$BOTNAME$", config.getConfig().credentials.userName, true);
    pattern = pattern.replaceAll("$SP$", " ", true);

    botReplies[pattern] = {
        created: created,
        reply  : reply,
        by     : by
    };
});
