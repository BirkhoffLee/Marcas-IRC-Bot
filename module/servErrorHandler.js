hook.on('listeners/error', function (from, to, message) {
    if (typeof message == "undefined") {
        console.log( "* WARNING: Server sent an error message!".red );
        return;
    }

    console.log( "* WARNING: Server sent an error message:".red );

    switch (typeof message) {
        case "object":
            console.dir(message);
            break;

        default:
            console.log(message);
            break;
    }
});
