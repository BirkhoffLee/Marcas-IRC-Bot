var config = {

    /* Your credentials */
    credentials: {
        userName: "MarcasBot",
        realName: "Marcas-IRC-Bot",
        channels: [
            "#ysitd",
            "#sinta",
            "#birkhoff",
            "#birkhofftest",
            "#ysttd"
        ],
        server: "asimov.freenode.net",
        floodProtection: true,
        floodProtectionDelay: 1000,
        autoRejoin: true,
        debug: true,
        showErrors: false  // node-irc 0.3.12 irc.js:591
    },

    /* Necessary system modules */
    necessaryModule: [
        "events",
        "irc",
        "nedb",
        "require-directory",
        "colors",
        "fs"
    ],

    /* Other settings */
    others: {
        version: "2.1.8",
        identify: "0000",
        admin: [
            "admin1",
            "admin2"
        ],
        commandPrefix: "~",
        callFormat: "{nick}: ",
        botSayColors: {
            black:       "\x0301",
            blue:        "\x0302",
            green:       "\x0303",
            red:         "\x0304",
            brown:       "\x0305",
            purple:      "\x0306",
            orange:      "\x0307",
            yellow:      "\x0308",
            light_green: "\x0309",
            light_blue:  "\x0310",
            gray_blue:   "\x0311",
            blue:        "\x0312",
            gray1:       "\x0313",
            gray2:       "\x0314",
            gray3:       "\x0315",
            gray4:       "\x0316"
        },
        maxListeners: 0, // 0: unlimited
        channelOpAreAdmin: true,
        trimMessage: true
    }
};


/**
 * Returns the config object.
 * @return {array} configuration
 */
function getConfig() {
    return config;
}

/**
 * Sets the new config.
 * @param {array} newConfig
 * @return {boolean}
 */
function setConfig(newConfig) {
    return (config = newConfig);
}

exports.getConfig = getConfig;
exports.setConfig = setConfig;
