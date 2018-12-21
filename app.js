(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("src/index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer");
console.log(lexer_1.getTokens('1 + 2 * (3 / 4)'));

});
___scope___.file("src/lexer.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringStream_1 = __importDefault(require("./StringStream"));
function getTokens(text) {
    const tokens = [];
    const state = { line: 1, stack: ['default'] };
    for (const line of text.split('\n')) {
        const stream = new StringStream_1.default(line);
        while (!stream.eol()) {
            const token = getToken(stream, state);
            if (token != undefined) {
                tokens.push(token);
            }
            if (stream.start == stream.pos) {
                throw new Error(`getToken failed to advance stream at position ${stream.pos} in string ${stream.string}`);
            }
            stream.start = stream.pos;
        }
        state.line += 1;
    }
    return tokens;
}
exports.getTokens = getTokens;
function getToken(stream, state) {
    //Built for codeMirror streams API
    //State is a stack of states
    switch (state.stack[state.stack.length - 1]) {
        default:
            return getDefaultToken(stream, state);
    }
}
exports.getToken = getToken;
function makeEmit(stream, state) {
    return function emitToken(type) {
        return {
            type,
            first_column: stream.start,
            last_column: stream.pos,
            line: state.line,
            text: stream.current()
        };
    };
}
function getDefaultToken(stream, state) {
    const emitToken = makeEmit(stream, state);
    if (stream.eatSpace()) {
        // skip whitespace
        return undefined;
    }
    if (stream.match(/\+/)) {
        return emitToken('+');
    }
    if (stream.match(/\-/)) {
        return emitToken('-');
    }
    if (stream.match(/\*/)) {
        return emitToken('*');
    }
    if (stream.match(/\//)) {
        return emitToken('/');
    }
    if (stream.match(/\(/)) {
        return emitToken('(');
    }
    if (stream.match(/\)/)) {
        return emitToken(')');
    }
    if (stream.match(/=/)) {
        return emitToken('=');
    }
    if (stream.match(/,/)) {
        return emitToken(',');
    }
    if (stream.match(/>=/)) {
        return emitToken('>=');
    }
    if (stream.match(/<=/)) {
        return emitToken('<=');
    }
    if (stream.match(/>/)) {
        return emitToken('>');
    }
    if (stream.match(/</)) {
        return emitToken('<');
    }
    if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
        return emitToken('IDENTIFIER');
    }
    if (stream.match(/-?[0-9]+(\.[0-9]+)?/)) {
        return emitToken('NUMBER');
    }
    if (stream.match(/#/)) {
        if (!stream.match(/\n/)) {
            // comment lasts till end of line
            stream.match(/.*/); // if no eol encountered, comment lasts till end of file
        }
        return emitToken('COMMENT');
    }
    stream.next();
    return emitToken('ERROR');
}

});
___scope___.file("src/StringStream.js", function(exports, require, module, __filename, __dirname){

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StringStream_1 = __importDefault(require("../node_modules/codemirror/src/util/StringStream"));
exports.default = StringStream_1.default;

});
___scope___.file("node_modules/codemirror/src/util/StringStream.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const misc_js_1 = require("./misc.js");
// STRING STREAM
// Fed to the mode parsers, provides helper functions to make
// parsers more succinct.
class StringStream {
    constructor(string, tabSize, lineOracle) {
        this.pos = this.start = 0;
        this.string = string;
        this.tabSize = tabSize || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = lineOracle;
    }
    eol() { return this.pos >= this.string.length; }
    sol() { return this.pos == this.lineStart; }
    peek() { return this.string.charAt(this.pos) || undefined; }
    next() {
        if (this.pos < this.string.length)
            return this.string.charAt(this.pos++);
    }
    eat(match) {
        let ch = this.string.charAt(this.pos);
        let ok;
        if (typeof match == "string")
            ok = ch == match;
        else
            ok = ch && (match.test ? match.test(ch) : match(ch));
        if (ok) {
            ++this.pos;
            return ch;
        }
    }
    eatWhile(match) {
        let start = this.pos;
        while (this.eat(match)) { }
        return this.pos > start;
    }
    eatSpace() {
        let start = this.pos;
        while (/[\s\u00a0]/.test(this.string.charAt(this.pos)))
            ++this.pos;
        return this.pos > start;
    }
    skipToEnd() { this.pos = this.string.length; }
    skipTo(ch) {
        let found = this.string.indexOf(ch, this.pos);
        if (found > -1) {
            this.pos = found;
            return true;
        }
    }
    backUp(n) { this.pos -= n; }
    column() {
        if (this.lastColumnPos < this.start) {
            this.lastColumnValue = misc_js_1.countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
            this.lastColumnPos = this.start;
        }
        return this.lastColumnValue - (this.lineStart ? misc_js_1.countColumn(this.string, this.lineStart, this.tabSize) : 0);
    }
    indentation() {
        return misc_js_1.countColumn(this.string, null, this.tabSize) -
            (this.lineStart ? misc_js_1.countColumn(this.string, this.lineStart, this.tabSize) : 0);
    }
    match(pattern, consume, caseInsensitive) {
        if (typeof pattern == "string") {
            let cased = str => caseInsensitive ? str.toLowerCase() : str;
            let substr = this.string.substr(this.pos, pattern.length);
            if (cased(substr) == cased(pattern)) {
                if (consume !== false)
                    this.pos += pattern.length;
                return true;
            }
        }
        else {
            let match = this.string.slice(this.pos).match(pattern);
            if (match && match.index > 0)
                return null;
            if (match && consume !== false)
                this.pos += match[0].length;
            return match;
        }
    }
    current() { return this.string.slice(this.start, this.pos); }
    hideFirstChars(n, inner) {
        this.lineStart += n;
        try {
            return inner();
        }
        finally {
            this.lineStart -= n;
        }
    }
    lookAhead(n) {
        let oracle = this.lineOracle;
        return oracle && oracle.lookAhead(n);
    }
    baseToken() {
        let oracle = this.lineOracle;
        return oracle && oracle.baseToken(this.pos);
    }
}
exports.default = StringStream;

});
___scope___.file("node_modules/codemirror/src/util/misc.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bind(f) {
    let args = Array.prototype.slice.call(arguments, 1);
    return function () { return f.apply(null, args); };
}
exports.bind = bind;
function copyObj(obj, target, overwrite) {
    if (!target)
        target = {};
    for (let prop in obj)
        if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop)))
            target[prop] = obj[prop];
    return target;
}
exports.copyObj = copyObj;
// Counts the column offset in a string, taking tabs into account.
// Used mostly to find indentation.
function countColumn(string, end, tabSize, startIndex, startValue) {
    if (end == null) {
        end = string.search(/[^\s\u00a0]/);
        if (end == -1)
            end = string.length;
    }
    for (let i = startIndex || 0, n = startValue || 0;;) {
        let nextTab = string.indexOf("\t", i);
        if (nextTab < 0 || nextTab >= end)
            return n + (end - i);
        n += nextTab - i;
        n += tabSize - (n % tabSize);
        i = nextTab + 1;
    }
}
exports.countColumn = countColumn;
class Delayed {
    constructor() { this.id = null; }
    set(ms, f) {
        clearTimeout(this.id);
        this.id = setTimeout(f, ms);
    }
}
exports.Delayed = Delayed;
function indexOf(array, elt) {
    for (let i = 0; i < array.length; ++i)
        if (array[i] == elt)
            return i;
    return -1;
}
exports.indexOf = indexOf;
// Number of pixels added to scroller and sizer to hide scrollbar
exports.scrollerGap = 30;
// Returned or thrown by various protocols to signal 'I'm not
// handling this'.
exports.Pass = { toString: function () { return "CodeMirror.Pass"; } };
// Reused option objects for setSelection & friends
exports.sel_dontScroll = { scroll: false }, exports.sel_mouse = { origin: "*mouse" }, exports.sel_move = { origin: "+move" };
// The inverse of countColumn -- find the offset that corresponds to
// a particular column.
function findColumn(string, goal, tabSize) {
    for (let pos = 0, col = 0;;) {
        let nextTab = string.indexOf("\t", pos);
        if (nextTab == -1)
            nextTab = string.length;
        let skipped = nextTab - pos;
        if (nextTab == string.length || col + skipped >= goal)
            return pos + Math.min(skipped, goal - col);
        col += nextTab - pos;
        col += tabSize - (col % tabSize);
        pos = nextTab + 1;
        if (col >= goal)
            return pos;
    }
}
exports.findColumn = findColumn;
let spaceStrs = [""];
function spaceStr(n) {
    while (spaceStrs.length <= n)
        spaceStrs.push(lst(spaceStrs) + " ");
    return spaceStrs[n];
}
exports.spaceStr = spaceStr;
function lst(arr) { return arr[arr.length - 1]; }
exports.lst = lst;
function map(array, f) {
    let out = [];
    for (let i = 0; i < array.length; i++)
        out[i] = f(array[i], i);
    return out;
}
exports.map = map;
function insertSorted(array, value, score) {
    let pos = 0, priority = score(value);
    while (pos < array.length && score(array[pos]) <= priority)
        pos++;
    array.splice(pos, 0, value);
}
exports.insertSorted = insertSorted;
function nothing() { }
function createObj(base, props) {
    let inst;
    if (Object.create) {
        inst = Object.create(base);
    }
    else {
        nothing.prototype = base;
        inst = new nothing();
    }
    if (props)
        copyObj(props, inst);
    return inst;
}
exports.createObj = createObj;
let nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
function isWordCharBasic(ch) {
    return /\w/.test(ch) || ch > "\x80" &&
        (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
}
exports.isWordCharBasic = isWordCharBasic;
function isWordChar(ch, helper) {
    if (!helper)
        return isWordCharBasic(ch);
    if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch))
        return true;
    return helper.test(ch);
}
exports.isWordChar = isWordChar;
function isEmpty(obj) {
    for (let n in obj)
        if (obj.hasOwnProperty(n) && obj[n])
            return false;
    return true;
}
exports.isEmpty = isEmpty;
// Extending unicode characters. A series of a non-extending char +
// any number of extending chars is treated as a single unit as far
// as editing and measuring is concerned. This is not fully correct,
// since some scripts/fonts/browsers also treat other configurations
// of code points as a group.
let extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
function isExtendingChar(ch) { return ch.charCodeAt(0) >= 768 && extendingChars.test(ch); }
exports.isExtendingChar = isExtendingChar;
// Returns a number from the range [`0`; `str.length`] unless `pos` is outside that range.
function skipExtendingChars(str, pos, dir) {
    while ((dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos)))
        pos += dir;
    return pos;
}
exports.skipExtendingChars = skipExtendingChars;
// Returns the value from the range [`from`; `to`] that satisfies
// `pred` and is closest to `from`. Assumes that at least `to`
// satisfies `pred`. Supports `from` being greater than `to`.
function findFirst(pred, from, to) {
    // At any point we are certain `to` satisfies `pred`, don't know
    // whether `from` does.
    let dir = from > to ? -1 : 1;
    for (;;) {
        if (from == to)
            return from;
        let midF = (from + to) / 2, mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
        if (mid == from)
            return pred(mid) ? from : to;
        if (pred(mid))
            to = mid;
        else
            from = mid + dir;
    }
}
exports.findFirst = findFirst;

});
return ___scope___.entry = "src/index.js";
});
FuseBox.pkg("events", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
if (FuseBox.isServer) {
	module.exports = global.require("events");
} else {
	function EventEmitter() {
		this._events = this._events || {};
		this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
		if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
		this._maxListeners = n;
		return this;
	};

	EventEmitter.prototype.emit = function(type) {
		var er, handler, len, args, i, listeners;

		if (!this._events) this._events = {};

		// If there is no 'error' event listener then throw.
		if (type === "error") {
			if (!this._events.error || (isObject(this._events.error) && !this._events.error.length)) {
				er = arguments[1];
				if (er instanceof Error) {
					throw er; // Unhandled 'error' event
				}
				throw TypeError('Uncaught, unspecified "error" event.');
			}
		}

		handler = this._events[type];

		if (isUndefined(handler)) return false;

		if (isFunction(handler)) {
			switch (arguments.length) {
				// fast cases
				case 1:
					handler.call(this);
					break;
				case 2:
					handler.call(this, arguments[1]);
					break;
				case 3:
					handler.call(this, arguments[1], arguments[2]);
					break;
				// slower
				default:
					args = Array.prototype.slice.call(arguments, 1);
					handler.apply(this, args);
			}
		} else if (isObject(handler)) {
			args = Array.prototype.slice.call(arguments, 1);
			listeners = handler.slice();
			len = listeners.length;
			for (i = 0; i < len; i++) listeners[i].apply(this, args);
		}

		return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
		var m;

		if (!isFunction(listener)) throw TypeError("listener must be a function");

		if (!this._events) this._events = {};

		// To avoid recursion in the case that type === "newListener"! Before
		// adding it to the listeners, first emit "newListener".
		if (this._events.newListener) this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);

		if (!this._events[type])
			// Optimize the case of one listener. Don't need the extra array object.
			this._events[type] = listener;
		else if (isObject(this._events[type]))
			// If we've already got an array, just append.
			this._events[type].push(listener);
		// Adding the second element, need to change to array.
		else this._events[type] = [this._events[type], listener];

		// Check for listener leak
		if (isObject(this._events[type]) && !this._events[type].warned) {
			if (!isUndefined(this._maxListeners)) {
				m = this._maxListeners;
			} else {
				m = EventEmitter.defaultMaxListeners;
			}

			if (m && m > 0 && this._events[type].length > m) {
				this._events[type].warned = true;
				console.error(
					"(node) warning: possible EventEmitter memory " + "leak detected. %d listeners added. " + "Use emitter.setMaxListeners() to increase limit.",
					this._events[type].length
				);
				if (typeof console.trace === "function") {
					// not supported in IE 10
					console.trace();
				}
			}
		}

		return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
		if (!isFunction(listener)) throw TypeError("listener must be a function");

		var fired = false;

		function g() {
			this.removeListener(type, g);

			if (!fired) {
				fired = true;
				listener.apply(this, arguments);
			}
		}

		g.listener = listener;
		this.on(type, g);

		return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
		var list, position, length, i;

		if (!isFunction(listener)) throw TypeError("listener must be a function");

		if (!this._events || !this._events[type]) return this;

		list = this._events[type];
		length = list.length;
		position = -1;

		if (list === listener || (isFunction(list.listener) && list.listener === listener)) {
			delete this._events[type];
			if (this._events.removeListener) this.emit("removeListener", type, listener);
		} else if (isObject(list)) {
			for (i = length; i-- > 0; ) {
				if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
					position = i;
					break;
				}
			}

			if (position < 0) return this;

			if (list.length === 1) {
				list.length = 0;
				delete this._events[type];
			} else {
				list.splice(position, 1);
			}

			if (this._events.removeListener) this.emit("removeListener", type, listener);
		}

		return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
		var key, listeners;

		if (!this._events) return this;

		// not listening for removeListener, no need to emit
		if (!this._events.removeListener) {
			if (arguments.length === 0) this._events = {};
			else if (this._events[type]) delete this._events[type];
			return this;
		}

		// emit removeListener for all listeners on all events
		if (arguments.length === 0) {
			for (key in this._events) {
				if (key === "removeListener") continue;
				this.removeAllListeners(key);
			}
			this.removeAllListeners("removeListener");
			this._events = {};
			return this;
		}

		listeners = this._events[type];

		if (isFunction(listeners)) {
			this.removeListener(type, listeners);
		} else if (listeners) {
			// LIFO order
			while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
		}
		delete this._events[type];

		return this;
	};

	EventEmitter.prototype.listeners = function(type) {
		var ret;
		if (!this._events || !this._events[type]) ret = [];
		else if (isFunction(this._events[type])) ret = [this._events[type]];
		else ret = this._events[type].slice();
		return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
		if (this._events) {
			var evlistener = this._events[type];

			if (isFunction(evlistener)) return 1;
			else if (evlistener) return evlistener.length;
		}
		return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
		return emitter.listenerCount(type);
	};

	function isFunction(arg) {
		return typeof arg === "function";
	}

	function isNumber(arg) {
		return typeof arg === "number";
	}

	function isObject(arg) {
		return typeof arg === "object" && arg !== null;
	}

	function isUndefined(arg) {
		return arg === void 0;
	}
}

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("fusebox-hot-reload", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
/**
 * @module listens to `source-changed` socket events and actions hot reload
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Client = require("fusebox-websocket").SocketClient, bundleErrors = {}, outputElement = document.createElement("div"), styleElement = document.createElement("style"), minimizeToggleId = "fuse-box-toggle-minimized", hideButtonId = "fuse-box-hide", expandedOutputClass = "fuse-box-expanded-output", localStoragePrefix = "__fuse-box_";
function storeSetting(key, value) {
    localStorage[localStoragePrefix + key] = value;
}
function getSetting(key) {
    return localStorage[localStoragePrefix + key] === "true" ? true : false;
}
var outputInBody = false, outputMinimized = getSetting(minimizeToggleId), outputHidden = false;
outputElement.id = "fuse-box-output";
styleElement.innerHTML = "\n    #" + outputElement.id + ", #" + outputElement.id + " * {\n        box-sizing: border-box;\n    }\n    #" + outputElement.id + " {\n        z-index: 999999999999;\n        position: fixed;\n        top: 10px;\n        right: 10px;\n        width: 400px;\n        overflow: auto;\n        background: #fdf3f1;\n        border: 1px solid #eca494;\n        border-radius: 5px;\n        font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        box-shadow: 0px 3px 6px 1px rgba(0,0,0,.15);\n    }\n    #" + outputElement.id + "." + expandedOutputClass + " {\n        height: auto;\n        width: auto;\n        left: 10px;\n        max-height: calc(100vh - 50px);\n    }\n    #" + outputElement.id + " .fuse-box-errors {\n        display: none;\n    }\n    #" + outputElement.id + "." + expandedOutputClass + " .fuse-box-errors {\n        display: block;\n        border-top: 1px solid #eca494;\n        padding: 0 10px;\n    }\n    #" + outputElement.id + " button {\n        border: 1px solid #eca494;\n        padding: 5px 10px;\n        border-radius: 4px;\n        margin-left: 5px;\n        background-color: white;\n        color: black;\n        box-shadow: 0px 2px 2px 0px rgba(0,0,0,.05);\n    }\n    #" + outputElement.id + " .fuse-box-header {\n        padding: 10px;\n    }\n    #" + outputElement.id + " .fuse-box-header h4 {\n        display: inline-block;\n        margin: 4px;\n    }";
styleElement.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(styleElement);
function displayBundleErrors() {
    var errorMessages = Object.keys(bundleErrors).reduce(function (allMessages, bundleName) {
        var bundleMessages = bundleErrors[bundleName];
        return allMessages.concat(bundleMessages.map(function (message) {
            var messageOutput = message
                .replace(/\n/g, "<br>")
                .replace(/\t/g, "&nbsp;&nbps;&npbs;&nbps;")
                .replace(/ /g, "&nbsp;");
            return "<pre>" + messageOutput + "</pre>";
        }));
    }, []), errorOutput = errorMessages.join("");
    if (errorOutput && !outputHidden) {
        outputElement.innerHTML = "\n        <div class=\"fuse-box-header\" style=\"\">\n            <h4 style=\"\">Fuse Box Bundle Errors (" + errorMessages.length + "):</h4>\n            <div style=\"float: right;\">\n                <button id=\"" + minimizeToggleId + "\">" + (outputMinimized ? "Expand" : "Minimize") + "</button>\n                <button id=\"" + hideButtonId + "\">Hide</button>\n            </div>\n        </div>\n        <div class=\"fuse-box-errors\">\n            " + errorOutput + "\n        </div>\n        ";
        document.body.appendChild(outputElement);
        outputElement.className = outputMinimized ? "" : expandedOutputClass;
        outputInBody = true;
        document.getElementById(minimizeToggleId).onclick = function () {
            outputMinimized = !outputMinimized;
            storeSetting(minimizeToggleId, outputMinimized);
            displayBundleErrors();
        };
        document.getElementById(hideButtonId).onclick = function () {
            outputHidden = true;
            displayBundleErrors();
        };
    }
    else if (outputInBody) {
        document.body.removeChild(outputElement);
        outputInBody = false;
    }
}
exports.connect = function (port, uri, reloadFullPage) {
    if (FuseBox.isServer) {
        return;
    }
    port = port || window.location.port;
    var client = new Client({
        port: port,
        uri: uri
    });
    client.connect();
    client.on("page-reload", function (data) {
        return window.location.reload();
    });
    client.on("page-hmr", function (data) {
        FuseBox.flush();
        FuseBox.dynamic(data.path, data.content);
        if (FuseBox.mainFile) {
            try {
                FuseBox.import(FuseBox.mainFile);
            }
            catch (e) {
                if (typeof e === "string") {
                    if (/not found/.test(e)) {
                        return window.location.reload();
                    }
                }
                console.error(e);
            }
        }
    });
    client.on("source-changed", function (data) {
        console.info("%cupdate \"" + data.path + "\"", "color: #237abe");
        if (reloadFullPage) {
            return window.location.reload();
        }
        /**
         * If a plugin handles this request then we don't have to do anything
         **/
        for (var index = 0; index < FuseBox.plugins.length; index++) {
            var plugin = FuseBox.plugins[index];
            if (plugin.hmrUpdate && plugin.hmrUpdate(data)) {
                return;
            }
        }
        if (data.type === "hosted-css") {
            var fileId = data.path.replace(/^\//, "").replace(/[\.\/]+/g, "-");
            var existing = document.getElementById(fileId);
            if (existing) {
                existing.setAttribute("href", data.path + "?" + new Date().getTime());
            }
            else {
                var node = document.createElement("link");
                node.id = fileId;
                node.type = "text/css";
                node.rel = "stylesheet";
                node.href = data.path;
                document.getElementsByTagName("head")[0].appendChild(node);
            }
        }
        if (data.type === "js" || data.type === "css") {
            FuseBox.flush();
            FuseBox.dynamic(data.path, data.content);
            if (FuseBox.mainFile) {
                try {
                    FuseBox.import(FuseBox.mainFile);
                }
                catch (e) {
                    if (typeof e === "string") {
                        if (/not found/.test(e)) {
                            return window.location.reload();
                        }
                    }
                    console.error(e);
                }
            }
        }
    });
    client.on("error", function (error) {
        console.log(error);
    });
    client.on("bundle-error", function (_a) {
        var bundleName = _a.bundleName, message = _a.message;
        console.error("Bundle error in " + bundleName + ": " + message);
        var errorsForBundle = bundleErrors[bundleName] || [];
        errorsForBundle.push(message);
        bundleErrors[bundleName] = errorsForBundle;
        displayBundleErrors();
    });
    client.on("update-bundle-errors", function (_a) {
        var bundleName = _a.bundleName, messages = _a.messages;
        messages.forEach(function (message) { return console.error("Bundle error in " + bundleName + ": " + message); });
        bundleErrors[bundleName] = messages;
        displayBundleErrors();
    });
};

});
return ___scope___.entry = "index.js";
});
FuseBox.pkg("fusebox-websocket", {}, function(___scope___){
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var SocketClient = /** @class */ (function () {
    function SocketClient(opts) {
        opts = opts || {};
        var port = opts.port || window.location.port;
        var protocol = location.protocol === "https:" ? "wss://" : "ws://";
        var domain = location.hostname || "localhost";
        this.url = opts.host || "" + protocol + domain + ":" + port;
        if (opts.uri) {
            this.url = opts.uri;
        }
        this.authSent = false;
        this.emitter = new events.EventEmitter();
    }
    SocketClient.prototype.reconnect = function (fn) {
        var _this = this;
        setTimeout(function () {
            _this.emitter.emit("reconnect", { message: "Trying to reconnect" });
            _this.connect(fn);
        }, 5000);
    };
    SocketClient.prototype.on = function (event, fn) {
        this.emitter.on(event, fn);
    };
    SocketClient.prototype.connect = function (fn) {
        var _this = this;
        console.log("%cConnecting to fusebox HMR at " + this.url, "color: #237abe");
        setTimeout(function () {
            _this.client = new WebSocket(_this.url);
            _this.bindEvents(fn);
        }, 0);
    };
    SocketClient.prototype.close = function () {
        this.client.close();
    };
    SocketClient.prototype.send = function (eventName, data) {
        if (this.client.readyState === 1) {
            this.client.send(JSON.stringify({ event: eventName, data: data || {} }));
        }
    };
    SocketClient.prototype.error = function (data) {
        this.emitter.emit("error", data);
    };
    /** Wires up the socket client messages to be emitted on our event emitter */
    SocketClient.prototype.bindEvents = function (fn) {
        var _this = this;
        this.client.onopen = function (event) {
            console.log("%cConnected", "color: #237abe");
            if (fn) {
                fn(_this);
            }
        };
        this.client.onerror = function (event) {
            _this.error({ reason: event.reason, message: "Socket error" });
        };
        this.client.onclose = function (event) {
            _this.emitter.emit("close", { message: "Socket closed" });
            if (event.code !== 1011) {
                _this.reconnect(fn);
            }
        };
        this.client.onmessage = function (event) {
            var data = event.data;
            if (data) {
                var item = JSON.parse(data);
                _this.emitter.emit(item.type, item.data);
                _this.emitter.emit("*", item);
            }
        };
    };
    return SocketClient;
}());
exports.SocketClient = SocketClient;

});
return ___scope___.entry = "index.js";
});
FuseBox.import("fusebox-hot-reload").connect(4444, "", false)

FuseBox.import("default/src/index.js");
FuseBox.main("default/src/index.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))