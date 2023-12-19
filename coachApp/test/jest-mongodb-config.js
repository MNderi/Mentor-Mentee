module.exports = {
    mongodbMemoryServerOptions: {
      instance: {
        dbName: 'jest',
      },
      binary: {
        version: '8.0.3', 
        skipMD5: true,
      },
      autoStart: false,
    },
  };
  