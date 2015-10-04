var header = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'Cookie': 'over18=1',
                'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3'
            };

hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("cheerio");
    configArr.necessaryModule.push("html-entities");
    configArr.necessaryModule.push("iconv-lite");
    config.setConfig(configArr);
});

hook.on('initalize/initalize', function () {
    var htmlEntities = _html_entities.XmlEntities;
        entities = new htmlEntities();
});

hook.on('common/parseChat', function (from, to, message) {
    var target = common.defaultTarget(from, to);

    var url = message.trim().match(/https?:\/\/\S*/ig);
    if (url == null) {
        return;
    }

    url.forEach(function (thisUrl) {
        _request ({
            url: thisUrl.trim(),
            headers: header,
            timeout: 6000,
            // gzip: true,
            encoding: null
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    var encode = response.headers['content-type'].match(/charset=\S+/i).toString().replace('charset=', '');
                } catch (e) {
                    // ignore
                }

                if (typeof encode != "undefined" && !encode.match('utf-8')) {
                    body = _iconv_lite.decode(body, encode);
                }

                $ = _cheerio.load(body);
                var title = entities.decode($('title').text().trim().replace(/\n/g, ' '));
                if (title != '') {
                    common.botSay(target, "［ \x02" + title + "\x02 ］－  \x02" + response.request.host.trim() + "\x02");
                }
            }
        });
    });
});
