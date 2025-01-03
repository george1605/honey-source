(() => {
  var e = {4654: function (e, t, r) {
    "use strict";
    var n;
    var o;
    var i;
    var s;
    var a;
    var c;
    var u;
    var h;
    var f;
    var p;
    var l = this && this.__awaiter || function (e, t, r, n) {
      return new (r || (r = Promise))(function (o, i) {
        function s(e) {
          try {
            c(n.next(e));
          } catch (e) {
            i(e);
          }
        }
        function a(e) {
          try {
            c(n.throw(e));
          } catch (e) {
            i(e);
          }
        }
        function c(e) {
          var t;
          e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r(function (e) {
            e(t);
          })).then(s, a);
        }
        c((n = n.apply(e, t || [])).next());
      });
    };
    var d = this && this.__classPrivateFieldSet || function (e, t, r, n, o) {
      if ("m" === n) throw new TypeError("Private method is not writable");
      if ("a" === n && !o) throw new TypeError("Private accessor was defined without a setter");
      if ("function" == typeof t ? e !== t || !o : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
      "a" === n ? o.call(e, r) : o ? o.value = r : t.set(e, r);
      return r;
    };
    var y = this && this.__classPrivateFieldGet || function (e, t, r, n) {
      if ("a" === r && !n) throw new TypeError("Private accessor was defined without a getter");
      if ("function" == typeof t ? e !== t || !n : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return "m" === r ? n : "a" === r ? n.call(e) : n ? n.value : t.get(e);
    };
    var g = this && this.__importDefault || function (e) {
      return e && e.__esModule ? e : {default: e};
    };
    Object.defineProperty(t, "__esModule", {value: true});
    t.PostMessenger = undefined;
    const v = g(r(2081));
    const m = r(1614);
    const w = r(3982);
    const b = r(6068);
    const x = "AES-CBC";
    t.PostMessenger = class {
      constructor({clientName: e = "unknown", enableLogging: t = false, useEncryption: r = true, maxResponseTime: u = 1e4, types: h}) {
        n.add(this);
        this.connection = null;
        o.set(this, undefined);
        i.set(this, {algorithm: null, iv: null, requestKey: null});
        s.set(this, {});
        this.targetWindow = null;
        this.targetOrigin = null;
        a.set(this, undefined);
        c.set(this, null);
        (0, v.default)(this);
        this.clientName = e;
        d(this, o, t, "f");
        this.useEncryption = (e, t = false) => {
          const n = r && e !== w.InternalMessageTypes.postMessengerConnect;
          if (n && !this.connection && t) {
            const r = new Error(this.prefix(`Cannot send message ${e}. Encryption is on but there is no connected client.`));
            if ("function" != typeof t) throw r;
            t(r);
          }
          return n;
        };
        this.maxResponseTime = u;
        if (h.postMessengerConnect) throw new Error(this.prefix("postMessengerConnect is a reserved message type."));
        d(this, a, Object.assign(Object.assign({}, h), w.InternalMessageTypes), "f");
      }
      prefix(e) {
        return `postMessenger: ${this.clientName} ${e}`;
      }
      logger(...e) {
        if (y(this, o, "f")) {
          "string" == typeof e[0] ? console.log(this.prefix(e[0]), ...e.slice(1)) : console.log(...e);
        }
      }
      getListeners() {
        return y(this, s, "f");
      }
      addListener(e, t) {
        y(this, s, "f")[e] ? y(this, s, "f")[e].push(t) : y(this, s, "f")[e] = [t];
        return () => this.removeListener(e, t);
      }
      removeListener(e, t) {
        if (y(this, s, "f")[e]) {
          const r = y(this, s, "f")[e].indexOf(t);
          if (r > -1) {
            y(this, s, "f")[e].splice(r, r + 1);
          }
        }
      }
      onReceiveMessage(e) {
        if (e.data && y(this, s, "f")[e.data.type]) {
          if (y(this, c, "f") && !y(this, c, "f")(e.origin)) return;
          y(this, s, "f")[e.data.type].forEach(t => {
            t(e.data, e);
          });
        }
      }
      request(e, t = {}, r = {}) {
        const o = y(this, a, "f")[e];
        if (!y(this, a, "f")[e]) throw new Error(this.prefix(`Unable to find messageType for ${e}`));
        if (this.connection && !this.connection.types[String(e)]) throw new Error(this.prefix(`Connected client ${this.connection.clientName} does not have a matching message type for ${e} so this request will fail.`));
        return y(this, n, "m", f)(y(this, a, "f")[e], t, r);
      }
      bindResponders(e) {
        if (e.postMessengerConnect) throw new Error(this.prefix("postMessengerConnect is a reserved message type."));
        return y(this, n, "m", p)(e);
      }
      connect({targetWindow: e, targetOrigin: t, maxRetries: r = 10}) {
        return l(this, undefined, undefined, function* () {
          if (!e || !t) throw new Error(this.prefix("targetWindow and targetOrigin are required for connect"));
          this.setTarget(e, t);
          this.beginListening(e => e === new URL(t).origin);
          let o = null;
          let s = null;
          const c = this.useEncryption();
          if (c) {
            o = crypto.getRandomValues(new Uint8Array(16));
            y(this, i, "f").requestKey = yield crypto.subtle.generateKey({length: 256, name: "AES-CBC"}, true, ["encrypt", "decrypt"]);
            s = yield crypto.subtle.exportKey("jwk", y(this, i, "f").requestKey);
            y(this, i, "f").iv = o;
            y(this, i, "f").algorithm = {iv: o, name: "AES-CBC"};
          }
          const u = r || 1;
          let h = null;
          for (let e = 0; e < u; e += 1) {
            try {
              h = yield y(this, n, "m", f)(w.InternalMessageTypes.postMessengerConnect, {clientName: this.clientName, iv: o, jsonRequestKey: s, origin: window.location.origin, types: y(this, a, "f"), useEncryption: c}, {maxResponseTime: 500});
            } catch (e) {}
            if (h) {
              this.connection = h;
              break;
            }
          }
          if (!this.connection) throw new Error(this.prefix(`Connection failed after ${u} attempts over ${500 * u / 1e3} seconds.`));
          this.logger(`Connection established to ${this.connection.clientName}`, this.connection);
          return true;
        });
      }
      acceptConnections({allowAnyOrigin: e = false, fromClientName: t = null, origin: r}) {
        if (!e && !r) throw new Error(this.prefix("allowAnyOrigin must be true if origin is not specified"));
        const o = e => !t || t === e.clientName;
        this.beginListening(e => !r || e === r);
        return new Promise(e => {
          const t = y(this, n, "m", p)({postMessengerConnect: (r, n) => l(this, undefined, undefined, function* () {
            if (!n.source) throw new Error(this.prefix("event.source is null"));
            this.setTarget(n.source, r.origin);
            this.connection = {clientName: r.clientName, types: r.types, useEncryption: false};
            if (this.useEncryption()) {
              if (!r.iv || !r.jsonRequestKey || !r.useEncryption) {
                const e = "encryption is required but iv or jsonRequestKey or useEncryption were not provided in connection message.";
                throw new Error(this.prefix("encryption is required but iv or jsonRequestKey or useEncryption were not provided in connection message."));
              }
              this.connection.useEncryption = true;
              y(this, i, "f").iv = new Uint8Array([...r.iv]);
              y(this, i, "f").algorithm = {iv: y(this, i, "f").iv, name: "AES-CBC"};
              y(this, i, "f").requestKey = yield crypto.subtle.importKey("jwk", r.jsonRequestKey, {name: "AES-CBC"}, false, ["encrypt", "decrypt"]);
            }
            t();
            this.logger(`Accepted connection from ${this.connection.clientName}`, this.connection);
            e(this.connection);
            return {clientName: this.clientName, types: r.types, useEncryption: this.useEncryption()};
          })}, o);
        });
      }
      setTarget(e, t) {
        if (!e || !t) throw new Error(this.prefix("targetWindow and targetWindow are required for setTarget"));
        this.targetWindow = e;
        const r = new URL(t);
        this.targetOrigin = r.origin;
      }
      beginListening(e) {
        d(this, c, e, "f");
        window.addEventListener("message", this.onReceiveMessage);
      }
      stopListening() {
        window.removeEventListener("message", this.onReceiveMessage);
      }
      decrypt(e) {
        return l(this, undefined, undefined, function* () {
          if (!y(this, i, "f").algorithm || !y(this, i, "f").requestKey) throw new Error(this.prefix("encryptionValues must be set before calling decrpyt"));
          const t = (0, b.decodeBase64)(e);
          const r = (0, b.str2ab)(t);
          const n = yield crypto.subtle.decrypt(y(this, i, "f").algorithm, y(this, i, "f").requestKey, r);
          if (0 === n.byteLength) return null;
          const o = (new TextDecoder).decode(n);
          return JSON.parse(o);
        });
      }
      encrypt(e) {
        return l(this, undefined, undefined, function* () {
          if (!y(this, i, "f").algorithm || !y(this, i, "f").requestKey) throw new Error(this.prefix("encryptionValues must be set before calling encrypt"));
          const t = (new TextEncoder).encode(JSON.stringify(e));
          const r = yield crypto.subtle.encrypt(y(this, i, "f").algorithm, y(this, i, "f").requestKey, t);
          const n = (0, b.ab2str)(r);
          return (0, b.encodeBase64)(n);
        });
      }
    };
    o = new WeakMap;
    i = new WeakMap;
    s = new WeakMap;
    a = new WeakMap;
    c = new WeakMap;
    n = new WeakSet;
    u = function (e = {}) {
      if (!this.targetWindow || !this.targetOrigin) {
        const e = this.prefix("targetWindow has not been initialized, please ensure you call setTarget before calling beginListening");
        throw new Error(e);
      }
      this.targetWindow.postMessage(e, this.targetOrigin);
    };
    h = function (e, t, r = {}, o) {
      return l(this, undefined, undefined, function* () {
        let i = r;
        let s = o || null;
        if (this.useEncryption(e, true)) {
          i = yield this.encrypt(r);
          if (s) {
            s = yield this.encrypt(s);
          }
        }
        y(this, n, "m", u)({data: i, errorMessage: s, isError: Boolean(s), messageId: t, type: e});
      });
    };
    f = function (e, t = {}, r = {}) {
      return l(this, undefined, undefined, function* () {
        const o = (0, m.v4)();
        this.logger(`sending request type '${e}' to '${this.targetOrigin}':`, t);
        yield y(this, n, "m", h)(e, o, t);
        return new Promise((t, n) => {
          let i = false;
          const s = this.addListener(e, r => l(this, undefined, undefined, function* () {
            if ((0, w.isRequestMessage)(r) && r.messageId === o) {
              i = true;
              s();
              if (r.isError) {
                let t = r.errorMessage;
                if (this.useEncryption(e, true) && r.errorMessage) {
                  t = yield this.decrypt(r.errorMessage);
                }
                const o = this.prefix(`Responder for request type '${e}' to target '${this.targetOrigin}' failed with message: "${t}"`);
                n(new Error(o));
              } else {
                let o = r.data;
                if (this.useEncryption(e, true)) {
                  if ("string" != typeof r.data) {
                    const t = this.prefix(`encryption is required but request received a non string data response for message: ${e}`);
                    return void n(new Error(t));
                  }
                  o = yield this.decrypt(r.data);
                }
                t(o);
              }
            }
          }));
          if (-1 !== r.maxResponseTime) {
            setTimeout(() => {
              if (!i) {
                const t = this.prefix(`Time out waiting for target '${this.targetOrigin}' to respond to request, type '${e}'`);
                n(new Error(t));
                s();
              }
            }, r.maxResponseTime || this.maxResponseTime);
          }
        });
      });
    };
    p = function (e, t = null) {
      const r = [];
      Object.entries(e).forEach(([e, o]) => {
        const i = y(this, a, "f")[e];
        const s = this.addListener(y(this, a, "f")[e], (e, r) => l(this, undefined, undefined, function* () {
          if (!(0, w.isRequestMessage)(e) || !o) return;
          if (t && !t(e.data)) return;
          try {
            if (this.useEncryption(y(this, a, "f")[e], true)) {
              if ("string" != typeof s) throw new Error(this.prefix("encryption is required but responder received a non string data response"));
              s = yield this.decrypt(s);
            }
            const t = yield o(s, r);
            this.logger(`responding to request type '${y(this, a, "f")[e]}' from target '${this.targetOrigin}':`, t);
            y(this, n, "m", h)(y(this, a, "f")[e], e.messageId, t);
          } catch (t) {
            (0, w.isError)(t) ? y(this, n, "m", h)(y(this, a, "f")[e], e.messageId, {}, t.message) : y(this, n, "m", h)(y(this, a, "f")[e], e.messageId, {}, this.prefix("responder threw a non Error object"));
          }
        }));
        r.push(s);
      });
      return () => {
        this.logger("removing responders:", e);
        r.forEach(e => e());
      };
    };
  }, 3982: (e, t) => {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: true});
    t.InternalMessageTypes = t.isRequestMessage = t.isError = undefined;
    t.isError = e => Boolean(e.message);
    t.isRequestMessage = e => Boolean(e && "object" == typeof e && !Array.isArray(e) && "string" == typeof e.type && "string" == typeof e.messageId && "boolean" == typeof e.isError && undefined !== e.errorMessage);
    (function (e) {
      e.postMessengerConnect = "post-messenger-connect";
    }(t.InternalMessageTypes || (t.InternalMessageTypes = {})));
  }, 6068: (e, t) => {
    "use strict";
    Object.defineProperty(t, "__esModule", {value: true});
    t.decodeBase64 = t.encodeBase64 = t.str2ab = t.ab2str = undefined;
    t.ab2str = function (e) {
      const t = Array.from(new Uint16Array(e));
      return String.fromCharCode.apply(null, t);
    };
    t.str2ab = function (e) {
      const t = new ArrayBuffer(2 * e.length);
      const r = new Uint16Array(t);
      for (let t = 0, n = e.length; t < n; t += 1) r[t] = e.charCodeAt(t);
      return t;
    };
    t.encodeBase64 = function (e) {
      const t = new Uint16Array(e.length);
      for (let r = 0; r < t.length; r++) t[r] = e.charCodeAt(r);
      return btoa(String.fromCharCode(...new Uint8Array(t.buffer)));
    };
    t.decodeBase64 = function (e) {
      const t = atob(e);
      const r = new Uint8Array(t.length);
      for (let e = 0; e < r.length; e++) r[e] = t.charCodeAt(e);
      return String.fromCharCode(...new Uint16Array(r.buffer));
    };
  }, 1989: (e, t, r) => {
    var n = r(1789);
    var o = r(401);
    var i = r(7667);
    var s = r(1327);
    var a = r(1866);
    function c(e) {
      var t = -1;
      var r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r;) {
        var n = e[t];
        this.set(e[t][0], e[t][1]);
      }
    }
    c.prototype.clear = n;
    c.prototype.delete = o;
    c.prototype.get = i;
    c.prototype.has = s;
    c.prototype.set = a;
    e.exports = c;
  }, 8407: (e, t, r) => {
    var n = r(7040);
    var o = r(4125);
    var i = r(2117);
    var s = r(7518);
    var a = r(4705);
    function c(e) {
      var t = -1;
      var r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r;) {
        var n = e[t];
        this.set(e[t][0], e[t][1]);
      }
    }
    c.prototype.clear = n;
    c.prototype.delete = o;
    c.prototype.get = i;
    c.prototype.has = s;
    c.prototype.set = a;
    e.exports = c;
  }, 7071: (e, t, r) => {
    var n = r(852)(r(5639), "Map");
    e.exports = n;
  }, 3369: (e, t, r) => {
    var n = r(4785);
    var o = r(1285);
    var i = r(6e3);
    var s = r(9916);
    var a = r(5265);
    function c(e) {
      var t = -1;
      var r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r;) {
        var n = e[t];
        this.set(e[t][0], e[t][1]);
      }
    }
    c.prototype.clear = n;
    c.prototype.delete = o;
    c.prototype.get = i;
    c.prototype.has = s;
    c.prototype.set = a;
    e.exports = c;
  }, 2705: (e, t, r) => {
    var n = r(5639).Symbol;
    e.exports = r(5639).Symbol;
  }, 9932: e => {
    e.exports = function (e, t) {
      for (var r = -1, n = null == e ? 0 : e.length, o = Array(n); ++r < n;) o[r] = t(e[r], r, e);
      return o;
    };
  }, 8470: (e, t, r) => {
    var n = r(7813);
    e.exports = function (e, t) {
      for (var r = e.length; r--;) if (n(e[r][0], t)) return r;
      return -1;
    };
  }, 7786: (e, t, r) => {
    var n = r(1811);
    var o = r(327);
    e.exports = function (e, t) {
      for (var r = 0, i = (t = n(t, e)).length; null != e && r < i;) e = e[o(t[r++])];
      return r && r == i ? e : undefined;
    };
  }, 4239: (e, t, r) => {
    var n = r(2705);
    var o = r(9607);
    var i = r(2333);
    var s = n ? n.toStringTag : undefined;
    e.exports = function (e) {
      return null == e ? undefined === e ? "[object Undefined]" : "[object Null]" : s && s in Object(e) ? o(e) : i(e);
    };
  }, 8458: (e, t, r) => {
    var n = r(3560);
    var o = r(5346);
    var i = r(3218);
    var s = r(346);
    var a = /^\[object .+?Constructor\]$/;
    var c = Function.prototype;
    var u = Object.prototype;
    var h = Function.prototype.toString;
    var f = Object.prototype.hasOwnProperty;
    var p = /^function.*?\(\) \{ \[native code\] \}$/;
    e.exports = function (e) {
      return !(!i(e) || o(e)) && (n(e) ? /^function.*?\(\) \{ \[native code\] \}$/ : /^\[object .+?Constructor\]$/).test(s(e));
    };
  }, 531: (e, t, r) => {
    var n = r(2705);
    var o = r(9932);
    var i = r(1469);
    var s = r(3448);
    var a = n ? n.prototype : undefined;
    var c = a ? a.toString : undefined;
    e.exports = function e(t) {
      if ("string" == typeof t) return t;
      if (i(t)) return o(t, e) + "";
      if (s(t)) return c ? c.call(t) : "";
      var r = t + "";
      return "0" == r && 1 / t == -Infinity ? "-0" : r;
    };
  }, 1811: (e, t, r) => {
    var n = r(1469);
    var o = r(5403);
    var i = r(5514);
    var s = r(9833);
    e.exports = function (e, t) {
      return n(e) ? e : o(e, t) ? [e] : i(s(e));
    };
  }, 4429: (e, t, r) => {
    var n = r(5639)["__core-js_shared__"];
    e.exports = r(5639)["__core-js_shared__"];
  }, 8450: (e, t, r) => {
    var n = "object" == typeof r.g && r.g && r.g.Object === Object && r.g;
    e.exports = n;
  }, 5050: (e, t, r) => {
    var n = r(7019);
    e.exports = function (e, t) {
      var r = e.__data__;
      return n(t) ? e.__data__["string" == typeof t ? "string" : "hash"] : e.__data__.map;
    };
  }, 852: (e, t, r) => {
    var n = r(8458);
    var o = r(7801);
    e.exports = function (e, t) {
      var r = o(e, t);
      return n(r) ? r : undefined;
    };
  }, 9607: (e, t, r) => {
    var n = r(2705);
    var o = Object.prototype;
    var i = Object.prototype.hasOwnProperty;
    var s = Object.prototype.toString;
    var a = n ? n.toStringTag : undefined;
    e.exports = function (e) {
      var t = Object.prototype.hasOwnProperty.call(e, a);
      var r = e[a];
      try {
        e[a] = undefined;
        var n = true;
      } catch (e) {}
      var o = Object.prototype.toString.call(e);
      if (n) {
        t ? e[a] = r : delete e[a];
      }
      return o;
    };
  }, 7801: e => {
    e.exports = function (e, t) {
      return null == e ? undefined : e[t];
    };
  }, 1789: (e, t, r) => {
    var n = r(4536);
    e.exports = function () {
      this.__data__ = n ? n(null) : {};
      this.size = 0;
    };
  }, 401: e => {
    e.exports = function (e) {
      var t = this.has(e) && delete this.__data__[e];
      this.size -= t ? 1 : 0;
      return t;
    };
  }, 7667: (e, t, r) => {
    var n = r(4536);
    var o = Object.prototype.hasOwnProperty;
    e.exports = function (e) {
      var t = this.__data__;
      if (n) {
        var r = this.__data__[e];
        return "__lodash_hash_undefined__" === this.__data__[e] ? undefined : this.__data__[e];
      }
      return Object.prototype.hasOwnProperty.call(this.__data__, e) ? this.__data__[e] : undefined;
    };
  }, 1327: (e, t, r) => {
    var n = r(4536);
    var o = Object.prototype.hasOwnProperty;
    e.exports = function (e) {
      var t = this.__data__;
      return n ? undefined !== this.__data__[e] : Object.prototype.hasOwnProperty.call(this.__data__, e);
    };
  }, 1866: (e, t, r) => {
    var n = r(4536);
    e.exports = function (e, t) {
      var r = this.__data__;
      this.size += this.has(e) ? 0 : 1;
      r[e] = n && undefined === t ? "__lodash_hash_undefined__" : t;
      return this;
    };
  }, 5403: (e, t, r) => {
    var n = r(1469);
    var o = r(3448);
    var i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
    var s = /^\w*$/;
    e.exports = function (e, t) {
      if (n(e)) return false;
      var r = typeof e;
      return !("number" != r && "symbol" != r && "boolean" != r && null != e && !o(e)) || /^\w*$/.test(e) || !/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/.test(e) || null != t && e in Object(t);
    };
  }, 7019: e => {
    e.exports = function (e) {
      var t = typeof e;
      return "string" == t || "number" == t || "symbol" == t || "boolean" == t ? "__proto__" !== e : null === e;
    };
  }, 5346: (e, t, r) => {
    var n;
    var o = r(4429);
    var i = (n = /[^.]+$/.exec(o && o.keys && o.keys.IE_PROTO || "")) ? "Symbol(src)_1." + n : "";
    e.exports = function (e) {
      return !!i && i in e;
    };
  }, 7040: e => {
    e.exports = function () {
      this.__data__ = [];
      this.size = 0;
    };
  }, 4125: (e, t, r) => {
    var n = r(8470);
    var o = Array.prototype.splice;
    e.exports = function (e) {
      var t = this.__data__;
      var r = n(t, e);
      return !(r < 0 || (r == t.length - 1 ? t.pop() : Array.prototype.splice.call(t, r, 1), --this.size, 0));
    };
  }, 2117: (e, t, r) => {
    var n = r(8470);
    e.exports = function (e) {
      var t = this.__data__;
      var r = n(this.__data__, e);
      return r < 0 ? undefined : this.__data__[r][1];
    };
  }, 7518: (e, t, r) => {
    var n = r(8470);
    e.exports = function (e) {
      return n(this.__data__, e) > -1;
    };
  }, 4705: (e, t, r) => {
    var n = r(8470);
    e.exports = function (e, t) {
      var r = this.__data__;
      var o = n(r, e);
      o < 0 ? (++this.size, r.push([e, t])) : r[o][1] = t;
      return this;
    };
  }, 4785: (e, t, r) => {
    var n = r(1989);
    var o = r(8407);
    var i = r(7071);
    e.exports = function () {
      this.size = 0;
      this.__data__ = {hash: new n, map: new (i || o), string: new n};
    };
  }, 1285: (e, t, r) => {
    var n = r(5050);
    e.exports = function (e) {
      var t = n(this, e).delete(e);
      this.size -= t ? 1 : 0;
      return t;
    };
  }, 6e3: (e, t, r) => {
    var n = r(5050);
    e.exports = function (e) {
      return n(this, e).get(e);
    };
  }, 9916: (e, t, r) => {
    var n = r(5050);
    e.exports = function (e) {
      return n(this, e).has(e);
    };
  }, 5265: (e, t, r) => {
    var n = r(5050);
    e.exports = function (e, t) {
      var r = n(this, e);
      var o = r.size;
      r.set(e, t);
      this.size += r.size == r.size ? 0 : 1;
      return this;
    };
  }, 4523: (e, t, r) => {
    var n = r(8306);
    e.exports = function (e) {
      var t = n(e, function (e) {
        if (500 === t.cache.size) {
          t.cache.clear();
        }
        return e;
      });
      var r = t.cache;
      return t;
    };
  }, 4536: (e, t, r) => {
    var n = r(852)(Object, "create");
    e.exports = n;
  }, 2333: e => {
    var t = Object.prototype.toString;
    e.exports = function (e) {
      return Object.prototype.toString.call(e);
    };
  }, 5639: (e, t, r) => {
    var n = r(8450);
    var o = "object" == typeof self && self && self.Object === Object && self;
    var i = n || o || Function("return this")();
    e.exports = i;
  }, 5514: (e, t, r) => {
    var n = r(4523);
    var o = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var i = /\\(\\)?/g;
    var s = n(function (e) {
      var t = [];
      if (46 === e.charCodeAt(0)) {
        t.push("");
      }
      e.replace(/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, function (e, r, n, o) {
        t.push(n ? o.replace(/\\(\\)?/g, "$1") : r || e);
      });
      return t;
    });
    e.exports = s;
  }, 327: (e, t, r) => {
    var n = r(3448);
    e.exports = function (e) {
      if ("string" == typeof e || n(e)) return e;
      var t = e + "";
      return "0" == t && 1 / e == -Infinity ? "-0" : t;
    };
  }, 346: e => {
    var t = Function.prototype.toString;
    e.exports = function (e) {
      if (null != e) {
        try {
          return Function.prototype.toString.call(e);
        } catch (e) {}
        try {
          return e + "";
        } catch (e) {}
      }
      return "";
    };
  }, 7813: e => {
    e.exports = function (e, t) {
      return e === t || e != e && t != t;
    };
  }, 7361: (e, t, r) => {
    var n = r(7786);
    e.exports = function (e, t, r) {
      var o = null == e ? undefined : n(e, t);
      return undefined === o ? r : o;
    };
  }, 1469: e => {
    var t = Array.isArray;
    e.exports = Array.isArray;
  }, 3560: (e, t, r) => {
    var n = r(4239);
    var o = r(3218);
    e.exports = function (e) {
      if (!o(e)) return false;
      var t = n(e);
      return "[object Function]" == t || "[object GeneratorFunction]" == t || "[object AsyncFunction]" == t || "[object Proxy]" == t;
    };
  }, 3218: e => {
    e.exports = function (e) {
      var t = typeof e;
      return null != e && ("object" == t || "function" == t);
    };
  }, 7005: e => {
    e.exports = function (e) {
      return null != e && "object" == typeof e;
    };
  }, 3448: (e, t, r) => {
    var n = r(4239);
    var o = r(7005);
    e.exports = function (e) {
      return "symbol" == typeof e || o(e) && "[object Symbol]" == n(e);
    };
  }, 8306: (e, t, r) => {
    var n = r(3369);
    function o(e, t) {
      if ("function" != typeof e || null != t && "function" != typeof t) throw new TypeError("Expected a function");
      var r = function () {
        var o = t ? t() : arguments[0];
        var i = r.cache;
        if (i.has(o)) return i.get(o);
        var s = e();
        r.cache = i.set(o, s) || i;
        return s;
      };
      r.cache = new (o.Cache || n);
      return r;
    }
    o.Cache = n;
    e.exports = o;
  }, 9833: (e, t, r) => {
    var n = r(531);
    e.exports = function (e) {
      return null == e ? "" : n(e);
    };
  }, 1614: (e, t, r) => {
    "use strict";
    var n;
    r.r(t);
    r.d(t, {NIL: () => "00000000-0000-0000-0000-000000000000", parse: () => g, stringify: () => h, v1: () => y, v3: () => P, v4: () => S, v5: () => C, validate: () => a, version: () => T});
    var o = new Uint8Array(16);
    function i() {
      if (!n && !(n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
      return n(o);
    }
    const s = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    for (var c = [], u = 0; u < 256; ++u) c.push((u + 256).toString(16).substr(1));
    const h = function (e) {
      var t = arguments.length > 1 && undefined !== arguments[1] ? arguments[1] : 0;
      var r = (c[e[t + 0]] + c[e[t + 1]] + c[e[t + 2]] + c[e[t + 3]] + "-" + c[e[t + 4]] + c[e[t + 5]] + "-" + c[e[t + 6]] + c[e[t + 7]] + "-" + c[e[t + 8]] + c[e[t + 9]] + "-" + c[e[t + 10]] + c[e[t + 11]] + c[e[t + 12]] + c[e[t + 13]] + c[e[t + 14]] + c[e[t + 15]]).toLowerCase();
      if (!("string" == typeof r && /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i.test(r))) throw TypeError("Stringified UUID is invalid");
      return r;
    };
    var f;
    var p;
    var l = 0;
    var d = 0;
    const y = function (e, t, r) {
      var n = t && r || 0;
      var o = t || new Array(16);
      var s = (e = e || {}).node || f;
      var a = undefined !== e.clockseq ? e.clockseq : p;
      if (null == s || null == a) {
        var c = e.random || (e.rng || i)();
        if (null == s) {
          s = f = [1, c[1], c[2], c[3], c[4], c[5]];
        }
        if (null == a) {
          a = p = 16383 & (c[6] << 8 | c[7]);
        }
      }
      var u = undefined !== e.msecs ? e.msecs : Date.now();
      var y = undefined !== e.nsecs ? e.nsecs : d + 1;
      var g = u - l + (y - d) / 1e4;
      if (g < 0 && undefined === e.clockseq) {
        a = a + 1 & 16383;
      }
      if ((g < 0 || u > l) && undefined === e.nsecs) {
        y = 0;
      }
      if (y >= 1e4) 
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
      l = u;
      d = y;
      p = a;
      var v = (10000 * (268435455 & (u += 122192928e5)) + y) % 4294967296;
      o[n++] = v >>> 24 & 255;
      o[n++] = v >>> 16 & 255;
      o[n++] = v >>> 8 & 255;
      o[n++] = 255 & v;
      var m = u / 4294967296 * 1e4 & 268435455;
      o[n++] = m >>> 8 & 255;
      o[n++] = 255 & m;
      o[n++] = m >>> 24 & 15 | 16;
      o[n++] = m >>> 16 & 255;
      o[n++] = a >>> 8 | 128;
      o[n++] = 255 & a;
      for (var w = 0; w < 6; ++w) o[n + w] = s[w];
      return t || h(o);
    };
    const g = function (e) {
      if (!("string" == typeof e && /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i.test(e))) throw TypeError("Invalid UUID");
      var t;
      var r = new Uint8Array(16);
      r[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24;
      r[1] = t >>> 16 & 255;
      r[2] = t >>> 8 & 255;
      r[3] = 255 & t;
      r[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8;
      r[5] = 255 & t;
      r[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8;
      r[7] = 255 & t;
      r[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8;
      r[9] = 255 & t;
      r[10] = (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255;
      r[11] = t / 4294967296 & 255;
      r[12] = t >>> 24 & 255;
      r[13] = t >>> 16 & 255;
      r[14] = t >>> 8 & 255;
      r[15] = 255 & t;
      return r;
    };
    function v(e, t, r) {
      function n(e, n, o, i) {
        if ("string" == typeof e) {
          e = function (e) {
            e = unescape(encodeURIComponent(e));
            for (var t = [], r = 0; r < e.length; ++r) t.push(e.charCodeAt(r));
            return t;
          }(e);
        }
        if ("string" == typeof n) {
          n = g(n);
        }
        if (16 !== n.length) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        var s = new Uint8Array(16 + e.length);
        s.set(n);
        s.set(e, n.length);
        (s = r(s))[6] = 15 & s[6] | t;
        s[8] = 63 & s[8] | 128;
        if (o) {
          i = i || 0;
          for (var a = 0; a < 16; ++a) o[i + a] = s[a];
          return o;
        }
        return h(s);
      }
      try {
        n.name = e;
      } catch (e) {}
      n.DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
      n.URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
      return n;
    }
    function w(e, t) {
      var r = (65535 & e) + (65535 & t);
      return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r;
    }
    function b(e, t, r, n, o, i) {
      return w((s = w(w(t, e), w(n, i))) << (a = o) | s >>> 32 - a, r);
      var s;
      var a;
    }
    const P = v("v3", 48, function (e) {
      if ("string" == typeof e) {
        var t = "[object Object]";
        e = new Uint8Array(15);
        for (var r = 0; r < 15; ++r) e[r] = "[object Object]".charCodeAt(r);
      }
      return function (e) {
        for (var t = [], r = 32 * e.length, n = "0123456789abcdef", o = 0; o < r; o += 8) {
          var i = e[o >> 5] >>> o % 32 & 255;
          var s = parseInt("0123456789abcdef".charAt(i >>> 4 & 15) + "0123456789abcdef".charAt(15 & i), 16);
          t.push(s);
        }
        return t;
      }(function (e, t) {
        e[t >> 5] |= 128 << t % 32;
        e[14 + (t + 64 >>> 9 << 4) + 1 - 1] = t;
        for (var r = 1732584193, n = -271733879, o = -1732584194, i = 271733878, s = 0; s < e.length; s += 16) {
          r = b(n & o | ~n & i, r, n, e[s], 7, -680876936);
          i = b(r & n | ~r & o, i, r, e[s + 1], 12, -389564586);
          o = b(i & r | ~i & n, o, i, e[s + 2], 17, 606105819);
          n = b(o & i | ~o & r, n, o, e[s + 3], 22, -1044525330);
          r = b(n & o | ~n & i, r, n, e[s + 4], 7, -176418897);
          i = b(r & n | ~r & o, i, r, e[s + 5], 12, 1200080426);
          o = b(i & r | ~i & n, o, i, e[s + 6], 17, -1473231341);
          n = b(o & i | ~o & r, n, o, e[s + 7], 22, -45705983);
          r = b(n & o | ~n & i, r, n, e[s + 8], 7, 1770035416);
          i = b(r & n | ~r & o, i, r, e[s + 9], 12, -1958414417);
          o = b(i & r | ~i & n, o, i, e[s + 10], 17, -42063);
          n = b(o & i | ~o & r, n, o, e[s + 11], 22, -1990404162);
          r = b(n & o | ~n & i, r, n, e[s + 12], 7, 1804603682);
          i = b(r & n | ~r & o, i, r, e[s + 13], 12, -40341101);
          o = b(i & r | ~i & n, o, i, e[s + 14], 17, -1502002290);
          r = b((n = b(o & i | ~o & r, n, o, e[s + 15], 22, 1236535329)) & i | o & ~i, r, n = b(o & i | ~o & r, n, o, e[s + 15], 22, 1236535329), e[s + 1], 5, -165796510);
          i = b(r & o | n & ~o, i, r, e[s + 6], 9, -1069501632);
          o = b(i & n | r & ~n, o, i, e[s + 11], 14, 643717713);
          n = b(o & r | i & ~r, n, o, e[s], 20, -373897302);
          r = b(n & i | o & ~i, r, n, e[s + 5], 5, -701558691);
          i = b(r & o | n & ~o, i, r, e[s + 10], 9, 38016083);
          o = b(i & n | r & ~n, o, i, e[s + 15], 14, -660478335);
          n = b(o & r | i & ~r, n, o, e[s + 4], 20, -405537848);
          r = b(n & i | o & ~i, r, n, e[s + 9], 5, 568446438);
          i = b(r & o | n & ~o, i, r, e[s + 14], 9, -1019803690);
          o = b(i & n | r & ~n, o, i, e[s + 3], 14, -187363961);
          n = b(o & r | i & ~r, n, o, e[s + 8], 20, 1163531501);
          r = b(n & i | o & ~i, r, n, e[s + 13], 5, -1444681467);
          i = b(r & o | n & ~o, i, r, e[s + 2], 9, -51403784);
          o = b(i & n | r & ~n, o, i, e[s + 7], 14, 1735328473);
          r = b((n = b(o & r | i & ~r, n, o, e[s + 12], 20, -1926607734)) ^ o ^ i, r, n = b(o & r | i & ~r, n, o, e[s + 12], 20, -1926607734), e[s + 5], 4, -378558);
          i = b(r ^ n ^ o, i, r, e[s + 8], 11, -2022574463);
          o = b(i ^ r ^ n, o, i, e[s + 11], 16, 1839030562);
          n = b(o ^ i ^ r, n, o, e[s + 14], 23, -35309556);
          r = b(n ^ o ^ i, r, n, e[s + 1], 4, -1530992060);
          i = b(r ^ n ^ o, i, r, e[s + 4], 11, 1272893353);
          o = b(i ^ r ^ n, o, i, e[s + 7], 16, -155497632);
          n = b(o ^ i ^ r, n, o, e[s + 10], 23, -1094730640);
          r = b(n ^ o ^ i, r, n, e[s + 13], 4, 681279174);
          i = b(r ^ n ^ o, i, r, e[s], 11, -358537222);
          o = b(i ^ r ^ n, o, i, e[s + 3], 16, -722521979);
          n = b(o ^ i ^ r, n, o, e[s + 6], 23, 76029189);
          r = b(n ^ o ^ i, r, n, e[s + 9], 4, -640364487);
          i = b(r ^ n ^ o, i, r, e[s + 12], 11, -421815835);
          o = b(i ^ r ^ n, o, i, e[s + 15], 16, 530742520);
          r = b(o ^ ((n = b(o ^ i ^ r, n, o, e[s + 2], 23, -995338651)) | ~i), r, n = b(o ^ i ^ r, n, o, e[s + 2], 23, -995338651), e[s], 6, -198630844);
          i = b(n ^ (r | ~o), i, r, e[s + 7], 10, 1126891415);
          o = b(r ^ (i | ~n), o, i, e[s + 14], 15, -1416354905);
          n = b(i ^ (o | ~r), n, o, e[s + 5], 21, -57434055);
          r = b(o ^ (n | ~i), r, n, e[s + 12], 6, 1700485571);
          i = b(n ^ (r | ~o), i, r, e[s + 3], 10, -1894986606);
          o = b(r ^ (i | ~n), o, i, e[s + 10], 15, -1051523);
          n = b(i ^ (o | ~r), n, o, e[s + 1], 21, -2054922799);
          r = b(o ^ (n | ~i), r, n, e[s + 8], 6, 1873313359);
          i = b(n ^ (r | ~o), i, r, e[s + 15], 10, -30611744);
          o = b(r ^ (i | ~n), o, i, e[s + 6], 15, -1560198380);
          n = b(i ^ (o | ~r), n, o, e[s + 13], 21, 1309151649);
          r = b(o ^ (n | ~i), r, n, e[s + 4], 6, -145523070);
          i = b(n ^ (r | ~o), i, r, e[s + 11], 10, -1120210379);
          o = b(r ^ (i | ~n), o, i, e[s + 2], 15, 718787259);
          n = b(i ^ (o | ~r), n, o, e[s + 9], 21, -343485551);
          r = w(r, r);
          n = w(n, n);
          o = w(o, o);
          i = w(i, i);
        }
        return [r, n, o, i];
      }(function (e) {
        if (0 === e.length) return [];
        for (var t = 8 * e.length, r = new Uint32Array(14 + (t + 64 >>> 9 << 4) + 1), n = 0; n < t; n += 8) r[n >> 5] |= (255 & e[n / 8]) << n % 32;
        return r;
      }(e), 8 * e.length));
    });
    const S = function (e, t, r) {
      var n = (e = e || {}).random || (e.rng || i)();
      n[6] = 15 & n[6] | 64;
      n[8] = 63 & n[8] | 128;
      if (t) {
        r = r || 0;
        for (var o = 0; o < 16; ++o) t[r + o] = n[o];
        return t;
      }
      return h(n);
    };
    function j(e, t, r, n) {
      switch (e) {
        case 0:
          return t & r ^ ~t & n;
        case 1:
        case 3:
          return t ^ r ^ n;
        case 2:
          return t & r ^ t & n ^ r & n;
      }
    }
    const C = v("v5", 80, function (e) {
      var t = [1518500249, 1859775393, 2400959708, 3395469782];
      var r = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
      if ("string" == typeof e) {
        var n = "[object Object]";
        e = [];
        for (var o = 0; o < 15; ++o) e.push("[object Object]".charCodeAt(o));
      } else if (!Array.isArray(e)) {
        e = Array.prototype.slice.call(e);
      }
      e.push(128);
      for (var i = e.length / 4 + 2, s = Math.ceil(i / 16), a = new Array(s), c = 0; c < s; ++c) {
        for (var u = new Uint32Array(16), h = 0; h < 16; ++h) u[h] = e[64 * c + 4 * h] << 24 | e[64 * c + 4 * h + 1] << 16 | e[64 * c + 4 * h + 2] << 8 | e[64 * c + 4 * h + 3];
        a[c] = u;
      }
      a[s - 1][14] = 8 * (e.length - 1) / Math.pow(2, 32);
      a[s - 1][14] = Math.floor(a[s - 1][14]);
      a[s - 1][15] = 8 * (e.length - 1) & 4294967295;
      for (var f = 0; f < s; ++f) {
        for (var p = new Uint32Array(80), l = 0; l < 16; ++l) p[l] = a[f][l];
        for (var d = 16; d < 80; ++d) p[d] = (p[d - 3] ^ p[d - 8] ^ p[d - 14] ^ p[d - 16]) << 1 | (p[d - 3] ^ p[d - 8] ^ p[d - 14] ^ p[d - 16]) >>> 31;
        for (var y = 1732584193, g = 4023233417, v = 2562383102, m = 271733878, w = 3285377520, b = 0; b < 80; ++b) {
          var x = Math.floor(b / 20);
          var _ = (y << 5 | y >>> 27) + j(x, g, v, m) + w + t[x] + p[b] >>> 0;
          w = m;
          m = v;
          v = (g << 30 | g >>> 2) >>> 0;
          g = y;
          y = _;
        }
        r[0] = 1732584193 + y >>> 0;
        r[1] = 4023233417 + g >>> 0;
        r[2] = 2562383102 + v >>> 0;
        r[3] = 271733878 + m >>> 0;
        r[4] = 3285377520 + w >>> 0;
      }
      return [103, 69, 35, 1, 239, 205, 171, 137, 152, 186, 220, 254, 16, 50, 84, 118, 195, 210, 225, 240];
    });
    const M = "00000000-0000-0000-0000-000000000000";
    const T = function (e) {
      if (!("string" == typeof e && /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i.test(e))) throw TypeError("Invalid UUID");
      return parseInt(e.substr(14, 1), 16);
    };
  }, 2081: (e, t, r) => {
    "use strict";
    r.r(t);
    r.d(t, {default: () => o});
    const n = e => {
      const t = new Set;
      do {
        for (const r of Reflect.ownKeys(e)) t.add([e, r]);
      } while ((e = Reflect.getPrototypeOf(e)) && e !== Object.prototype);
      return t;
    };
    function o(e, {include: t, exclude: r} = {}) {
      const o = e => {
        const n = t => "string" == typeof t ? e === t : t.test(e);
        return t ? t.some(n) : !r || !r.some(n);
      };
      for (const [t, r] of n(e.constructor.prototype)) {
        if ("constructor" === r || !o(r)) continue;
        const n = Reflect.getOwnPropertyDescriptor(t, r);
        if (n && "function" == typeof n.value) {
          e[r] = e[r].bind(e);
        }
      }
      return e;
    }
  }};
  var t = {};
  function r(n) {
    var o = t[n];
    if (undefined !== o) return o.exports;
    var i = t[n] = {exports: {}};
    e[n].call(i.exports, i, i.exports, r);
    return i.exports;
  }
  r.n = e => {
    var t = e && e.__esModule ? () => e.default : () => e;
    r.d(t, {a: t});
    return t;
  };
  r.d = (e, t) => {
    for (var n in t) if (r.o(t, n) && !r.o(e, n)) {
      Object.defineProperty(e, n, {enumerable: true, get: t[n]});
    }
  };
  r.g = function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  }();
  r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
  r.r = e => {
    if ("undefined" != typeof Symbol && Symbol.toStringTag) {
      Object.defineProperty(e, Symbol.toStringTag, {value: "Module"});
    }
    Object.defineProperty(e, "__esModule", {value: true});
  };
  (() => {
    "use strict";
    var e;
    var t = r(4654);
    var n = r(7361);
    var o = r.n(n);
    !function (e) {
      e.merchantSPBGetWindowPath = "merchantSPB:merchantSPBGetWindowPath";
      e.merchantSPBCreateOrder = "merchantSPB:merchantSPBCreateOrder";
      e.merchantSPBApproveOrder = "merchantSPB:merchantSPBApproveOrder";
      e.merchantSPBCancelOrder = "merchantSPB:merchantSPBCancelOrder";
      e.merchantSPBErrorOrder = "merchantSPB:merchantSPBErrorOrder";
      e.merchantSPBGuestEnabled = "merchantSPB:merchantSPBGuestEnabled";
      e.merchantSPBGetFacilitatorAccessToken = "merchantSPB:merchantSPBGetFacilitatorAccessToken";
    }(e || (e = {}));
    const i = {327: "327", 346: "346", 401: "401", 531: "531", 852: "852", 1285: "1285", 1327: "1327", 1469: "1469", 1614: "1614", 1789: "1789", 1811: "1811", 1866: "1866", 1989: "1989", 2081: "2081", 2117: "2117", 2333: "2333", 2705: "2705", 3218: "3218", 3369: "3369", 3448: "3448", 3560: "3560", 3982: "3982", 4125: "4125", 4239: "4239", 4429: "4429", 4523: "4523", 4536: "4536", 4654: "4654", 4705: "4705", 4785: "4785", 5050: "5050", 5265: "5265", 5346: "5346", 5403: "5403", 5514: "5514", 5639: "5639", 6e3: "6000", 6068: "6068", 7005: "7005", 7019: "7019", 7040: "7040", 7071: "7071", 7361: "7361", 7518: "7518", 7667: "7667", 7786: "7786", 7801: "7801", 7813: "7813", 8306: "8306", 8407: "8407", 8450: "8450", 8458: "8458", 8470: "8470", 9607: "9607", 9833: "9833", 9916: "9916", 9932: "9932"};
    var s = function (e, t, r, n) {
      return new (r || (r = Promise))(function (o, i) {
        function s(e) {
          try {
            c(n.next(e));
          } catch (e) {
            i(e);
          }
        }
        function a(e) {
          try {
            c(n.throw(e));
          } catch (e) {
            i(e);
          }
        }
        function c(e) {
          var t;
          e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r(function (e) {
            e(t);
          })).then(s, a);
        }
        c((n = n.apply(e, t || [])).next());
      });
    };
    const a = new t.PostMessenger({clientName: "merchant-spb", enableLogging: true, types: e, useEncryption: false});
    s(this, undefined, undefined, function* () {
      const e = window.exports.paymentSession();
      window.top ? (a.bindResponders({[i.merchantSPBGetWindowPath]: ({path: e}) => o()(window, e), [i.merchantSPBCreateOrder]: () => s(this, undefined, undefined, function* () {
        return e.createOrder({eventSource: "honey"});
      }), [i.merchantSPBApproveOrder]: t => {
        try {
          e.onApprove(t);
        } catch (e) {}
      }, [i.merchantSPBCancelOrder]: t => e.onCancel(t), [i.merchantSPBErrorOrder]: t => e.onError(t.error || "unknown error"), [i.merchantSPBGuestEnabled]: ({merchantId: e}) => s(this, undefined, undefined, function* () {
        return yield window.exports.isGuestEnabled(e);
      }), [i.merchantSPBGetFacilitatorAccessToken]: () => s(this, undefined, undefined, function* () {
        return yield e.getFacilitatorAccessToken();
      })}), yield a.connect({targetOrigin: document.referrer || window.location.ancestorOrigins[0], targetWindow: window.top})) : console.error("window.top is null");
    });
  })();
})();
