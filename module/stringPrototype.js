/**
 * String prototype sets.
 *
 * A boy IRC bot, Marcas.
 */

/**
 * String.prototype.startsWith   Returns true if the string starts with str.
 * @param  {String} str
 * @return {boolean}
 */
String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};

/**
 * String.prototype.isContain   Returns true if the string contains find.
 * @param  {String} find   String to find
 * @return {boolean}
 */
String.prototype.isContain = function (find) {
    return this.indexOf(find) !== -1;
};

/**
 * String.prototype.replaceAll   Replace all.
 * @param  {String}  reallyDo
 * @param  {String}  replaceWith
 * @param  {boolean} ignoreCase
 * @return {boolean}
 */
/*
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}
*/
String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}
