/* global process */
/* global hook */
/* global config */
/* global util */
/* global common */
/* global _cheerio */
/* global toggleList */
/* global _entities */
/* global _html_entities */
/* global _node_icu_charset_detector */
/* global _iconv_lite */
/* global _request */

var entities,
    header = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
        'Cookie': 'over18=1',
        'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3'
    };

/**
 * checkEnv  Check if the environment is supported
 * @return {boolean}
 */
function checkEnv () {
    try {
        require.resolve("node-icu-charset-detector");
    } catch (e) {
        if (e.code == "MODULE_NOT_FOUND" && process.env.OS == "Windows_NT") {
            return false;
        }
    }

    return true;
}

/**
 * requestHTML  Request the target url
 * @param  {string} from
 * @param  {string} to
 * @param  {string} message
 * @return {void}
 */
function requestHTML (from, to, message) {
    var target = common.defaultTarget(from, to);

    var url = message.trim().match(/https?:\/\/\S*/ig);
    if (url == null) {
        return;
    }

    url.forEach(function (thisUrl) {
        thisUrl = thisUrl.trim();
        util.log("[" + thisUrl + "] Requesting.");

        _request ({
            url      : thisUrl,
            headers  : header,
            timeout  : 6000,
            encoding : null,
            gzip     : true,
            followRedirect: true
        }, function(error, response, body) {
            if (!error) {
                var host;

                if (typeof response.request.uri.href != "undefined") {
                    host = response.request.uri.href.trim().match(/https?:\/\/([^\/]+)\/?/i)[1];
                } else if (typeof this.uri.href != "undefined") {
                    host = this.uri.href.trim().match(/https?:\/\/([^\/]+)\/?/i)[1];
                } else {
                    host = thisUrl.trim().match(/https?:\/\/([^\/]+)\/?/i)[1];
                }
                parseTitle(thisUrl, target, response, body, host.trim());
            }
        });
    });
}

/**
 * parseTitle  Parse the title in the HTML code
 * @param  {string} thisUrl
 * @param  {string} target
 * @param  {string} response
 * @param  {string} body
 * @param  {string} host
 * @return {void}
 */
function parseTitle (thisUrl, target, response, body, host) {
    util.log("[" + thisUrl + "] Request ended. Starting parsing.");
    var str, charset;

    try {
        charset = _node_icu_charset_detector.detectCharset(body);
    } catch (e) {
        charset = "UTF-8";
    }

    if (charset != "UTF-8") {
        try {
            str = _iconv_lite.decode(body, charset).toString().trim();
            util.log(("[" + thisUrl + "] Converted to " + charset + ".").red);
        } catch (e) {
            str = body.toString().trim();
            util.log(("[" + thisUrl + "] Failed converting to " + charset + ".").red);
        }
    } else {
        str = body.toString().trim();
        util.log("[" + thisUrl + "] Not converted.");
    }

    try {
        var $ = _cheerio.load(str);
        var title = _entities.decode($('title').text().trim().replace(/\n/g, ' ')).replace(/((?:\u0003\d\d?,\d\d?|\u0003\d\d?|\u0002|\u001d|\u000f|\u0016|\u001f))/g, '');

        if (title != "") {
            common.botSay(target, "［ \x02" + title + "\x02 ］－ \x02" + host + "\x02");
        }
    } catch (e) {
        util.log(("[" + thisUrl + "] FAILED parsing title.").red);
    }
}

hook.on('initalize/initalize', function () {
    if (!checkEnv()) {
        util.log("* WARNING: Parse title feature disabled due to the OS is Windows and Windows do not have node-icu-charset-detector module.");
        return;
    }

    var htmlEntities = _html_entities.XmlEntities;
        _entities    = new htmlEntities();
});

hook.on('initalize/prepare', function () {
    if (!checkEnv()) {
        return;
    }

    var configArr = config.getConfig();
    configArr.necessaryModule.push("request");
    configArr.necessaryModule.push("cheerio");
    configArr.necessaryModule.push("iconv-lite");
    configArr.necessaryModule.push("node-icu-charset-detector");
    configArr.necessaryModule.push("html-entities");
    config.setConfig(configArr);
});

hook.on('common/parseChat', function (from, to, message) {
    if (!checkEnv()) {
        return;
    }

    if (!toggleList.title || common.isBanned(from)) {
        return;
    }

    requestHTML(from, to, message);
});
