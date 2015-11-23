hook.on('listeners/error', function (from, to, message) {
    if (typeof message == "undefined") {
        util.log( "* WARNING: Server sent an error message!".red );
        return;
    }

    util.log( "* WARNING: Server sent an error message:".red );

    switch (typeof message) {
        case "object":
            console.dir(message);
            break;

        default:
            util.log(message);
            break;
    }
});
