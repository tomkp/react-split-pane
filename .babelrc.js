const env = process.env.NODE_ENV;

if (env === 'test' || env === 'demo') {
  module.exports = {
    presets: ['env', 'stage-0', 'react'],
  };
} else {
  module.exports = {
    presets: [
      [
        'env',
        {
          modules: false,
        },
      ],
      'stage-0',
      'react',
    ],
    plugins: ['external-helpers'],
  };
}
