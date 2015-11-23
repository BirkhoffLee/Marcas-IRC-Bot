/* global util */
/* global _nedb */
/* global config */
/* global database */
/* global common */
/* global hook */
/* global process */

/**
 * Marcas initalizing
 *
 * A boy IRC bot.
 */

util = require('util');

util.log("* INITALIZING");
util.log("* INITALIZING: LOADED MODULE: util");

config = require("../config");
common = require("../common");

/**
 * Set start time.
 */
var configArr = config.getConfig();
configArr.others.startTime = Math.round(new Date().getTime() / 1000);
config.setConfig(configArr);

/**
 * Initalize EventEmitter.
 */
var EventEmitter = require('events').EventEmitter;
hook = new EventEmitter();
hook.setMaxListeners(config.getConfig().others.maxListeners);

/**
 * Load bot modules
 */
require('require-directory')(module, "./");
require('require-directory')(module, "../commands");
hook.emit("initalize/prepare");

/**
 * Require necessary node_modules.
 */
var loadedModules = [];
var neededModules = [];
config.getConfig().necessaryModule.forEach(function (moduleName) {
    if (moduleName == 'require-directory') {
        return;
    }

    try {
        if (!loadedModules.inArray(moduleName)) {
            require.resolve(moduleName);

            eval("_" + moduleName.replaceAll('-', "_") + " = require('" + moduleName + "')");
            util.log("* INITALIZING: LOADED MODULE: " + moduleName);
            loadedModules.push(moduleName)
        }
    } catch(e) {
        console.error("\nNode module " + moduleName + " isn't found.");
        console.error("You may solve this by \"npm install " + moduleName + "\".");
        console.error("");
        console.error("The required node modules of this bot are below:");
        config.getConfig().necessaryModule.forEach(function(moduleName) {
            if (!neededModules.inArray(moduleName)) {
                neededModules.push(moduleName);
            }
        });
        util.log(neededModules.join(" "));

        process.exit(e.code);
    }
});

/**
 * Load database
 */
database  = {
                botReplies: new _nedb({ filename: 'botReplies.db', autoload: true }),
                botBanList: new _nedb({ filename: 'botBanList.db', autoload: true })
            };

/**
 * Initalize
 */
hook.emit("initalize/initalize");

/**
 * Load required vars
 */
common.reloadBotBanList();
common.reloadBotReplies();

/**
 * Connect to server.
 */
hook.emit("initalize/connect");
hook.emit("initalize/addListener");
