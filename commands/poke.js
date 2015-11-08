var commandName      = "poke";
var commandSudo      = false;
var commandHelp      = "Poke someone.";
var commandUsage     = "[toPoke]";
var commandDisabled  = false;

var emojies = ["(`・ω・´)", "(´・ω・`)", "(́◉◞౪◟◉‵)", "(ﾟ∀。)", "(ゝ∀･)", "(σ′▽‵)′▽‵)σ", "σ ﾟ∀ ﾟ) ﾟ∀ﾟ)σ ", "ヾ(●゜▽゜●)♡ "];

function randomEmoji () {
    return emojies[Math.floor(Math.random() * emojies.length)];
}

hook.on('common/runCommand', function (from, to, isAdmin, args, message) {
    var target = common.defaultTarget(from, to);

    if (args[0] != commandName || commandDisabled) {
        return;
    }
    if (commandSudo && !isAdmin) {
        console.log("* WARNING: Unauthorized sudo request from %s".red, from);
        common.botSay(target, common.mention(from) + "Access Denied!", "red");
        return;
    }
    if (typeof args[1] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return false;
    }

    var nick = args[1];

    if (!to.startsWith("#")) {
        common.botSay(target, common.mention(from) + "Sorry, this command is not executed from PMs.", "red");
        return;
    }
    if (common.isBanned(nick)) {
        common.botSay(target, common.mention(from) + "Sorry, but " + nick + " is in my ban list.", "red");
        return;
    }
    if (typeof Client.chans[to].users[nick] == "undefined") {
        common.botSay(target, common.mention(from) + "Sorry, but I found that " + nick + " has not joined this channel yet.", "red");
        return;
    }

    common.botSay(to, common.mention(nick) + "\x02" + from + "\x02 is poking you! " + randomEmoji());
});

hook.on('command/help', function (target, isAdmin, args, cmdPrefix) {
    if (typeof commandName  == "undefined" || typeof commandSudo  == "undefined" ||
        typeof commandHelp  == "undefined" || typeof commandUsage == "undefined") {
        return;
    }
    var helpString = cmdPrefix + commandName + ": ";

    if (commandSudo) {
        if (commandDisabled) {
            helpString += "\x02(Needs admin and disabled)\x02";
        } else {
            helpString += "\x02(Needs admin)\x02";
        }
    } else {
        if (commandDisabled) {
            helpString += "\x02(Disabled)\x02";
        }
    }

    helpString += " " + commandHelp;

    if (typeof args[1] != "undefined" && args[1] == commandName) {
        helpString = "\x02" + helpString + "\x02";
        helpString += "\nUsage: " + cmdPrefix + commandName + " " + commandUsage;
        common.botSay(target, helpString);
    }
});

