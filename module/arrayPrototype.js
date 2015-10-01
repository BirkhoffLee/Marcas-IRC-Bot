/**
 * Array prototype sets.
 *
 * A boy IRC bot, Marcas.
 */

/**
 * Array.prototype.inArray   Returns true if find is in the array.
 * @param  {String} find   String to find
 * @return {boolean}
 */
Array.prototype.inArray = function (find, option) {
    var length = this.length;

    for (var i = 0; i < length; i++) {
        if (option == "case-insensitive") {
            if (this[i].toLowerCase() == find.toLowerCase()) {
                return true;
            }
        }
        if (this[i] == find) {
            return true;
        }
    }

    return false;
};
