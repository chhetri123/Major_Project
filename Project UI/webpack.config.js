module.exports = {
  // ... other configurations
  resolve: {
    fallback: {
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      url: require.resolve("url/"),
    },
  },
};
