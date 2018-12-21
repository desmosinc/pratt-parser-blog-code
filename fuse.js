const {
  FuseBox,
  WebIndexPlugin,
  CSSPlugin,
  CSSResourcePlugin,
} = require('fuse-box');
const fuse = FuseBox.init({
  homeDir: '.',
  target: 'browser@es6',
  output: 'dist/$name.js',
  plugins: [
    [
      CSSResourcePlugin({
        dist: 'dist/css-resources',
        resolve: f => `/css-resources/${f}`,
      }),
      CSSPlugin(),
    ],
    WebIndexPlugin({
      path: "."
    }),
  ],
});
fuse.dev(); // launch http server
fuse
  .bundle('app')
  .instructions(' > src/index.ts')
  .hmr()
  .watch();
fuse.run();
