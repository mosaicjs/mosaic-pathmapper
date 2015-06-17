(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _libPathMapper = __webpack_require__(1);

	var _libPathMapper2 = _interopRequireDefault(_libPathMapper);

	var _libPathFormatter = __webpack_require__(2);

	var _libPathFormatter2 = _interopRequireDefault(_libPathFormatter);

	exports['default'] = {
	    PathMapper: _libPathMapper2['default'],
	    PathFormatter: _libPathFormatter2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * This class is used to map path masks to objects. It allows to find nearest
	 * object matching to the given path. This class is useful to implement call
	 * routers.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var PathMapper = (function () {
	    function PathMapper() {
	        _classCallCheck(this, PathMapper);
	    }

	    _createClass(PathMapper, [{
	        key: 'add',

	        /**
	         * Adds a new object to this mapper.
	         * 
	         * @param mask
	         *            path mask used to dispatch to this object
	         * @param obj
	         *            the object to add
	         */
	        value: function add(mask, obj) {
	            var chunks = [];
	            var names = [];
	            var a = false;
	            var segments = mask.split('*');
	            segments.forEach(function (segment) {
	                var b = false;
	                var array = segment.split(':');
	                array.forEach(function (str) {
	                    if (!a && !b) {
	                        chunks.push(esc(str));
	                    } else if (a || b) {
	                        var idx = str.indexOf('/');
	                        var r = b ? '[^/]+' : '.*?';
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
	            var str = chunks.join('');
	            var regexp = new RegExp('^' + str + '$');
	            this._handlers = this._handlers || [];
	            this._handlers.push({
	                mask: mask,
	                regexp: regexp,
	                names: names,
	                obj: obj
	            });
	        }
	    }, {
	        key: 'find',

	        /**
	         * Finds and returns a nearest object corresponding to the given path. This
	         * method returns an object with two fields: 1) The 'obj' field contains the
	         * found object 2) The 'params' field contains all found path parameters
	         * (defined in the initial path mask used to register this object).
	         */
	        value: function find(path) {
	            var _this = this;

	            var result = null;
	            this._handlers = this._handlers || [];

	            var _loop = function (i, len) {
	                var handler = _this._handlers[i];
	                if (!handler.regexp.test(path)) return 'continue';
	                var params = {};
	                var regexp = handler.regexp.exec(path);
	                var array = regexp.slice(1);
	                var idx = 0;
	                array.forEach(function (param) {
	                    var name = handler.names[idx++];
	                    var value = param ? decodeURIComponent(param) : null;
	                    params[name] = value;
	                });
	                result = {
	                    params: params,
	                    obj: handler.obj
	                };
	            };

	            for (var i = 0, len = this._handlers.length; !result && i < len; i++) {
	                var _ret = _loop(i, len);

	                if (_ret === 'continue') continue;
	            }
	            return result;
	        }
	    }, {
	        key: 'remove',

	        /**
	         * Removes and returns the mapped object corresponding to the specified path
	         * mask.
	         */
	        value: function remove(mask) {
	            var result = null;
	            var removed = null;
	            var handlers = this._handlers || [];
	            this._handlers = [];
	            handlers.forEach(function (handler) {
	                var keep = true;
	                if (handler.mask === mask) {
	                    removed = handler.obj;
	                } else {
	                    this._handlers.push(handler);
	                }
	            }, this);
	            return removed;
	        }
	    }]);

	    return PathMapper;
	})();

	exports['default'] = PathMapper;

	/** Regular expression used to find and replace special symbols. */
	var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	/** Escapes the specified string */
	function esc(str) {
	    return str.replace(escapeRegExp, '\\$&');
	}
	/** Transforms the given string in a Regexp group. */
	function wrap(str) {
	    return '(' + str + ')';
	}
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var PathMapper = (function () {
	    function PathMapper() {
	        _classCallCheck(this, PathMapper);
	    }

	    _createClass(PathMapper, null, [{
	        key: 'formatPath',

	        /**
	         * A static method used to format a string based on the given path mask and
	         * specified parameters.
	         */
	        value: function formatPath(mask, params) {
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
	                    var _name = null;
	                    var idx = segment.indexOf('/');
	                    if (idx >= 0) {
	                        _name = segment.substring(0, idx);
	                        segment = segment.substring(idx);
	                    } else {
	                        _name = segment;
	                        segment = null;
	                    }
	                    var value = params[_name];
	                    if (!value) {
	                        var msg = 'Required parameter "' + _name + '" not defined.';
	                        var err = new Error(msg);
	                        err._code = 400;
	                        throw err;
	                    }
	                    delete params[_name];
	                    path.push(value);
	                    if (segment && segment !== '') {
	                        path.push(segment);
	                    }
	                }
	            }
	            return path.join('');
	        }
	    }]);

	    return PathMapper;
	})();

	exports['default'] = PathMapper;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;