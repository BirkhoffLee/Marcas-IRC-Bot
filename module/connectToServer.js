/**
 * Connecting to IRC Server.
 *
 * A boy IRC bot, Marcas.
 */

hook.on("initalize/connect", function () {
    var _config = config.getConfig();

    Client = new _irc.Client(
        _config.credentials.server,
        _config.credentials.userName,
        _config.credentials );
});
