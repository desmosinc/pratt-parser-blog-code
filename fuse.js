const { FuseBox, WebIndexPlugin } = require("fuse-box");
const fuse = FuseBox.init({
  homeDir: ".",
  target: "browser@es6",
  output: "dist/$name.js",
  plugins: [WebIndexPlugin()],
});
fuse.dev(); // launch http server
fuse
  .bundle("app")
  .instructions(" > src/index.ts")
  .hmr()
  .watch();
fuse.run();
