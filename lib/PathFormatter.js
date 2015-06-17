export default class PathMapper {
    /**
     * A static method used to format a string based on the given path mask and
     * specified parameters.
     */
    static formatPath(mask, params) {
        params = params || {};
        let array = mask.split(/[:\*]/gim);
        let path = [];
        for (let i = 0; i < array.length; i++) {
            let segment = array[i];
            if (i === 0) {
                if (segment !== '') {
                    path.push(segment);
                }
            } else {
                let name = null;
                let idx = segment.indexOf('/');
                if (idx >= 0) {
                    name = segment.substring(0, idx);
                    segment = segment.substring(idx);
                } else {
                    name = segment;
                    segment = null;
                }
                let value = params[name];
                if (!value) {
                    let msg = 'Required parameter "' + name + '" not defined.';
                    let err = new Error(msg);
                    err._code = 400;
                    throw err;
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
}
