"use strict";
/**
 * response.js
 *
 * Response class provides content decoding
 */
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const headers_js_1 = require("./headers.js");
const body_1 = require("./body");
const INTERNALS = Symbol('Response internals');
// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;
/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
    constructor(body = null, opts = {}) {
        body_1.default.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new headers_js_1.default(opts.headers);
        if (body != null && !headers.has('Content-Type')) {
            const contentType = body_1.extractContentType(body);
            if (contentType) {
                headers.append('Content-Type', contentType);
            }
        }
        this[INTERNALS] = {
            url: opts.url,
            status,
            statusText: opts.statusText || STATUS_CODES[status],
            headers,
            counter: opts.counter
        };
    }
    get url() {
        return this[INTERNALS].url || '';
    }
    get status() {
        return this[INTERNALS].status;
    }
    /**
     * Convenience property representing if the request ended normally
     */
    get ok() {
        return this[INTERNALS].status >= 200 && this[INTERNALS].status < 300;
    }
    get redirected() {
        return this[INTERNALS].counter > 0;
    }
    get statusText() {
        return this[INTERNALS].statusText;
    }
    get headers() {
        return this[INTERNALS].headers;
    }
    /**
     * Clone this response
     *
     * @return  Response
     */
    clone() {
        return new Response(body_1.clone(this), {
            url: this.url,
            status: this.status,
            statusText: this.statusText,
            headers: this.headers,
            ok: this.ok,
            redirected: this.redirected
        });
    }
}
exports.default = Response;
body_1.default.mixIn(Response.prototype);
Object.defineProperties(Response.prototype, {
    url: { enumerable: true },
    status: { enumerable: true },
    ok: { enumerable: true },
    redirected: { enumerable: true },
    statusText: { enumerable: true },
    headers: { enumerable: true },
    clone: { enumerable: true }
});
Object.defineProperty(Response.prototype, Symbol.toStringTag, {
    value: 'Response',
    writable: false,
    enumerable: false,
    configurable: true
});
