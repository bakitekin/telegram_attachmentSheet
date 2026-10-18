module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo automatically adds the react-native-worklets plugin
    // (required by Reanimated 4 / Skia's usePointBuffer) when the package is
    // installed, and wires up the React Compiler experiment from app.json.
    presets: ['babel-preset-expo'],
  };
};
