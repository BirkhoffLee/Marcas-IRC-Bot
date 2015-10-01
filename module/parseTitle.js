hook.on('initalize/prepare', function () {
    var configArr = config.getConfig();
    configArr.necessaryModule.push("cheerio");
    configArr.necessaryModule.push("html-entities");
    configArr.necessaryModule.push("url");
    config.setConfig(configArr);
});

hook.on('common/parseChat', function (from, to, message) {
    var target = common.defaultTarget(from, to);
    var htmlEntities = _html_entities.XmlEntities;
    var entities = new htmlEntities();

    var url = message.match(/https?:\/\/\S*/ig);
    if (url == null) {
        return;
    }

    url.forEach(function (thisUrl) {
        var options = {
            url: thisUrl.trim(),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
                'Cookie': 'over18=1',
                'Accept-Language': 'zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3'
            },
            timeout: 1500,
            gzip: true
        };

        _request (options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                $ = _cheerio.load(body);
                var title = entities.decode($('title').text().trim());
                if (title != '') {
                    common.botSay(target, "［ \x02" + title.replace(/\n/g, " ") + "\x02 ］－  \x02" + _url.parse(options.url).host + "\x02");
                }
            }
        });
    });
});
