/**
 * This class is used to map path masks to objects. It allows to find nearest
 * object matching to the given path. This class is useful to implement call
 * routers.
 */
export default class PathMapper {

    /**
     * Adds a new object to this mapper.
     * 
     * @param mask
     *            path mask used to dispatch to this object
     * @param obj
     *            the object to add
     */
    add(mask, obj) {
        let chunks = [];
        let names = [];
        let a = false;
        let segments = mask.split('*'); 
        segments.forEach(function(segment) {
            let b = false;
            let array = segment.split(':');
            array.forEach(function(str) {
                if (!a && !b) {
                    chunks.push(esc(str));
                } else if (a || b) {
                    let idx = str.indexOf('/');
                    let r = b ? '[^\/]+' : '.*?';
                    if (idx >= 0) {
                        chunks.push(wrap(r));
                        names.push(str.substring(0, idx));
                        chunks.push(esc(str.substring(idx)));
                    } else {
                        chunks.push(wrap(r));
                        names.push(str);
                    }
                }
                b = true;
            });
            a = true;
        });
        let str = chunks.join('');
        let regexp = new RegExp('^' + str + '$');
        this._handlers = this._handlers || [];
        this._handlers.push({
            mask : mask,
            regexp : regexp,
            names : names,
            obj : obj
        });
    }

    /**
     * Finds and returns a nearest object corresponding to the given path. This
     * method returns an object with two fields: 1) The 'obj' field contains the
     * found object 2) The 'params' field contains all found path parameters
     * (defined in the initial path mask used to register this object).
     */
    find(path) {
        let result = null;
        this._handlers = this._handlers || [];
        for (let i = 0, len = this._handlers.length; !result && i < len; i++) {
            let handler = this._handlers[i];
            if (!handler.regexp.test(path))
                continue;
            let params = {};
            let regexp = handler.regexp.exec(path);
            let array = regexp.slice(1);
            let idx = 0;
            array.forEach(function(param) {
                let name = handler.names[idx++];
                let value = param ? decodeURIComponent(param) : null;
                params[name] = value;
            });
            result = {
                params : params,
                obj : handler.obj
            };
        }
        return result;
    }

    /**
     * Removes and returns the mapped object corresponding to the specified path
     * mask.
     */
    remove(mask) {
        let result = null;
        let removed = null;
        let handlers = this._handlers || [];
        this._handlers = [];
        handlers.forEach(function(handler) {
            let keep = true;
            if (handler.mask === mask) {
                removed = handler.obj;
            } else {
                this._handlers.push(handler);
            }
        }, this);
        return removed;
    }

}


/** Regular expression used to find and replace special symbols. */
let escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
/** Escapes the specified string */
function esc(str) {
    return str.replace(escapeRegExp, '\\$&');
}
/** Transforms the given string in a Regexp group. */
function wrap(str) {
    return '(' + str + ')';
}
