var config = {

    /* Connection credentials */
    credentials: {
        /*
          Bot's name on IRC.
         */
        userName: "MarcasBot",

        /*
          Bot's real name.
         */
        realName: "Marcas-IRC-Bot",

        /*
          Channels will Marcas join.
         */
        channels: [
            "#ysitd",
            "#sinta",
            "#oktw",
            "#birkhoff",
            "#ysttd"
        ],

        /*
          The server will Marcas connect.
         */
        server: "asimov.freenode.net",

        /*
          Recommended configuration.
          Don't touch this if you don't
          know what are you doing.
         */
        port: 6697,
        secure: true,
        floodProtection: false,
        floodProtectionDelay: 0,
        autoRejoin: true,
        debug: true,
        showErrors: false  // node-irc 0.3.12 irc.js:591
    },

    others: {
        /*
          The version of Marcas.
         */
        version: "2.3.3",

        /*
          Password for NickServ.
         */
        identify: "0000",

        /*
          Marcas' masters. This should be a nickname.
          For example: "~shutdown"
         */
        admin: [
            "admin1",
            "admin2"
        ],

        /*
          Marcas will execute commands from messages starts with this.
          For example: "~help"
         */
        commandPrefix: "~",

        /*
          Marcas will use this format to mention somebody.
         */
        callFormat: "{nick}: ",

        /*
          This will be the default togglelist if there
          is no botToggles.db
         */
        toggleList: {
            title: true,
            reply: true,
            titlestricturl: false
        },

        /*
          If this is set to true, Marcas will give channel operators
          admin permission. But they must use "~sudo" to execute
          admin commands. For example: "~sudo toggle title"
         */
        channelOpAreAdmin: true,

        /*
          If this is set to true, Marcas will turn "  ~help " as "~help"
         */
        trimMessage: true,

        /*
          Do not touch this if you don't
          know what are you doing.
          0: unlimited
         */
        maxListeners: 0,

        /*
          Do not touch this if you don't
          know what are you doing.
         */
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
        }
    },

    /*
      Do not touch this if you don't
      know what are you doing.
     */
    necessaryModule: [
        "events",
        "irc",
        "nedb",
        "require-directory",
        "colors",
        "fs"
    ]
};

/*
  OK, stop editing!
  ======================================
 */


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
