import { useScript } from '..';

var useSlardar = function useSlardar(bID) {
  useScript('', {
    innerHTML: "(function(i, s, o, g, r, a, m) {\n      i[\"SlardarMonitorObject\"] = r; (i[r] = i[r] ||\n      function() { (i[r].q = i[r].q || []).push(arguments)\n      }),\n      (i[r].l = 1 * new Date()); (a = s.createElement(o)),\n      (m = s.getElementsByTagName(o)[0]);\n      a.async = 1;\n      a.onload = function(){\n        window.Slardar && window.Slardar(\"config\",{bid: '".concat(bID, "'});\n      };\n      a.src = g;\n      a.crossOrigin = \"anonymous\";\n      m.parentNode.insertBefore(a, m);\n      i[r].globalPreCollectError = function() {\n          i[r](\"precollect\", \"error\", arguments)\n      };\n      if (typeof i.addEventListener === \"function\") {\n          i.addEventListener(\"error\", i[r].globalPreCollectError, true)\n      }\n      if ('PerformanceLongTaskTiming' in i) {\n          var g = i[r].lt = {\n              e: []\n          };\n          g.o = new PerformanceObserver(function(l) {\n              g.e = g.e.concat(l.getEntries())\n          });\n          g.o.observe({\n              entryTypes: ['longtask']\n          })\n      }\n  })(window, document, \"script\", \"https://i.snssdk.com/slardar/sdk.js?bid=").concat(bID, "\", \"Slardar\");")
  });
};

export default useSlardar;