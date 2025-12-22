import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const external = ['react', 'react-dom', 'react/jsx-runtime'];

const createConfig = (input, outputName) => ({
  input,
  external,
  output: [
    {
      file: `dist/${outputName}.js`,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: `dist/${outputName}.cjs`,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.tsx'],
    }),
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  ],
});

export default [
  createConfig('src/index.ts', 'index'),
  createConfig('src/keyboard.ts', 'keyboard'),
  createConfig('src/persistence.ts', 'persistence'),
];
