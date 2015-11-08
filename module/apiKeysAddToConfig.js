/**
 * Add the pre-set api keys to the configuration
 *
 * A boy IRC bot, Marcas.
 */

hook.on('initalize/initalize', function () {
    var apiKeys = require('../apiKeys.js');
    var configArr = config.getConfig();
    configArr.apiKeys = apiKeys.getApiKeys();
    config.setConfig(configArr);
});
