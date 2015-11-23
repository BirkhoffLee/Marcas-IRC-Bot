var commandName      = "toggle";
var commandSudo      = true;
var commandHelp      = "Toggle features on/off.";
var commandUsage     = "[toggleName]";
var commandDisabled  = false;

hook.on('initalize/initalize', function () {
    toggleList = {};
    database["toggle"] = new _nedb({ filename: 'botToggles.db'});
    database.toggle.loadDatabase(function (error) {
        if (error) {
            util.log("* ERROR LOADING TOGGLELIST DATABASE. EXITING");
            process.exit(1);
        }

        database.toggle.find({}, function (err, docs) {
            if (docs.length == 0) {
                _toggleList = config.getConfig().others.toggleList;
                for (var name in _toggleList) {
                    var data = {
                        name: name,
                        status: _toggleList[name]
                    };
                    database.toggle.insert(data);
                }
                return;
            }

            toggleList = {};
            docs.forEach(function (doc) {
                toggleList[doc.name] = doc.status;
            });
        });
    });
});

hook.on('common/runCommand', function (from, to, isAdmin, args, message) {
    var target = common.defaultTarget(from, to);

    if (args[0] != commandName || commandDisabled) {
        return;
    }
    if (commandSudo && !isAdmin) {
        util.log(("* WARNING: Unauthorized sudo request from " + from).red);
        common.botSay(target, common.mention(from) + "Access Denied!", "red");
        return;
    }
    if (typeof args[1] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return false;
    }

    var name = args[1];
    database.toggle.find({name: name}, function (err, docs) {
        if (docs.length != 0) {
            if (docs[0].status == true) {
                var turnto = false;
            } else {
                var turnto = true;
            }
            database.toggle.update({name: name}, {$set: {name: name, status: turnto}}, {}, function (err, numReplaced) {
                if (!err) {
                    database.toggle.find({}, function (err, docs) {
                        toggleList = {};
                        docs.forEach(function (doc) {
                            toggleList[doc.name] = doc.status;
                        });
                    });

                    common.botSay(target, common.mention(from) + "The value of '" + name + "' changed to " + turnto.toString() + ".", "blue");
                } else {
                    common.botSay(target, common.mention(from) + "Operation failure!", "red");
                }
            });
        } else {
            common.botSay(target, common.mention(from) + "Feature not found!", "red");
        }
    });
});

hook.on('command/help', function (target, isAdmin, args, cmdPrefix) {
    /* DO NOT TOUCH THIS */
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
