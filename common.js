/* global Client */
/* global database */
/* global botReplies */
/* global sAdminList */
/* global _fs */
/* global hook */
/* global common */
/* global botBanList */
/* global config */

/**
 * Marcas
 *
 * A boy IRC bot.
 */

/**
 * Returns the target by the default rule.
 * (If "to" is the bot's name, the target sets to "from", or target sets to "to")
 * @param  {string} from
 * @param  {string} to
 * @return {string}
 */
function defaultTarget (from, to) {
    return (to == config.getConfig().credentials.userName) ? from : to;
}

/**
 * Checks if someone got banned.
 * @param  {string}   nick
 * @return {boolean}
 */
function isBanned (nick) {
    if (typeof botBanList == "undefined") {
        return false;
    }

    var result = false;

    botBanList.forEach(function (banRegex) {
        if (new RegExp(banRegex, "i").test(nick)) {
            result = true;
            return;
        }
    });

    return result;
}

/**
 * Parse the content of the chat.
 * @param  {string} from
 * @param  {string} to
 * @param  {string} message
 * @return {void}
 */
function parseChat (from, to, message) {
    if (config.getConfig().others.trimMessage) {
        message = message.trim();
    }

    hook.emit("common/parseChat", from, to, message);
}

/**
 * Parse the command to run.
 * @param  {string} from
 * @param  {string} to
 * @param  {string} message
 * @return {void}
 */
function runCommand (from, to, message) {
    var target  =  common.defaultTarget(from, to);
    var cmdPre  =  config.getConfig().others.commandPrefix;
    var args    =  message.split(' ');
        args[0] =  args[0].replace(cmdPre, "");
    var command =  args[0];
    var isAdmin =  false;

    if (!new RegExp("^[A-Za-z0-9]").test(command)) {
        // Ignore non-alphanumeric command name
        util.log("* COMMAND: Ignored.".magenta);
        return;
    }

    if (command == "sudo") {
        if (typeof args[1] == "undefined") {
            common.botSay(target, common.mention(from) + "Usage: " + cmdPre + "sudo <command>", "red");
            return;
        }

        var sudo    = true;
        isAdmin = common.isAdmin(from, to, sudo);
        args.shift();       // delete "sudo"
        command = args[0];  // make the second argu to the first
        message = message.replace("sudo ", "");

        if (!isAdmin) {
            common.botSay(target, common.mention(from) + "Access Denied!", "red");
            util.log(("* WARNING: Unauthorized sudo request from " + from).red);
            return;
        }
    } else {
        if (to.slice(0, 1) == "#") {
            isAdmin = common.isAdmin(from, to);
        } else {
            isAdmin = common.isAdmin(from);
        }
    }

    if (isAdmin) {
        util.log(("* COMMAND: [sudo] Command name: " + command).magenta);
    } else {
        util.log(("* COMMAND: Command name: " + command).magenta);
    }

    if (!_fs.existsSync("./commands/" + command + ".js")) {
        common.botSay(target, common.mention(from) + "Command not found! Type '" + cmdPre + "help' for help.", "red");
        util.log( "* COMMAND: Command not found.".magenta );
        return;
    }

    hook.emit("common/runCommand", from, to, isAdmin, args, message);
}

/**
 * Check if the nick is one of the administrators.
 * @param  {string}   nick
 * @param  {string}   channel
 * @param  {boolean}  sudo
 * @return {Boolean}
 */
function isAdmin (nick, channel, sudo) {
    hook.emit("common/isAdmin", nick);

    if (typeof channel == "undefined") {
        channel = "";
    }
    if (typeof sudo == "undefined") {
        sudo = false;
    }

    /* If he's the admin of the bot, return true */
    if (config.getConfig().others.admin.inArray(nick)) {
        return true;
    } else {

        /* If he's the op of the talking channel and is sudoing, return true */
        if (config.getConfig().others.channelOpAreAdmin && sudo) {
            if (typeof sAdminList[channel] != "undefined" && sAdminList[channel].inArray(nick, "case-insensitive")) {
                return true;
            }
        }
        return false;
    }
}

/**
 * Mention someone.
 * @param  {string} nick
 * @return {string}
 */
function mention (nick) {
    return config.getConfig().others.callFormat.replaceAll("{nick}", nick);
}

/**
 * Reload botReplies
 * @return {void}
 */
function reloadBotReplies () {
    /* Backup */
    var oldBotReplies = {};
    if (typeof botReplies != "undefined") {
        oldBotReplies = botReplies;
    }

    /* Delete all botReplies in memory */
    botReplies = {};

    /* Reload */
    database.botReplies.find({}, function (err, documents) {
        if (err != null) {
            util.log("* WARNING: Failed loading botReplies!".red);
            return;
        }

        if (typeof documents == 'undefined' || documents == []) {
            return;
        }

        for (var doc in documents) {
            if (typeof documents[doc].created == 'undefined' || typeof documents[doc].content == 'undefined' || typeof documents[doc].reply == 'undefined' || typeof documents[doc].by == 'undefined') {
                return;
            }

            hook.emit(
                    "common/reloadBotReplies",
                    documents[doc].created,
                    documents[doc].content,
                    documents[doc].reply,
                    documents[doc].by );
        }
    });
}

/**
 * Reload botBanList
 * @return {void}
 */
function reloadBotBanList () {
    /* Backup */
    var oldBotBanList = [];
    if (typeof botBanList != "undefined") {
        oldBotBanList = botBanList;
    }

    /* Delete all botBanList in memory */
    botBanList = [];

    /* Reload */
    database.botBanList.find({}, function (err, documents) {
        if (err !== null) {
            util.log("* WARNING: Failed loading botBanList!".red);
        } else if (typeof documents !== 'undefined' && documents != []) {
            for (var doc in documents) {
                if (typeof documents[doc].banNick != "undefined") {
                    botBanList.push(documents[doc].banNick);
                }
            }
        }
    });
}

/**
 * Say something
 * @param  {string}  target     the target to say
 * @param  {string}  content    what to say
 * @param  {string}  color      display color
 * @param  {boolean} singleLine just say a line
 * @return {boolean}
 */
function botSay (target, content, color, singleLine) {
    hook.emit("common/botSay", target, content, color);
    var colors = config.getConfig().others.botSayColors;

    if (typeof color == 'undefined' || typeof colors[color] == 'undefined') {
        color = "";  // black
    } else {
        color = colors[color];
    }

    var say = color + content.replaceAll("\n", "\n" + color, true);
    try {
        if (singleLine) {
            return Client.say(target, say, singleLine);
        }

        return Client.say(target, say);
    } catch(e) {
        util.log("* WARNING: ERROR SENDING MESSAGE".red);
    }
}

/**
 * Check if "find" is in the array
 * @param  {string} array
 * @param  {string} find
 * @param  {string} option  supports "case-insensitive"
 * @return {boolean}
 */
function inArray (array, find, option) {
    var length = array.length;

    for (var i = 0; i < length; i++) {
        if (option == "case-insensitive") {
            if (array[i].toLowerCase() == find.toLowerCase()) {
                return true;
            }
        }
        if (array[i] == find) {
            return true;
        }
    }

    return false;
}

exports.defaultTarget = defaultTarget;
exports.isBanned = isBanned;
exports.parseChat = parseChat;
exports.runCommand = runCommand;
exports.isAdmin = isAdmin;
exports.mention = mention;
exports.reloadBotReplies = reloadBotReplies;
exports.reloadBotBanList = reloadBotBanList;
exports.botSay = botSay;
exports.inArray = inArray;
