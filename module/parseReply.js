function run (target, from, to, command) {
    command = config.getConfig().others.commandPrefix + command.replaceAll("{from}", from, true).replaceAll("{to}", to, true);
    command = command.replaceAll("{target}", target, true);
    common.runCommand(from, to, command);
}

hook.on('common/parseChat', function (from, to, message) {
    if (!toggleList.reply) {
        return;
    }

    if (typeof botReplies == "undefined") {
        return;
    }

    for (var pattern in botReplies) {
        hook.emit("module/parseReply", pattern);

        if (new RegExp(pattern, 'i').exec(message) !== null) {
            var target = common.defaultTarget(from, to);
            var value  = botReplies[pattern].reply.trim();

            if (!value.startsWith("#{") && value.slice(0, -1) != "}") {
                common.botSay(target, botReplies[pattern].reply);
                return;
            }

            var commands = value.split("}#{");
            if (commands.length == 1) {
                commands[0] = commands[0].slice(2, -1);
            } else {
                commands[0] = commands[0].slice(2);
                commands[commands.length - 1] = commands[commands.length - 1].slice(0, -1);
            }
            var first = false;
            commands.forEach(function (command) {
                if (!first) {
                    first = true;
                    run(target, from, to, command);
                } else {
                    setTimeout(function () {
                        run(target, from, to, command);
                    }, 700);
                }
            });
        }
    }
});
