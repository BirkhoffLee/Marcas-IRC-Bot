var entities,
    header = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
    'Cookie': 'over18=1',
    'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3'
};

function requestHTML (from, to, message) {
    var target = common.defaultTarget(from, to);

    var url = message.trim().match(/https?:\/\/\S*/ig);
    if (url == null) {
        return;
    }

    url.forEach(function (thisUrl) {
        thisUrl = thisUrl.trim();
        console.log("[%s] Requesting.", thisUrl);

        _request ({
            url      : thisUrl,
            headers  : header,
            timeout  : 6000,
            encoding : null,
            gzip     : true,
            followRedirect: true
        }, function(error, response, body) {
            if (!error) {
                if (typeof response.request.uri.href != "undefined") {
                    var host = response.request.uri.href.trim().match(/https?:\/\/([^\/]+)\/?/i)[1];
                } else if (typeof this.uri.href != "undefined") {
                    var host = this.uri.href.trim().match(/https?:\/\/([^\/]+)\/?/i)[1];
                } else {
                    var host = thisUrl.trim().match(/https?:\/\/([^\/]+)\/?/i)[1];
                }
                parseTitle(thisUrl, target, response, body, host.trim());
            }
        });
    });
}

function parseTitle (thisUrl, target, response, body, host) {
    console.log("[%s] Request ended. Starting parsing.", thisUrl);

    try {
        var charset = _node_icu_charset_detector.detectCharset(body);
    } catch(e) {
        var charset = "UTF-8";
    }

    if (charset != "UTF-8") {
        var str = _iconv_lite.decode(body, charset).toString().trim();
        console.log("[%s] Converted to " + charset + ".", thisUrl);
    } else {
        var str = body.toString().trim();
        console.log("[%s] Not converted.", thisUrl);
    }

    $ = _cheerio.load(str);console.log(str);

    var title = _entities.decode($('title').text().trim().replace(/\n/g, ' ')).replace(/((?:\u0003\d\d?,\d\d?|\u0003\d\d?|\u0002|\u001d|\u000f|\u0016|\u001f))/g, '');
    if (title != "") {
        common.botSay(target, "［ \x02" + title + "\x02 ］－ \x02" + host + "\x02");
    }
}

hook.on('initalize/initalize', function () {
    var htmlEntities = _html_entities.XmlEntities;
        _entities    = new htmlEntities();
});

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("request");
    configArr.necessaryModule.push("cheerio");
    configArr.necessaryModule.push("iconv-lite");
    configArr.necessaryModule.push("node-icu-charset-detector");
    configArr.necessaryModule.push("html-entities");
    config.setConfig(configArr);
});

hook.on('common/parseChat', function (from, to, message) {
    if (!toggleList.title || common.isBanned(from)) {
        return;
    }

    requestHTML(from, to, message);
});
