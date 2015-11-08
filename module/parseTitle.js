var entities,
    header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
    'Cookie': 'over18=1',
    'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3'
};

function parseTitle (thisUrl, target, response, body) {
    console.log("[%s] Request ended. Starting parsing.", thisUrl);

    var host = (toggleList.titlestricturl && response.request.host) ? response.request.host.trim() : thisUrl.match(/https?:\/\/([^\/]+)\/?/i)[1].trim();

    var charset = _node_icu_charset_detector.detectCharset(body);
    if (charset != "UTF-8") {
        var str = _iconv_lite.decode(body, charset).toString().trim();
        console.log("[%s] Converted to " + charset + ".", thisUrl);
    } else {
        var str = body.toString().trim();
        console.log("[%s] Not converted.", thisUrl);
    }

    $ = _cheerio.load(str, {
        decodeEntities: true
    });

    var title = $('title').text().trim().replace(/\n/g, ' ');
    if (title != "") {
        common.botSay(target, "［ \x02" + title + "\x02 ］－ \x02" + host + "\x02");
    }
}

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("request");
    configArr.necessaryModule.push("cheerio");
    configArr.necessaryModule.push("iconv-lite");
    configArr.necessaryModule.push("node-icu-charset-detector");
    config.setConfig(configArr);
});

hook.on('common/parseChat', function (from, to, message) {
    if (!toggleList.title || common.isBanned(from)) {
        return;
    }

    var target = common.defaultTarget(from, to);

    var url = message.trim().match(/https?:\/\/\S*/ig);
    if (url == null) {
        return;
    }

    url.forEach(function (thisUrl) {
        thisUrl = thisUrl.trim();
        console.log("[%s] Requesting.", thisUrl);

        _request ({
            url: thisUrl,
            headers: header,
            timeout: 6000,
            encoding: null,
            gzip: true
        }, function(error, response, body) {
            if (!error) {
                parseTitle(thisUrl, target, response, body);
            }
        });
    });
});
