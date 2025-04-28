import { Compiler, BannerPlugin } from 'webpack'
import { defineConfig } from '@rsbuild/core'
import { RstestPlugin as RstestInternalPlugin } from 'webpack'
import { webpackProvider } from '@rsbuild/webpack'
import { pluginSwc } from '@rsbuild/plugin-webpack-swc'

class RstestPlugin {
  constructor() {}

  apply(compiler: Compiler) {
    compiler.hooks.make.tap('plugin', (compilation) => {
      const hooks =
        compiler.webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(
          compilation
        )

      //       hooks.renderRequire.tap('plugin1111', (moduleSource) => {
      //         return `// Check if module is in cache
      // var cachedModule = __webpack_module_cache__[moduleId];
      // if (cachedModule !== undefined) {
      //         return cachedModule.exports;
      // }
      // var mockedModule = __webpack_require__.mocked?.[moduleId];
      // if (mockedModule !== undefined) {
      //         return mockedModule;
      // }
      // // Create a new module (and put it into the cache)
      // var module = __webpack_module_cache__[moduleId] = {
      //         // no module.id needed
      //         // no module.loaded needed
      //         exports: {}
      // };

      // // Execute the module function
      // __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

      // // Return the exports of the module
      // return module.exports;`
      //       })
    })

    const { RuntimeModule } = compiler.webpack
    class RetestImportRuntimeModule extends RuntimeModule {
      constructor() {
        super('rstest runtime')
      }

      generate() {
        return `
            if (typeof __webpack_module_cache__ !== 'undefined') {
              __webpack_require__.c = __webpack_module_cache__;
            }
            // __webpack_require__.rstest_register_module = async (id, modFactory, resolveMod) => {
            //   let _resolve = undefined
              
            //   const innerPromise = new Promise((resolve, reject) => {
            //     _resolve = resolve
            //     })

            //   const mod = await modFactory();
            //   __webpack_require__.c[id] = { exports: mod } 
            //   _resolve()
            //   return innerPromise
            // };
            __webpack_require__.mock_modules = {};
            __webpack_require__.set_mock = (id, modFactory) => {
              __webpack_require__.mock_modules[id] = modFactory;
            };
            __webpack_require__.get_mock = (id) => {
              let currentMock = __webpack_require__.mock_modules[id];
              if (currentMock) {
                return currentMock;
              }
            };
            __webpack_require__.rstest_require = (...args) => {
              let currentMock = __webpack_require__.mock_modules[args[0]];
              if (currentMock) {
                return currentMock();
              }
              return __webpack_require__(...args)
            };
          `
      }
    }

    // 新加一个 runtime module
    compiler.hooks.thisCompilation.tap('CustomPlugin', (compilation) => {
      compilation.hooks.additionalChunkRuntimeRequirements.tap(
        'CustomPlugin',
        (chunk, set) => {
          // if (chunk.name?.startsWith('runtime~')) {
          compilation.addRuntimeModule(chunk, new RetestImportRuntimeModule())
          // }
        }
      )
    })

    // compiler.hooks.compilation.tap('RepackTargetPlugin', (compilation) => {
    //   const { RuntimeGlobals } = compiler.webpack
    //   compilation.hooks.runtimeModule.tap(
    //     'RepackTargetPlugin',
    //     (module, chunk) => {
    //       if (module.name === 'rstest runtime') {
    //         module.source.source = Buffer.from(
    //           `  "/override/public/path";\n`,
    //           'utf-8'
    //         )
    //       }
    //       // const originSource = module.source?.source?.toString?.('utf-8')
    //       // console.log('👨‍👩‍👦‍👦', originSource)
    //       // module.source!.source = Buffer.from(
    //       //   `${originSource}/* QQQ */`,
    //       //   'utf-8'
    //       // )
    //     }
    //   )
    // })
  }
}

export default defineConfig({
  provider: webpackProvider,
  plugins: [pluginSwc()],
  resolve: {
    alias: {
      '@shared/pad': 'lodash-es/pad.js',
    },
  },
  source: {
    entry: {
      // index: './src/index.js',
      indexCjs: './src/index-cjs.js',
    },
  },
  output: {
    minify: false,
    filenameHash: false,
    externals: [
      ({ request, dependencyType, contextInfo }: any, callback: any) => {
        let shouldWarn = false
        const _callback = (_matched: boolean, _shouldWarn?: boolean) => {
          if (_shouldWarn) {
            shouldWarn = true
          }
        }

        if (
          request === 'lodash-es/capitalize.js' ||
          request === 'radashi' ||
          request === 'pkg1' ||
          request === 'pkg2'
        ) {
          if (contextInfo.issuer && dependencyType === 'commonjs') {
            return callback(undefined, 'commonjs ' + request)
          } else {
            return callback(undefined, 'import ' + request)
          }
        }
        callback()
      },
    ],
  },
  tools: {
    htmlPlugin: false,
    webpack: {
      node: {
        __dirname: false,
        __filename: false,
      },
      plugins: [
        new RstestPlugin(),
        new RstestInternalPlugin(),
        new BannerPlugin({
          banner: `// \`__import\` should be inject from vm outside.
const __import = (request) => {
  console.log('🟡 ESM import: ', request);
  return import(request);
}
import { createRequire } from 'node:module';
// \`require\` should be inject from vm outside.
const require = createRequire(import.meta.url);
`,
          raw: true,
        }),
      ],
      devtool: false,
      target: 'node',
      output: {
        importFunctionName: '__import',
        asyncChunks: false,
        chunkLoading: 'import',
      },
      experiments: {
        outputModule: true,
        topLevelAwait: true,
      },
      optimization: {
        splitChunks: {
          chunks: 'all',
        },
        concatenateModules: false,
        moduleIds: 'named',
        chunkIds: 'named',
        // runtimeChunk: true,
      },
    },
  },
})
