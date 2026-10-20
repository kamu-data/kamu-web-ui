// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// Stylesheets load from /base/, while the builder serves their fonts from /media/.
// A URL rewrite instead of Karma's `proxies`, whose http-proxy calls the deprecated util._extend.
const MEDIA_PREFIX = "/base/media/";
const rewriteMediaUrls = {
  "middleware:rewrite-media-urls": [
    "value",
    (req, _res, next) => {
      if (req.url.startsWith(MEDIA_PREFIX)) {
        req.url = req.url.slice("/base".length);
      }
      next();
    },
  ],
};

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-firefox-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      rewriteMediaUrls,
    ],
    beforeMiddleware: ["rewrite-media-urls"],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage/kamu-platform"),
      reports: ["html", "lcovonly", "text-summary"],
    },
    reporters: ["progress", "kjhtml", "coverage-istanbul"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
  });
  process.env.TZ = "Europe/Kyiv";
};
