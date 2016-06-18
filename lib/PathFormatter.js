/**
 * A static method used to format a string based on the given path mask and
 * specified parameters.
 */
function PathMapper() {
}
PathMapper.formatPath = function(mask, params) {
    params = params || {};
    var array = mask.split(/[:\*]/gim);
    var path = [];
    for (var i = 0; i < array.length; i++) {
        var segment = array[i];
        if (i === 0) {
            if (segment !== '') {
                path.push(segment);
            }
        } else {
            var name = null;
            var idx = segment.indexOf('/');
            if (idx >= 0) {
                name = segment.substring(0, idx);
                segment = segment.substring(idx);
            } else {
                name = segment;
                segment = null;
            }
            var value = params[name];
            if (typeof value === 'function') {
                value = value();
            }
            delete params[name];
            path.push(value);
            if (segment && segment !== '') {
                path.push(segment);
            }
        }
    }
    return path.join('');
}

module.exports = PathMapper;
