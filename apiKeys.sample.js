var apiKeys = {
    "goo_gl": "",
    "pagespeed": "",
    "thinkpage_weather": "", // http://www.thinkpage.cn/weather/api
    "baidu_translate": "" // http://goo.gl/C8GpPl
};

/**
 * Returns the config object.
 * @return {array} configuration
 */
function getApiKeys() {
    return apiKeys;
}

exports.getApiKeys = getApiKeys;
