"v0.4.7 Geetest Inc.";

(function (b, a) {
  "object" === typeof module && "object" === typeof module.exports ? module.exports = b.document ? a(b, !0) : function (c) {
    if (!c.document) {
      throw Error("Geetest requires a window with a document")
    }
    return a(c)
  } : a(b)
})("undefined" !== typeof window ? window : this, function (n, l) {
  function g(e) {
    this._obj = e
  }

  function c(f) {
    var e = this;
    (new g(f))._each(function (h, k) {
      e[h] = k
    })
  }
  if ("undefined" === typeof n) {
    throw Error("Geetest requires browser environment")
  }
  var b = n.document,
    E = n.Math,
    D = b.getElementsByTagName("head")[0];
  g.prototype = {
    _each: function (h) {
      var e = this._obj,
        f;
      for (f in e) {
        e.hasOwnProperty(f) && h(f, e[f])
      }
      return this
    }
  };
  c.prototype = {
    api_server: "api.geetest.com",
    protocol: "http://",
    type_path: "/gettype.php",
    fallback_config: {
      slide: {
        static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
        type: "slide",
        slide: "/static/js/geetest.0.0.0.js"
      },
      fullpage: {
        static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
        type: "fullpage",
        fullpage: "/static/js/fullpage.0.0.0.js"
      }
    },
    _get_fallback_config: function () {
      return "string" === typeof this.type ? this.fallback_config[this.type] : this.new_captcha ? this.fallback_config.fullpage : this.fallback_config.slide
    }, _extend: function (f) {
      var e = this;
      (new g(f))._each(function (h, k) {
        e[h] = k
      })
    }
  };
  var C = function (e) {
      return "object" === typeof e && null !== e
    },
    j = {},
    i = {},
    B = function (k, e) {
      var f = b.createElement("script");
      f.charset = "UTF-8";
      f.async = !0;
      f.onerror = function () {
        e(!0)
      };
      var h = !1;
      f.onload = f.onreadystatechange = function () {
        h || f.readyState && "loaded" !== f.readyState && "complete" !== f.readyState || (h = !0, setTimeout(function () {
          e(!1)
        }, 0))
      };
      f.src = k;
      D.appendChild(f)
    },
    s = function (f) {
      if (!f) {
        return ""
      }
      var e = "?";
      (new g(f))._each(function (h, k) {
        if ("string" === typeof k || "number" === typeof k || "boolean" === typeof k) {
          e = e + encodeURIComponent(h) + "=" + encodeURIComponent(k) + "&"
        }
      });
      "?" === e && (e = "");
      return e.replace(/&$/, "")
    },
    o = function (k, e, f, h) {
      e = e.replace(/^https?:\/\/|\/$/g, "");
      f = f.replace(/\/+/g, "/");
      0 !== f.indexOf("/") && (f = "/" + f);
      h = f + s(h);
      e && (h = k + e + h);
      return h
    },
    a = function (q, f, h, p, k) {
      var m = function (r) {
        var e = o(q, f[r], h, p);
        B(e, function (t) {
          t ? r >= f.length - 1 ? k(!0) : m(r + 1) : k(!1)
        })
      };
      m(0)
    },
    d = function (m, e, f, k) {
      if (C(f.getLib)) {
        f._extend(f.getLib), k(f)
      } else {
        if (f.offline) {
          k(f._get_fallback_config())
        } else {
          var h = "geetest_" + (parseInt(10000 * E.random()) + (new Date).valueOf());
          n[h] = function (p) {
            "success" === p.status ? k(p.data) : p.status ? k(f._get_fallback_config()) : k(p);
            n[h] = void 0;
            try {
              delete n[h]
            } catch (q) {}
          };
          a(f.protocol, m, e, {
            gt: f.gt,
            callback: h
          }, function (p) {
            p && k(f._get_fallback_config())
          })
        }
      }
    },
    F = function (h, e) {
      var f = {
        networkError: "\u7f51\u7edc\u9519\u8bef"
      };
      if ("function" === typeof e.onError) {
        e.onError(f[h])
      } else {
        throw Error(f[h])
      }
    };
  n.Geetest && (i.slide = "loaded");
  l = function (h, e) {
    var f = new c(h);
    h.https ? f.protocol = "https://" : h.protocol || (f.protocol = n.location.protocol + "//");
    d([f.api_server || f.apiserver], f.type_path, f, function (p) {
      var q = p.type,
        m = function () {
          f._extend(p);
          e(new n.Geetest(f))
        };
      j[q] = j[q] || [];
      var k = i[q] || "init";
      "init" === k ? (i[q] = "loading", j[q].push(m), a(f.protocol, p.static_servers || p.domains, p[q] || p.path, null, function (r) {
        if (r) {
          i[q] = "fail", F("networkError", f)
        } else {
          i[q] = "loaded";
          r = j[q];
          for (var v = 0, u = r.length; v < u; v += 1) {
            var t = r[v];
            "function" === typeof t && t()
          }
          j[q] = []
        }
      })) : "loaded" === k ? m() : "fail" === k ? F("networkError", f) : "loading" === k && j[q].push(m)
    })
  };
  return n.initGeetest = l
});
