module.exports = {
  plugins: [
    require("./dist/", {
      minViewPort: 375,
      maxViewPort: 1024,
    }), // ビルド時に ON
  ],
};
