const register = require("ignore-styles").default;
const path = require("path");
const fs = require("fs");
const md5File = require("md5-file");

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

//global variables
if (typeof localStorage === "undefined") {
  global.localStorage = {
    getItem: () => {},
    setItem: () => {},
  };
}

if (typeof screen === "undefined") {
  global.screen = {};
}

if (typeof window === "undefined") {
  global.window = {
    document: {
      documentElement: {
        className: "",
      },
    },
    navigator: {
      userAgent: "",
    },
  };
}

register(undefined, (mod, filename) => {
  const ext = [".png", ".jpg"].find((f) => filename.endsWith(f));
  const svgext = [".svg"].find((f) => filename.endsWith(f));
  if (!ext && !svgext) {
    return;
  }

  if (ext) {
    if (fs.statSync(filename).size < 10000) {
      const file = fs.readFileSync(filename).toString("base64");
      const mimeType = mimeTypes[ext] || "image/jpg";
      mod.exports = `data:${mimeType};base64,${file}`;
    } else {
      const hash = md5File.sync(filename).slice(0, 8);
      const bn = path.basename(filename).replace(/(\.\w{3})$/, `.${hash}$1`);
      mod.exports = `/static/media/${bn}`;
    }
  }

  if (svgext) {
    const hash = md5File.sync(filename).slice(0, 8);
    const bn = path.basename(filename).replace(/(\.\w{3})$/, `.${hash}$1`);
    mod.exports = `/static/media/${bn}`;
  }
});

require("@babel/register")({
  ignore: [/(node_modules)/],
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    "syntax-dynamic-import",
    "dynamic-import-node",
    "react-loadable/babel",
  ],
});
// require('./index');
