var commandName      = "help";
var commandSudo      = false;
var commandHelp      = "Show this help message.";
var commandUsage     = "<cmd>";
var commandDisabled  = false;

// http://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
var walk = function(dir, done) {
  var results = [];
  _fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      _fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

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

    var cmdPrefix = config.getConfig().others.commandPrefix;

    if (typeof args[1] == "undefined") {
        walk ("commands", function(err, results) {
            if (err) {
                common.botSay(target, common.mention(from) + "Error getting command list!");
                return;
            }

            var commandHelps = "";

            results.forEach(function (path) {
                var fn = _path.basename(path, '.js');
                if (!fn.startsWith("_")) {
                    commandHelps += ", " + _path.basename(path, '.js');
                }
            })
            common.botSay(target, common.mention(from) + "\x02Commands list (" + cmdPrefix + commandName + " <cmd> for further information): \x02" + commandHelps.slice(2));
        });
    }

    hook.emit("command/help", target, isAdmin, args, cmdPrefix);
});

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("path");
    config.setConfig(configArr);
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


