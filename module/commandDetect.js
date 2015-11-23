hook.on('common/parseChat', function (from, to, message) {
    if (message.startsWith(config.getConfig().others.commandPrefix)) {
        util.log( "* Running command.".red );
        common.runCommand(from, to, message);
        return;
    }
});
