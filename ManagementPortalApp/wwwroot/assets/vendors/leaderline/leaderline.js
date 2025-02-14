﻿(function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = "MODULE_NOT_FOUND"), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = "function" == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      1: [
        function (require, module, exports) {
          /*! LeaderLine v1.1.5 (c) anseki https://anseki.github.io/leader-line/ */
          window.LeaderLine = (function () {
            "use strict";
            var te,
              M,
              I,
              C,
              L,
              o,
              t,
              h,
              f,
              p,
              n,
              a,
              e,
              x,
              b,
              l,
              r,
              i,
              k,
              w,
              s,
              u,
              c,
              A = "leader-line",
              V = 1,
              P = 2,
              N = 3,
              T = 4,
              W = { top: V, right: P, bottom: N, left: T },
              B = 1,
              R = 2,
              F = 3,
              G = 4,
              D = 5,
              z = { straight: B, arc: R, fluid: F, magnet: G, grid: D },
              ne = "behind",
              d = A + "-defs",
              y =
                '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="leader-line-defs"><style><![CDATA[.leader-line{position:absolute;overflow:visible!important;pointer-events:none!important;font-size:16px}#leader-line-defs{width:0;height:0;position:absolute;left:0;top:0}.leader-line-line-path{fill:none}.leader-line-mask-bg-rect{fill:#fff}.leader-line-caps-mask-anchor,.leader-line-caps-mask-marker-shape{fill:#000}.leader-line-caps-mask-anchor{stroke:#000}.leader-line-caps-mask-line,.leader-line-plugs-face{stroke:transparent}.leader-line-line-mask-shape{stroke:#fff}.leader-line-line-outline-mask-shape{stroke:#000}.leader-line-plug-mask-shape{fill:#fff;stroke:#000}.leader-line-plug-outline-mask-shape{fill:#000;stroke:#fff}.leader-line-areaAnchor{position:absolute;overflow:visible!important}]]></style><defs><circle id="leader-line-disc" cx="0" cy="0" r="5"/><rect id="leader-line-square" x="-5" y="-5" width="10" height="10"/><polygon id="leader-line-arrow1" points="-8,-8 8,0 -8,8 -5,0"/><polygon id="leader-line-arrow2" points="-4,-8 4,0 -4,8 -7,5 -2,0 -7,-5"/><polygon id="leader-line-arrow3" points="-4,-5 8,0 -4,5"/><g id="leader-line-hand"><path style="fill: #fcfcfc" d="M9.19 11.14h4.75c1.38 0 2.49-1.11 2.49-2.49 0-.51-.15-.98-.41-1.37h1.3c1.38 0 2.49-1.11 2.49-2.49s-1.11-2.53-2.49-2.53h1.02c1.38 0 2.49-1.11 2.49-2.49s-1.11-2.49-2.49-2.49h14.96c1.37 0 2.49-1.11 2.49-2.49s-1.11-2.49-2.49-2.49H16.58C16-9.86 14.28-11.14 9.7-11.14c-4.79 0-6.55 3.42-7.87 4.73H-2.14v13.23h3.68C3.29 9.97 5.47 11.14 9.19 11.14L9.19 11.14Z"/><path style="fill: black" d="M13.95 12c1.85 0 3.35-1.5 3.35-3.35 0-.17-.02-.34-.04-.51h.07c1.85 0 3.35-1.5 3.35-3.35 0-.79-.27-1.51-.72-2.08 1.03-.57 1.74-1.67 1.74-2.93 0-.59-.16-1.15-.43-1.63h12.04c1.85 0 3.35-1.5 3.35-3.35 0-1.85-1.5-3.35-3.35-3.35H17.2C16.26-10.93 13.91-12 9.7-12 5.36-12 3.22-9.4 1.94-7.84c0 0-.29.33-.5.57-.63 0-3.58 0-3.58 0C-2.61-7.27-3-6.88-3-6.41v13.23c0 .47.39.86.86.86 0 0 2.48 0 3.2 0C2.9 10.73 5.29 12 9.19 12L13.95 12ZM9.19 10.28c-3.46 0-5.33-1.05-6.9-3.87-.15-.27-.44-.44-.75-.44 0 0-1.81 0-2.82 0V-5.55c1.06 0 3.11 0 3.11 0 .25 0 .44-.06.61-.25l.83-.95c1.23-1.49 2.91-3.53 6.43-3.53 3.45 0 4.9.74 5.57 1.72h-4.3c-.48 0-.86.38-.86.86s.39.86.86.86h22.34c.9 0 1.63.73 1.63 1.63 0 .9-.73 1.63-1.63 1.63H15.83c-.48 0-.86.38-.86.86 0 .47.39.86.86.86h2.52c.9 0 1.63.73 1.63 1.63s-.73 1.63-1.63 1.63h-3.12c-.48 0-.86.38-.86.86 0 .47.39.86.86.86h2.11c.88 0 1.63.76 1.63 1.67 0 .9-.73 1.63-1.63 1.63h-3.2c-.48 0-.86.39-.86.86 0 .47.39.86.86.86h1.36c.05.16.09.34.09.51 0 .9-.73 1.63-1.63 1.63C13.95 10.28 9.19 10.28 9.19 10.28Z"/></g><g id="leader-line-crosshair"><path d="M0-78.97c-43.54 0-78.97 35.43-78.97 78.97 0 43.54 35.43 78.97 78.97 78.97s78.97-35.43 78.97-78.97C78.97-43.54 43.55-78.97 0-78.97ZM76.51-1.21h-9.91v-9.11h-2.43v9.11h-11.45c-.64-28.12-23.38-50.86-51.5-51.5V-64.17h9.11V-66.6h-9.11v-9.91C42.46-75.86 75.86-42.45 76.51-1.21ZM-1.21-30.76h-9.11v2.43h9.11V-4.2c-1.44.42-2.57 1.54-2.98 2.98H-28.33v-9.11h-2.43v9.11H-50.29C-49.65-28-27.99-49.65-1.21-50.29V-30.76ZM-30.76 1.21v9.11h2.43v-9.11H-4.2c.42 1.44 1.54 2.57 2.98 2.98v24.13h-9.11v2.43h9.11v19.53C-27.99 49.65-49.65 28-50.29 1.21H-30.76ZM1.22 30.75h9.11v-2.43h-9.11V4.2c1.44-.42 2.56-1.54 2.98-2.98h24.13v9.11h2.43v-9.11h19.53C49.65 28 28 49.65 1.22 50.29V30.75ZM30.76-1.21v-9.11h-2.43v9.11H4.2c-.42-1.44-1.54-2.56-2.98-2.98V-28.33h9.11v-2.43h-9.11V-50.29C28-49.65 49.65-28 50.29-1.21H30.76ZM-1.21-76.51v9.91h-9.11v2.43h9.11v11.45c-28.12.64-50.86 23.38-51.5 51.5H-64.17v-9.11H-66.6v9.11h-9.91C-75.86-42.45-42.45-75.86-1.21-76.51ZM-76.51 1.21h9.91v9.11h2.43v-9.11h11.45c.64 28.12 23.38 50.86 51.5 51.5v11.45h-9.11v2.43h9.11v9.91C-42.45 75.86-75.86 42.45-76.51 1.21ZM1.22 76.51v-9.91h9.11v-2.43h-9.11v-11.45c28.12-.64 50.86-23.38 51.5-51.5h11.45v9.11h2.43v-9.11h9.91C75.86 42.45 42.45 75.86 1.22 76.51Z"/><path d="M0 83.58-7.1 96 7.1 96Z"/><path d="M0-83.58 7.1-96-7.1-96"/><path d="M83.58 0 96 7.1 96-7.1Z"/><path d="M-83.58 0-96-7.1-96 7.1Z"/></g></defs></svg>',
              ae = {
                disc: {
                  elmId: "leader-line-disc",
                  noRotate: !0,
                  bBox: {
                    left: -5,
                    top: -5,
                    width: 10,
                    height: 10,
                    right: 5,
                    bottom: 5,
                  },
                  widthR: 2.5,
                  heightR: 2.5,
                  bCircle: 5,
                  sideLen: 5,
                  backLen: 5,
                  overhead: 0,
                  outlineBase: 1,
                  outlineMax: 4,
                },
                square: {
                  elmId: "leader-line-square",
                  noRotate: !0,
                  bBox: {
                    left: -5,
                    top: -5,
                    width: 10,
                    height: 10,
                    right: 5,
                    bottom: 5,
                  },
                  widthR: 2.5,
                  heightR: 2.5,
                  bCircle: 5,
                  sideLen: 5,
                  backLen: 5,
                  overhead: 0,
                  outlineBase: 1,
                  outlineMax: 4,
                },
                arrow1: {
                  elmId: "leader-line-arrow1",
                  bBox: {
                    left: -8,
                    top: -8,
                    width: 16,
                    height: 16,
                    right: 8,
                    bottom: 8,
                  },
                  widthR: 4,
                  heightR: 4,
                  bCircle: 8,
                  sideLen: 8,
                  backLen: 8,
                  overhead: 8,
                  outlineBase: 2,
                  outlineMax: 1.5,
                },
                arrow2: {
                  elmId: "leader-line-arrow2",
                  bBox: {
                    left: -7,
                    top: -8,
                    width: 11,
                    height: 16,
                    right: 4,
                    bottom: 8,
                  },
                  widthR: 2.75,
                  heightR: 4,
                  bCircle: 8,
                  sideLen: 8,
                  backLen: 7,
                  overhead: 4,
                  outlineBase: 1,
                  outlineMax: 1.75,
                },
                arrow3: {
                  elmId: "leader-line-arrow3",
                  bBox: {
                    left: -4,
                    top: -5,
                    width: 12,
                    height: 10,
                    right: 8,
                    bottom: 5,
                  },
                  widthR: 3,
                  heightR: 2.5,
                  bCircle: 8,
                  sideLen: 5,
                  backLen: 4,
                  overhead: 8,
                  outlineBase: 1,
                  outlineMax: 2.5,
                },
                hand: {
                  elmId: "leader-line-hand",
                  bBox: {
                    left: -3,
                    top: -12,
                    width: 40,
                    height: 24,
                    right: 37,
                    bottom: 12,
                  },
                  widthR: 10,
                  heightR: 6,
                  bCircle: 37,
                  sideLen: 12,
                  backLen: 3,
                  overhead: 37,
                },
                crosshair: {
                  elmId: "leader-line-crosshair",
                  noRotate: !0,
                  bBox: {
                    left: -96,
                    top: -96,
                    width: 192,
                    height: 192,
                    right: 96,
                    bottom: 96,
                  },
                  widthR: 48,
                  heightR: 48,
                  bCircle: 96,
                  sideLen: 96,
                  backLen: 96,
                  overhead: 0,
                },
              },
              j = {
                behind: ne,
                disc: "disc",
                square: "square",
                arrow1: "arrow1",
                arrow2: "arrow2",
                arrow3: "arrow3",
                hand: "hand",
                crosshair: "crosshair",
              },
              ie = {
                disc: "disc",
                square: "square",
                arrow1: "arrow1",
                arrow2: "arrow2",
                arrow3: "arrow3",
                hand: "hand",
                crosshair: "crosshair",
              },
              H = [V, P, N, T],
              U = "auto",
              oe = { x: "left", y: "top", width: "width", height: "height" },
              Z = 80,
              Y = 4,
              X = 5,
              q = 120,
              Q = 8,
              K = 3.75,
              J = 10,
              $ = 30,
              ee = 0.5522847,
              le = 0.25 * Math.PI,
              m = /^\s*(\-?[\d\.]+)\s*(\%)?\s*$/,
              re = "http://www.w3.org/2000/svg",
              S =
                "-ms-scroll-limit" in document.documentElement.style &&
                "-ms-ime-align" in document.documentElement.style &&
                !window.navigator.msPointerEnabled,
              se = !S && !!document.uniqueID,
              ue = "MozAppearance" in document.documentElement.style,
              he = !(S || ue || !window.chrome || !window.CSS),
              pe =
                !S &&
                !se &&
                !ue &&
                !he &&
                !window.chrome &&
                "WebkitAppearance" in document.documentElement.style,
              ce = se || S ? 0.2 : 0.1,
              de = {
                path: F,
                lineColor: "coral",
                lineSize: 4,
                plugSE: [ne, "arrow1"],
                plugSizeSE: [1, 1],
                lineOutlineEnabled: !1,
                lineOutlineColor: "indianred",
                lineOutlineSize: 0.25,
                plugOutlineEnabledSE: [!1, !1],
                plugOutlineSizeSE: [1, 1],
              },
              fe =
                ((s = {}.toString),
                (u = {}.hasOwnProperty.toString),
                (c = u.call(Object)),
                function (e) {
                  var t, n;
                  return (
                    e &&
                    "[object Object]" === s.call(e) &&
                    (!(t = Object.getPrototypeOf(e)) ||
                      ((n = t.hasOwnProperty("constructor") && t.constructor) &&
                        "function" == typeof n &&
                        u.call(n) === c))
                  );
                }),
              ye =
                Number.isFinite ||
                function (e) {
                  return "number" == typeof e && window.isFinite(e);
                },
              g =
                ((x = {
                  ease: [0.25, 0.1, 0.25, 1],
                  linear: [0, 0, 1, 1],
                  "ease-in": [0.42, 0, 1, 1],
                  "ease-out": [0, 0, 0.58, 1],
                  "ease-in-out": [0.42, 0, 0.58, 1],
                }),
                (b = 1e3 / 60 / 2),
                (l =
                  window.requestAnimationFrame ||
                  window.mozRequestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.msRequestAnimationFrame ||
                  function (e) {
                    setTimeout(e, b);
                  }),
                (r =
                  window.cancelAnimationFrame ||
                  window.mozCancelAnimationFrame ||
                  window.webkitCancelAnimationFrame ||
                  window.msCancelAnimationFrame ||
                  function (e) {
                    clearTimeout(e);
                  }),
                (i =
                  Number.isFinite ||
                  function (e) {
                    return "number" == typeof e && window.isFinite(e);
                  }),
                (k = []),
                (w = 0),
                {
                  add: function (n, e, t, a, i, o, l) {
                    var r,
                      s,
                      u,
                      h,
                      p,
                      c,
                      d,
                      f,
                      y,
                      m,
                      S,
                      g,
                      _,
                      v = ++w;
                    function E(e, t) {
                      return { value: n(t), timeRatio: e, outputRatio: t };
                    }
                    if (
                      ("string" == typeof i && (i = x[i]),
                      (n = n || function () {}),
                      t < b)
                    )
                      s = [E(0, 0), E(1, 1)];
                    else {
                      if (
                        ((u = b / t),
                        (s = [E(0, 0)]),
                        0 === i[0] && 0 === i[1] && 1 === i[2] && 1 === i[3])
                      )
                        for (p = u; p <= 1; p += u) s.push(E(p, p));
                      else
                        for (c = h = (p = u) / 10; c <= 1; c += h)
                          (_ = g = S = m = y = void 0),
                            (m = (y = (f = c) * f) * f),
                            (_ = 3 * (S = 1 - f) * y),
                            p <=
                              (d = {
                                x: (g = S * S * 3 * f) * i[0] + _ * i[2] + m,
                                y: g * i[1] + _ * i[3] + m,
                              }).x && (s.push(E(d.x, d.y)), (p += u));
                      s.push(E(1, 1));
                    }
                    return (
                      (r = {
                        animId: v,
                        frameCallback: e,
                        duration: t,
                        count: a,
                        frames: s,
                        reverse: !!o,
                      }),
                      k.push(r),
                      !1 !== l && ke(r, l),
                      v
                    );
                  },
                  remove: function (n) {
                    var a;
                    k.some(function (e, t) {
                      return e.animId === n && ((a = t), !(e.framesStart = null));
                    }) && k.splice(a, 1);
                  },
                  start: function (t, n, a) {
                    k.some(function (e) {
                      return e.animId === t && ((e.reverse = !!n), ke(e, a), !0);
                    });
                  },
                  stop: function (t, n) {
                    var a;
                    return (
                      k.some(function (e) {
                        return (
                          e.animId === t &&
                          (n
                            ? null != e.lastFrame &&
                              (a = e.frames[e.lastFrame].timeRatio)
                            : ((a = (Date.now() - e.framesStart) / e.duration),
                              e.reverse && (a = 1 - a),
                              a < 0 ? (a = 0) : 1 < a && (a = 1)),
                          !(e.framesStart = null))
                        );
                      }),
                      a
                    );
                  },
                  validTiming: function (t) {
                    return "string" == typeof t
                      ? x[t]
                      : Array.isArray(t) &&
                        [0, 1, 2, 3].every(function (e) {
                          return i(t[e]) && 0 <= t[e] && t[e] <= 1;
                        })
                      ? [t[0], t[1], t[2], t[3]]
                      : null;
                  },
                }),
              _ = function (e) {
                (e.SVGPathElement.prototype.getPathData &&
                  e.SVGPathElement.prototype.setPathData) ||
                  (function () {
                    function i(e) {
                      (this._string = e),
                        (this._currentIndex = 0),
                        (this._endIndex = this._string.length),
                        (this._prevCommand = null),
                        this._skipOptionalSpaces();
                    }
                    var o = {
                        Z: "Z",
                        M: "M",
                        L: "L",
                        C: "C",
                        Q: "Q",
                        A: "A",
                        H: "H",
                        V: "V",
                        S: "S",
                        T: "T",
                        z: "Z",
                        m: "m",
                        l: "l",
                        c: "c",
                        q: "q",
                        a: "a",
                        h: "h",
                        v: "v",
                        s: "s",
                        t: "t",
                      },
                      l = -1 !== e.navigator.userAgent.indexOf("MSIE ");
                    i.prototype = {
                      parseSegment: function () {
                        var e = this._string[this._currentIndex],
                          t = o[e] ? o[e] : null;
                        if (null === t) {
                          if (null === this._prevCommand) return null;
                          if (
                            null ===
                            (t =
                              ("+" === e ||
                                "-" === e ||
                                "." === e ||
                                ("0" <= e && e <= "9")) &&
                              "Z" !== this._prevCommand
                                ? "M" === this._prevCommand
                                  ? "L"
                                  : "m" === this._prevCommand
                                  ? "l"
                                  : this._prevCommand
                                : null)
                          )
                            return null;
                        } else this._currentIndex += 1;
                        var n = null,
                          a = (this._prevCommand = t).toUpperCase();
                        return (
                          "H" === a || "V" === a
                            ? (n = [this._parseNumber()])
                            : "M" === a || "L" === a || "T" === a
                            ? (n = [this._parseNumber(), this._parseNumber()])
                            : "S" === a || "Q" === a
                            ? (n = [
                                this._parseNumber(),
                                this._parseNumber(),
                                this._parseNumber(),
                                this._parseNumber(),
                              ])
                            : "C" === a
                            ? (n = [
                                this._parseNumber(),
                                this._parseNumber(),
                                this._parseNumber(),
                                this._parseNumber(),
                                this._parseNumber(),
                                this._parseNumber(),
                              ])
                            : "A" === a
                            ? (n = [
                                this._parseNumber(),
                                this._parseNumber(),
                                this._parseNumber(),
                                this._parseArcFlag(),
                                this._parseArcFlag(),
                                this._parseNumber(),
                                this._parseNumber(),
                              ])
                            : "Z" === a && (this._skipOptionalSpaces(), (n = [])),
                          null === n || 0 <= n.indexOf(null)
                            ? null
                            : { type: t, values: n }
                        );
                      },
                      hasMoreData: function () {
                        return this._currentIndex < this._endIndex;
                      },
                      peekSegmentType: function () {
                        var e = this._string[this._currentIndex];
                        return o[e] ? o[e] : null;
                      },
                      initialCommandIsMoveTo: function () {
                        if (!this.hasMoreData()) return !0;
                        var e = this.peekSegmentType();
                        return "M" === e || "m" === e;
                      },
                      _isCurrentSpace: function () {
                        var e = this._string[this._currentIndex];
                        return (
                          e <= " " &&
                          (" " === e ||
                            "\n" === e ||
                            "\t" === e ||
                            "\r" === e ||
                            "\f" === e)
                        );
                      },
                      _skipOptionalSpaces: function () {
                        for (
                          ;
                          this._currentIndex < this._endIndex &&
                          this._isCurrentSpace();
  
                        )
                          this._currentIndex += 1;
                        return this._currentIndex < this._endIndex;
                      },
                      _skipOptionalSpacesOrDelimiter: function () {
                        return (
                          !(
                            this._currentIndex < this._endIndex &&
                            !this._isCurrentSpace() &&
                            "," !== this._string[this._currentIndex]
                          ) &&
                          (this._skipOptionalSpaces() &&
                            this._currentIndex < this._endIndex &&
                            "," === this._string[this._currentIndex] &&
                            ((this._currentIndex += 1),
                            this._skipOptionalSpaces()),
                          this._currentIndex < this._endIndex)
                        );
                      },
                      _parseNumber: function () {
                        var e = 0,
                          t = 0,
                          n = 1,
                          a = 0,
                          i = 1,
                          o = 1,
                          l = this._currentIndex;
                        if (
                          (this._skipOptionalSpaces(),
                          this._currentIndex < this._endIndex &&
                          "+" === this._string[this._currentIndex]
                            ? (this._currentIndex += 1)
                            : this._currentIndex < this._endIndex &&
                              "-" === this._string[this._currentIndex] &&
                              ((this._currentIndex += 1), (i = -1)),
                          this._currentIndex === this._endIndex ||
                            ((this._string[this._currentIndex] < "0" ||
                              "9" < this._string[this._currentIndex]) &&
                              "." !== this._string[this._currentIndex]))
                        )
                          return null;
                        for (
                          var r = this._currentIndex;
                          this._currentIndex < this._endIndex &&
                          "0" <= this._string[this._currentIndex] &&
                          this._string[this._currentIndex] <= "9";
  
                        )
                          this._currentIndex += 1;
                        if (this._currentIndex !== r)
                          for (var s = this._currentIndex - 1, u = 1; r <= s; )
                            (t += u * (this._string[s] - "0")), --s, (u *= 10);
                        if (
                          this._currentIndex < this._endIndex &&
                          "." === this._string[this._currentIndex]
                        ) {
                          if (
                            ((this._currentIndex += 1),
                            this._currentIndex >= this._endIndex ||
                              this._string[this._currentIndex] < "0" ||
                              "9" < this._string[this._currentIndex])
                          )
                            return null;
                          for (
                            ;
                            this._currentIndex < this._endIndex &&
                            "0" <= this._string[this._currentIndex] &&
                            this._string[this._currentIndex] <= "9";
  
                          )
                            (n *= 10),
                              (a +=
                                (this._string.charAt(this._currentIndex) - "0") /
                                n),
                              (this._currentIndex += 1);
                        }
                        if (
                          this._currentIndex !== l &&
                          this._currentIndex + 1 < this._endIndex &&
                          ("e" === this._string[this._currentIndex] ||
                            "E" === this._string[this._currentIndex]) &&
                          "x" !== this._string[this._currentIndex + 1] &&
                          "m" !== this._string[this._currentIndex + 1]
                        ) {
                          if (
                            ((this._currentIndex += 1),
                            "+" === this._string[this._currentIndex]
                              ? (this._currentIndex += 1)
                              : "-" === this._string[this._currentIndex] &&
                                ((this._currentIndex += 1), (o = -1)),
                            this._currentIndex >= this._endIndex ||
                              this._string[this._currentIndex] < "0" ||
                              "9" < this._string[this._currentIndex])
                          )
                            return null;
                          for (
                            ;
                            this._currentIndex < this._endIndex &&
                            "0" <= this._string[this._currentIndex] &&
                            this._string[this._currentIndex] <= "9";
  
                          )
                            (e *= 10),
                              (e += this._string[this._currentIndex] - "0"),
                              (this._currentIndex += 1);
                        }
                        var h = t + a;
                        return (
                          (h *= i),
                          e && (h *= Math.pow(10, o * e)),
                          l === this._currentIndex
                            ? null
                            : (this._skipOptionalSpacesOrDelimiter(), h)
                        );
                      },
                      _parseArcFlag: function () {
                        if (this._currentIndex >= this._endIndex) return null;
                        var e = null,
                          t = this._string[this._currentIndex];
                        if (((this._currentIndex += 1), "0" === t)) e = 0;
                        else {
                          if ("1" !== t) return null;
                          e = 1;
                        }
                        return this._skipOptionalSpacesOrDelimiter(), e;
                      },
                    };
                    function a(e) {
                      if (!e || 0 === e.length) return [];
                      var t = new i(e),
                        n = [];
                      if (t.initialCommandIsMoveTo())
                        for (; t.hasMoreData(); ) {
                          var a = t.parseSegment();
                          if (null === a) break;
                          n.push(a);
                        }
                      return n;
                    }
                    function r(e) {
                      return e.map(function (e) {
                        return {
                          type: e.type,
                          values: Array.prototype.slice.call(e.values),
                        };
                      });
                    }
                    function d(e) {
                      var m = [],
                        S = null,
                        g = null,
                        _ = null,
                        v = null,
                        E = null,
                        x = null,
                        b = null;
                      return (
                        e.forEach(function (e) {
                          var t, n, a, i, o, l, r, s, u, h, p, c, d, f, y;
                          "M" === e.type
                            ? ((f = e.values[0]),
                              (y = e.values[1]),
                              m.push({ type: "M", values: [f, y] }),
                              (v = x = f),
                              (E = b = y))
                            : "C" === e.type
                            ? ((a = e.values[0]),
                              (i = e.values[1]),
                              (t = e.values[2]),
                              (n = e.values[3]),
                              (f = e.values[4]),
                              (y = e.values[5]),
                              m.push({ type: "C", values: [a, i, t, n, f, y] }),
                              (g = t),
                              (_ = n),
                              (v = f),
                              (E = y))
                            : "L" === e.type
                            ? ((f = e.values[0]),
                              (y = e.values[1]),
                              m.push({ type: "L", values: [f, y] }),
                              (v = f),
                              (E = y))
                            : "H" === e.type
                            ? ((f = e.values[0]),
                              m.push({ type: "L", values: [f, E] }),
                              (v = f))
                            : "V" === e.type
                            ? ((y = e.values[0]),
                              m.push({ type: "L", values: [v, y] }),
                              (E = y))
                            : "S" === e.type
                            ? ((t = e.values[0]),
                              (n = e.values[1]),
                              (f = e.values[2]),
                              (y = e.values[3]),
                              (l =
                                "C" === S || "S" === S
                                  ? ((o = v + (v - g)), E + (E - _))
                                  : ((o = v), E)),
                              m.push({ type: "C", values: [o, l, t, n, f, y] }),
                              (g = t),
                              (_ = n),
                              (v = f),
                              (E = y))
                            : "T" === e.type
                            ? ((f = e.values[0]),
                              (y = e.values[1]),
                              (i =
                                "Q" === S || "T" === S
                                  ? ((a = v + (v - g)), E + (E - _))
                                  : ((a = v), E)),
                              (o = v + (2 * (a - v)) / 3),
                              (l = E + (2 * (i - E)) / 3),
                              (r = f + (2 * (a - f)) / 3),
                              (s = y + (2 * (i - y)) / 3),
                              m.push({ type: "C", values: [o, l, r, s, f, y] }),
                              (g = a),
                              (_ = i),
                              (v = f),
                              (E = y))
                            : "Q" === e.type
                            ? ((a = e.values[0]),
                              (i = e.values[1]),
                              (f = e.values[2]),
                              (y = e.values[3]),
                              (o = v + (2 * (a - v)) / 3),
                              (l = E + (2 * (i - E)) / 3),
                              (r = f + (2 * (a - f)) / 3),
                              (s = y + (2 * (i - y)) / 3),
                              m.push({ type: "C", values: [o, l, r, s, f, y] }),
                              (g = a),
                              (_ = i),
                              (v = f),
                              (E = y))
                            : "A" === e.type
                            ? ((u = e.values[0]),
                              (h = e.values[1]),
                              (p = e.values[2]),
                              (c = e.values[3]),
                              (d = e.values[4]),
                              (f = e.values[5]),
                              (y = e.values[6]),
                              0 === u || 0 === h
                                ? (m.push({
                                    type: "C",
                                    values: [v, E, f, y, f, y],
                                  }),
                                  (v = f),
                                  (E = y))
                                : (v === f && E === y) ||
                                  U(v, E, f, y, u, h, p, c, d).forEach(function (
                                    e
                                  ) {
                                    m.push({ type: "C", values: e }),
                                      (v = f),
                                      (E = y);
                                  }))
                            : "Z" === e.type && (m.push(e), (v = x), (E = b)),
                            (S = e.type);
                        }),
                        m
                      );
                    }
                    var n = e.SVGPathElement.prototype.setAttribute,
                      s = e.SVGPathElement.prototype.removeAttribute,
                      f = e.Symbol ? e.Symbol() : "__cachedPathData",
                      y = e.Symbol ? e.Symbol() : "__cachedNormalizedPathData",
                      U = function (e, t, n, a, i, o, l, r, s, u) {
                        function h(e, t, n) {
                          return {
                            x: e * Math.cos(n) - t * Math.sin(n),
                            y: e * Math.sin(n) + t * Math.cos(n),
                          };
                        }
                        var p,
                          c,
                          d,
                          f,
                          y,
                          m,
                          S,
                          g,
                          _,
                          v,
                          E,
                          x,
                          b,
                          k,
                          w,
                          O = ((p = l), (Math.PI * p) / 180),
                          M = [];
                        u
                          ? ((k = u[0]), (w = u[1]), (x = u[2]), (b = u[3]))
                          : ((e = (c = h(e, t, -O)).x),
                            (t = c.y),
                            1 <
                              (m =
                                ((f = (e - (n = (d = h(n, a, -O)).x)) / 2) * f) /
                                  (i * i) +
                                ((y = (t - (a = d.y)) / 2) * y) / (o * o)) &&
                              ((i *= m = Math.sqrt(m)), (o *= m)),
                            (_ =
                              (S = i * i) * (g = o * o) - S * y * y - g * f * f),
                            (v = S * y * y + g * f * f),
                            (x =
                              ((E =
                                (r === s ? -1 : 1) * Math.sqrt(Math.abs(_ / v))) *
                                i *
                                y) /
                                o +
                              (e + n) / 2),
                            (b = (E * -o * f) / i + (t + a) / 2),
                            (k = Math.asin(parseFloat(((t - b) / o).toFixed(9)))),
                            (w = Math.asin(parseFloat(((a - b) / o).toFixed(9)))),
                            e < x && (k = Math.PI - k),
                            n < x && (w = Math.PI - w),
                            k < 0 && (k = 2 * Math.PI + k),
                            w < 0 && (w = 2 * Math.PI + w),
                            s && w < k && (k -= 2 * Math.PI),
                            !s && k < w && (w -= 2 * Math.PI));
                        var I,
                          C,
                          L,
                          A = w - k;
                        Math.abs(A) > (120 * Math.PI) / 180 &&
                          ((I = w),
                          (C = n),
                          (L = a),
                          (w =
                            s && k < w
                              ? k + ((120 * Math.PI) / 180) * 1
                              : k + ((120 * Math.PI) / 180) * -1),
                          (n = x + i * Math.cos(w)),
                          (a = b + o * Math.sin(w)),
                          (M = U(n, a, C, L, i, o, l, 0, s, [w, I, x, b]))),
                          (A = w - k);
                        var V = Math.cos(k),
                          P = Math.sin(k),
                          N = Math.cos(w),
                          T = Math.sin(w),
                          W = Math.tan(A / 4),
                          B = (4 / 3) * i * W,
                          R = (4 / 3) * o * W,
                          F = [e, t],
                          G = [e + B * P, t - R * V],
                          D = [n + B * T, a - R * N],
                          z = [n, a];
                        if (
                          ((G[0] = 2 * F[0] - G[0]), (G[1] = 2 * F[1] - G[1]), u)
                        )
                          return [G, D, z].concat(M);
                        M = [G, D, z].concat(M).join().split(",");
                        var j = [],
                          H = [];
                        return (
                          M.forEach(function (e, t) {
                            t % 2
                              ? H.push(h(M[t - 1], M[t], O).y)
                              : H.push(h(M[t], M[t + 1], O).x),
                              6 === H.length && (j.push(H), (H = []));
                          }),
                          j
                        );
                      };
                    (e.SVGPathElement.prototype.setAttribute = function (e, t) {
                      "d" === e && ((this[f] = null), (this[y] = null)),
                        n.call(this, e, t);
                    }),
                      (e.SVGPathElement.prototype.removeAttribute = function (
                        e,
                        t
                      ) {
                        "d" === e && ((this[f] = null), (this[y] = null)),
                          s.call(this, e);
                      }),
                      (e.SVGPathElement.prototype.getPathData = function (e) {
                        if (e && e.normalize) {
                          if (this[y]) return r(this[y]);
                          this[f]
                            ? (n = r(this[f]))
                            : ((n = a(this.getAttribute("d") || "")),
                              (this[f] = r(n)));
                          var t = d(
                            ((s = []),
                            (c = p = h = u = null),
                            n.forEach(function (e) {
                              var t,
                                n,
                                a,
                                i,
                                o,
                                l,
                                r = e.type;
                              "M" === r
                                ? ((o = e.values[0]),
                                  (l = e.values[1]),
                                  s.push({ type: "M", values: [o, l] }),
                                  (u = p = o),
                                  (h = c = l))
                                : "m" === r
                                ? ((o = u + e.values[0]),
                                  (l = h + e.values[1]),
                                  s.push({ type: "M", values: [o, l] }),
                                  (u = p = o),
                                  (h = c = l))
                                : "L" === r
                                ? ((o = e.values[0]),
                                  (l = e.values[1]),
                                  s.push({ type: "L", values: [o, l] }),
                                  (u = o),
                                  (h = l))
                                : "l" === r
                                ? ((o = u + e.values[0]),
                                  (l = h + e.values[1]),
                                  s.push({ type: "L", values: [o, l] }),
                                  (u = o),
                                  (h = l))
                                : "C" === r
                                ? ((t = e.values[0]),
                                  (n = e.values[1]),
                                  (a = e.values[2]),
                                  (i = e.values[3]),
                                  (o = e.values[4]),
                                  (l = e.values[5]),
                                  s.push({
                                    type: "C",
                                    values: [t, n, a, i, o, l],
                                  }),
                                  (u = o),
                                  (h = l))
                                : "c" === r
                                ? ((t = u + e.values[0]),
                                  (n = h + e.values[1]),
                                  (a = u + e.values[2]),
                                  (i = h + e.values[3]),
                                  (o = u + e.values[4]),
                                  (l = h + e.values[5]),
                                  s.push({
                                    type: "C",
                                    values: [t, n, a, i, o, l],
                                  }),
                                  (u = o),
                                  (h = l))
                                : "Q" === r
                                ? ((t = e.values[0]),
                                  (n = e.values[1]),
                                  (o = e.values[2]),
                                  (l = e.values[3]),
                                  s.push({ type: "Q", values: [t, n, o, l] }),
                                  (u = o),
                                  (h = l))
                                : "q" === r
                                ? ((t = u + e.values[0]),
                                  (n = h + e.values[1]),
                                  (o = u + e.values[2]),
                                  (l = h + e.values[3]),
                                  s.push({ type: "Q", values: [t, n, o, l] }),
                                  (u = o),
                                  (h = l))
                                : "A" === r
                                ? ((o = e.values[5]),
                                  (l = e.values[6]),
                                  s.push({
                                    type: "A",
                                    values: [
                                      e.values[0],
                                      e.values[1],
                                      e.values[2],
                                      e.values[3],
                                      e.values[4],
                                      o,
                                      l,
                                    ],
                                  }),
                                  (u = o),
                                  (h = l))
                                : "a" === r
                                ? ((o = u + e.values[5]),
                                  (l = h + e.values[6]),
                                  s.push({
                                    type: "A",
                                    values: [
                                      e.values[0],
                                      e.values[1],
                                      e.values[2],
                                      e.values[3],
                                      e.values[4],
                                      o,
                                      l,
                                    ],
                                  }),
                                  (u = o),
                                  (h = l))
                                : "H" === r
                                ? ((o = e.values[0]),
                                  s.push({ type: "H", values: [o] }),
                                  (u = o))
                                : "h" === r
                                ? ((o = u + e.values[0]),
                                  s.push({ type: "H", values: [o] }),
                                  (u = o))
                                : "V" === r
                                ? ((l = e.values[0]),
                                  s.push({ type: "V", values: [l] }),
                                  (h = l))
                                : "v" === r
                                ? ((l = h + e.values[0]),
                                  s.push({ type: "V", values: [l] }),
                                  (h = l))
                                : "S" === r
                                ? ((a = e.values[0]),
                                  (i = e.values[1]),
                                  (o = e.values[2]),
                                  (l = e.values[3]),
                                  s.push({ type: "S", values: [a, i, o, l] }),
                                  (u = o),
                                  (h = l))
                                : "s" === r
                                ? ((a = u + e.values[0]),
                                  (i = h + e.values[1]),
                                  (o = u + e.values[2]),
                                  (l = h + e.values[3]),
                                  s.push({ type: "S", values: [a, i, o, l] }),
                                  (u = o),
                                  (h = l))
                                : "T" === r
                                ? ((o = e.values[0]),
                                  (l = e.values[1]),
                                  s.push({ type: "T", values: [o, l] }),
                                  (u = o),
                                  (h = l))
                                : "t" === r
                                ? ((o = u + e.values[0]),
                                  (l = h + e.values[1]),
                                  s.push({ type: "T", values: [o, l] }),
                                  (u = o),
                                  (h = l))
                                : ("Z" !== r && "z" !== r) ||
                                  (s.push({ type: "Z", values: [] }),
                                  (u = p),
                                  (h = c));
                            }),
                            s)
                          );
                          return (this[y] = r(t)), t;
                        }
                        if (this[f]) return r(this[f]);
                        var s,
                          u,
                          h,
                          p,
                          c,
                          n = a(this.getAttribute("d") || "");
                        return (this[f] = r(n)), n;
                      }),
                      (e.SVGPathElement.prototype.setPathData = function (e) {
                        if (0 === e.length)
                          l
                            ? this.setAttribute("d", "")
                            : this.removeAttribute("d");
                        else {
                          for (var t = "", n = 0, a = e.length; n < a; n += 1) {
                            var i = e[n];
                            0 < n && (t += " "),
                              (t += i.type),
                              i.values &&
                                0 < i.values.length &&
                                (t += " " + i.values.join(" "));
                          }
                          this.setAttribute("d", t);
                        }
                      }),
                      (e.SVGRectElement.prototype.getPathData = function (e) {
                        var t = this.x.baseVal.value,
                          n = this.y.baseVal.value,
                          a = this.width.baseVal.value,
                          i = this.height.baseVal.value,
                          o = this.hasAttribute("rx")
                            ? this.rx.baseVal.value
                            : this.ry.baseVal.value,
                          l = this.hasAttribute("ry")
                            ? this.ry.baseVal.value
                            : this.rx.baseVal.value;
                        a / 2 < o && (o = a / 2), i / 2 < l && (l = i / 2);
                        var r = (r = [
                          { type: "M", values: [t + o, n] },
                          { type: "H", values: [t + a - o] },
                          { type: "A", values: [o, l, 0, 0, 1, t + a, n + l] },
                          { type: "V", values: [n + i - l] },
                          {
                            type: "A",
                            values: [o, l, 0, 0, 1, t + a - o, n + i],
                          },
                          { type: "H", values: [t + o] },
                          { type: "A", values: [o, l, 0, 0, 1, t, n + i - l] },
                          { type: "V", values: [n + l] },
                          { type: "A", values: [o, l, 0, 0, 1, t + o, n] },
                          { type: "Z", values: [] },
                        ]).filter(function (e) {
                          return (
                            "A" !== e.type ||
                            (0 !== e.values[0] && 0 !== e.values[1])
                          );
                        });
                        return e && !0 === e.normalize && (r = d(r)), r;
                      }),
                      (e.SVGCircleElement.prototype.getPathData = function (e) {
                        var t = this.cx.baseVal.value,
                          n = this.cy.baseVal.value,
                          a = this.r.baseVal.value,
                          i = [
                            { type: "M", values: [t + a, n] },
                            { type: "A", values: [a, a, 0, 0, 1, t, n + a] },
                            { type: "A", values: [a, a, 0, 0, 1, t - a, n] },
                            { type: "A", values: [a, a, 0, 0, 1, t, n - a] },
                            { type: "A", values: [a, a, 0, 0, 1, t + a, n] },
                            { type: "Z", values: [] },
                          ];
                        return e && !0 === e.normalize && (i = d(i)), i;
                      }),
                      (e.SVGEllipseElement.prototype.getPathData = function (e) {
                        var t = this.cx.baseVal.value,
                          n = this.cy.baseVal.value,
                          a = this.rx.baseVal.value,
                          i = this.ry.baseVal.value,
                          o = [
                            { type: "M", values: [t + a, n] },
                            { type: "A", values: [a, i, 0, 0, 1, t, n + i] },
                            { type: "A", values: [a, i, 0, 0, 1, t - a, n] },
                            { type: "A", values: [a, i, 0, 0, 1, t, n - i] },
                            { type: "A", values: [a, i, 0, 0, 1, t + a, n] },
                            { type: "Z", values: [] },
                          ];
                        return e && !0 === e.normalize && (o = d(o)), o;
                      }),
                      (e.SVGLineElement.prototype.getPathData = function () {
                        return [
                          {
                            type: "M",
                            values: [
                              this.x1.baseVal.value,
                              this.y1.baseVal.value,
                            ],
                          },
                          {
                            type: "L",
                            values: [
                              this.x2.baseVal.value,
                              this.y2.baseVal.value,
                            ],
                          },
                        ];
                      }),
                      (e.SVGPolylineElement.prototype.getPathData = function () {
                        for (
                          var e = [], t = 0;
                          t < this.points.numberOfItems;
                          t += 1
                        ) {
                          var n = this.points.getItem(t);
                          e.push({
                            type: 0 === t ? "M" : "L",
                            values: [n.x, n.y],
                          });
                        }
                        return e;
                      }),
                      (e.SVGPolygonElement.prototype.getPathData = function () {
                        for (
                          var e = [], t = 0;
                          t < this.points.numberOfItems;
                          t += 1
                        ) {
                          var n = this.points.getItem(t);
                          e.push({
                            type: 0 === t ? "M" : "L",
                            values: [n.x, n.y],
                          });
                        }
                        return e.push({ type: "Z", values: [] }), e;
                      });
                  })();
              },
              v =
                ((a = {}),
                (xe.m = n =
                  [
                    function (e, t, n) {
                      n.r(t);
                      var a = 500,
                        i = [],
                        o =
                          window.requestAnimationFrame ||
                          window.mozRequestAnimationFrame ||
                          window.webkitRequestAnimationFrame ||
                          window.msRequestAnimationFrame ||
                          function (e) {
                            return setTimeout(e, 1e3 / 60);
                          },
                        l =
                          window.cancelAnimationFrame ||
                          window.mozCancelAnimationFrame ||
                          window.webkitCancelAnimationFrame ||
                          window.msCancelAnimationFrame ||
                          function (e) {
                            return clearTimeout(e);
                          },
                        r = Date.now(),
                        s = void 0;
                      function u() {
                        var n = void 0,
                          e = void 0;
                        s && (l.call(window, s), (s = null)),
                          i.forEach(function (e) {
                            var t;
                            (t = e.event) &&
                              ((e.event = null), e.listener(t), (n = !0));
                          }),
                          n
                            ? ((r = Date.now()), (e = !0))
                            : Date.now() - r < a && (e = !0),
                          e && (s = o.call(window, u));
                      }
                      function h(n) {
                        var a = -1;
                        return (
                          i.some(function (e, t) {
                            return e.listener === n && ((a = t), !0);
                          }),
                          a
                        );
                      }
                      var p = {
                        add: function (e) {
                          var t = void 0;
                          return -1 === h(e)
                            ? (i.push((t = { listener: e })),
                              function (e) {
                                (t.event = e), s || u();
                              })
                            : null;
                        },
                        remove: function (e) {
                          var t;
                          -1 < (t = h(e)) &&
                            (i.splice(t, 1),
                            !i.length && s && (l.call(window, s), (s = null)));
                        },
                      };
                      t.default = p;
                    },
                  ]),
                (xe.c = a),
                (xe.d = function (e, t, n) {
                  xe.o(e, t) ||
                    Object.defineProperty(e, t, { enumerable: !0, get: n });
                }),
                (xe.r = function (e) {
                  "undefined" != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(e, Symbol.toStringTag, {
                      value: "Module",
                    }),
                    Object.defineProperty(e, "__esModule", { value: !0 });
                }),
                (xe.t = function (t, e) {
                  if ((1 & e && (t = xe(t)), 8 & e)) return t;
                  if (4 & e && "object" == typeof t && t && t.__esModule)
                    return t;
                  var n = Object.create(null);
                  if (
                    (xe.r(n),
                    Object.defineProperty(n, "default", {
                      enumerable: !0,
                      value: t,
                    }),
                    2 & e && "string" != typeof t)
                  )
                    for (var a in t)
                      xe.d(
                        n,
                        a,
                        function (e) {
                          return t[e];
                        }.bind(null, a)
                      );
                  return n;
                }),
                (xe.n = function (e) {
                  var t =
                    e && e.__esModule
                      ? function () {
                          return e.default;
                        }
                      : function () {
                          return e;
                        };
                  return xe.d(t, "a", t), t;
                }),
                (xe.o = function (e, t) {
                  return Object.prototype.hasOwnProperty.call(e, t);
                }),
                (xe.p = ""),
                xe((xe.s = 0)).default),
              me = {
                line_altColor: { iniValue: !1 },
                line_color: {},
                line_colorTra: { iniValue: !1 },
                line_strokeWidth: {},
                plug_enabled: { iniValue: !1 },
                plug_enabledSE: { hasSE: !0, iniValue: !1 },
                plug_plugSE: { hasSE: !0, iniValue: ne },
                plug_colorSE: { hasSE: !0 },
                plug_colorTraSE: { hasSE: !0, iniValue: !1 },
                plug_markerWidthSE: { hasSE: !0 },
                plug_markerHeightSE: { hasSE: !0 },
                lineOutline_enabled: { iniValue: !1 },
                lineOutline_color: {},
                lineOutline_colorTra: { iniValue: !1 },
                lineOutline_strokeWidth: {},
                lineOutline_inStrokeWidth: {},
                plugOutline_enabledSE: { hasSE: !0, iniValue: !1 },
                plugOutline_plugSE: { hasSE: !0, iniValue: ne },
                plugOutline_colorSE: { hasSE: !0 },
                plugOutline_colorTraSE: { hasSE: !0, iniValue: !1 },
                plugOutline_strokeWidthSE: { hasSE: !0 },
                plugOutline_inStrokeWidthSE: { hasSE: !0 },
                position_socketXYSE: { hasSE: !0, hasProps: !0 },
                position_plugOverheadSE: { hasSE: !0 },
                position_path: {},
                position_lineStrokeWidth: {},
                position_socketGravitySE: { hasSE: !0 },
                path_pathData: {},
                path_edge: { hasProps: !0 },
                viewBox_bBox: { hasProps: !0 },
                viewBox_plugBCircleSE: { hasSE: !0 },
                lineMask_enabled: { iniValue: !1 },
                lineMask_outlineMode: { iniValue: !1 },
                lineMask_x: {},
                lineMask_y: {},
                lineOutlineMask_x: {},
                lineOutlineMask_y: {},
                maskBGRect_x: {},
                maskBGRect_y: {},
                capsMaskAnchor_enabledSE: { hasSE: !0, iniValue: !1 },
                capsMaskAnchor_pathDataSE: { hasSE: !0 },
                capsMaskAnchor_strokeWidthSE: { hasSE: !0 },
                capsMaskMarker_enabled: { iniValue: !1 },
                capsMaskMarker_enabledSE: { hasSE: !0, iniValue: !1 },
                capsMaskMarker_plugSE: { hasSE: !0, iniValue: ne },
                capsMaskMarker_markerWidthSE: { hasSE: !0 },
                capsMaskMarker_markerHeightSE: { hasSE: !0 },
                caps_enabled: { iniValue: !1 },
                attach_plugSideLenSE: { hasSE: !0 },
                attach_plugBackLenSE: { hasSE: !0 },
              },
              E = {
                show_on: {},
                show_effect: {},
                show_animOptions: {},
                show_animId: {},
                show_inAnim: {},
              },
              O = "fade",
              Se = [],
              ge = {},
              _e = 0,
              ve = {},
              Ee = 0;
            function xe(e) {
              if (a[e]) return a[e].exports;
              var t = (a[e] = { i: e, l: !1, exports: {} });
              return (
                n[e].call(t.exports, t, t.exports, xe), (t.l = !0), t.exports
              );
            }
            function be() {
              var i = Date.now(),
                o = !1;
              e && (r.call(window, e), (e = null)),
                k.forEach(function (e) {
                  var t, n, a;
                  if (e.framesStart) {
                    if (
                      (t = i - e.framesStart) >= e.duration &&
                      e.count &&
                      e.loopsLeft <= 1
                    )
                      return (
                        (a =
                          e.frames[
                            (e.lastFrame = e.reverse ? 0 : e.frames.length - 1)
                          ]),
                        e.frameCallback(a.value, !0, a.timeRatio, a.outputRatio),
                        void (e.framesStart = null)
                      );
                    if (t > e.duration) {
                      if (((n = Math.floor(t / e.duration)), e.count)) {
                        if (n >= e.loopsLeft)
                          return (
                            (a =
                              e.frames[
                                (e.lastFrame = e.reverse
                                  ? 0
                                  : e.frames.length - 1)
                              ]),
                            e.frameCallback(
                              a.value,
                              !0,
                              a.timeRatio,
                              a.outputRatio
                            ),
                            void (e.framesStart = null)
                          );
                        e.loopsLeft -= n;
                      }
                      (e.framesStart += e.duration * n), (t = i - e.framesStart);
                    }
                    e.reverse && (t = e.duration - t),
                      (a = e.frames[(e.lastFrame = Math.round(t / b))]),
                      !1 !==
                      e.frameCallback(a.value, !1, a.timeRatio, a.outputRatio)
                        ? (o = !0)
                        : (e.framesStart = null);
                  }
                }),
                o && (e = l.call(window, be));
            }
            function ke(e, t) {
              (e.framesStart = Date.now()),
                null != t &&
                  (e.framesStart -= e.duration * (e.reverse ? 1 - t : t)),
                (e.loopsLeft = e.count),
                (e.lastFrame = null),
                be();
            }
            function we(t, n) {
              var e, a;
              return (
                typeof t != typeof n ||
                (e = fe(t) ? "obj" : Array.isArray(t) ? "array" : "") !=
                  (fe(n) ? "obj" : Array.isArray(n) ? "array" : "") ||
                ("obj" === e
                  ? we((a = Object.keys(t).sort()), Object.keys(n).sort()) ||
                    a.some(function (e) {
                      return we(t[e], n[e]);
                    })
                  : "array" === e
                  ? t.length !== n.length ||
                    t.some(function (e, t) {
                      return we(e, n[t]);
                    })
                  : t !== n)
              );
            }
            function Oe(n) {
              return n
                ? fe(n)
                  ? Object.keys(n).reduce(function (e, t) {
                      return (e[t] = Oe(n[t])), e;
                    }, {})
                  : Array.isArray(n)
                  ? n.map(Oe)
                  : n
                : n;
            }
            function Me(e) {
              var t,
                n,
                a,
                i = 1,
                o = (e = (e + "").trim());
              function l(e) {
                var t = 1,
                  n = m.exec(e);
                return (
                  n &&
                    ((t = parseFloat(n[1])),
                    n[2]
                      ? (t = 0 <= t && t <= 100 ? t / 100 : 1)
                      : (t < 0 || 1 < t) && (t = 1)),
                  t
                );
              }
              return (
                (t = /^(rgba|hsla|hwb|gray|device\-cmyk)\s*\(([\s\S]+)\)$/i.exec(
                  e
                ))
                  ? ((n = t[1].toLowerCase()),
                    (a = t[2].trim().split(/\s*,\s*/)),
                    "rgba" === n && 4 === a.length
                      ? ((i = l(a[3])),
                        (o = "rgb(" + a.slice(0, 3).join(", ") + ")"))
                      : "hsla" === n && 4 === a.length
                      ? ((i = l(a[3])),
                        (o = "hsl(" + a.slice(0, 3).join(", ") + ")"))
                      : "hwb" === n && 4 === a.length
                      ? ((i = l(a[3])),
                        (o = "hwb(" + a.slice(0, 3).join(", ") + ")"))
                      : "gray" === n && 2 === a.length
                      ? ((i = l(a[1])), (o = "gray(" + a[0] + ")"))
                      : "device-cmyk" === n &&
                        5 <= a.length &&
                        ((i = l(a[4])),
                        (o = "device-cmyk(" + a.slice(0, 4).join(", ") + ")")))
                  : (t =
                      /^\#(?:([\da-f]{6})([\da-f]{2})|([\da-f]{3})([\da-f]))$/i.exec(
                        e
                      ))
                  ? (o = t[1]
                      ? ((i = parseInt(t[2], 16) / 255), "#" + t[1])
                      : ((i = parseInt(t[4] + t[4], 16) / 255), "#" + t[3]))
                  : "transparent" === e.toLocaleLowerCase() && (i = 0),
                [i, o]
              );
            }
            function Ie(e) {
              return !(
                !e ||
                e.nodeType !== Node.ELEMENT_NODE ||
                "function" != typeof e.getBoundingClientRect
              );
            }
            function Ce(e, t) {
              var n,
                a,
                i,
                o,
                l = {};
              if (!(i = e.ownerDocument))
                return (
                  console.error("Cannot get document that contains the element."),
                  null
                );
              if (
                e.compareDocumentPosition(i) & Node.DOCUMENT_POSITION_DISCONNECTED
              )
                return console.error("A disconnected element was passed."), null;
              for (a in (n = e.getBoundingClientRect())) l[a] = n[a];
              if (!t) {
                if (!(o = i.defaultView))
                  return (
                    console.error("Cannot get window that contains the element."),
                    null
                  );
                (l.left += o.pageXOffset),
                  (l.right += o.pageXOffset),
                  (l.top += o.pageYOffset),
                  (l.bottom += o.pageYOffset);
              }
              return l;
            }
            function Le(e, t) {
              var n,
                a,
                i = [],
                o = e;
              for (t = t || window; ; ) {
                if (!(n = o.ownerDocument))
                  return (
                    console.error(
                      "Cannot get document that contains the element."
                    ),
                    null
                  );
                if (!(a = n.defaultView))
                  return (
                    console.error("Cannot get window that contains the element."),
                    null
                  );
                if (a === t) break;
                if (!(o = a.frameElement))
                  return console.error("`baseWindow` was not found."), null;
                i.unshift(o);
              }
              return i;
            }
            function Ae(e, t) {
              var n,
                a,
                o = 0,
                l = 0;
              return (a = Le(e, (t = t || window)))
                ? a.length
                  ? (a.forEach(function (e, t) {
                      var n,
                        a,
                        i = Ce(e, 0 < t);
                      (o += i.left),
                        (l += i.top),
                        (a = (n = e).ownerDocument.defaultView.getComputedStyle(
                          n,
                          ""
                        )),
                        (i = {
                          left: n.clientLeft + parseFloat(a.paddingLeft),
                          top: n.clientTop + parseFloat(a.paddingTop),
                        }),
                        (o += i.left),
                        (l += i.top);
                    }),
                    ((n = Ce(e, !0)).left += o),
                    (n.right += o),
                    (n.top += l),
                    (n.bottom += l),
                    n)
                  : Ce(e)
                : null;
            }
            function Ve(e, t) {
              var n = e.x - t.x,
                a = e.y - t.y;
              return Math.sqrt(n * n + a * a);
            }
            function Pe(e, t, n) {
              var a = t.x - e.x,
                i = t.y - e.y;
              return {
                x: e.x + a * n,
                y: e.y + i * n,
                angle: Math.atan2(i, a) / (Math.PI / 180),
              };
            }
            function Ne(e, t, n) {
              var a = Math.atan2(e.y - t.y, t.x - e.x);
              return { x: t.x + Math.cos(a) * n, y: t.y + Math.sin(a) * n * -1 };
            }
            function Te(e, t, n, a, i) {
              var o = i * i,
                l = o * i,
                r = 1 - i,
                s = r * r,
                u = s * r,
                h = u * e.x + 3 * s * i * t.x + 3 * r * o * n.x + l * a.x,
                p = u * e.y + 3 * s * i * t.y + 3 * r * o * n.y + l * a.y,
                c = e.x + 2 * i * (t.x - e.x) + o * (n.x - 2 * t.x + e.x),
                d = e.y + 2 * i * (t.y - e.y) + o * (n.y - 2 * t.y + e.y),
                f = t.x + 2 * i * (n.x - t.x) + o * (a.x - 2 * n.x + t.x),
                y = t.y + 2 * i * (n.y - t.y) + o * (a.y - 2 * n.y + t.y),
                m = r * e.x + i * t.x,
                S = r * e.y + i * t.y,
                g = r * n.x + i * a.x,
                _ = r * n.y + i * a.y,
                v = 90 - (180 * Math.atan2(c - f, d - y)) / Math.PI;
              return {
                x: h,
                y: p,
                fromP2: { x: c, y: d },
                toP1: { x: f, y: y },
                fromP1: { x: m, y: S },
                toP2: { x: g, y: _ },
                angle: (v += 180 < v ? -180 : 180),
              };
            }
            function We(n, a, i, o, e) {
              function l(e, t, n, a, i) {
                return (
                  e *
                    (e * (-3 * t + 9 * n - 9 * a + 3 * i) +
                      6 * t -
                      12 * n +
                      6 * a) -
                  3 * t +
                  3 * n
                );
              }
              var r,
                s,
                u,
                h,
                p = [
                  0.2491, 0.2491, 0.2335, 0.2335, 0.2032, 0.2032, 0.1601, 0.1601,
                  0.1069, 0.1069, 0.0472, 0.0472,
                ],
                c = 0,
                d = (e = null == e || 1 < e ? 1 : e < 0 ? 0 : e) / 2;
              return (
                [
                  -0.1252, 0.1252, -0.3678, 0.3678, -0.5873, 0.5873, -0.7699,
                  0.7699, -0.9041, 0.9041, -0.9816, 0.9816,
                ].forEach(function (e, t) {
                  (s = l((r = d * e + d), n.x, a.x, i.x, o.x)),
                    (u = l(r, n.y, a.y, i.y, o.y)),
                    (h = s * s + u * u),
                    (c += p[t] * Math.sqrt(h));
                }),
                d * c
              );
            }
            function Be(e, t, n, a, i) {
              for (
                var o, l = 0.5, r = 1 - l;
                (o = We(e, t, n, a, r)), !(Math.abs(o - i) <= 0.01);
  
              )
                r += (o < i ? 1 : -1) * (l /= 2);
              return r;
            }
            function Re(e, n) {
              var a;
              return (
                e.forEach(function (e) {
                  var t = n
                    ? e.map(function (e) {
                        var t = { x: e.x, y: e.y };
                        return n(t), t;
                      })
                    : e;
                  (a = a || [{ type: "M", values: [t[0].x, t[0].y] }]).push(
                    t.length
                      ? 2 === t.length
                        ? { type: "L", values: [t[1].x, t[1].y] }
                        : {
                            type: "C",
                            values: [
                              t[1].x,
                              t[1].y,
                              t[2].x,
                              t[2].y,
                              t[3].x,
                              t[3].y,
                            ],
                          }
                      : { type: "Z", values: [] }
                  );
                }),
                a
              );
            }
            function Fe(e) {
              var n = [],
                a = 0;
              return (
                e.forEach(function (e) {
                  var t = (2 === e.length ? Ve : We).apply(null, e);
                  n.push(t), (a += t);
                }),
                { segsLen: n, lenAll: a }
              );
            }
            function Ge(e, a) {
              return (
                null == e ||
                null == a ||
                e.length !== a.length ||
                e.some(function (e, t) {
                  var n = a[t];
                  return (
                    e.type !== n.type ||
                    e.values.some(function (e, t) {
                      return e !== n.values[t];
                    })
                  );
                })
              );
            }
            function De(e, t, n) {
              e.events[t]
                ? e.events[t].indexOf(n) < 0 && e.events[t].push(n)
                : (e.events[t] = [n]);
            }
            function ze(e, t, n) {
              var a;
              e.events[t] &&
                -1 < (a = e.events[t].indexOf(n)) &&
                e.events[t].splice(a, 1);
            }
            function je(e) {
              t && clearTimeout(t),
                Se.push(e),
                (t = setTimeout(function () {
                  Se.forEach(function (e) {
                    e();
                  }),
                    (Se = []);
                }, 0));
            }
            function He(e, t) {
              e.reflowTargets.indexOf(t) < 0 && e.reflowTargets.push(t);
            }
            function Ue(e) {
              e.reflowTargets.forEach(function (e) {
                var n;
                (n = e),
                  setTimeout(function () {
                    var e = n.parentNode,
                      t = n.nextSibling;
                    e.insertBefore(e.removeChild(n), t);
                  }, 0);
              }),
                (e.reflowTargets = []);
            }
            function Ze(e, t, n, a, i, o, l) {
              var r, s, u;
              "auto-start-reverse" === n
                ? ("boolean" != typeof h &&
                    (t.setAttribute("orient", "auto-start-reverse"),
                    (h =
                      t.orientType.baseVal ===
                      SVGMarkerElement.SVG_MARKER_ORIENT_UNKNOWN)),
                  h
                    ? t.setAttribute("orient", n)
                    : ((r = i.createSVGTransform()).setRotate(180, 0, 0),
                      o.transform.baseVal.appendItem(r),
                      t.setAttribute("orient", "auto"),
                      (u = !0)))
                : (t.setAttribute("orient", n),
                  !1 === h && o.transform.baseVal.clear()),
                (s = t.viewBox.baseVal),
                u
                  ? ((s.x = -a.right), (s.y = -a.bottom))
                  : ((s.x = a.left), (s.y = a.top)),
                (s.width = a.width),
                (s.height = a.height),
                se && He(e, l);
            }
            function Ye(e, t) {
              return {
                prop: e ? "markerEnd" : "markerStart",
                orient: t
                  ? t.noRotate
                    ? "0"
                    : e
                    ? "auto"
                    : "auto-start-reverse"
                  : null,
              };
            }
            function Xe(n, a) {
              Object.keys(a).forEach(function (e) {
                var t = a[e];
                n[e] =
                  null != t.iniValue
                    ? t.hasSE
                      ? [t.iniValue, t.iniValue]
                      : t.iniValue
                    : t.hasSE
                    ? t.hasProps
                      ? [{}, {}]
                      : []
                    : t.hasProps
                    ? {}
                    : null;
              });
            }
            function qe(t, e, n, a, i) {
              return (
                a !== e[n] &&
                ((e[n] = a),
                i &&
                  i.forEach(function (e) {
                    e(t, a, n);
                  }),
                !0)
              );
            }
            function Qe(e) {
              function t(e, t) {
                return e + parseFloat(t);
              }
              var n = e.document,
                a = e.getComputedStyle(n.documentElement, ""),
                i = e.getComputedStyle(n.body, ""),
                o = { x: 0, y: 0 };
              return (
                "static" !== i.position
                  ? ((o.x -= [
                      a.marginLeft,
                      a.borderLeftWidth,
                      a.paddingLeft,
                      i.marginLeft,
                      i.borderLeftWidth,
                    ].reduce(t, 0)),
                    (o.y -= [
                      a.marginTop,
                      a.borderTopWidth,
                      a.paddingTop,
                      i.marginTop,
                      i.borderTopWidth,
                    ].reduce(t, 0)))
                  : "static" !== a.position &&
                    ((o.x -= [a.marginLeft, a.borderLeftWidth].reduce(t, 0)),
                    (o.y -= [a.marginTop, a.borderTopWidth].reduce(t, 0))),
                o
              );
            }
            function Ke(e) {
              var t,
                n = e.document;
              n.getElementById(d) ||
                ((t = new e.DOMParser().parseFromString(y, "image/svg+xml")),
                n.body.appendChild(t.documentElement),
                _(e));
            }
            function Je(u) {
              var _,
                f,
                v,
                e,
                n,
                a,
                i,
                y,
                s,
                h,
                p,
                t,
                o,
                l,
                r,
                c,
                d,
                m,
                S,
                g = u.options,
                E = u.curStats,
                x = u.aplStats,
                b = E.position_socketXYSE,
                k = !1;
              function w(e, t) {
                var n =
                  t === V
                    ? { x: e.left + e.width / 2, y: e.top }
                    : t === P
                    ? { x: e.right, y: e.top + e.height / 2 }
                    : t === N
                    ? { x: e.left  + e.width / 2, y: e.bottom }
                    : { x: e.left, y: e.top + e.height / 2 };
                return (n.socketId = t), n;
              }
              function O(e) {
                return { x: e.x, y: e.y };
              }
              if (
                ((E.position_path = g.path),
                (E.position_lineStrokeWidth = E.line_strokeWidth),
                (E.position_socketGravitySE = _ = Oe(g.socketGravitySE)),
                (f = [0, 1].map(function (e) {
                  var t,
                    n,
                    a,
                    i = g.anchorSE[e],
                    o = u.optionIsAttach.anchorSE[e],
                    l = !1 !== o ? ve[i._id] : null,
                    r =
                      !1 !== o && l.conf.getStrokeWidth
                        ? l.conf.getStrokeWidth(l, u)
                        : 0,
                    s =
                      !1 !== o && l.conf.getBBoxNest
                        ? l.conf.getBBoxNest(l, u, r)
                        : Ae(i, u.baseWindow);
                  return (
                    (E.capsMaskAnchor_pathDataSE[e] =
                      !1 !== o && l.conf.getPathData
                        ? l.conf.getPathData(l, u, r)
                        : ((n =
                            null != (t = s).right ? t.right : t.left + t.width),
                          (a = null != t.bottom ? t.bottom : t.top + t.height),
                          [
                            { type: "M", values: [t.left, t.top] },
                            { type: "L", values: [n, t.top] },
                            { type: "L", values: [n, a] },
                            { type: "L", values: [t.left, a] },
                            { type: "Z", values: [] },
                          ])),
                    (E.capsMaskAnchor_strokeWidthSE[e] = r),
                    s
                  );
                })),
                (i = -1),
                g.socketSE[0] && g.socketSE[1]
                  ? ((b[0] = w(f[0], g.socketSE[0])),
                    (b[1] = w(f[1], g.socketSE[1])))
                  : (g.socketSE[0] || g.socketSE[1]
                      ? ((a = g.socketSE[0] ? ((n = 0), 1) : ((n = 1), 0)),
                        (b[n] = w(f[n], g.socketSE[n])),
                        (e = H.map(function (e) {
                          return w(f[a], e);
                        })).forEach(function (e) {
                          var t = Ve(e, b[n]);
                          (t < i || -1 === i) && ((b[a] = e), (i = t));
                        }))
                      : ((e = H.map(function (e) {
                          return w(f[1], e);
                        })),
                        H.map(function (e) {
                          return w(f[0], e);
                        }).forEach(function (n) {
                          e.forEach(function (e) {
                            var t = Ve(n, e);
                            (t < i || -1 === i) &&
                              ((b[0] = n), (b[1] = e), (i = t));
                          });
                        })),
                    [0, 1].forEach(function (e) {
                      var t, n;
                      g.socketSE[e] ||
                        (f[e].width || f[e].height
                          ? f[e].width ||
                            (b[e].socketId !== T && b[e].socketId !== P)
                            ? f[e].height ||
                              (b[e].socketId !== V && b[e].socketId !== N) ||
                              (b[e].socketId =
                                0 <= b[e ? 0 : 1].y - f[e].top ? N : V)
                            : (b[e].socketId =
                                0 <= b[e ? 0 : 1].x - f[e].left ? P : T)
                          : ((t = b[e ? 0 : 1].x - f[e].left),
                            (n = b[e ? 0 : 1].y - f[e].top),
                            (b[e].socketId =
                              Math.abs(t) >= Math.abs(n)
                                ? 0 <= t
                                  ? P
                                  : T
                                : 0 <= n
                                ? N
                                : V)));
                    })),
                E.position_path !== x.position_path ||
                  E.position_lineStrokeWidth !== x.position_lineStrokeWidth ||
                  [0, 1].some(function (e) {
                    return (
                      E.position_plugOverheadSE[e] !==
                        x.position_plugOverheadSE[e] ||
                      ((i = b[e]),
                      (o = x.position_socketXYSE[e]),
                      i.x !== o.x || i.y !== o.y || i.socketId !== o.socketId) ||
                      ((t = _[e]),
                      (n = x.position_socketGravitySE[e]),
                      (a =
                        null == t
                          ? "auto"
                          : Array.isArray(t)
                          ? "array"
                          : "number") !=
                        (null == n
                          ? "auto"
                          : Array.isArray(n)
                          ? "array"
                          : "number") ||
                        ("array" == a ? t[0] !== n[0] || t[1] !== n[1] : t !== n))
                    );
                    var t, n, a, i, o;
                  }))
              ) {
                switch (
                  ((u.pathList.baseVal = v = []),
                  (u.pathList.animVal = null),
                  E.position_path)
                ) {
                  case B:
                    v.push([O(b[0]), O(b[1])]);
                    break;
                  case R:
                    (t =
                      ("number" == typeof _[0] && 0 < _[0]) ||
                      ("number" == typeof _[1] && 0 < _[1])),
                      (o = le * (t ? -1 : 1)),
                      (l = Math.atan2(b[1].y - b[0].y, b[1].x - b[0].x)),
                      (r = o - l),
                      (c = Math.PI - l - o),
                      (d = (Ve(b[0], b[1]) / Math.sqrt(2)) * ee),
                      (m = {
                        x: b[0].x + Math.cos(r) * d,
                        y: b[0].y + Math.sin(r) * d * -1,
                      }),
                      (S = {
                        x: b[1].x + Math.cos(c) * d,
                        y: b[1].y + Math.sin(c) * d * -1,
                      }),
                      v.push([O(b[0]), m, S, O(b[1])]);
                    break;
                  case F:
                  case G:
                    (s = [_[0], E.position_path === G ? 0 : _[1]]),
                      (h = []),
                      (p = []),
                      b.forEach(function (e, t) {
                        var n,
                          a,
                          i,
                          o,
                          l = s[t],
                          r = Array.isArray(l)
                            ? { x: l[0], y: l[1] }
                            : "number" == typeof l
                            ? e.socketId === V
                              ? { x: 0, y: -l }
                              : e.socketId === P
                              ? { x: l, y: 0 }
                              : e.socketId === N
                              ? { x: 0, y: l }
                              : { x: -l, y: 0 }
                            : ((n = b[t ? 0 : 1]),
                              (i =
                                0 < (a = E.position_plugOverheadSE[t])
                                  ? q + (Q < a ? (a - Q) * K : 0)
                                  : Z +
                                    (E.position_lineStrokeWidth > Y
                                      ? (E.position_lineStrokeWidth - Y) * X
                                      : 0)),
                              e.socketId === V
                                ? ((o = (e.y - n.y) / 2) < i && (o = i),
                                  { x: 0, y: -o })
                                : e.socketId === P
                                ? ((o = (n.x - e.x) / 2) < i && (o = i),
                                  { x: o, y: 0 })
                                : e.socketId === N
                                ? ((o = (n.y - e.y) / 2) < i && (o = i),
                                  { x: 0, y: o })
                                : ((o = (e.x - n.x) / 2) < i && (o = i),
                                  { x: -o, y: 0 }));
                        (h[t] = e.x + r.x), (p[t] = e.y + r.y);
                      }),
                      v.push([
                        O(b[0]),
                        { x: h[0], y: p[0] },
                        { x: h[1], y: p[1] },
                        O(b[1]),
                      ]);
                    break;
                  case D:
                    !(function () {
                      var a,
                        o = 1,
                        l = 2,
                        r = 3,
                        s = 4,
                        u = [[], []],
                        h = [];
                      function p(e) {
                        return e === o ? r : e === l ? s : e === r ? o : l;
                      }
                      function c(e) {
                        return e === l || e === s ? "x" : "y";
                      }
                      function d(e, t, n) {
                        var a = { x: e.x, y: e.y };
                        if (n) {
                          if (n === p(e.dirId))
                            throw new Error("Invalid dirId: " + n);
                          a.dirId = n;
                        } else a.dirId = e.dirId;
                        return (
                          a.dirId === o
                            ? (a.y -= t)
                            : a.dirId === l
                            ? (a.x += t)
                            : a.dirId === r
                            ? (a.y += t)
                            : (a.x -= t),
                          a
                        );
                      }
                      function f(e, t) {
                        return t.dirId === o
                          ? e.y <= t.y
                          : t.dirId === l
                          ? e.x >= t.x
                          : t.dirId === r
                          ? e.y >= t.y
                          : e.x <= t.x;
                      }
                      function y(e, t) {
                        return t.dirId === o || t.dirId === r
                          ? e.x === t.x
                          : e.y === t.y;
                      }
                      function m(e) {
                        return e[0]
                          ? { contain: 0, notContain: 1 }
                          : { contain: 1, notContain: 0 };
                      }
                      function S(e, t, n) {
                        return Math.abs(t[n] - e[n]);
                      }
                      function g(e, t, n) {
                        return "x" === n
                          ? e.x < t.x
                            ? l
                            : s
                          : e.y < t.y
                          ? r
                          : o;
                      }
                      for (
                        b.forEach(function (e, t) {
                          var n,
                            a = O(e),
                            i = _[t];
                          (n = Array.isArray(i)
                            ? i[0] < 0
                              ? [s, -i[0]]
                              : 0 < i[0]
                              ? [l, i[0]]
                              : i[1] < 0
                              ? [o, -i[1]]
                              : 0 < i[1]
                              ? [r, i[1]]
                              : [e.socketId, 0]
                            : "number" != typeof i
                            ? [e.socketId, $]
                            : 0 <= i
                            ? [e.socketId, i]
                            : [p(e.socketId), -i]),
                            (a.dirId = n[0]),
                            (i = n[1]),
                            u[t].push(a),
                            (h[t] = d(a, i));
                        });
                        (function () {
                          var e,
                            t,
                            a,
                            i,
                            n = [f(h[1], h[0]), f(h[0], h[1])],
                            o = [c(h[0].dirId), c(h[1].dirId)];
                          if (o[0] === o[1]) {
                            if (n[0] && n[1])
                              return void (
                                y(h[1], h[0]) ||
                                (h[0][o[0]] === h[1][o[1]]
                                  ? (u[0].push(h[0]), u[1].push(h[1]))
                                  : ((e =
                                      h[0][o[0]] + (h[1][o[1]] - h[0][o[0]]) / 2),
                                    u[0].push(d(h[0], Math.abs(e - h[0][o[0]]))),
                                    u[1].push(d(h[1], Math.abs(e - h[1][o[1]])))))
                              );
                            n[0] !== n[1]
                              ? ((t = m(n)),
                                (a = S(
                                  h[t.notContain],
                                  h[t.contain],
                                  o[t.notContain]
                                )) < $ &&
                                  (h[t.notContain] = d(h[t.notContain], $ - a)),
                                u[t.notContain].push(h[t.notContain]),
                                (h[t.notContain] = d(
                                  h[t.notContain],
                                  $,
                                  y(h[t.contain], h[t.notContain])
                                    ? "x" === o[t.notContain]
                                      ? r
                                      : l
                                    : g(
                                        h[t.notContain],
                                        h[t.contain],
                                        "x" === o[t.notContain] ? "y" : "x"
                                      )
                                )))
                              : ((a = S(h[0], h[1], "x" === o[0] ? "y" : "x")),
                                u.forEach(function (e, t) {
                                  var n = 0 === t ? 1 : 0;
                                  e.push(h[t]),
                                    (h[t] = d(
                                      h[t],
                                      $,
                                      2 * $ <= a
                                        ? g(h[t], h[n], "x" === o[t] ? "y" : "x")
                                        : "x" === o[t]
                                        ? r
                                        : l
                                    ));
                                }));
                          } else {
                            if (n[0] && n[1])
                              return void (y(h[1], h[0])
                                ? u[1].push(h[1])
                                : y(h[0], h[1])
                                ? u[0].push(h[0])
                                : u[0].push(
                                    "x" === o[0]
                                      ? { x: h[1].x, y: h[0].y }
                                      : { x: h[0].x, y: h[1].y }
                                  ));
                            n[0] !== n[1]
                              ? ((t = m(n)),
                                u[t.notContain].push(h[t.notContain]),
                                (h[t.notContain] = d(
                                  h[t.notContain],
                                  $,
                                  S(
                                    h[t.notContain],
                                    h[t.contain],
                                    o[t.contain]
                                  ) >= $
                                    ? g(
                                        h[t.notContain],
                                        h[t.contain],
                                        o[t.contain]
                                      )
                                    : h[t.contain].dirId
                                )))
                              : ((i = [
                                  { x: h[0].x, y: h[0].y },
                                  { x: h[1].x, y: h[1].y },
                                ]),
                                u.forEach(function (e, t) {
                                  var n = 0 === t ? 1 : 0,
                                    a = S(i[t], i[n], o[t]);
                                  a < $ && (h[t] = d(h[t], $ - a)),
                                    e.push(h[t]),
                                    (h[t] = d(h[t], $, g(h[t], h[n], o[n])));
                                }));
                          }
                          return 1;
                        })();
  
                      );
                      u[1].reverse(),
                        u[0].concat(u[1]).forEach(function (e, t) {
                          var n = { x: e.x, y: e.y };
                          0 < t && v.push([a, n]), (a = n);
                        });
                    })();
                }
                (y = []),
                  E.position_plugOverheadSE.forEach(function (e, t) {
                    var n,
                      a,
                      i,
                      o,
                      l,
                      r,
                      s,
                      u,
                      h,
                      p,
                      c,
                      d = !t;
                    0 < e
                      ? 2 === (n = v[(a = d ? 0 : v.length - 1)]).length
                        ? ((y[a] = y[a] || Ve.apply(null, n)),
                          y[a] > J &&
                            (y[a] - e < J && (e = y[a] - J),
                            (i = Pe(n[0], n[1], (d ? e : y[a] - e) / y[a])),
                            (v[a] = d ? [i, n[1]] : [n[0], i]),
                            (y[a] -= e)))
                        : ((y[a] = y[a] || We.apply(null, n)),
                          y[a] > J &&
                            (y[a] - e < J && (e = y[a] - J),
                            (i = Te(
                              n[0],
                              n[1],
                              n[2],
                              n[3],
                              Be(n[0], n[1], n[2], n[3], d ? e : y[a] - e)
                            )),
                            (l = d
                              ? ((o = n[0]), i.toP1)
                              : ((o = n[3]), i.fromP2)),
                            (r = Math.atan2(o.y - i.y, i.x - o.x)),
                            (s = Ve(i, l)),
                            (i.x = o.x + Math.cos(r) * e),
                            (i.y = o.y + Math.sin(r) * e * -1),
                            (l.x = i.x + Math.cos(r) * s),
                            (l.y = i.y + Math.sin(r) * s * -1),
                            (v[a] = d
                              ? [i, i.toP1, i.toP2, n[3]]
                              : [n[0], i.fromP1, i.fromP2, i]),
                            (y[a] = null)))
                      : e < 0 &&
                        ((n = v[(a = d ? 0 : v.length - 1)]),
                        (u = b[t].socketId),
                        (h = u === T || u === P ? "x" : "y"),
                        e < (c = -f[t]["x" == h ? "width" : "height"]) && (e = c),
                        (p = e * (u === T || u === V ? -1 : 1)),
                        2 === n.length
                          ? (n[d ? 0 : n.length - 1][h] += p)
                          : (d ? [0, 1] : [n.length - 2, n.length - 1]).forEach(
                              function (e) {
                                n[e][h] += p;
                              }
                            ),
                        (y[a] = null));
                  }),
                  (x.position_socketXYSE = Oe(b)),
                  (x.position_plugOverheadSE = Oe(E.position_plugOverheadSE)),
                  (x.position_path = E.position_path),
                  (x.position_lineStrokeWidth = E.position_lineStrokeWidth),
                  (x.position_socketGravitySE = Oe(_)),
                  (k = !0),
                  u.events.apl_position &&
                    u.events.apl_position.forEach(function (e) {
                      e(u, v);
                    });
              }
              return k;
            }
            function $e(t, n) {
              n !== t.isShown &&
                (!!n != !!t.isShown &&
                  (t.svg.style.visibility = n ? "" : "hidden"),
                (t.isShown = n),
                t.events &&
                  t.events.svgShow &&
                  t.events.svgShow.forEach(function (e) {
                    e(t, n);
                  }));
            }
            function et(e, t) {
              var n,
                a,
                i,
                o,
                l,
                h,
                p,
                c,
                d,
                f,
                r,
                s,
                u,
                y,
                m,
                S,
                g,
                _,
                v,
                E,
                x,
                b,
                k,
                w,
                O,
                M,
                I,
                C,
                L,
                A,
                V,
                P,
                N,
                T,
                W,
                B,
                R,
                F,
                G,
                D,
                z,
                j,
                H,
                U,
                Z,
                Y,
                X,
                q,
                Q,
                K,
                J,
                $,
                ee = {};
              t.line &&
                (ee.line =
                  ((a = (n = e).options),
                  (i = n.curStats),
                  (o = n.events),
                  (l = !1),
                  (l =
                    qe(n, i, "line_color", a.lineColor, o.cur_line_color) || l),
                  (l = qe(n, i, "line_colorTra", Me(i.line_color)[0] < 1) || l),
                  (l =
                    qe(
                      n,
                      i,
                      "line_strokeWidth",
                      a.lineSize,
                      o.cur_line_strokeWidth
                    ) || l))),
                (t.plug || ee.line) &&
                  (ee.plug =
                    ((p = (h = e).options),
                    (c = h.curStats),
                    (d = h.events),
                    (f = !1),
                    [0, 1].forEach(function (e) {
                      var t,
                        n,
                        a,
                        i,
                        o,
                        l,
                        r,
                        s,
                        u = p.plugSE[e];
                      (f = qe(h, c.plug_enabledSE, e, u !== ne) || f),
                        (f = qe(h, c.plug_plugSE, e, u) || f),
                        (f =
                          qe(
                            h,
                            c.plug_colorSE,
                            e,
                            (s = p.plugColorSE[e] || c.line_color),
                            d.cur_plug_colorSE
                          ) || f),
                        (f = qe(h, c.plug_colorTraSE, e, Me(s)[0] < 1) || f),
                        u !== ne &&
                          ((i = n = (t = ae[ie[u]]).widthR * p.plugSizeSE[e]),
                          (o = a = t.heightR * p.plugSizeSE[e]),
                          pe &&
                            ((i *= c.line_strokeWidth),
                            (o *= c.line_strokeWidth)),
                          (f = qe(h, c.plug_markerWidthSE, e, i) || f),
                          (f = qe(h, c.plug_markerHeightSE, e, o) || f),
                          (c.capsMaskMarker_markerWidthSE[e] = n),
                          (c.capsMaskMarker_markerHeightSE[e] = a)),
                        (c.plugOutline_plugSE[e] = c.capsMaskMarker_plugSE[e] =
                          u),
                        c.plug_enabledSE[e]
                          ? ((s =
                              (c.line_strokeWidth / de.lineSize) *
                              p.plugSizeSE[e]),
                            (c.position_plugOverheadSE[e] = t.overhead * s),
                            (c.viewBox_plugBCircleSE[e] = t.bCircle * s),
                            (l = t.sideLen * s),
                            (r = t.backLen * s))
                          : ((c.position_plugOverheadSE[e] =
                              -c.line_strokeWidth / 2),
                            (c.viewBox_plugBCircleSE[e] = l = r = 0)),
                        qe(
                          h,
                          c.attach_plugSideLenSE,
                          e,
                          l,
                          d.cur_attach_plugSideLenSE
                        ),
                        qe(
                          h,
                          c.attach_plugBackLenSE,
                          e,
                          r,
                          d.cur_attach_plugBackLenSE
                        ),
                        (c.capsMaskAnchor_enabledSE[e] = !c.plug_enabledSE[e]);
                    }),
                    (f =
                      qe(
                        h,
                        c,
                        "plug_enabled",
                        c.plug_enabledSE[0] || c.plug_enabledSE[1]
                      ) || f))),
                (t.lineOutline || ee.line) &&
                  (ee.lineOutline =
                    ((u = (r = e).options),
                    (y = r.curStats),
                    (m = !1),
                    (m =
                      qe(r, y, "lineOutline_enabled", u.lineOutlineEnabled) || m),
                    (m = qe(r, y, "lineOutline_color", u.lineOutlineColor) || m),
                    (m =
                      qe(
                        r,
                        y,
                        "lineOutline_colorTra",
                        Me(y.lineOutline_color)[0] < 1
                      ) || m),
                    (s = y.line_strokeWidth * u.lineOutlineSize),
                    (m =
                      qe(
                        r,
                        y,
                        "lineOutline_strokeWidth",
                        y.line_strokeWidth - 2 * s
                      ) || m),
                    (m =
                      qe(
                        r,
                        y,
                        "lineOutline_inStrokeWidth",
                        y.lineOutline_colorTra
                          ? y.lineOutline_strokeWidth + 2 * ce
                          : y.line_strokeWidth - s
                      ) || m))),
                (t.plugOutline || ee.line || ee.plug || ee.lineOutline) &&
                  (ee.plugOutline =
                    ((g = (S = e).options),
                    (_ = S.curStats),
                    (v = !1),
                    [0, 1].forEach(function (e) {
                      var t,
                        n = _.plugOutline_plugSE[e],
                        a = n !== ne ? ae[ie[n]] : null;
                      (v =
                        qe(
                          S,
                          _.plugOutline_enabledSE,
                          e,
                          g.plugOutlineEnabledSE[e] &&
                            _.plug_enabled &&
                            _.plug_enabledSE[e] &&
                            !!a &&
                            !!a.outlineBase
                        ) || v),
                        (v =
                          qe(
                            S,
                            _.plugOutline_colorSE,
                            e,
                            (t = g.plugOutlineColorSE[e] || _.lineOutline_color)
                          ) || v),
                        (v =
                          qe(S, _.plugOutline_colorTraSE, e, Me(t)[0] < 1) || v),
                        a &&
                          a.outlineBase &&
                          ((t = g.plugOutlineSizeSE[e]) > a.outlineMax &&
                            (t = a.outlineMax),
                          (t *= 2 * a.outlineBase),
                          (v = qe(S, _.plugOutline_strokeWidthSE, e, t) || v),
                          (v =
                            qe(
                              S,
                              _.plugOutline_inStrokeWidthSE,
                              e,
                              _.plugOutline_colorTraSE[e]
                                ? t -
                                    (ce /
                                      (_.line_strokeWidth / de.lineSize) /
                                      g.plugSizeSE[e]) *
                                      2
                                : t / 2
                            ) || v));
                    }),
                    v)),
                (t.faces ||
                  ee.line ||
                  ee.plug ||
                  ee.lineOutline ||
                  ee.plugOutline) &&
                  (ee.faces =
                    ((b = (E = e).curStats),
                    (k = E.aplStats),
                    (w = E.events),
                    (O = !1),
                    !b.line_altColor &&
                      qe(
                        E,
                        k,
                        "line_color",
                        (x = b.line_color),
                        w.apl_line_color
                      ) &&
                      ((E.lineFace.style.stroke = x), (O = !0)),
                    qe(
                      E,
                      k,
                      "line_strokeWidth",
                      (x = b.line_strokeWidth),
                      w.apl_line_strokeWidth
                    ) &&
                      ((E.lineShape.style.strokeWidth = x + "px"),
                      (O = !0),
                      (ue || se) &&
                        (He(E, E.lineShape),
                        se && (He(E, E.lineFace), He(E, E.lineMaskCaps)))),
                    qe(
                      E,
                      k,
                      "lineOutline_enabled",
                      (x = b.lineOutline_enabled),
                      w.apl_lineOutline_enabled
                    ) &&
                      ((E.lineOutlineFace.style.display = x ? "inline" : "none"),
                      (O = !0)),
                    b.lineOutline_enabled &&
                      (qe(
                        E,
                        k,
                        "lineOutline_color",
                        (x = b.lineOutline_color),
                        w.apl_lineOutline_color
                      ) && ((E.lineOutlineFace.style.stroke = x), (O = !0)),
                      qe(
                        E,
                        k,
                        "lineOutline_strokeWidth",
                        (x = b.lineOutline_strokeWidth),
                        w.apl_lineOutline_strokeWidth
                      ) &&
                        ((E.lineOutlineMaskShape.style.strokeWidth = x + "px"),
                        (O = !0),
                        se &&
                          (He(E, E.lineOutlineMaskCaps),
                          He(E, E.lineOutlineFace))),
                      qe(
                        E,
                        k,
                        "lineOutline_inStrokeWidth",
                        (x = b.lineOutline_inStrokeWidth),
                        w.apl_lineOutline_inStrokeWidth
                      ) &&
                        ((E.lineMaskShape.style.strokeWidth = x + "px"),
                        (O = !0),
                        se &&
                          (He(E, E.lineOutlineMaskCaps),
                          He(E, E.lineOutlineFace)))),
                    qe(
                      E,
                      k,
                      "plug_enabled",
                      (x = b.plug_enabled),
                      w.apl_plug_enabled
                    ) &&
                      ((E.plugsFace.style.display = x ? "inline" : "none"),
                      (O = !0)),
                    b.plug_enabled &&
                      [0, 1].forEach(function (n) {
                        var e = b.plug_plugSE[n],
                          t = e !== ne ? ae[ie[e]] : null,
                          a = Ye(n, t);
                        qe(
                          E,
                          k.plug_enabledSE,
                          n,
                          (x = b.plug_enabledSE[n]),
                          w.apl_plug_enabledSE
                        ) &&
                          ((E.plugsFace.style[a.prop] = x
                            ? "url(#" + E.plugMarkerIdSE[n] + ")"
                            : "none"),
                          (O = !0)),
                          b.plug_enabledSE[n] &&
                            (qe(E, k.plug_plugSE, n, e, w.apl_plug_plugSE) &&
                              ((E.plugFaceSE[n].href.baseVal = "#" + t.elmId),
                              Ze(
                                E,
                                E.plugMarkerSE[n],
                                a.orient,
                                t.bBox,
                                E.svg,
                                E.plugMarkerShapeSE[n],
                                E.plugsFace
                              ),
                              (O = !0),
                              ue && He(E, E.plugsFace)),
                            qe(
                              E,
                              k.plug_colorSE,
                              n,
                              (x = b.plug_colorSE[n]),
                              w.apl_plug_colorSE
                            ) &&
                              ((E.plugFaceSE[n].style.fill = x),
                              (O = !0),
                              (he || pe || se) &&
                                !b.line_colorTra &&
                                He(E, se ? E.lineMaskCaps : E.capsMaskLine)),
                            ["markerWidth", "markerHeight"].forEach(function (e) {
                              var t = "plug_" + e + "SE";
                              qe(E, k[t], n, (x = b[t][n]), w["apl_" + t]) &&
                                ((E.plugMarkerSE[n][e].baseVal.value = x),
                                (O = !0));
                            }),
                            qe(
                              E,
                              k.plugOutline_enabledSE,
                              n,
                              (x = b.plugOutline_enabledSE[n]),
                              w.apl_plugOutline_enabledSE
                            ) &&
                              (x
                                ? ((E.plugFaceSE[n].style.mask =
                                    "url(#" + E.plugMaskIdSE[n] + ")"),
                                  (E.plugOutlineFaceSE[n].style.display =
                                    "inline"))
                                : ((E.plugFaceSE[n].style.mask = "none"),
                                  (E.plugOutlineFaceSE[n].style.display =
                                    "none")),
                              (O = !0)),
                            b.plugOutline_enabledSE[n] &&
                              (qe(
                                E,
                                k.plugOutline_plugSE,
                                n,
                                e,
                                w.apl_plugOutline_plugSE
                              ) &&
                                ((E.plugOutlineFaceSE[n].href.baseVal =
                                  E.plugMaskShapeSE[n].href.baseVal =
                                  E.plugOutlineMaskShapeSE[n].href.baseVal =
                                    "#" + t.elmId),
                                [E.plugMaskSE[n], E.plugOutlineMaskSE[n]].forEach(
                                  function (e) {
                                    (e.x.baseVal.value = t.bBox.left),
                                      (e.y.baseVal.value = t.bBox.top),
                                      (e.width.baseVal.value = t.bBox.width),
                                      (e.height.baseVal.value = t.bBox.height);
                                  }
                                ),
                                (O = !0)),
                              qe(
                                E,
                                k.plugOutline_colorSE,
                                n,
                                (x = b.plugOutline_colorSE[n]),
                                w.apl_plugOutline_colorSE
                              ) &&
                                ((E.plugOutlineFaceSE[n].style.fill = x),
                                (O = !0),
                                se &&
                                  (He(E, E.lineMaskCaps),
                                  He(E, E.lineOutlineMaskCaps))),
                              qe(
                                E,
                                k.plugOutline_strokeWidthSE,
                                n,
                                (x = b.plugOutline_strokeWidthSE[n]),
                                w.apl_plugOutline_strokeWidthSE
                              ) &&
                                ((E.plugOutlineMaskShapeSE[n].style.strokeWidth =
                                  x + "px"),
                                (O = !0)),
                              qe(
                                E,
                                k.plugOutline_inStrokeWidthSE,
                                n,
                                (x = b.plugOutline_inStrokeWidthSE[n]),
                                w.apl_plugOutline_inStrokeWidthSE
                              ) &&
                                ((E.plugMaskShapeSE[n].style.strokeWidth =
                                  x + "px"),
                                (O = !0))));
                      }),
                    O)),
                (t.position || ee.line || ee.plug) && (ee.position = Je(e)),
                (t.path || ee.position) &&
                  (ee.path =
                    ((C = (M = e).curStats),
                    (L = M.aplStats),
                    (A = M.pathList.animVal || M.pathList.baseVal),
                    (V = C.path_edge),
                    (P = !1),
                    A &&
                      ((V.x1 = V.x2 = A[0][0].x),
                      (V.y1 = V.y2 = A[0][0].y),
                      (C.path_pathData = I =
                        Re(A, function (e) {
                          e.x < V.x1 && (V.x1 = e.x),
                            e.y < V.y1 && (V.y1 = e.y),
                            e.x > V.x2 && (V.x2 = e.x),
                            e.y > V.y2 && (V.y2 = e.y);
                        })),
                      Ge(I, L.path_pathData) &&
                        (M.linePath.setPathData(I),
                        (L.path_pathData = I),
                        (P = !0),
                        se
                          ? (He(M, M.plugsFace), He(M, M.lineMaskCaps))
                          : ue && He(M, M.linePath),
                        M.events.apl_path &&
                          M.events.apl_path.forEach(function (e) {
                            e(M, I);
                          }))),
                    P)),
                (ee.viewBox =
                  ((T = (N = e).curStats),
                  (W = N.aplStats),
                  (B = T.path_edge),
                  (R = T.viewBox_bBox),
                  (F = W.viewBox_bBox),
                  (G = N.svg.viewBox.baseVal),
                  (D = N.svg.style),
                  (z = !1),
                  (j = Math.max(
                    T.line_strokeWidth / 2,
                    T.viewBox_plugBCircleSE[0] || 0,
                    T.viewBox_plugBCircleSE[1] || 0
                  )),
                  (H = {
                    x1: B.x1 - j,
                    y1: B.y1 - j,
                    x2: B.x2 + j,
                    y2: B.y2 + j,
                  }),
                  N.events.new_edge4viewBox &&
                    N.events.new_edge4viewBox.forEach(function (e) {
                      e(N, H);
                    }),
                  (R.x =
                    T.lineMask_x =
                    T.lineOutlineMask_x =
                    T.maskBGRect_x =
                      H.x1),
                  (R.y =
                    T.lineMask_y =
                    T.lineOutlineMask_y =
                    T.maskBGRect_y =
                      H.y1),
                  (R.width = H.x2 - H.x1),
                  (R.height = H.y2 - H.y1),
                  ["x", "y", "width", "height"].forEach(function (e) {
                    var t;
                    (t = R[e]) !== F[e] &&
                      ((G[e] = F[e] = t),
                      (D[oe[e]] =
                        t +
                        ("x" === e || "y" === e ? N.bodyOffset[e] : 0) +
                        "px"),
                      (z = !0));
                  }),
                  z)),
                (ee.mask =
                  ((Y = (U = e).curStats),
                  (X = U.aplStats),
                  (q = !1),
                  Y.plug_enabled
                    ? [0, 1].forEach(function (e) {
                        Y.capsMaskMarker_enabledSE[e] =
                          (Y.plug_enabledSE[e] && Y.plug_colorTraSE[e]) ||
                          (Y.plugOutline_enabledSE[e] &&
                            Y.plugOutline_colorTraSE[e]);
                      })
                    : (Y.capsMaskMarker_enabledSE[0] =
                        Y.capsMaskMarker_enabledSE[1] =
                          !1),
                  (Y.capsMaskMarker_enabled =
                    Y.capsMaskMarker_enabledSE[0] ||
                    Y.capsMaskMarker_enabledSE[1]),
                  (Y.lineMask_outlineMode = Y.lineOutline_enabled),
                  (Y.caps_enabled =
                    Y.capsMaskMarker_enabled ||
                    Y.capsMaskAnchor_enabledSE[0] ||
                    Y.capsMaskAnchor_enabledSE[1]),
                  (Y.lineMask_enabled = Y.caps_enabled || Y.lineMask_outlineMode),
                  ((Y.lineMask_enabled && !Y.lineMask_outlineMode) ||
                    Y.lineOutline_enabled) &&
                    ["x", "y"].forEach(function (e) {
                      var t = "maskBGRect_" + e;
                      qe(U, X, t, (Z = Y[t])) &&
                        ((U.maskBGRect[e].baseVal.value = Z), (q = !0));
                    }),
                  qe(U, X, "lineMask_enabled", (Z = Y.lineMask_enabled)) &&
                    ((U.lineFace.style.mask = Z
                      ? "url(#" + U.lineMaskId + ")"
                      : "none"),
                    (q = !0),
                    pe && He(U, U.lineMask)),
                  Y.lineMask_enabled &&
                    (qe(
                      U,
                      X,
                      "lineMask_outlineMode",
                      (Z = Y.lineMask_outlineMode)
                    ) &&
                      (Z
                        ? ((U.lineMaskBG.style.display = "none"),
                          (U.lineMaskShape.style.display = "inline"))
                        : ((U.lineMaskBG.style.display = "inline"),
                          (U.lineMaskShape.style.display = "none")),
                      (q = !0)),
                    ["x", "y"].forEach(function (e) {
                      var t = "lineMask_" + e;
                      qe(U, X, t, (Z = Y[t])) &&
                        ((U.lineMask[e].baseVal.value = Z), (q = !0));
                    }),
                    qe(U, X, "caps_enabled", (Z = Y.caps_enabled)) &&
                      ((U.lineMaskCaps.style.display =
                        U.lineOutlineMaskCaps.style.display =
                          Z ? "inline" : "none"),
                      (q = !0),
                      pe && He(U, U.capsMaskLine)),
                    Y.caps_enabled &&
                      ([0, 1].forEach(function (e) {
                        var t;
                        qe(
                          U,
                          X.capsMaskAnchor_enabledSE,
                          e,
                          (Z = Y.capsMaskAnchor_enabledSE[e])
                        ) &&
                          ((U.capsMaskAnchorSE[e].style.display = Z
                            ? "inline"
                            : "none"),
                          (q = !0),
                          pe && He(U, U.lineMask)),
                          Y.capsMaskAnchor_enabledSE[e] &&
                            (Ge(
                              (t = Y.capsMaskAnchor_pathDataSE[e]),
                              X.capsMaskAnchor_pathDataSE[e]
                            ) &&
                              (U.capsMaskAnchorSE[e].setPathData(t),
                              (X.capsMaskAnchor_pathDataSE[e] = t),
                              (q = !0)),
                            qe(
                              U,
                              X.capsMaskAnchor_strokeWidthSE,
                              e,
                              (Z = Y.capsMaskAnchor_strokeWidthSE[e])
                            ) &&
                              ((U.capsMaskAnchorSE[e].style.strokeWidth =
                                Z + "px"),
                              (q = !0)));
                      }),
                      qe(
                        U,
                        X,
                        "capsMaskMarker_enabled",
                        (Z = Y.capsMaskMarker_enabled)
                      ) &&
                        ((U.capsMaskLine.style.display = Z ? "inline" : "none"),
                        (q = !0)),
                      Y.capsMaskMarker_enabled &&
                        [0, 1].forEach(function (n) {
                          var e = Y.capsMaskMarker_plugSE[n],
                            t = e !== ne ? ae[ie[e]] : null,
                            a = Ye(n, t);
                          qe(
                            U,
                            X.capsMaskMarker_enabledSE,
                            n,
                            (Z = Y.capsMaskMarker_enabledSE[n])
                          ) &&
                            ((U.capsMaskLine.style[a.prop] = Z
                              ? "url(#" + U.lineMaskMarkerIdSE[n] + ")"
                              : "none"),
                            (q = !0)),
                            Y.capsMaskMarker_enabledSE[n] &&
                              (qe(U, X.capsMaskMarker_plugSE, n, e) &&
                                ((U.capsMaskMarkerShapeSE[n].href.baseVal =
                                  "#" + t.elmId),
                                Ze(
                                  U,
                                  U.capsMaskMarkerSE[n],
                                  a.orient,
                                  t.bBox,
                                  U.svg,
                                  U.capsMaskMarkerShapeSE[n],
                                  U.capsMaskLine
                                ),
                                (q = !0),
                                ue && (He(U, U.capsMaskLine), He(U, U.lineFace))),
                              ["markerWidth", "markerHeight"].forEach(function (
                                e
                              ) {
                                var t = "capsMaskMarker_" + e + "SE";
                                qe(U, X[t], n, (Z = Y[t][n])) &&
                                  ((U.capsMaskMarkerSE[n][e].baseVal.value = Z),
                                  (q = !0));
                              }));
                        }))),
                  Y.lineOutline_enabled &&
                    ["x", "y"].forEach(function (e) {
                      var t = "lineOutlineMask_" + e;
                      qe(U, X, t, (Z = Y[t])) &&
                        ((U.lineOutlineMask[e].baseVal.value = Z), (q = !0));
                    }),
                  q)),
                t.effect &&
                  ((J = (Q = e).curStats),
                  ($ = Q.aplStats),
                  Object.keys(te).forEach(function (e) {
                    var t = te[e],
                      n = e + "_enabled",
                      a = e + "_options",
                      i = J[a];
                    qe(Q, $, n, (K = J[n]))
                      ? (K && ($[a] = Oe(i)), t[K ? "init" : "remove"](Q))
                      : K &&
                        we(i, $[a]) &&
                        (t.remove(Q), ($[n] = !0), ($[a] = Oe(i)), t.init(Q));
                  })),
                (he || pe) && ee.line && !ee.path && He(e, e.lineShape),
                he && ee.plug && !ee.line && He(e, e.plugsFace),
                Ue(e);
            }
            function tt(e, t) {
              return {
                duration:
                  ye(e.duration) && 0 < e.duration ? e.duration : t.duration,
                timing: g.validTiming(e.timing) ? e.timing : Oe(t.timing),
              };
            }
            function nt(e, t, n, a) {
              var i,
                o = e.curStats,
                l = e.aplStats,
                r = {};
              function s() {
                ["show_on", "show_effect", "show_animOptions"].forEach(function (
                  e
                ) {
                  l[e] = o[e];
                });
              }
              (o.show_on = t),
                n &&
                  M[n] &&
                  ((o.show_effect = n),
                  (o.show_animOptions = tt(
                    fe(a) ? a : {},
                    M[n].defaultAnimOptions
                  ))),
                (r.show_on = o.show_on !== l.show_on),
                (r.show_effect = o.show_effect !== l.show_effect),
                (r.show_animOptions = we(o.show_animOptions, l.show_animOptions)),
                r.show_effect || r.show_animOptions
                  ? o.show_inAnim
                    ? ((i = r.show_effect
                        ? M[l.show_effect].stop(e, !0, !0)
                        : M[l.show_effect].stop(e)),
                      s(),
                      M[l.show_effect].init(e, i))
                    : r.show_on &&
                      (l.show_effect &&
                        r.show_effect &&
                        M[l.show_effect].stop(e, !0, !0),
                      s(),
                      M[l.show_effect].init(e))
                  : r.show_on && (s(), M[l.show_effect].start(e));
            }
            function at(e, t, n) {
              var a = { props: e, optionName: n };
              return (
                e.attachments.indexOf(t) < 0 &&
                (!t.conf.bind || t.conf.bind(t, a)) &&
                (e.attachments.push(t), t.boundTargets.push(a), 1)
              );
            }
            function it(n, a, e) {
              var i = n.attachments.indexOf(a);
              -1 < i && n.attachments.splice(i, 1),
                a.boundTargets.some(function (e, t) {
                  return (
                    e.props === n &&
                    (a.conf.unbind && a.conf.unbind(a, e), (i = t), !0)
                  );
                }) &&
                  (a.boundTargets.splice(i, 1),
                  e ||
                    je(function () {
                      a.boundTargets.length || o(a);
                    }));
            }
            function ot(s, u) {
              var e,
                i,
                a,
                t,
                n,
                o,
                l,
                r,
                h,
                p,
                c,
                d,
                f,
                y,
                m,
                S,
                g,
                _ = s.options,
                v = {};
              function E(e, t, n, a, i) {
                var o = {};
                return (
                  n
                    ? null != a
                      ? ((o.container = e[n]), (o.key = a))
                      : ((o.container = e), (o.key = n))
                    : ((o.container = e), (o.key = t)),
                  (o.default = i),
                  (o.acceptsAuto = null == o.default),
                  o
                );
              }
              function x(e, t, n, a, i, o, l) {
                var r,
                  s,
                  u,
                  h = E(e, n, i, o, l);
                return (
                  null != t[n] &&
                    (s = (t[n] + "").toLowerCase()) &&
                    ((h.acceptsAuto && s === U) || (u = a[s])) &&
                    u !== h.container[h.key] &&
                    ((h.container[h.key] = u), (r = !0)),
                  null != h.container[h.key] ||
                    h.acceptsAuto ||
                    ((h.container[h.key] = h.default), (r = !0)),
                  r
                );
              }
              function b(e, t, n, a, i, o, l, r, s) {
                var u,
                  h,
                  p,
                  c,
                  d = E(e, n, i, o, l);
                if (!a) {
                  if (null == d.default) throw new Error("Invalid `type`: " + n);
                  a = typeof d.default;
                }
                return (
                  null != t[n] &&
                    ((d.acceptsAuto && (t[n] + "").toLowerCase() === U) ||
                      ((p = h = t[n]),
                      ("number" === (c = a) ? ye(p) : typeof p === c) &&
                        ((h = s && "string" === a && h ? h.trim() : h), 1) &&
                        (!r || r(h)))) &&
                    h !== d.container[d.key] &&
                    ((d.container[d.key] = h), (u = !0)),
                  null != d.container[d.key] ||
                    d.acceptsAuto ||
                    ((d.container[d.key] = d.default), (u = !0)),
                  u
                );
              }
              if (
                ((u = u || {}),
                ["start", "end"].forEach(function (e, t) {
                  var n = u[e],
                    a = !1;
                  if (
                    n &&
                    (Ie(n) || (a = L(n, "anchor"))) &&
                    n !== _.anchorSE[t]
                  ) {
                    if (
                      (!1 !== s.optionIsAttach.anchorSE[t] &&
                        it(s, ve[_.anchorSE[t]._id]),
                      a && !at(s, ve[n._id], e))
                    )
                      throw new Error("Can't bind attachment");
                    (_.anchorSE[t] = n),
                      (s.optionIsAttach.anchorSE[t] = a),
                      (i = v.position = !0);
                  }
                }),
                !_.anchorSE[0] ||
                  !_.anchorSE[1] ||
                  _.anchorSE[0] === _.anchorSE[1])
              )
                throw new Error("`start` and `end` are required.");
              function k(e) {
                var t = o.appendChild(S.createElementNS(re, "mask"));
                return (
                  (t.id = e),
                  (t.maskUnits.baseVal =
                    SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE),
                  [t.x, t.y, t.width, t.height].forEach(function (e) {
                    e.baseVal.newValueSpecifiedUnits(
                      SVGLength.SVG_LENGTHTYPE_PX,
                      0
                    );
                  }),
                  t
                );
              }
              function w(e) {
                var t = o.appendChild(S.createElementNS(re, "marker"));
                return (
                  (t.id = e),
                  (t.markerUnits.baseVal =
                    SVGMarkerElement.SVG_MARKERUNITS_STROKEWIDTH),
                  t.viewBox.baseVal || t.setAttribute("viewBox", "0 0 0 0"),
                  t
                );
              }
              function O(e) {
                return (
                  [e.width, e.height].forEach(function (e) {
                    e.baseVal.newValueSpecifiedUnits(
                      SVGLength.SVG_LENGTHTYPE_PERCENTAGE,
                      100
                    );
                  }),
                  e
                );
              }
              i &&
                (e = (function (e, t) {
                  var n, a, i;
                  if (!(n = Le(e)) || !(a = Le(t)))
                    throw new Error("Cannot get frames.");
                  return (
                    n.length &&
                      a.length &&
                      (n.reverse(),
                      a.reverse(),
                      n.some(function (t) {
                        return a.some(function (e) {
                          return e === t && ((i = e.contentWindow), !0);
                        });
                      })),
                    i || window
                  );
                })(
                  !1 !== s.optionIsAttach.anchorSE[0]
                    ? ve[_.anchorSE[0]._id].element
                    : _.anchorSE[0],
                  !1 !== s.optionIsAttach.anchorSE[1]
                    ? ve[_.anchorSE[1]._id].element
                    : _.anchorSE[1]
                )) !== s.baseWindow &&
                ((t = e),
                (m = (a = s).aplStats),
                (S = t.document),
                (g = A + "-" + a._id),
                (a.pathList = {}),
                Xe(m, me),
                Object.keys(te).forEach(function (e) {
                  var t = e + "_enabled";
                  m[t] && (te[e].remove(a), (m[t] = !1));
                }),
                a.baseWindow &&
                  a.svg &&
                  a.baseWindow.document.body.removeChild(a.svg),
                Ke((a.baseWindow = t)),
                (a.bodyOffset = Qe(t)),
                (a.svg = n = S.createElementNS(re, "svg")),
                (n.className.baseVal = A),
                n.viewBox.baseVal || n.setAttribute("viewBox", "0 0 0 0"),
                (a.defs = o = n.appendChild(S.createElementNS(re, "defs"))),
                (a.linePath = r = o.appendChild(S.createElementNS(re, "path"))),
                (r.id = h = g + "-line-path"),
                (r.className.baseVal = A + "-line-path"),
                pe && (r.style.fill = "none"),
                (a.lineShape = r = o.appendChild(S.createElementNS(re, "use"))),
                (r.id = p = g + "-line-shape"),
                (r.href.baseVal = "#" + h),
                ((l = o.appendChild(S.createElementNS(re, "g"))).id = c =
                  g + "-caps"),
                (a.capsMaskAnchorSE = [0, 1].map(function () {
                  var e = l.appendChild(S.createElementNS(re, "path"));
                  return (e.className.baseVal = A + "-caps-mask-anchor"), e;
                })),
                (a.lineMaskMarkerIdSE = [
                  g + "-caps-mask-marker-0",
                  g + "-caps-mask-marker-1",
                ]),
                (a.capsMaskMarkerSE = [0, 1].map(function (e) {
                  return w(a.lineMaskMarkerIdSE[e]);
                })),
                (a.capsMaskMarkerShapeSE = [0, 1].map(function (e) {
                  var t = a.capsMaskMarkerSE[e].appendChild(
                    S.createElementNS(re, "use")
                  );
                  return (t.className.baseVal = A + "-caps-mask-marker-shape"), t;
                })),
                (a.capsMaskLine = r =
                  l.appendChild(S.createElementNS(re, "use"))),
                (r.className.baseVal = A + "-caps-mask-line"),
                (r.href.baseVal = "#" + p),
                (a.maskBGRect = r =
                  O(o.appendChild(S.createElementNS(re, "rect")))),
                (r.id = d = g + "-mask-bg-rect"),
                (r.className.baseVal = A + "-mask-bg-rect"),
                pe && (r.style.fill = "white"),
                (a.lineMask = O(k((a.lineMaskId = g + "-line-mask")))),
                (a.lineMaskBG = r =
                  a.lineMask.appendChild(S.createElementNS(re, "use"))),
                (r.href.baseVal = "#" + d),
                (a.lineMaskShape = r =
                  a.lineMask.appendChild(S.createElementNS(re, "use"))),
                (r.className.baseVal = A + "-line-mask-shape"),
                (r.href.baseVal = "#" + h),
                (r.style.display = "none"),
                (a.lineMaskCaps = r =
                  a.lineMask.appendChild(S.createElementNS(re, "use"))),
                (r.href.baseVal = "#" + c),
                (a.lineOutlineMask = O(k((f = g + "-line-outline-mask")))),
                ((r = a.lineOutlineMask.appendChild(
                  S.createElementNS(re, "use")
                )).href.baseVal = "#" + d),
                (a.lineOutlineMaskShape = r =
                  a.lineOutlineMask.appendChild(S.createElementNS(re, "use"))),
                (r.className.baseVal = A + "-line-outline-mask-shape"),
                (r.href.baseVal = "#" + h),
                (a.lineOutlineMaskCaps = r =
                  a.lineOutlineMask.appendChild(S.createElementNS(re, "use"))),
                (r.href.baseVal = "#" + c),
                (a.face = n.appendChild(S.createElementNS(re, "g"))),
                (a.lineFace = r =
                  a.face.appendChild(S.createElementNS(re, "use"))),
                (r.href.baseVal = "#" + p),
                (a.lineOutlineFace = r =
                  a.face.appendChild(S.createElementNS(re, "use"))),
                (r.href.baseVal = "#" + p),
                (r.style.mask = "url(#" + f + ")"),
                (r.style.display = "none"),
                (a.plugMaskIdSE = [g + "-plug-mask-0", g + "-plug-mask-1"]),
                (a.plugMaskSE = [0, 1].map(function (e) {
                  return k(a.plugMaskIdSE[e]);
                })),
                (a.plugMaskShapeSE = [0, 1].map(function (e) {
                  var t = a.plugMaskSE[e].appendChild(
                    S.createElementNS(re, "use")
                  );
                  return (t.className.baseVal = A + "-plug-mask-shape"), t;
                })),
                (y = []),
                (a.plugOutlineMaskSE = [0, 1].map(function (e) {
                  return k((y[e] = g + "-plug-outline-mask-" + e));
                })),
                (a.plugOutlineMaskShapeSE = [0, 1].map(function (e) {
                  var t = a.plugOutlineMaskSE[e].appendChild(
                    S.createElementNS(re, "use")
                  );
                  return (
                    (t.className.baseVal = A + "-plug-outline-mask-shape"), t
                  );
                })),
                (a.plugMarkerIdSE = [g + "-plug-marker-0", g + "-plug-marker-1"]),
                (a.plugMarkerSE = [0, 1].map(function (e) {
                  var t = w(a.plugMarkerIdSE[e]);
                  return (
                    pe &&
                      (t.markerUnits.baseVal =
                        SVGMarkerElement.SVG_MARKERUNITS_USERSPACEONUSE),
                    t
                  );
                })),
                (a.plugMarkerShapeSE = [0, 1].map(function (e) {
                  return a.plugMarkerSE[e].appendChild(
                    S.createElementNS(re, "g")
                  );
                })),
                (a.plugFaceSE = [0, 1].map(function (e) {
                  return a.plugMarkerShapeSE[e].appendChild(
                    S.createElementNS(re, "use")
                  );
                })),
                (a.plugOutlineFaceSE = [0, 1].map(function (e) {
                  var t = a.plugMarkerShapeSE[e].appendChild(
                    S.createElementNS(re, "use")
                  );
                  return (
                    (t.style.mask = "url(#" + y[e] + ")"),
                    (t.style.display = "none"),
                    t
                  );
                })),
                (a.plugsFace = r =
                  a.face.appendChild(S.createElementNS(re, "use"))),
                (r.className.baseVal = A + "-plugs-face"),
                (r.href.baseVal = "#" + p),
                (r.style.display = "none"),
                a.curStats.show_inAnim
                  ? ((a.isShown = 1), M[m.show_effect].stop(a, !0))
                  : a.isShown || (n.style.visibility = "hidden"),
                S.body.appendChild(n),
                [0, 1, 2].forEach(function (e) {
                  var t,
                    n = a.options.labelSEM[e];
                  n &&
                    L(n, "label") &&
                    (t = ve[n._id]).conf.initSvg &&
                    t.conf.initSvg(t, a);
                }),
                (v.line =
                  v.plug =
                  v.lineOutline =
                  v.plugOutline =
                  v.faces =
                  v.effect =
                    !0)),
                (v.position =
                  x(_, u, "path", z, null, null, de.path) || v.position),
                (v.position =
                  x(_, u, "startSocket", W, "socketSE", 0) || v.position),
                (v.position =
                  x(_, u, "endSocket", W, "socketSE", 1) || v.position),
                [u.startSocketGravity, u.endSocketGravity].forEach(function (
                  e,
                  t
                ) {
                  var n,
                    a,
                    i = !1;
                  null != e &&
                    (Array.isArray(e)
                      ? ye(e[0]) &&
                        ye(e[1]) &&
                        ((i = [e[0], e[1]]),
                        Array.isArray(_.socketGravitySE[t]) &&
                          ((n = i),
                          (a = _.socketGravitySE[t]),
                          n.length === a.length &&
                            n.every(function (e, t) {
                              return e === a[t];
                            })) &&
                          (i = !1))
                      : ((e + "").toLowerCase() === U
                          ? (i = null)
                          : ye(e) && 0 <= e && (i = e),
                        i === _.socketGravitySE[t] && (i = !1)),
                    !1 !== i && ((_.socketGravitySE[t] = i), (v.position = !0)));
                }),
                (v.line =
                  b(
                    _,
                    u,
                    "color",
                    null,
                    "lineColor",
                    null,
                    de.lineColor,
                    null,
                    !0
                  ) || v.line),
                (v.line =
                  b(
                    _,
                    u,
                    "size",
                    null,
                    "lineSize",
                    null,
                    de.lineSize,
                    function (e) {
                      return 0 < e;
                    }
                  ) || v.line),
                ["startPlug", "endPlug"].forEach(function (e, t) {
                  (v.plug = x(_, u, e, j, "plugSE", t, de.plugSE[t]) || v.plug),
                    (v.plug =
                      b(
                        _,
                        u,
                        e + "Color",
                        "string",
                        "plugColorSE",
                        t,
                        null,
                        null,
                        !0
                      ) || v.plug),
                    (v.plug =
                      b(
                        _,
                        u,
                        e + "Size",
                        null,
                        "plugSizeSE",
                        t,
                        de.plugSizeSE[t],
                        function (e) {
                          return 0 < e;
                        }
                      ) || v.plug);
                }),
                (v.lineOutline =
                  b(
                    _,
                    u,
                    "outline",
                    null,
                    "lineOutlineEnabled",
                    null,
                    de.lineOutlineEnabled
                  ) || v.lineOutline),
                (v.lineOutline =
                  b(
                    _,
                    u,
                    "outlineColor",
                    null,
                    "lineOutlineColor",
                    null,
                    de.lineOutlineColor,
                    null,
                    !0
                  ) || v.lineOutline),
                (v.lineOutline =
                  b(
                    _,
                    u,
                    "outlineSize",
                    null,
                    "lineOutlineSize",
                    null,
                    de.lineOutlineSize,
                    function (e) {
                      return 0 < e && e <= 0.48;
                    }
                  ) || v.lineOutline),
                ["startPlugOutline", "endPlugOutline"].forEach(function (e, t) {
                  (v.plugOutline =
                    b(
                      _,
                      u,
                      e,
                      null,
                      "plugOutlineEnabledSE",
                      t,
                      de.plugOutlineEnabledSE[t]
                    ) || v.plugOutline),
                    (v.plugOutline =
                      b(
                        _,
                        u,
                        e + "Color",
                        "string",
                        "plugOutlineColorSE",
                        t,
                        null,
                        null,
                        !0
                      ) || v.plugOutline),
                    (v.plugOutline =
                      b(
                        _,
                        u,
                        e + "Size",
                        null,
                        "plugOutlineSizeSE",
                        t,
                        de.plugOutlineSizeSE[t],
                        function (e) {
                          return 1 <= e;
                        }
                      ) || v.plugOutline);
                }),
                ["startLabel", "endLabel", "middleLabel"].forEach(function (
                  e,
                  t
                ) {
                  var n,
                    a,
                    i,
                    o = u[e],
                    l =
                      _.labelSEM[t] && !s.optionIsAttach.labelSEM[t]
                        ? ve[_.labelSEM[t]._id].text
                        : _.labelSEM[t],
                    r = !1;
                  if (
                    ((n = "string" == typeof o) && (o = o.trim()),
                    (n || (o && (r = L(o, "label")))) && o !== l)
                  ) {
                    if (
                      (_.labelSEM[t] &&
                        (it(s, ve[_.labelSEM[t]._id]), (_.labelSEM[t] = "")),
                      o)
                    ) {
                      if (
                        (r
                          ? (a = ve[(i = o)._id]).boundTargets
                              .slice()
                              .forEach(function (e) {
                                a.conf.removeOption(a, e);
                              })
                          : (i = new C(I.captionLabel, [o])),
                        !at(s, ve[i._id], e))
                      )
                        throw new Error("Can't bind attachment");
                      _.labelSEM[t] = i;
                    }
                    s.optionIsAttach.labelSEM[t] = r;
                  }
                }),
                Object.keys(te).forEach(function (a) {
                  var e,
                    t,
                    o = te[a],
                    n = a + "_enabled",
                    i = a + "_options";
                  function l(a) {
                    var i = {};
                    return (
                      o.optionsConf.forEach(function (e) {
                        var t = e[0],
                          n = e[3];
                        null == e[4] || i[n] || (i[n] = []),
                          ("function" == typeof t ? t : "id" === t ? x : b).apply(
                            null,
                            [i, a].concat(e.slice(1))
                          );
                      }),
                      i
                    );
                  }
                  function r(e) {
                    var t,
                      n = a + "_animOptions";
                    return (
                      e.hasOwnProperty("animation")
                        ? fe(e.animation)
                          ? (t = s.curStats[n] =
                              tt(e.animation, o.defaultAnimOptions))
                          : ((t = !!e.animation),
                            (s.curStats[n] = t
                              ? tt({}, o.defaultAnimOptions)
                              : null))
                        : ((t = !!o.defaultEnabled),
                          (s.curStats[n] = t
                            ? tt({}, o.defaultAnimOptions)
                            : null)),
                      t
                    );
                  }
                  u.hasOwnProperty(a) &&
                    ((e = u[a]),
                    fe(e)
                      ? ((s.curStats[n] = !0),
                        (t = s.curStats[i] = l(e)),
                        o.anim && (s.curStats[i].animation = r(e)))
                      : (t = s.curStats[n] = !!e) &&
                        ((s.curStats[i] = l({})),
                        o.anim && (s.curStats[i].animation = r({}))),
                    we(t, _[a]) && ((_[a] = t), (v.effect = !0)));
                }),
                et(s, v);
            }
            function lt(e, t, n) {
              var a = {
                options: {
                  anchorSE: [],
                  socketSE: [],
                  socketGravitySE: [],
                  plugSE: [],
                  plugColorSE: [],
                  plugSizeSE: [],
                  plugOutlineEnabledSE: [],
                  plugOutlineColorSE: [],
                  plugOutlineSizeSE: [],
                  labelSEM: ["", "", ""],
                },
                optionIsAttach: { anchorSE: [!1, !1], labelSEM: [!1, !1, !1] },
                curStats: {},
                aplStats: {},
                attachments: [],
                events: {},
                reflowTargets: [],
              };
              Xe(a.curStats, me),
                Xe(a.aplStats, me),
                Object.keys(te).forEach(function (e) {
                  var t = te[e].stats;
                  Xe(a.curStats, t), Xe(a.aplStats, t), (a.options[e] = !1);
                }),
                Xe(a.curStats, E),
                Xe(a.aplStats, E),
                (a.curStats.show_effect = O),
                (a.curStats.show_animOptions = Oe(M[O].defaultAnimOptions)),
                Object.defineProperty(this, "_id", { value: ++_e }),
                (a._id = this._id),
                (ge[this._id] = a),
                1 === arguments.length && ((n = e), (e = null)),
                (n = n || {}),
                (e || t) && ((n = Oe(n)), e && (n.start = e), t && (n.end = t)),
                (a.isShown = a.aplStats.show_on = !n.hide),
                this.setOptions(n);
            }
            function rt(n) {
              return function (e) {
                var t = {};
                (t[n] = e), this.setOptions(t);
              };
            }
            function st(e, t) {
              var n,
                a = { conf: e, curStats: {}, aplStats: {}, boundTargets: [] },
                i = {};
              e.argOptions.every(function (e) {
                return (
                  !(
                    !t.length ||
                    ("string" == typeof e.type
                      ? typeof t[0] !== e.type
                      : "function" != typeof e.type || !e.type(t[0]))
                  ) && ((i[e.optionName] = t.shift()), !0)
                );
              }),
                (n = t.length && fe(t[0]) ? Oe(t[0]) : {}),
                Object.keys(i).forEach(function (e) {
                  n[e] = i[e];
                }),
                e.stats && (Xe(a.curStats, e.stats), Xe(a.aplStats, e.stats)),
                Object.defineProperty(this, "_id", { value: ++Ee }),
                Object.defineProperty(this, "isRemoved", {
                  get: function () {
                    return !ve[this._id];
                  },
                }),
                (a._id = this._id),
                (e.init && !e.init(a, n)) || (ve[this._id] = a);
            }
            return (
              (te = {
                dash: {
                  stats: { dash_len: {}, dash_gap: {}, dash_maxOffset: {} },
                  anim: !0,
                  defaultAnimOptions: { duration: 1e3, timing: "linear" },
                  optionsConf: [
                    [
                      "type",
                      "len",
                      "number",
                      null,
                      null,
                      null,
                      function (e) {
                        return 0 < e;
                      },
                    ],
                    [
                      "type",
                      "gap",
                      "number",
                      null,
                      null,
                      null,
                      function (e) {
                        return 0 < e;
                      },
                    ],
                  ],
                  init: function (e) {
                    De(e, "apl_line_strokeWidth", te.dash.update),
                      (e.lineFace.style.strokeDashoffset = 0),
                      te.dash.update(e);
                  },
                  remove: function (e) {
                    var t = e.curStats;
                    ze(e, "apl_line_strokeWidth", te.dash.update),
                      t.dash_animId &&
                        (g.remove(t.dash_animId), (t.dash_animId = null)),
                      (e.lineFace.style.strokeDasharray = "none"),
                      (e.lineFace.style.strokeDashoffset = 0),
                      Xe(e.aplStats, te.dash.stats);
                  },
                  update: function (t) {
                    var e,
                      n = t.curStats,
                      a = t.aplStats,
                      i = a.dash_options,
                      o = !1;
                    (n.dash_len = i.len || 2 * a.line_strokeWidth),
                      (n.dash_gap = i.gap || a.line_strokeWidth),
                      (n.dash_maxOffset = n.dash_len + n.dash_gap),
                      (o = qe(t, a, "dash_len", n.dash_len) || o),
                      (o = qe(t, a, "dash_gap", n.dash_gap) || o) &&
                        (t.lineFace.style.strokeDasharray =
                          a.dash_len + "," + a.dash_gap),
                      n.dash_animOptions
                        ? ((o = qe(t, a, "dash_maxOffset", n.dash_maxOffset)),
                          a.dash_animOptions &&
                            (o || we(n.dash_animOptions, a.dash_animOptions)) &&
                            (n.dash_animId &&
                              ((e = g.stop(n.dash_animId)),
                              g.remove(n.dash_animId)),
                            (a.dash_animOptions = null)),
                          a.dash_animOptions ||
                            ((n.dash_animId = g.add(
                              function (e) {
                                return (1 - e) * a.dash_maxOffset + "px";
                              },
                              function (e) {
                                t.lineFace.style.strokeDashoffset = e;
                              },
                              n.dash_animOptions.duration,
                              0,
                              n.dash_animOptions.timing,
                              !1,
                              e
                            )),
                            (a.dash_animOptions = Oe(n.dash_animOptions))))
                        : a.dash_animOptions &&
                          (n.dash_animId &&
                            (g.remove(n.dash_animId), (n.dash_animId = null)),
                          (t.lineFace.style.strokeDashoffset = 0),
                          (a.dash_animOptions = null));
                  },
                },
                gradient: {
                  stats: {
                    gradient_colorSE: { hasSE: !0 },
                    gradient_pointSE: { hasSE: !0, hasProps: !0 },
                  },
                  optionsConf: [
                    [
                      "type",
                      "startColor",
                      "string",
                      "colorSE",
                      0,
                      null,
                      null,
                      !0,
                    ],
                    ["type", "endColor", "string", "colorSE", 1, null, null, !0],
                  ],
                  init: function (e) {
                    var t,
                      a = e.baseWindow.document,
                      n = e.defs,
                      i = A + "-" + e._id + "-gradient";
                    (e.efc_gradient_gradient = t =
                      n.appendChild(a.createElementNS(re, "linearGradient"))),
                      (t.id = i),
                      (t.gradientUnits.baseVal =
                        SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE),
                      [t.x1, t.y1, t.x2, t.y2].forEach(function (e) {
                        e.baseVal.newValueSpecifiedUnits(
                          SVGLength.SVG_LENGTHTYPE_PX,
                          0
                        );
                      }),
                      (e.efc_gradient_stopSE = [0, 1].map(function (t) {
                        var n = e.efc_gradient_gradient.appendChild(
                          a.createElementNS(re, "stop")
                        );
                        try {
                          n.offset.baseVal = t;
                        } catch (e) {
                          if (e.code !== DOMException.NO_MODIFICATION_ALLOWED_ERR)
                            throw e;
                          n.setAttribute("offset", t);
                        }
                        return n;
                      })),
                      De(e, "cur_plug_colorSE", te.gradient.update),
                      De(e, "apl_path", te.gradient.update),
                      (e.curStats.line_altColor = !0),
                      (e.lineFace.style.stroke = "url(#" + i + ")"),
                      te.gradient.update(e);
                  },
                  remove: function (e) {
                    e.efc_gradient_gradient &&
                      (e.defs.removeChild(e.efc_gradient_gradient),
                      (e.efc_gradient_gradient = e.efc_gradient_stopSE = null)),
                      ze(e, "cur_plug_colorSE", te.gradient.update),
                      ze(e, "apl_path", te.gradient.update),
                      (e.curStats.line_altColor = !1),
                      (e.lineFace.style.stroke = e.curStats.line_color),
                      Xe(e.aplStats, te.gradient.stats);
                  },
                  update: function (a) {
                    var e,
                      t,
                      i = a.curStats,
                      o = a.aplStats,
                      n = o.gradient_options,
                      l = a.pathList.animVal || a.pathList.baseVal;
                    [0, 1].forEach(function (e) {
                      i.gradient_colorSE[e] = n.colorSE[e] || i.plug_colorSE[e];
                    }),
                      (t = l[0][0]),
                      (i.gradient_pointSE[0] = { x: t.x, y: t.y }),
                      (t = (e = l[l.length - 1])[e.length - 1]),
                      (i.gradient_pointSE[1] = { x: t.x, y: t.y }),
                      [0, 1].forEach(function (t) {
                        var n;
                        qe(
                          a,
                          o.gradient_colorSE,
                          t,
                          (n = i.gradient_colorSE[t])
                        ) &&
                          (pe
                            ? ((n = Me(n)),
                              (a.efc_gradient_stopSE[t].style.stopColor = n[1]),
                              (a.efc_gradient_stopSE[t].style.stopOpacity = n[0]))
                            : (a.efc_gradient_stopSE[t].style.stopColor = n)),
                          ["x", "y"].forEach(function (e) {
                            (n = i.gradient_pointSE[t][e]) !==
                              o.gradient_pointSE[t][e] &&
                              (a.efc_gradient_gradient[
                                e + (t + 1)
                              ].baseVal.value = o.gradient_pointSE[t][e] =
                                n);
                          });
                      });
                  },
                },
                dropShadow: {
                  stats: {
                    dropShadow_dx: {},
                    dropShadow_dy: {},
                    dropShadow_blur: {},
                    dropShadow_color: {},
                    dropShadow_opacity: {},
                    dropShadow_x: {},
                    dropShadow_y: {},
                  },
                  optionsConf: [
                    ["type", "dx", null, null, null, 2],
                    ["type", "dy", null, null, null, 4],
                    [
                      "type",
                      "blur",
                      null,
                      null,
                      null,
                      3,
                      function (e) {
                        return 0 <= e;
                      },
                    ],
                    ["type", "color", null, null, null, "#000", null, !0],
                    [
                      "type",
                      "opacity",
                      null,
                      null,
                      null,
                      0.8,
                      function (e) {
                        return 0 <= e && e <= 1;
                      },
                    ],
                  ],
                  init: function (t) {
                    var e,
                      n,
                      a,
                      i,
                      o,
                      l = t.baseWindow.document,
                      r = t.defs,
                      s = A + "-" + t._id + "-dropShadow",
                      u =
                        ((e = l),
                        (n = s),
                        (o = {}),
                        "boolean" != typeof p &&
                          (p = !!window.SVGFEDropShadowElement && !pe),
                        (o.elmsAppend = [
                          (o.elmFilter = a = e.createElementNS(re, "filter")),
                        ]),
                        (a.filterUnits.baseVal =
                          SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE),
                        a.x.baseVal.newValueSpecifiedUnits(
                          SVGLength.SVG_LENGTHTYPE_PX,
                          0
                        ),
                        a.y.baseVal.newValueSpecifiedUnits(
                          SVGLength.SVG_LENGTHTYPE_PX,
                          0
                        ),
                        a.width.baseVal.newValueSpecifiedUnits(
                          SVGLength.SVG_LENGTHTYPE_PERCENTAGE,
                          100
                        ),
                        a.height.baseVal.newValueSpecifiedUnits(
                          SVGLength.SVG_LENGTHTYPE_PERCENTAGE,
                          100
                        ),
                        (a.id = n),
                        p
                          ? ((o.elmOffset =
                              o.elmBlur =
                              i =
                                a.appendChild(
                                  e.createElementNS(re, "feDropShadow")
                                )),
                            (o.styleFlood = i.style))
                          : ((o.elmBlur = a.appendChild(
                              e.createElementNS(re, "feGaussianBlur")
                            )),
                            (o.elmOffset = i =
                              a.appendChild(e.createElementNS(re, "feOffset"))),
                            (i.result.baseVal = "offsetblur"),
                            (i = a.appendChild(e.createElementNS(re, "feFlood"))),
                            (o.styleFlood = i.style),
                            ((i = a.appendChild(
                              e.createElementNS(re, "feComposite")
                            )).in2.baseVal = "offsetblur"),
                            (i.operator.baseVal =
                              SVGFECompositeElement.SVG_FECOMPOSITE_OPERATOR_IN),
                            (i = a.appendChild(
                              e.createElementNS(re, "feMerge")
                            )).appendChild(e.createElementNS(re, "feMergeNode")),
                            (i.appendChild(
                              e.createElementNS(re, "feMergeNode")
                            ).in1.baseVal = "SourceGraphic")),
                        o);
                    [
                      "elmFilter",
                      "elmOffset",
                      "elmBlur",
                      "styleFlood",
                      "elmsAppend",
                    ].forEach(function (e) {
                      t["efc_dropShadow_" + e] = u[e];
                    }),
                      u.elmsAppend.forEach(function (e) {
                        r.appendChild(e);
                      }),
                      t.face.setAttribute("filter", "url(#" + s + ")"),
                      De(t, "new_edge4viewBox", te.dropShadow.adjustEdge),
                      te.dropShadow.update(t);
                  },
                  remove: function (e) {
                    var t = e.defs;
                    e.efc_dropShadow_elmsAppend &&
                      (e.efc_dropShadow_elmsAppend.forEach(function (e) {
                        t.removeChild(e);
                      }),
                      (e.efc_dropShadow_elmFilter =
                        e.efc_dropShadow_elmOffset =
                        e.efc_dropShadow_elmBlur =
                        e.efc_dropShadow_styleFlood =
                        e.efc_dropShadow_elmsAppend =
                          null)),
                      ze(e, "new_edge4viewBox", te.dropShadow.adjustEdge),
                      et(e, {}),
                      e.face.removeAttribute("filter"),
                      Xe(e.aplStats, te.dropShadow.stats);
                  },
                  update: function (e) {
                    var t,
                      n,
                      a = e.curStats,
                      i = e.aplStats,
                      o = i.dropShadow_options;
                    (a.dropShadow_dx = t = o.dx),
                      qe(e, i, "dropShadow_dx", t) &&
                        ((e.efc_dropShadow_elmOffset.dx.baseVal = t), (n = !0)),
                      (a.dropShadow_dy = t = o.dy),
                      qe(e, i, "dropShadow_dy", t) &&
                        ((e.efc_dropShadow_elmOffset.dy.baseVal = t), (n = !0)),
                      (a.dropShadow_blur = t = o.blur),
                      qe(e, i, "dropShadow_blur", t) &&
                        (e.efc_dropShadow_elmBlur.setStdDeviation(t, t),
                        (n = !0)),
                      n && et(e, {}),
                      (a.dropShadow_color = t = o.color),
                      qe(e, i, "dropShadow_color", t) &&
                        (e.efc_dropShadow_styleFlood.floodColor = t),
                      (a.dropShadow_opacity = t = o.opacity),
                      qe(e, i, "dropShadow_opacity", t) &&
                        (e.efc_dropShadow_styleFlood.floodOpacity = t);
                  },
                  adjustEdge: function (a, i) {
                    var e,
                      t,
                      o = a.curStats,
                      l = a.aplStats;
                    null != o.dropShadow_dx &&
                      ((e = 3 * o.dropShadow_blur),
                      (t = {
                        x1: i.x1 - e + o.dropShadow_dx,
                        y1: i.y1 - e + o.dropShadow_dy,
                        x2: i.x2 + e + o.dropShadow_dx,
                        y2: i.y2 + e + o.dropShadow_dy,
                      }).x1 < i.x1 && (i.x1 = t.x1),
                      t.y1 < i.y1 && (i.y1 = t.y1),
                      t.x2 > i.x2 && (i.x2 = t.x2),
                      t.y2 > i.y2 && (i.y2 = t.y2),
                      ["x", "y"].forEach(function (e) {
                        var t,
                          n = "dropShadow_" + e;
                        (o[n] = t = i[e + "1"]),
                          qe(a, l, n, t) &&
                            (a.efc_dropShadow_elmFilter[e].baseVal.value = t);
                      }));
                  },
                },
              }),
              Object.keys(te).forEach(function (e) {
                var t = te[e],
                  n = t.stats;
                (n[e + "_enabled"] = { iniValue: !1 }),
                  (n[e + "_options"] = { hasProps: !0 }),
                  t.anim &&
                    ((n[e + "_animOptions"] = {}), (n[e + "_animId"] = {}));
              }),
              (M = {
                none: {
                  defaultAnimOptions: {},
                  init: function (e, t) {
                    var n = e.curStats;
                    n.show_animId &&
                      (g.remove(n.show_animId), (n.show_animId = null)),
                      M.none.start(e, t);
                  },
                  start: function (e, t) {
                    M.none.stop(e, !0);
                  },
                  stop: function (e, t, n) {
                    var a = e.curStats;
                    return (
                      (n = null != n ? n : e.aplStats.show_on),
                      (a.show_inAnim = !1),
                      t && $e(e, n),
                      n ? 1 : 0
                    );
                  },
                },
                fade: {
                  defaultAnimOptions: { duration: 300, timing: "linear" },
                  init: function (n, e) {
                    var t = n.curStats,
                      a = n.aplStats;
                    t.show_animId && g.remove(t.show_animId),
                      (t.show_animId = g.add(
                        function (e) {
                          return e;
                        },
                        function (e, t) {
                          t
                            ? M.fade.stop(n, !0)
                            : ((n.svg.style.opacity = e + ""),
                              se && (He(n, n.svg), Ue(n)));
                        },
                        a.show_animOptions.duration,
                        1,
                        a.show_animOptions.timing,
                        null,
                        !1
                      )),
                      M.fade.start(n, e);
                  },
                  start: function (e, t) {
                    var n,
                      a = e.curStats;
                    a.show_inAnim && (n = g.stop(a.show_animId)),
                      $e(e, 1),
                      (a.show_inAnim = !0),
                      g.start(
                        a.show_animId,
                        !e.aplStats.show_on,
                        null != t ? t : n
                      );
                  },
                  stop: function (e, t, n) {
                    var a,
                      i = e.curStats;
                    return (
                      (n = null != n ? n : e.aplStats.show_on),
                      (a = i.show_inAnim ? g.stop(i.show_animId) : n ? 1 : 0),
                      (i.show_inAnim = !1),
                      t && ((e.svg.style.opacity = n ? "" : "0"), $e(e, n)),
                      a
                    );
                  },
                },
                draw: {
                  defaultAnimOptions: {
                    duration: 500,
                    timing: [0.58, 0, 0.42, 1],
                  },
                  init: function (n, e) {
                    var t = n.curStats,
                      a = n.aplStats,
                      l = n.pathList.baseVal,
                      i = Fe(l),
                      r = i.segsLen,
                      s = i.lenAll;
                    t.show_animId && g.remove(t.show_animId),
                      (t.show_animId = g.add(
                        function (e) {
                          var t,
                            n,
                            a,
                            i,
                            o = -1;
                          if (0 === e) n = [[l[0][0], l[0][0]]];
                          else if (1 === e) n = l;
                          else {
                            for (t = s * e, n = []; t >= r[++o]; )
                              n.push(l[o]), (t -= r[o]);
                            t &&
                              (2 === (a = l[o]).length
                                ? n.push([a[0], Pe(a[0], a[1], t / r[o])])
                                : ((i = Te(
                                    a[0],
                                    a[1],
                                    a[2],
                                    a[3],
                                    Be(a[0], a[1], a[2], a[3], t)
                                  )),
                                  n.push([a[0], i.fromP1, i.fromP2, i])));
                          }
                          return n;
                        },
                        function (e, t) {
                          t
                            ? M.draw.stop(n, !0)
                            : ((n.pathList.animVal = e), et(n, { path: !0 }));
                        },
                        a.show_animOptions.duration,
                        1,
                        a.show_animOptions.timing,
                        null,
                        !1
                      )),
                      M.draw.start(n, e);
                  },
                  start: function (e, t) {
                    var n,
                      a = e.curStats;
                    a.show_inAnim && (n = g.stop(a.show_animId)),
                      $e(e, 1),
                      (a.show_inAnim = !0),
                      De(e, "apl_position", M.draw.update),
                      g.start(
                        a.show_animId,
                        !e.aplStats.show_on,
                        null != t ? t : n
                      );
                  },
                  stop: function (e, t, n) {
                    var a,
                      i = e.curStats;
                    return (
                      (n = null != n ? n : e.aplStats.show_on),
                      (a = i.show_inAnim ? g.stop(i.show_animId) : n ? 1 : 0),
                      (i.show_inAnim = !1),
                      t &&
                        ((e.pathList.animVal = n
                          ? null
                          : [
                              [
                                e.pathList.baseVal[0][0],
                                e.pathList.baseVal[0][0],
                              ],
                            ]),
                        et(e, { path: !0 }),
                        $e(e, n)),
                      a
                    );
                  },
                  update: function (e) {
                    ze(e, "apl_position", M.draw.update),
                      e.curStats.show_inAnim
                        ? M.draw.init(e, M.draw.stop(e))
                        : (e.aplStats.show_animOptions = {});
                  },
                },
              }),
              [
                ["start", "anchorSE", 0],
                ["end", "anchorSE", 1],
                ["color", "lineColor"],
                ["size", "lineSize"],
                ["startSocketGravity", "socketGravitySE", 0],
                ["endSocketGravity", "socketGravitySE", 1],
                ["startPlugColor", "plugColorSE", 0],
                ["endPlugColor", "plugColorSE", 1],
                ["startPlugSize", "plugSizeSE", 0],
                ["endPlugSize", "plugSizeSE", 1],
                ["outline", "lineOutlineEnabled"],
                ["outlineColor", "lineOutlineColor"],
                ["outlineSize", "lineOutlineSize"],
                ["startPlugOutline", "plugOutlineEnabledSE", 0],
                ["endPlugOutline", "plugOutlineEnabledSE", 1],
                ["startPlugOutlineColor", "plugOutlineColorSE", 0],
                ["endPlugOutlineColor", "plugOutlineColorSE", 1],
                ["startPlugOutlineSize", "plugOutlineSizeSE", 0],
                ["endPlugOutlineSize", "plugOutlineSizeSE", 1],
              ].forEach(function (e) {
                var t = e[0],
                  n = e[1],
                  a = e[2];
                Object.defineProperty(lt.prototype, t, {
                  get: function () {
                    var e =
                      null != a
                        ? ge[this._id].options[n][a]
                        : n
                        ? ge[this._id].options[n]
                        : ge[this._id].options[t];
                    return null == e ? U : Oe(e);
                  },
                  set: rt(t),
                  enumerable: !0,
                });
              }),
              [
                ["path", z],
                ["startSocket", W, "socketSE", 0],
                ["endSocket", W, "socketSE", 1],
                ["startPlug", j, "plugSE", 0],
                ["endPlug", j, "plugSE", 1],
              ].forEach(function (e) {
                var a = e[0],
                  i = e[1],
                  o = e[2],
                  l = e[3];
                Object.defineProperty(lt.prototype, a, {
                  get: function () {
                    var t,
                      n =
                        null != l
                          ? ge[this._id].options[o][l]
                          : o
                          ? ge[this._id].options[o]
                          : ge[this._id].options[a];
                    return n
                      ? Object.keys(i).some(function (e) {
                          return i[e] === n && ((t = e), !0);
                        })
                        ? t
                        : new Error("It's broken")
                      : U;
                  },
                  set: rt(a),
                  enumerable: !0,
                });
              }),
              Object.keys(te).forEach(function (n) {
                var a = te[n];
                Object.defineProperty(lt.prototype, n, {
                  get: function () {
                    var u,
                      e,
                      t = ge[this._id].options[n];
                    return fe(t)
                      ? ((u = t),
                        (e = a.optionsConf.reduce(function (e, t) {
                          var n,
                            a = t[0],
                            i = t[1],
                            o = t[2],
                            l = t[3],
                            r = t[4],
                            s = null != r ? u[l][r] : l ? u[l] : u[i];
                          return (
                            (e[i] =
                              "id" === a
                                ? s
                                  ? Object.keys(o).some(function (e) {
                                      return o[e] === s && ((n = e), !0);
                                    })
                                    ? n
                                    : new Error("It's broken")
                                  : U
                                : null == s
                                ? U
                                : Oe(s)),
                            e
                          );
                        }, {})),
                        a.anim && (e.animation = Oe(u.animation)),
                        e)
                      : t;
                  },
                  set: rt(n),
                  enumerable: !0,
                });
              }),
              ["startLabel", "endLabel", "middleLabel"].forEach(function (e, n) {
                Object.defineProperty(lt.prototype, e, {
                  get: function () {
                    var e = ge[this._id],
                      t = e.options;
                    return t.labelSEM[n] && !e.optionIsAttach.labelSEM[n]
                      ? ve[t.labelSEM[n]._id].text
                      : t.labelSEM[n] || "";
                  },
                  set: rt(e),
                  enumerable: !0,
                });
              }),
              (lt.prototype.setOptions = function (e) {
                return ot(ge[this._id], e), this;
              }),
              (lt.prototype.position = function () {
                return et(ge[this._id], { position: !0 }), this;
              }),
              (lt.prototype.remove = function () {
                var t = ge[this._id],
                  n = t.curStats;
                Object.keys(te).forEach(function (e) {
                  var t = e + "_animId";
                  n[t] && g.remove(n[t]);
                }),
                  n.show_animId && g.remove(n.show_animId),
                  t.attachments.slice().forEach(function (e) {
                    it(t, e);
                  }),
                  t.baseWindow &&
                    t.svg &&
                    t.baseWindow.document.body.removeChild(t.svg),
                  delete ge[this._id];
              }),
              (lt.prototype.show = function (e, t) {
                return nt(ge[this._id], !0, e, t), this;
              }),
              (lt.prototype.hide = function (e, t) {
                return nt(ge[this._id], !1, e, t), this;
              }),
              (o = function (t) {
                t &&
                  ve[t._id] &&
                  (t.boundTargets.slice().forEach(function (e) {
                    it(e.props, t, !0);
                  }),
                  t.conf.remove && t.conf.remove(t),
                  delete ve[t._id]);
              }),
              (st.prototype.remove = function () {
                var t = this,
                  n = ve[t._id];
                n &&
                  (n.boundTargets.slice().forEach(function (e) {
                    n.conf.removeOption(n, e);
                  }),
                  je(function () {
                    var e = ve[t._id];
                    e &&
                      (console.error(
                        "LeaderLineAttachment was not removed by removeOption"
                      ),
                      o(e));
                  }));
              }),
              (C = st),
              (window.LeaderLineAttachment = C),
              (L = function (e, t) {
                return (
                  e instanceof C &&
                  (!(e.isRemoved || (t && ve[e._id].conf.type !== t)) || null)
                );
              }),
              (I = {
                pointAnchor: {
                  type: "anchor",
                  argOptions: [{ optionName: "element", type: Ie }],
                  init: function (e, t) {
                    return (
                      (e.element = I.pointAnchor.checkElement(t.element)),
                      (e.x = I.pointAnchor.parsePercent(t.x, !0) || [0.5, !0]),
                      (e.y = I.pointAnchor.parsePercent(t.y, !0) || [0.5, !0]),
                      !0
                    );
                  },
                  removeOption: function (e, t) {
                    var n = t.props,
                      a = {},
                      i = e.element,
                      o = n.options.anchorSE["start" === t.optionName ? 1 : 0];
                    i === o &&
                      (i =
                        o === document.body
                          ? new C(I.pointAnchor, [i])
                          : document.body),
                      (a[t.optionName] = i),
                      ot(n, a);
                  },
                  getBBoxNest: function (e, t) {
                    var n = Ae(e.element, t.baseWindow),
                      a = n.width,
                      i = n.height;
                    return (
                      (n.width = n.height = 0),
                      (n.left = n.right = n.left + e.x[0] * (e.x[1] ? a : 1)),
                      (n.top = n.bottom = n.top + e.y[0] * (e.y[1] ? i : 1)),
                      n
                    );
                  },
                  parsePercent: function (e, t) {
                    var n,
                      a,
                      i = !1;
                    return (
                      ye(e)
                        ? (a = e)
                        : "string" == typeof e &&
                          (n = m.exec(e)) &&
                          n[2] &&
                          (i = 0 !== (a = parseFloat(n[1]) / 100)),
                      null != a && (t || 0 <= a) ? [a, i] : null
                    );
                  },
                  checkElement: function (e) {
                    if (null == e) e = document.body;
                    else if (!Ie(e)) throw new Error("`element` must be Element");
                    return e;
                  },
                },
                areaAnchor: {
                  type: "anchor",
                  argOptions: [
                    { optionName: "element", type: Ie },
                    { optionName: "shape", type: "string" },
                  ],
                  stats: {
                    color: {},
                    strokeWidth: {},
                    elementWidth: {},
                    elementHeight: {},
                    elementLeft: {},
                    elementTop: {},
                    pathListRel: {},
                    bBoxRel: {},
                    pathData: {},
                    viewBoxBBox: { hasProps: !0 },
                    dashLen: {},
                    dashGap: {},
                  },
                  init: function (i, e) {
                    var t,
                      n,
                      a,
                      o = [];
                    return (
                      (i.element = I.pointAnchor.checkElement(e.element)),
                      "string" == typeof e.color && (i.color = e.color.trim()),
                      "string" == typeof e.fillColor &&
                        (i.fill = e.fillColor.trim()),
                      ye(e.size) && 0 <= e.size && (i.size = e.size),
                      e.dash &&
                        ((i.dash = !0),
                        ye(e.dash.len) &&
                          0 < e.dash.len &&
                          (i.dashLen = e.dash.len),
                        ye(e.dash.gap) &&
                          0 < e.dash.gap &&
                          (i.dashGap = e.dash.gap)),
                      "circle" === e.shape
                        ? (i.shape = e.shape)
                        : "polygon" === e.shape &&
                          Array.isArray(e.points) &&
                          3 <= e.points.length &&
                          e.points.every(function (e) {
                            var t = {};
                            return (
                              !(
                                !(t.x = I.pointAnchor.parsePercent(e[0], !0)) ||
                                !(t.y = I.pointAnchor.parsePercent(e[1], !0))
                              ) &&
                              (o.push(t),
                              (t.x[1] || t.y[1]) && (i.hasRatio = !0),
                              !0)
                            );
                          })
                        ? ((i.shape = e.shape), (i.points = o))
                        : ((i.shape = "rect"),
                          (i.radius =
                            ye(e.radius) && 0 <= e.radius ? e.radius : 0)),
                      ("rect" !== i.shape && "circle" !== i.shape) ||
                        ((i.x = I.pointAnchor.parsePercent(e.x, !0) || [
                          -0.05,
                          !0,
                        ]),
                        (i.y = I.pointAnchor.parsePercent(e.y, !0) || [
                          -0.05,
                          !0,
                        ]),
                        (i.width = I.pointAnchor.parsePercent(e.width) || [
                          1.1,
                          !0,
                        ]),
                        (i.height = I.pointAnchor.parsePercent(e.height) || [
                          1.1,
                          !0,
                        ]),
                        (i.x[1] || i.y[1] || i.width[1] || i.height[1]) &&
                          (i.hasRatio = !0)),
                      (t = i.element.ownerDocument),
                      (i.svg = n = t.createElementNS(re, "svg")),
                      (n.className.baseVal = A + "-areaAnchor"),
                      n.viewBox.baseVal || n.setAttribute("viewBox", "0 0 0 0"),
                      (i.path = n.appendChild(t.createElementNS(re, "path"))),
                      (i.path.style.fill = i.fill || "none"),
                      (i.isShown = !1),
                      (n.style.visibility = "hidden"),
                      t.body.appendChild(n),
                      Ke((a = t.defaultView)),
                      (i.bodyOffset = Qe(a)),
                      (i.updateColor = function () {
                        var e,
                          t = i.curStats,
                          n = i.aplStats,
                          a = i.boundTargets.length
                            ? i.boundTargets[0].props.curStats
                            : null;
                        (t.color = e =
                          i.color || (a ? a.line_color : de.lineColor)),
                          qe(i, n, "color", e) && (i.path.style.stroke = e);
                      }),
                      (i.updateShow = function () {
                        $e(
                          i,
                          i.boundTargets.some(function (e) {
                            return !0 === e.props.isShown;
                          })
                        );
                      }),
                      !0
                    );
                  },
                  bind: function (e, t) {
                    var n = t.props;
                    return (
                      e.color || De(n, "cur_line_color", e.updateColor),
                      De(n, "svgShow", e.updateShow),
                      je(function () {
                        e.updateColor(), e.updateShow();
                      }),
                      !0
                    );
                  },
                  unbind: function (e, t) {
                    var n = t.props;
                    e.color || ze(n, "cur_line_color", e.updateColor),
                      ze(n, "svgShow", e.updateShow),
                      1 < e.boundTargets.length &&
                        je(function () {
                          e.updateColor(),
                            e.updateShow(),
                            I.areaAnchor.update(e) &&
                              e.boundTargets.forEach(function (e) {
                                et(e.props, { position: !0 });
                              });
                        });
                  },
                  removeOption: function (e, t) {
                    I.pointAnchor.removeOption(e, t);
                  },
                  remove: function (t) {
                    t.boundTargets.length &&
                      (console.error(
                        "LeaderLineAttachment was not unbound by remove"
                      ),
                      t.boundTargets.forEach(function (e) {
                        I.areaAnchor.unbind(t, e);
                      })),
                      t.svg.parentNode.removeChild(t.svg);
                  },
                  getStrokeWidth: function (e, t) {
                    return (
                      I.areaAnchor.update(e) &&
                        1 < e.boundTargets.length &&
                        je(function () {
                          e.boundTargets.forEach(function (e) {
                            e.props !== t && et(e.props, { position: !0 });
                          });
                        }),
                      e.curStats.strokeWidth
                    );
                  },
                  getPathData: function (e, t) {
                    var n = Ae(e.element, t.baseWindow);
                    return Re(e.curStats.pathListRel, function (e) {
                      (e.x += n.left), (e.y += n.top);
                    });
                  },
                  getBBoxNest: function (e, t) {
                    var n = Ae(e.element, t.baseWindow),
                      a = e.curStats.bBoxRel;
                    return {
                      left: a.left + n.left,
                      top: a.top + n.top,
                      right: a.right + n.left,
                      bottom: a.bottom + n.top,
                      width: a.width,
                      height: a.height,
                    };
                  },
                  update: function (t) {
                    var a,
                      n,
                      i,
                      o,
                      e,
                      l,
                      r,
                      s,
                      u,
                      h,
                      p,
                      c,
                      d,
                      f,
                      y,
                      m,
                      S,
                      g,
                      _,
                      v,
                      E,
                      x,
                      b,
                      k,
                      w,
                      O,
                      M,
                      I,
                      C,
                      L,
                      A,
                      V,
                      P = t.curStats,
                      N = t.aplStats,
                      T = t.boundTargets.length
                        ? t.boundTargets[0].props.curStats
                        : null,
                      W = {};
                    if (
                      ((W.strokeWidth = qe(
                        t,
                        P,
                        "strokeWidth",
                        null != t.size
                          ? t.size
                          : T
                          ? T.line_strokeWidth
                          : de.lineSize
                      )),
                      (a = Ce(t.element)),
                      (W.elementWidth = qe(t, P, "elementWidth", a.width)),
                      (W.elementHeight = qe(t, P, "elementHeight", a.height)),
                      (W.elementLeft = qe(t, P, "elementLeft", a.left)),
                      (W.elementTop = qe(t, P, "elementTop", a.top)),
                      W.strokeWidth ||
                        (t.hasRatio && (W.elementWidth || W.elementHeight)))
                    ) {
                      switch (t.shape) {
                        case "rect":
                          ((I = {
                            left: t.x[0] * (t.x[1] ? a.width : 1),
                            top: t.y[0] * (t.y[1] ? a.height : 1),
                            width: t.width[0] * (t.width[1] ? a.width : 1),
                            height: t.height[0] * (t.height[1] ? a.height : 1),
                          }).right = I.left + I.width),
                            (I.bottom = I.top + I.height),
                            (b = P.strokeWidth / 2),
                            (E = (x = Math.min(I.width, I.height))
                              ? (x / 2) * Math.SQRT2 + b
                              : 0),
                            (O = (v = t.radius
                              ? t.radius <= E
                                ? t.radius
                                : E
                              : 0)
                              ? ((w = v - (k = (v - b) / Math.SQRT2)),
                                (M = v * ee),
                                (O = [
                                  { x: I.left - w, y: I.top + k },
                                  { x: I.left + k, y: I.top - w },
                                  { x: I.right - k, y: I.top - w },
                                  { x: I.right + w, y: I.top + k },
                                  { x: I.right + w, y: I.bottom - k },
                                  { x: I.right - k, y: I.bottom + w },
                                  { x: I.left + k, y: I.bottom + w },
                                  { x: I.left - w, y: I.bottom - k },
                                ]),
                                (P.pathListRel = [
                                  [
                                    O[0],
                                    { x: O[0].x, y: O[0].y - M },
                                    { x: O[1].x - M, y: O[1].y },
                                    O[1],
                                  ],
                                ]),
                                O[1].x !== O[2].x &&
                                  P.pathListRel.push([O[1], O[2]]),
                                P.pathListRel.push([
                                  O[2],
                                  { x: O[2].x + M, y: O[2].y },
                                  { x: O[3].x, y: O[3].y - M },
                                  O[3],
                                ]),
                                O[3].y !== O[4].y &&
                                  P.pathListRel.push([O[3], O[4]]),
                                P.pathListRel.push([
                                  O[4],
                                  { x: O[4].x, y: O[4].y + M },
                                  { x: O[5].x + M, y: O[5].y },
                                  O[5],
                                ]),
                                O[5].x !== O[6].x &&
                                  P.pathListRel.push([O[5], O[6]]),
                                P.pathListRel.push([
                                  O[6],
                                  { x: O[6].x - M, y: O[6].y },
                                  { x: O[7].x, y: O[7].y + M },
                                  O[7],
                                ]),
                                O[7].y !== O[0].y &&
                                  P.pathListRel.push([O[7], O[0]]),
                                P.pathListRel.push([]),
                                (w = v - k + P.strokeWidth / 2),
                                [
                                  { x: I.left - w, y: I.top - w },
                                  { x: I.right + w, y: I.bottom + w },
                                ])
                              : ((w = P.strokeWidth / 2),
                                (O = [
                                  { x: I.left - w, y: I.top - w },
                                  { x: I.right + w, y: I.bottom + w },
                                ]),
                                (P.pathListRel = [
                                  [O[0], { x: O[1].x, y: O[0].y }],
                                  [{ x: O[1].x, y: O[0].y }, O[1]],
                                  [O[1], { x: O[0].x, y: O[1].y }],
                                  [],
                                ]),
                                [
                                  {
                                    x: I.left - P.strokeWidth,
                                    y: I.top - P.strokeWidth,
                                  },
                                  {
                                    x: I.right + P.strokeWidth,
                                    y: I.bottom + P.strokeWidth,
                                  },
                                ])),
                            (P.bBoxRel = {
                              left: O[0].x,
                              top: O[0].y,
                              right: O[1].x,
                              bottom: O[1].y,
                              width: O[1].x - O[0].x,
                              height: O[1].y - O[0].y,
                            });
                          break;
                        case "circle":
                          (_ = {
                            left: t.x[0] * (t.x[1] ? a.width : 1),
                            top: t.y[0] * (t.y[1] ? a.height : 1),
                            width: t.width[0] * (t.width[1] ? a.width : 1),
                            height: t.height[0] * (t.height[1] ? a.height : 1),
                          }).width ||
                            _.height ||
                            (_.width = _.height = 10),
                            _.width || (_.width = _.height),
                            _.height || (_.height = _.width),
                            (_.right = _.left + _.width),
                            (_.bottom = _.top + _.height),
                            (r = _.left + _.width / 2),
                            (s = _.top + _.height / 2),
                            (d = P.strokeWidth / 2),
                            (f = _.width / 2),
                            (y = _.height / 2),
                            (u = f * Math.SQRT2 + d),
                            (h = y * Math.SQRT2 + d),
                            (p = u * ee),
                            (c = h * ee),
                            (g = [
                              { x: r - u, y: s },
                              { x: r, y: s - h },
                              { x: r + u, y: s },
                              { x: r, y: s + h },
                            ]),
                            (P.pathListRel = [
                              [
                                g[0],
                                { x: g[0].x, y: g[0].y - c },
                                { x: g[1].x - p, y: g[1].y },
                                g[1],
                              ],
                              [
                                g[1],
                                { x: g[1].x + p, y: g[1].y },
                                { x: g[2].x, y: g[2].y - c },
                                g[2],
                              ],
                              [
                                g[2],
                                { x: g[2].x, y: g[2].y + c },
                                { x: g[3].x + p, y: g[3].y },
                                g[3],
                              ],
                              [
                                g[3],
                                { x: g[3].x - p, y: g[3].y },
                                { x: g[0].x, y: g[0].y + c },
                                g[0],
                              ],
                              [],
                            ]),
                            (m = u - f + P.strokeWidth / 2),
                            (S = h - y + P.strokeWidth / 2),
                            (g = [
                              { x: _.left - m, y: _.top - S },
                              { x: _.right + m, y: _.bottom + S },
                            ]),
                            (P.bBoxRel = {
                              left: g[0].x,
                              top: g[0].y,
                              right: g[1].x,
                              bottom: g[1].y,
                              width: g[1].x - g[0].x,
                              height: g[1].y - g[0].y,
                            });
                          break;
                        case "polygon":
                          t.points.forEach(function (e) {
                            var t = e.x[0] * (e.x[1] ? a.width : 1),
                              n = e.y[0] * (e.y[1] ? a.height : 1);
                            i
                              ? (t < i.left && (i.left = t),
                                t > i.right && (i.right = t),
                                n < i.top && (i.top = n),
                                n > i.bottom && (i.bottom = n))
                              : (i = { left: t, right: t, top: n, bottom: n }),
                              o
                                ? P.pathListRel.push([o, { x: t, y: n }])
                                : (P.pathListRel = []),
                              (o = { x: t, y: n });
                          }),
                            P.pathListRel.push([]),
                            (e = P.strokeWidth / 2),
                            (l = [
                              { x: i.left - e, y: i.top - e },
                              { x: i.right + e, y: i.bottom + e },
                            ]),
                            (P.bBoxRel = {
                              left: l[0].x,
                              top: l[0].y,
                              right: l[1].x,
                              bottom: l[1].y,
                              width: l[1].x - l[0].x,
                              height: l[1].y - l[0].y,
                            });
                      }
                      W.pathListRel = W.bBoxRel = !0;
                    }
                    return (
                      (W.pathListRel || W.elementLeft || W.elementTop) &&
                        (P.pathData = Re(P.pathListRel, function (e) {
                          (e.x += a.left), (e.y += a.top);
                        })),
                      qe(t, N, "strokeWidth", (n = P.strokeWidth)) &&
                        (t.path.style.strokeWidth = n + "px"),
                      Ge((n = P.pathData), N.pathData) &&
                        (t.path.setPathData(n),
                        (N.pathData = n),
                        (W.pathData = !0)),
                      t.dash &&
                        ((!W.pathData &&
                          (!W.strokeWidth || (t.dashLen && t.dashGap))) ||
                          ((P.dashLen = t.dashLen || 2 * P.strokeWidth),
                          (P.dashGap = t.dashGap || P.strokeWidth)),
                        (W.dash = qe(t, N, "dashLen", P.dashLen) || W.dash),
                        (W.dash = qe(t, N, "dashGap", P.dashGap) || W.dash),
                        W.dash &&
                          (t.path.style.strokeDasharray =
                            N.dashLen + "," + N.dashGap)),
                      (C = P.viewBoxBBox),
                      (L = N.viewBoxBBox),
                      (A = t.svg.viewBox.baseVal),
                      (V = t.svg.style),
                      (C.x = P.bBoxRel.left + a.left),
                      (C.y = P.bBoxRel.top + a.top),
                      (C.width = P.bBoxRel.width),
                      (C.height = P.bBoxRel.height),
                      ["x", "y", "width", "height"].forEach(function (e) {
                        (n = C[e]) !== L[e] &&
                          ((A[e] = L[e] = n),
                          (V[oe[e]] =
                            n +
                            ("x" === e || "y" === e ? t.bodyOffset[e] : 0) +
                            "px"));
                      }),
                      W.strokeWidth || W.pathListRel || W.bBoxRel
                    );
                  },
                },
                mouseHoverAnchor: {
                  type: "anchor",
                  argOptions: [
                    { optionName: "element", type: Ie },
                    { optionName: "showEffectName", type: "string" },
                  ],
                  style: {
                    backgroundImage:
                      "url('data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cG9seWdvbiBwb2ludHM9IjI0LDAgMCw4IDgsMTEgMCwxOSA1LDI0IDEzLDE2IDE2LDI0IiBmaWxsPSJjb3JhbCIvPjwvc3ZnPg==')",
                    backgroundSize: "",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "#f8f881",
                    cursor: "default",
                  },
                  hoverStyle: {
                    backgroundImage: "none",
                    backgroundColor: "#fadf8f",
                  },
                  padding: { top: 1, right: 15, bottom: 1, left: 2 },
                  minHeight: 15,
                  backgroundPosition: { right: 2, top: 2 },
                  backgroundSize: { width: 12, height: 12 },
                  dirKeys: [
                    ["top", "Top"],
                    ["right", "Right"],
                    ["bottom", "Bottom"],
                    ["left", "Left"],
                  ],
                  init: function (a, i) {
                    var o,
                      t,
                      e,
                      n,
                      l,
                      r,
                      s,
                      u,
                      h,
                      p,
                      c,
                      d = I.mouseHoverAnchor,
                      f = {};
                    if (
                      ((a.element = I.pointAnchor.checkElement(i.element)),
                      (u = a.element),
                      !(
                        (p = u.ownerDocument) &&
                        (h = p.defaultView) &&
                        h.HTMLElement &&
                        u instanceof h.HTMLElement
                      ))
                    )
                      throw new Error("`element` must be HTML element");
                    return (
                      (d.style.backgroundSize =
                        d.backgroundSize.width +
                        "px " +
                        d.backgroundSize.height +
                        "px"),
                      ["style", "hoverStyle"].forEach(function (e) {
                        var n = d[e];
                        a[e] = Object.keys(n).reduce(function (e, t) {
                          return (e[t] = n[t]), e;
                        }, {});
                      }),
                      "inline" ===
                      (o = a.element.ownerDocument.defaultView.getComputedStyle(
                        a.element,
                        ""
                      )).display
                        ? (a.style.display = "inline-block")
                        : "none" === o.display && (a.style.display = "block"),
                      I.mouseHoverAnchor.dirKeys.forEach(function (e) {
                        var t = e[0],
                          n = "padding" + e[1];
                        parseFloat(o[n]) < d.padding[t] &&
                          (a.style[n] = d.padding[t] + "px");
                      }),
                      a.style.display &&
                        ((n = a.element.style.display),
                        (a.element.style.display = a.style.display)),
                      I.mouseHoverAnchor.dirKeys.forEach(function (e) {
                        var t = "padding" + e[1];
                        a.style[t] &&
                          ((f[t] = a.element.style[t]),
                          (a.element.style[t] = a.style[t]));
                      }),
                      (e = a.element.getBoundingClientRect()).height <
                        d.minHeight &&
                        (se
                          ? ((c = d.minHeight),
                            "content-box" === o.boxSizing
                              ? (c -=
                                  parseFloat(o.borderTopWidth) +
                                  parseFloat(o.borderBottomWidth) +
                                  parseFloat(o.paddingTop) +
                                  parseFloat(o.paddingBottom))
                              : "padding-box" === o.boxSizing &&
                                (c -=
                                  parseFloat(o.borderTopWidth) +
                                  parseFloat(o.borderBottomWidth)),
                            (a.style.height = c + "px"))
                          : (a.style.height =
                              parseFloat(o.height) +
                              (d.minHeight - e.height) +
                              "px")),
                      (a.style.backgroundPosition = pe
                        ? e.width -
                          d.backgroundSize.width -
                          d.backgroundPosition.right +
                          "px " +
                          d.backgroundPosition.top +
                          "px"
                        : "right " +
                          d.backgroundPosition.right +
                          "px top " +
                          d.backgroundPosition.top +
                          "px"),
                      a.style.display && (a.element.style.display = n),
                      I.mouseHoverAnchor.dirKeys.forEach(function (e) {
                        var t = "padding" + e[1];
                        a.style[t] && (a.element.style[t] = f[t]);
                      }),
                      ["style", "hoverStyle"].forEach(function (e) {
                        var t = a[e],
                          n = i[e];
                        fe(n) &&
                          Object.keys(n).forEach(function (e) {
                            "string" == typeof n[e] || ye(n[e])
                              ? (t[e] = n[e])
                              : null == n[e] && delete t[e];
                          });
                      }),
                      "function" == typeof i.onSwitch && (s = i.onSwitch),
                      i.showEffectName &&
                        M[i.showEffectName] &&
                        (a.showEffectName = l = i.showEffectName),
                      (r = i.animOptions),
                      (a.elmStyle = t = a.element.style),
                      (a.mouseenter = function (e) {
                        (a.hoverStyleSave = d.getStyles(
                          t,
                          Object.keys(a.hoverStyle)
                        )),
                          d.setStyles(t, a.hoverStyle),
                          a.boundTargets.forEach(function (e) {
                            nt(e.props, !0, l, r);
                          }),
                          s && s(e);
                      }),
                      (a.mouseleave = function (e) {
                        d.setStyles(t, a.hoverStyleSave),
                          a.boundTargets.forEach(function (e) {
                            nt(e.props, !1, l, r);
                          }),
                          s && s(e);
                      }),
                      !0
                    );
                  },
                  bind: function (e, t) {
                    var n, a, i, o, l;
                    return (
                      t.props.svg
                        ? I.mouseHoverAnchor.llShow(t.props, !1, e.showEffectName)
                        : je(function () {
                            I.mouseHoverAnchor.llShow(
                              t.props,
                              !1,
                              e.showEffectName
                            );
                          }),
                      e.enabled ||
                        ((e.styleSave = I.mouseHoverAnchor.getStyles(
                          e.elmStyle,
                          Object.keys(e.style)
                        )),
                        I.mouseHoverAnchor.setStyles(e.elmStyle, e.style),
                        (e.removeEventListener =
                          ((n = e.element),
                          (a = e.mouseenter),
                          (i = e.mouseleave),
                          "onmouseenter" in n && "onmouseleave" in n
                            ? (n.addEventListener("mouseenter", a, !1),
                              n.addEventListener("mouseleave", i, !1),
                              function () {
                                n.removeEventListener("mouseenter", a, !1),
                                  n.removeEventListener("mouseleave", i, !1);
                              })
                            : (console.warn(
                                "mouseenter and mouseleave events polyfill is enabled."
                              ),
                              (o = function (e) {
                                (e.relatedTarget &&
                                  (e.relatedTarget === this ||
                                    this.compareDocumentPosition(
                                      e.relatedTarget
                                    ) & Node.DOCUMENT_POSITION_CONTAINED_BY)) ||
                                  a.apply(this, arguments);
                              }),
                              n.addEventListener("mouseover", o),
                              (l = function (e) {
                                (e.relatedTarget &&
                                  (e.relatedTarget === this ||
                                    this.compareDocumentPosition(
                                      e.relatedTarget
                                    ) & Node.DOCUMENT_POSITION_CONTAINED_BY)) ||
                                  i.apply(this, arguments);
                              }),
                              n.addEventListener("mouseout", l),
                              function () {
                                n.removeEventListener("mouseover", o, !1),
                                  n.removeEventListener("mouseout", l, !1);
                              }))),
                        (e.enabled = !0)),
                      !0
                    );
                  },
                  unbind: function (e, t) {
                    e.enabled &&
                      e.boundTargets.length <= 1 &&
                      (e.removeEventListener(),
                      I.mouseHoverAnchor.setStyles(e.elmStyle, e.styleSave),
                      (e.enabled = !1)),
                      I.mouseHoverAnchor.llShow(t.props, !0, e.showEffectName);
                  },
                  removeOption: function (e, t) {
                    I.pointAnchor.removeOption(e, t);
                  },
                  remove: function (t) {
                    t.boundTargets.length &&
                      (console.error(
                        "LeaderLineAttachment was not unbound by remove"
                      ),
                      t.boundTargets.forEach(function (e) {
                        I.mouseHoverAnchor.unbind(t, e);
                      }));
                  },
                  getBBoxNest: function (e, t) {
                    return Ae(e.element, t.baseWindow);
                  },
                  llShow: function (e, t, n) {
                    M[n || e.curStats.show_effect].stop(e, !0, t),
                      (e.aplStats.show_on = t);
                  },
                  getStyles: function (n, e) {
                    return e.reduce(function (e, t) {
                      return (e[t] = n[t]), e;
                    }, {});
                  },
                  setStyles: function (t, n) {
                    Object.keys(n).forEach(function (e) {
                      t[e] = n[e];
                    });
                  },
                },
                captionLabel: {
                  type: "label",
                  argOptions: [{ optionName: "text", type: "string" }],
                  stats: { color: {}, x: {}, y: {} },
                  textStyleProps: [
                    "fontFamily",
                    "fontStyle",
                    "fontVariant",
                    "fontWeight",
                    "fontStretch",
                    "fontSize",
                    "fontSizeAdjust",
                    "kerning",
                    "letterSpacing",
                    "wordSpacing",
                    "textDecoration",
                  ],
                  init: function (u, t) {
                    return (
                      "string" == typeof t.text && (u.text = t.text.trim()),
                      !!u.text &&
                        ("string" == typeof t.color && (u.color = t.color.trim()),
                        (u.outlineColor =
                          "string" == typeof t.outlineColor
                            ? t.outlineColor.trim()
                            : "#fff"),
                        Array.isArray(t.offset) &&
                          ye(t.offset[0]) &&
                          ye(t.offset[1]) &&
                          (u.offset = { x: t.offset[0], y: t.offset[1] }),
                        ye(t.lineOffset) && (u.lineOffset = t.lineOffset),
                        I.captionLabel.textStyleProps.forEach(function (e) {
                          null != t[e] && (u[e] = t[e]);
                        }),
                        (u.updateColor = function (e) {
                          I.captionLabel.updateColor(u, e);
                        }),
                        (u.updateSocketXY = function (e) {
                          var t,
                            n,
                            a,
                            i,
                            o = u.curStats,
                            l = u.aplStats,
                            r = e.curStats,
                            s = r.position_socketXYSE[u.socketIndex];
                          null != s.x &&
                            (u.offset
                              ? ((o.x = s.x + u.offset.x),
                                (o.y = s.y + u.offset.y))
                              : ((t = u.height / 2),
                                (n = Math.max(
                                  r.attach_plugSideLenSE[u.socketIndex] || 0,
                                  r.line_strokeWidth / 2
                                )),
                                (a =
                                  r.position_socketXYSE[u.socketIndex ? 0 : 1]),
                                s.socketId === T || s.socketId === P
                                  ? ((o.x =
                                      s.socketId === T
                                        ? s.x - t - u.width
                                        : s.x + t),
                                    (o.y =
                                      a.y < s.y
                                        ? s.y + n + t
                                        : s.y - n - t - u.height))
                                  : ((o.x =
                                      a.x < s.x
                                        ? s.x + n + t
                                        : s.x - n - t - u.width),
                                    (o.y =
                                      s.socketId === V
                                        ? s.y - t - u.height
                                        : s.y + t))),
                            qe(u, l, "x", (i = o.x)) &&
                              (u.elmPosition.x.baseVal.getItem(0).value = i),
                            qe(u, l, "y", (i = o.y)) &&
                              (u.elmPosition.y.baseVal.getItem(0).value =
                                i + u.height));
                        }),
                        (u.updatePath = function (e) {
                          var t,
                            n,
                            a = u.curStats,
                            i = u.aplStats,
                            o = e.pathList.animVal || e.pathList.baseVal;
                          o &&
                            ((t = I.captionLabel.getMidPoint(o, u.lineOffset)),
                            (a.x = t.x - u.width / 2),
                            (a.y = t.y - u.height / 2),
                            qe(u, i, "x", (n = a.x)) &&
                              (u.elmPosition.x.baseVal.getItem(0).value = n),
                            qe(u, i, "y", (n = a.y)) &&
                              (u.elmPosition.y.baseVal.getItem(0).value =
                                n + u.height));
                        }),
                        (u.updateShow = function (e) {
                          I.captionLabel.updateShow(u, e);
                        }),
                        pe &&
                          (u.adjustEdge = function (e, t) {
                            var n = u.curStats;
                            null != n.x &&
                              I.captionLabel.adjustEdge(
                                t,
                                {
                                  x: n.x,
                                  y: n.y,
                                  width: u.width,
                                  height: u.height,
                                },
                                u.strokeWidth / 2
                              );
                          }),
                        !0)
                    );
                  },
                  updateColor: function (e, t) {
                    var n,
                      a = e.curStats,
                      i = e.aplStats,
                      o = t.curStats;
                    (a.color = n = e.color || o.line_color),
                      qe(e, i, "color", n) && (e.styleFill.fill = n);
                  },
                  updateShow: function (e, t) {
                    var n = !0 === t.isShown;
                    n !== e.isShown &&
                      ((e.styleShow.visibility = n ? "" : "hidden"),
                      (e.isShown = n));
                  },
                  adjustEdge: function (e, t, n) {
                    var a = {
                      x1: t.x - n,
                      y1: t.y - n,
                      x2: t.x + t.width + n,
                      y2: t.y + t.height + n,
                    };
                    a.x1 < e.x1 && (e.x1 = a.x1),
                      a.y1 < e.y1 && (e.y1 = a.y1),
                      a.x2 > e.x2 && (e.x2 = a.x2),
                      a.y2 > e.y2 && (e.y2 = a.y2);
                  },
                  newText: function (e, t, n, a, i) {
                    var o,
                      l,
                      r,
                      s,
                      u,
                      h = t.createElementNS(re, "text");
                    return (
                      (h.textContent = e),
                      [h.x, h.y].forEach(function (e) {
                        var t = n.createSVGLength();
                        t.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0),
                          e.baseVal.initialize(t);
                      }),
                      "boolean" != typeof f && (f = "paintOrder" in h.style),
                      i && !f
                        ? ((l = t.createElementNS(re, "defs")),
                          (h.id = a),
                          l.appendChild(h),
                          ((s = (o = t.createElementNS(re, "g")).appendChild(
                            t.createElementNS(re, "use")
                          )).href.baseVal = "#" + a),
                          ((r = o.appendChild(
                            t.createElementNS(re, "use")
                          )).href.baseVal = "#" + a),
                          ((u = s.style).strokeLinejoin = "round"),
                          {
                            elmPosition: h,
                            styleText: h.style,
                            styleFill: r.style,
                            styleStroke: u,
                            styleShow: o.style,
                            elmsAppend: [l, o],
                          })
                        : ((u = h.style),
                          i &&
                            ((u.strokeLinejoin = "round"),
                            (u.paintOrder = "stroke")),
                          {
                            elmPosition: h,
                            styleText: u,
                            styleFill: u,
                            styleStroke: i ? u : null,
                            styleShow: u,
                            elmsAppend: [h],
                          })
                    );
                  },
                  getMidPoint: function (e, t) {
                    var n,
                      a,
                      i = Fe(e),
                      o = i.segsLen,
                      l = i.lenAll,
                      r = -1,
                      s = l / 2 + (t || 0);
                    if (s <= 0)
                      return 2 === (n = e[0]).length
                        ? Pe(n[0], n[1], 0)
                        : Te(n[0], n[1], n[2], n[3], 0);
                    if (l <= s)
                      return 2 === (n = e[e.length - 1]).length
                        ? Pe(n[0], n[1], 1)
                        : Te(n[0], n[1], n[2], n[3], 1);
                    for (a = []; s > o[++r]; ) a.push(e[r]), (s -= o[r]);
                    return 2 === (n = e[r]).length
                      ? Pe(n[0], n[1], s / o[r])
                      : Te(n[0], n[1], n[2], n[3], Be(n[0], n[1], n[2], n[3], s));
                  },
                  initSvg: function (t, n) {
                    var e,
                      a,
                      i = I.captionLabel.newText(
                        t.text,
                        n.baseWindow.document,
                        n.svg,
                        A + "-captionLabel-" + t._id,
                        t.outlineColor
                      );
                    [
                      "elmPosition",
                      "styleFill",
                      "styleShow",
                      "elmsAppend",
                    ].forEach(function (e) {
                      t[e] = i[e];
                    }),
                      (t.isShown = !1),
                      (t.styleShow.visibility = "hidden"),
                      I.captionLabel.textStyleProps.forEach(function (e) {
                        null != t[e] && (i.styleText[e] = t[e]);
                      }),
                      i.elmsAppend.forEach(function (e) {
                        n.svg.appendChild(e);
                      }),
                      (e = i.elmPosition.getBBox()),
                      (t.width = e.width),
                      (t.height = e.height),
                      t.outlineColor &&
                        ((a = 10 < (a = e.height / 9) ? 10 : a < 2 ? 2 : a),
                        (i.styleStroke.strokeWidth = a + "px"),
                        (i.styleStroke.stroke = t.outlineColor)),
                      (t.strokeWidth = a || 0),
                      Xe(t.aplStats, I.captionLabel.stats),
                      t.updateColor(n),
                      t.refSocketXY ? t.updateSocketXY(n) : t.updatePath(n),
                      pe && et(n, {}),
                      t.updateShow(n);
                  },
                  bind: function (e, t) {
                    var n = t.props;
                    return (
                      e.color || De(n, "cur_line_color", e.updateColor),
                      (e.refSocketXY =
                        "startLabel" === t.optionName ||
                        "endLabel" === t.optionName)
                        ? ((e.socketIndex =
                            "startLabel" === t.optionName ? 0 : 1),
                          De(n, "apl_position", e.updateSocketXY),
                          e.offset ||
                            (De(n, "cur_attach_plugSideLenSE", e.updateSocketXY),
                            De(n, "cur_line_strokeWidth", e.updateSocketXY)))
                        : De(n, "apl_path", e.updatePath),
                      De(n, "svgShow", e.updateShow),
                      pe && De(n, "new_edge4viewBox", e.adjustEdge),
                      I.captionLabel.initSvg(e, n),
                      !0
                    );
                  },
                  unbind: function (e, t) {
                    var n = t.props;
                    e.elmsAppend &&
                      (e.elmsAppend.forEach(function (e) {
                        n.svg.removeChild(e);
                      }),
                      (e.elmPosition =
                        e.styleFill =
                        e.styleShow =
                        e.elmsAppend =
                          null)),
                      Xe(e.curStats, I.captionLabel.stats),
                      Xe(e.aplStats, I.captionLabel.stats),
                      e.color || ze(n, "cur_line_color", e.updateColor),
                      e.refSocketXY
                        ? (ze(n, "apl_position", e.updateSocketXY),
                          e.offset ||
                            (ze(n, "cur_attach_plugSideLenSE", e.updateSocketXY),
                            ze(n, "cur_line_strokeWidth", e.updateSocketXY)))
                        : ze(n, "apl_path", e.updatePath),
                      ze(n, "svgShow", e.updateShow),
                      pe && (ze(n, "new_edge4viewBox", e.adjustEdge), et(n, {}));
                  },
                  removeOption: function (e, t) {
                    var n = t.props,
                      a = {};
                    (a[t.optionName] = ""), ot(n, a);
                  },
                  remove: function (t) {
                    t.boundTargets.length &&
                      (console.error(
                        "LeaderLineAttachment was not unbound by remove"
                      ),
                      t.boundTargets.forEach(function (e) {
                        I.captionLabel.unbind(t, e);
                      }));
                  },
                },
                pathLabel: {
                  type: "label",
                  argOptions: [{ optionName: "text", type: "string" }],
                  stats: { color: {}, startOffset: {}, pathData: {} },
                  init: function (s, t) {
                    return (
                      "string" == typeof t.text && (s.text = t.text.trim()),
                      !!s.text &&
                        ("string" == typeof t.color && (s.color = t.color.trim()),
                        (s.outlineColor =
                          "string" == typeof t.outlineColor
                            ? t.outlineColor.trim()
                            : "#fff"),
                        ye(t.lineOffset) && (s.lineOffset = t.lineOffset),
                        I.captionLabel.textStyleProps.forEach(function (e) {
                          null != t[e] && (s[e] = t[e]);
                        }),
                        (s.updateColor = function (e) {
                          I.captionLabel.updateColor(s, e);
                        }),
                        (s.updatePath = function (e) {
                          var t,
                            n = s.curStats,
                            a = s.aplStats,
                            i = e.curStats,
                            o = e.pathList.animVal || e.pathList.baseVal;
                          o &&
                            ((n.pathData = t =
                              I.pathLabel.getOffsetPathData(
                                o,
                                i.line_strokeWidth / 2 +
                                  s.strokeWidth / 2 +
                                  s.height / 4,
                                1.25 * s.height
                              )),
                            Ge(t, a.pathData) &&
                              (s.elmPath.setPathData(t),
                              (a.pathData = t),
                              (s.bBox = s.elmPosition.getBBox()),
                              s.updateStartOffset(e)));
                        }),
                        (s.updateStartOffset = function (e) {
                          var t,
                            i,
                            n,
                            a,
                            o = s.curStats,
                            l = s.aplStats,
                            r = e.curStats;
                          o.pathData &&
                            ((2 === s.semIndex && !s.lineOffset) ||
                              ((n = o.pathData.reduce(function (e, t) {
                                var n,
                                  a = t.values;
                                switch (t.type) {
                                  case "M":
                                    i = { x: a[0], y: a[1] };
                                    break;
                                  case "L":
                                    (n = { x: a[0], y: a[1] }),
                                      i && (e += Ve(i, n)),
                                      (i = n);
                                    break;
                                  case "C":
                                    (n = { x: a[4], y: a[5] }),
                                      i &&
                                        (e += We(
                                          i,
                                          { x: a[0], y: a[1] },
                                          { x: a[2], y: a[3] },
                                          n
                                        )),
                                      (i = n);
                                }
                                return e;
                              }, 0)),
                              (a =
                                0 === s.semIndex
                                  ? 0
                                  : 1 === s.semIndex
                                  ? n
                                  : n / 2),
                              2 !== s.semIndex &&
                                ((t =
                                  Math.max(
                                    r.attach_plugBackLenSE[s.semIndex] || 0,
                                    r.line_strokeWidth / 2
                                  ) +
                                  s.strokeWidth / 2 +
                                  s.height / 4),
                                (a =
                                  (a += 0 === s.semIndex ? t : -t) < 0
                                    ? 0
                                    : n < a
                                    ? n
                                    : a)),
                              s.lineOffset &&
                                (a = (a += s.lineOffset) < 0 ? 0 : n < a ? n : a),
                              (o.startOffset = a),
                              qe(s, l, "startOffset", a) &&
                                (s.elmOffset.startOffset.baseVal.value = a)));
                        }),
                        (s.updateShow = function (e) {
                          I.captionLabel.updateShow(s, e);
                        }),
                        pe &&
                          (s.adjustEdge = function (e, t) {
                            s.bBox &&
                              I.captionLabel.adjustEdge(
                                t,
                                s.bBox,
                                s.strokeWidth / 2
                              );
                          }),
                        !0)
                    );
                  },
                  getOffsetPathData: function (e, x, n) {
                    var b,
                      a,
                      k = [];
                    function w(e, t) {
                      return Math.abs(e.x - t.x) < 3 && Math.abs(e.y - t.y) < 3;
                    }
                    return (
                      e.forEach(function (e) {
                        var t,
                          n,
                          a,
                          i,
                          o,
                          l,
                          r,
                          s,
                          u,
                          h,
                          p,
                          c,
                          d,
                          f,
                          y,
                          m,
                          S,
                          g,
                          _,
                          v,
                          E;
                        2 === e.length
                          ? ((g = e[0]),
                            (_ = e[1]),
                            (v = x),
                            (E =
                              Math.atan2(g.y - _.y, _.x - g.x) + 0.5 * Math.PI),
                            (t = [
                              {
                                x: g.x + Math.cos(E) * v,
                                y: g.y + Math.sin(E) * v * -1,
                              },
                              {
                                x: _.x + Math.cos(E) * v,
                                y: _.y + Math.sin(E) * v * -1,
                              },
                            ]),
                            b
                              ? ((a = b.points),
                                0 <=
                                  (i =
                                    Math.atan2(a[1].y - a[0].y, a[0].x - a[1].x) -
                                    Math.atan2(
                                      e[0].y - e[1].y,
                                      e[1].x - e[0].x
                                    )) && i <= Math.PI
                                  ? (n = { type: "line", points: t, inside: !0 })
                                  : ((l = Ne(a[0], a[1], x)),
                                    (o = Ne(t[1], t[0], x)),
                                    (s = a[0]),
                                    (h = o),
                                    (p = t[1]),
                                    (c = (u = l).x - s.x),
                                    (d = u.y - s.y),
                                    (f = p.x - h.x),
                                    (y = p.y - h.y),
                                    (m =
                                      (-d * (s.x - h.x) + c * (s.y - h.y)) /
                                      (-f * d + c * y)),
                                    (S =
                                      (f * (s.y - h.y) - y * (s.x - h.x)) /
                                      (-f * d + c * y)),
                                    (n = (r =
                                      0 <= m && m <= 1 && 0 <= S && S <= 1
                                        ? { x: s.x + S * c, y: s.y + S * d }
                                        : null)
                                      ? {
                                          type: "line",
                                          points: [(a[1] = r), t[1]],
                                        }
                                      : ((a[1] = w(o, l) ? o : l),
                                        { type: "line", points: [o, t[1]] })),
                                    (b.len = Ve(a[0], a[1]))))
                              : (n = { type: "line", points: t }),
                            (n.len = Ve(n.points[0], n.points[1])),
                            k.push((b = n)))
                          : (k.push({
                              type: "cubic",
                              points: (function (e, t, n, a, i, o) {
                                for (
                                  var l,
                                    r,
                                    s = We(e, t, n, a) / o,
                                    u = 1 / (o < i ? (i / o) * s : s),
                                    h = [],
                                    p = 0;
                                  (r =
                                    (90 - (l = Te(e, t, n, a, p)).angle) *
                                    (Math.PI / 180)),
                                    h.push({
                                      x: l.x + Math.cos(r) * i,
                                      y: l.y + Math.sin(r) * i * -1,
                                    }),
                                    !(1 <= p);
  
                                )
                                  1 < (p += u) && (p = 1);
                                return h;
                              })(e[0], e[1], e[2], e[3], x, 16),
                            }),
                            (b = null));
                      }),
                      (b = null),
                      k.forEach(function (e) {
                        var t;
                        b =
                          "line" === e.type
                            ? (e.inside &&
                                (b.len > x
                                  ? (((t = b.points)[1] = Ne(t[0], t[1], -x)),
                                    (b.len = Ve(t[0], t[1])))
                                  : ((b.points = null), (b.len = 0)),
                                e.len > x + n
                                  ? (((t = e.points)[0] = Ne(
                                      t[1],
                                      t[0],
                                      -(x + n)
                                    )),
                                    (e.len = Ve(t[0], t[1])))
                                  : ((e.points = null), (e.len = 0))),
                              e)
                            : null;
                      }),
                      k.reduce(function (t, e) {
                        var n = e.points;
                        return (
                          n &&
                            ((a && w(n[0], a)) ||
                              t.push({ type: "M", values: [n[0].x, n[0].y] }),
                            "line" === e.type
                              ? t.push({ type: "L", values: [n[1].x, n[1].y] })
                              : (n.shift(),
                                n.forEach(function (e) {
                                  t.push({ type: "L", values: [e.x, e.y] });
                                })),
                            (a = n[n.length - 1])),
                          t
                        );
                      }, [])
                    );
                  },
                  newText: function (e, t, n, a) {
                    var i,
                      o,
                      l,
                      r,
                      s,
                      u,
                      h,
                      p,
                      c = t.createElementNS(re, "defs"),
                      d = c.appendChild(t.createElementNS(re, "path"));
                    return (
                      (d.id = i = n + "-path"),
                      ((r = (l = t.createElementNS(re, "text")).appendChild(
                        t.createElementNS(re, "textPath")
                      )).href.baseVal = "#" + i),
                      r.startOffset.baseVal.newValueSpecifiedUnits(
                        SVGLength.SVG_LENGTHTYPE_PX,
                        0
                      ),
                      (r.textContent = e),
                      "boolean" != typeof f && (f = "paintOrder" in l.style),
                      a && !f
                        ? ((l.id = o = n + "-text"),
                          c.appendChild(l),
                          ((h = (s = t.createElementNS(re, "g")).appendChild(
                            t.createElementNS(re, "use")
                          )).href.baseVal = "#" + o),
                          ((u = s.appendChild(
                            t.createElementNS(re, "use")
                          )).href.baseVal = "#" + o),
                          ((p = h.style).strokeLinejoin = "round"),
                          {
                            elmPosition: l,
                            elmPath: d,
                            elmOffset: r,
                            styleText: l.style,
                            styleFill: u.style,
                            styleStroke: p,
                            styleShow: s.style,
                            elmsAppend: [c, s],
                          })
                        : ((p = l.style),
                          a &&
                            ((p.strokeLinejoin = "round"),
                            (p.paintOrder = "stroke")),
                          {
                            elmPosition: l,
                            elmPath: d,
                            elmOffset: r,
                            styleText: p,
                            styleFill: p,
                            styleStroke: a ? p : null,
                            styleShow: p,
                            elmsAppend: [c, l],
                          })
                    );
                  },
                  initSvg: function (t, n) {
                    var e,
                      a,
                      i = I.pathLabel.newText(
                        t.text,
                        n.baseWindow.document,
                        A + "-pathLabel-" + t._id,
                        t.outlineColor
                      );
                    [
                      "elmPosition",
                      "elmPath",
                      "elmOffset",
                      "styleFill",
                      "styleShow",
                      "elmsAppend",
                    ].forEach(function (e) {
                      t[e] = i[e];
                    }),
                      (t.isShown = !1),
                      (t.styleShow.visibility = "hidden"),
                      I.captionLabel.textStyleProps.forEach(function (e) {
                        null != t[e] && (i.styleText[e] = t[e]);
                      }),
                      i.elmsAppend.forEach(function (e) {
                        n.svg.appendChild(e);
                      }),
                      i.elmPath.setPathData([
                        { type: "M", values: [0, 100] },
                        { type: "h", values: [100] },
                      ]),
                      (e = i.elmPosition.getBBox()),
                      (i.styleText.textAnchor = ["start", "end", "middle"][
                        t.semIndex
                      ]),
                      2 !== t.semIndex ||
                        t.lineOffset ||
                        i.elmOffset.startOffset.baseVal.newValueSpecifiedUnits(
                          SVGLength.SVG_LENGTHTYPE_PERCENTAGE,
                          50
                        ),
                      (t.height = e.height),
                      t.outlineColor &&
                        ((a = 10 < (a = e.height / 9) ? 10 : a < 2 ? 2 : a),
                        (i.styleStroke.strokeWidth = a + "px"),
                        (i.styleStroke.stroke = t.outlineColor)),
                      (t.strokeWidth = a || 0),
                      Xe(t.aplStats, I.pathLabel.stats),
                      t.updateColor(n),
                      t.updatePath(n),
                      t.updateStartOffset(n),
                      pe && et(n, {}),
                      t.updateShow(n);
                  },
                  bind: function (e, t) {
                    var n = t.props;
                    return (
                      e.color || De(n, "cur_line_color", e.updateColor),
                      De(n, "cur_line_strokeWidth", e.updatePath),
                      De(n, "apl_path", e.updatePath),
                      (e.semIndex =
                        "startLabel" === t.optionName
                          ? 0
                          : "endLabel" === t.optionName
                          ? 1
                          : 2),
                      (2 === e.semIndex && !e.lineOffset) ||
                        De(n, "cur_attach_plugBackLenSE", e.updateStartOffset),
                      De(n, "svgShow", e.updateShow),
                      pe && De(n, "new_edge4viewBox", e.adjustEdge),
                      I.pathLabel.initSvg(e, n),
                      !0
                    );
                  },
                  unbind: function (e, t) {
                    var n = t.props;
                    e.elmsAppend &&
                      (e.elmsAppend.forEach(function (e) {
                        n.svg.removeChild(e);
                      }),
                      (e.elmPosition =
                        e.elmPath =
                        e.elmOffset =
                        e.styleFill =
                        e.styleShow =
                        e.elmsAppend =
                          null)),
                      Xe(e.curStats, I.pathLabel.stats),
                      Xe(e.aplStats, I.pathLabel.stats),
                      e.color || ze(n, "cur_line_color", e.updateColor),
                      ze(n, "cur_line_strokeWidth", e.updatePath),
                      ze(n, "apl_path", e.updatePath),
                      (2 === e.semIndex && !e.lineOffset) ||
                        ze(n, "cur_attach_plugBackLenSE", e.updateStartOffset),
                      ze(n, "svgShow", e.updateShow),
                      pe && (ze(n, "new_edge4viewBox", e.adjustEdge), et(n, {}));
                  },
                  removeOption: function (e, t) {
                    var n = t.props,
                      a = {};
                    (a[t.optionName] = ""), ot(n, a);
                  },
                  remove: function (t) {
                    t.boundTargets.length &&
                      (console.error(
                        "LeaderLineAttachment was not unbound by remove"
                      ),
                      t.boundTargets.forEach(function (e) {
                        I.pathLabel.unbind(t, e);
                      }));
                  },
                },
              }),
              Object.keys(I).forEach(function (e) {
                lt[e] = function () {
                  return new C(I[e], Array.prototype.slice.call(arguments));
                };
              }),
              (lt.positionByWindowResize = !0),
              window.addEventListener(
                "resize",
                v.add(function () {
                  lt.positionByWindowResize &&
                    Object.keys(ge).forEach(function (e) {
                      et(ge[e], { position: !0 });
                    });
                }),
                !1
              ),
              lt
            );
          })();
          !(function (e, t) {
            "object" == typeof exports && "undefined" != typeof module
              ? (module.exports = t())
              : "function" == typeof define && define.amd
              ? define(t)
              : (e["leader-line"] = t());
          })(this, function () {
            return LeaderLine;
          });
        },
        {},
      ],
    },
    {},
    [1]
  );
  
  
  