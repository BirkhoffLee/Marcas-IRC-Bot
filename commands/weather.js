var commandName      = "weather";
var commandSudo      = false;
var commandHelp      = "Weather information.";
var commandUsage     = "[cityName]";
var commandDisabled  = false;

var apiKey           = "";
var apiAllurl        = "https://api.thinkpage.cn/v2/weather/all.json?city={city}&language=zh-cht&unit=c&aqi=&alarm=0&key=" + apiKey;
var cities = {
    "台北|臺北": "Taipei"  ,  "桃園": "Taoyuan" ,
    "新竹"     : "Xinzhu"  ,  "宜蘭": "Yilan"   ,
    "高雄"     : "Gaoxiong",  "嘉義": "Jiayi"   ,
    "台南"     : "Tainan"  ,  "台東": "Taidong" ,
    "屏東"     : "Pingdong",  "台中": "Taizhong",
    "苗栗"     : "Miaoli"  ,  "彰化": "Zhanghua",
    "南投"     : "Nantou"  ,  "花蓮": "Hualian" ,  "雲林": "Yunlin"
};

if (apiKey == "") {
    commandDisabled = true;
    console.log("* WARNING: Weather api key not given".red);
}

hook.on('common/runCommand', function (from, to, isAdmin, args, message) {
    var target = common.defaultTarget(from, to);

    if (args[0] != commandName || commandDisabled) {
        return;
    }
    if (commandSudo && !isAdmin) {
        console.log("* WARNING: Unauthorized sudo request from %s".red, from);
        common.botSay(target, common.mention(from) + "Access Denied!", "red");
        return;
    }
    if (typeof args[1] == "undefined") {
        common.botSay(target, "Usage: " + commandUsage, "red");
        return;
    }

    var city = args[1];
    for (var thecity in cities) {
        if (thecity.isContain("|")) {
            var thecities = thecity.split("|");
            for (var thisCity in thecities) {
                if (city == thecities[thisCity]) {
                    city = cities[thecity];
                    break;
                }
            }
        } else {
            if (city == thecity) {
                city = cities[thecity];
                break;
            }
        }
    }

    var requestURL = apiAllurl.replace("{city}", city);
    _request(requestURL, function (error, response, body) {
        if (error || response.statusCode != 200) {
            common.botSay(target, common.mention(from) + "Something went wrong, try again later :(", "red");
            return;
        }

        var json = JSON.parse(body);

        if (json.status != "OK") {
            common.botSay(target, common.mention(from) + "Something went wrong, maybe a mispelling of the city name?", "red");
            return;
        }

        var weather = json.weather[0];

        var cityName        = (weather.city_name)       ? weather.city_name   : "N/A" ;
        var lastUpdate      = (weather.last_update)     ? weather.last_update : "N/A" ;
        var nowText         = (weather.now.text)        ? weather.now.text    : "N/A" ;
        var nowTemperature  = (weather.now.temperature) ? weather.now.temperature : "N/A" ;

        var weatherText     = "－目前\x02" + cityName + "\x02的天氣：";
            weatherText    += nowText;
            weatherText    += "，氣溫：\x02" + nowTemperature.toString() + "°C\x02。\n";

        var futureText      = "";
        var futWeathers     = 0;
        var mostFutWeathers = 3;
        weather.future.forEach(function (dayWeather) {
            if (futWeathers == mostFutWeathers) {
                return;
            }
            futWeathers++;

            var date = (dayWeather.date) ? dayWeather.date : "N/A" ;
            var day  = (dayWeather.day) ? dayWeather.day : "N/A" ;
            var cop  = (dayWeather.cop) ? dayWeather.cop : "N/A" ;
            var text = (dayWeather.text.isContain("/")) ? dayWeather.text.split("/") : dayWeather.text;
            var high = (dayWeather.high == "-") ? "N/A" : dayWeather.high;
            var low  = (dayWeather.low == "-") ? "N/A" : dayWeather.high;

            if (typeof text == "object") {
                text = "上午\x02" + text[0] + "\x02，下午\x02" + text[1] + "\x02";
            } else {
                text = "\x02全天" + text + "\x02";
            }

            futureText += "－" + date + " " + day + "：";
            futureText += text;
            futureText += "，" + "氣溫：\x02" + high + "°C\x02 / \x02" + low + "°C\x02";
            futureText += "，" + "降雨概率：\x02" + cop.toString() + "\x02。";
        });
        weatherText += futureText;
        // weatherText += "最後更新 (ISO 8601)：" + lastUpdate.toString();

        common.botSay(target, weatherText, "blue");
    });
});

hook.on('command/help', function (target, isAdmin, args, cmdPrefix) {
    if (typeof commandName  == "undefined" || typeof commandSudo  == "undefined" ||
        typeof commandHelp  == "undefined" || typeof commandUsage == "undefined") {
        return;
    }
    var helpString = cmdPrefix + commandName + ": ";

    if (commandSudo) {
        if (commandDisabled) {
            helpString += "\x02(Needs admin and disabled)\x02";
        } else {
            helpString += "\x02(Needs admin)\x02";
        }
    } else {
        if (commandDisabled) {
            helpString += "\x02(Disabled)\x02";
        }
    }

    helpString += " " + commandHelp;

    if (typeof args[1] != "undefined" && args[1] == commandName) {
        helpString = "\x02" + helpString + "\x02";
        helpString += "\nUsage: " + cmdPrefix + commandName + " " + commandUsage;
        common.botSay(target, helpString);
    }
});

