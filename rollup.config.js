import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  commonjs(),
  nodeResolve({
    preferBuiltins: true
  }),
  typescript({
    allowSyntheticDefaultImports: true
  })
];

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      format: 'esm'
    },
    plugins: plugins
  }
];
