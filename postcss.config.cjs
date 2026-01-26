module.exports = {
  plugins: [
    require("@csstools/postcss-global-data")({
      files: ["./src/styles/media.css"],
    }),
    require("postcss-custom-media")(),
  ],
};
