hook.on('common/parseChat', function (from, to, message) {
    if (message.startsWith(config.getConfig().others.commandPrefix)) {
        console.log( "* Running command.".red );
        common.runCommand(from, to, message);
        return;
    }
});
