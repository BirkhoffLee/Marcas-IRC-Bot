/**
 * IRC listeners.
 *
 * A boy IRC bot, Marcas.
 */

hook.on("initalize/addListener", function() {
    var listenerFunctions = {

        /**
        * Triggered when a private message was sent.
        * @param  {string} from    Library [node-irc] default argu
        * @param  {string} to      Library [node-irc] default argu
        * @param  {string} message Library [node-irc] default argu
        * @return {void}
        */
        message:    function(from, to, message) {
                        hook.emit("listeners/message", from, to, message);
                    },

        /**
        * Triggered when a notice was sent.
        * @param  {string} nick    Library [node-irc] default argu
        * @param  {string} to      Library [node-irc] default argu
        * @param  {string} text    Library [node-irc] default argu
        * @param  {string} message Library [node-irc] default argu
        * @return {void}
        */
        notice:    function(nick, to, text, message) {
                        hook.emit("listeners/notice", nick, to, text, message);
                    },

        /**
        * Triggered when someone sent an private message to us.
        * @param  {string} from    Library [node-irc] default argu
        * @param  {string} message Library [node-irc] default argu
        * @return {void}
        */
        pm:         function(from, message) {
                        hook.emit("listeners/pm", from, message);
                    },

        /**
        * Triggered when someone joins.
        * @param  {string} channel Library [node-irc] default argu
        * @param  {string} nick    Library [node-irc] default argu
        * @param  {string} message Library [node-irc] default afrgu
        * @return {void}
        */
        join:       function(channel, nick, message) {
                        hook.emit("listeners/join", channel, nick, message);
                    },

        /**
        * Triggered when someone leaves.
        * @param  {string} nick     Library [node-irc] default argu
        * @param  {string} reason   Library [node-irc] default argu
        * @param  {string} channels Library [node-irc] default argu
        * @param  {string} message  Library [node-irc] default argu
        * @return {string}          Library [node-irc] default argu
        */
        quit:       function(nick, reason, channels, message) {
                        hook.emit("listeners/quit", nick, reason, channels, message);
                    },

        /**
        * Triggered when someone got kicked.
        * @param  {string} channel Library [node-irc] default argu
        * @param  {string} nick    Library [node-irc] default argu
        * @param  {string} by      Library [node-irc] default argu
        * @param  {string} reason  Library [node-irc] default argu
        * @param  {string} message Library [node-irc] default argu
        * @return {void}
        */
        kick:       function(channel, nick, by, reason, message) {
                        hook.emit("listeners/kick", channel, nick, by, reason, message);
                    },

        /**
        * Triggered when the server sent an error.
        * @param  {string} message Library [node-irc] default argu
        * @return {void}
        */
        error:      function(message) {
                        hook.emit("listeners/error", message);
                    },

        /**
        * Triggered when someone changes his nick.
        * @param  {string} oldnick  Library [node-irc] default argu
        * @param  {string} newnick  Library [node-irc] default argu
        * @param  {string} channels Library [node-irc] default argu
        * @param  {string} message  Library [node-irc] default argu
        * @return {void}
        */
        nick:       function(oldnick, newnick, channels, message) {
                        hook.emit("listeners/nick", oldnick, newnick, channels, message);
                    },

        /**
        * Triggered when client receives a "message" from the server.
        * @param  {string} message  Library [node-irc] default argu
        * @return {void}
        */
        raw:        function(message) {
                        hook.emit("listeners/raw", message);
                    }
    };

    // Registers listeners
    for(var event in listenerFunctions) {
        Client.addListener(event, listenerFunctions[event]);
        hook.emit("listeners/registering", event, listenerFunctions);
    }
});
