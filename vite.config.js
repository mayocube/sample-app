/**
 * "IMPORTANT: THIS FILE IS GENERATED, CHANGES SHOULD BE MADE WITHIN '@okta/generator'"
 * */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import NodeModulesPolyfills, { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

require('dotenv').config();

process.env.CLIENT_ID = process.env.SPA_CLIENT_ID || process.env.CLIENT_ID;
process.env.OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
process.env.USE_INTERACTION_CODE = process.env.USE_INTERACTION_CODE || false;

const env = {};

// List of environment variables made available to the app
[
  'ISSUER',
  'CLIENT_ID',
  'OKTA_TESTING_DISABLEHTTPSCHECK',
  'USE_INTERACTION_CODE',
  'SERVERLESS_DOMAIN',
].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} must be set. See README.md`);
  }
  env[key] = process.env[key];
});

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const includeSampleBaseName = command === 'build' && !process.env.STANDALONE_SAMPLE_BUILD;
  return {
    base: '/',
    plugins: [react()],
    define: {
      'process.env': env,
    },
    resolve: {
      alias: {
        'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        sys: 'util',
        events: 'rollup-plugin-node-polyfills/polyfills/events',
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        path: 'rollup-plugin-node-polyfills/polyfills/path',
        querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
        url: 'rollup-plugin-node-polyfills/polyfills/url',
        string_decoder:
          'rollup-plugin-node-polyfills/polyfills/string-decoder',
        http: 'rollup-plugin-node-polyfills/polyfills/http',
        https: 'rollup-plugin-node-polyfills/polyfills/http',
        os: 'rollup-plugin-node-polyfills/polyfills/os',
        assert: 'rollup-plugin-node-polyfills/polyfills/assert',
        constants: 'rollup-plugin-node-polyfills/polyfills/constants',
        _stream_duplex:
          'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
        _stream_passthrough:
          'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
        _stream_readable:
          'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
        _stream_writable:
          'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
        _stream_transform:
          'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
        timers: 'rollup-plugin-node-polyfills/polyfills/timers',
        console: 'rollup-plugin-node-polyfills/polyfills/console',
        vm: 'rollup-plugin-node-polyfills/polyfills/vm',
        zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
        tty: 'rollup-plugin-node-polyfills/polyfills/tty',
        domain: 'rollup-plugin-node-polyfills/polyfills/domain',
        buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
          NodeModulesPolyfills(),
          {
            name: 'fix-node-globals-polyfill',
            setup(build) {
              build.onResolve(
                { filter: /_virtual-process-polyfill_\.js/ },
                ({ path }) => ({ path }),
              );
            },
          },
        ],
      },
    },
    server: {
      port: process.env.PORT || 8080,
    },
    preview: {
      port: process.env.PORT || 8080,
    },
    build: {
      rollupOptions: {
        // always throw with build warnings
        onwarn(warning, warn) {
          warn('\nBuild warning happened, customize "onwarn" callback in vite.config.js to handle this error.');
          //throw new Error(warning);
        },
        plugins: [
          // Enable rollup polyfills plugin
          // used during production bundling
          rollupNodePolyFill(),
        ],
      },
      sourcemap: true,
    },
  };
});
