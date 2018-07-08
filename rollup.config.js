import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

export default {
  input: pkg.source,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
  external: [
    'react',
    'react-dom',
    'prop-types',
    'inline-style-prefixer',
    'react-style-proptype',
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
  ],
  watch: {
    include: 'src/**',
  },
};
