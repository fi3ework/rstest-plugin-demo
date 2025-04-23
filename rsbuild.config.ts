import { Compiler } from 'webpack'
import HarmonyImportDependency from 'webpack/lib/dependencies/HarmonyImportDependency.js'
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
        const compilation = this.compilation
        return `
            __webpack_require__.rstest_import = async function(modPath, mod) {
              if (!mod) {
                  // external module
                  return __import(request) // injected to vm
                } else {
                  // bundled module
                  const resolvedMod = await mod;
                  return resolvedMod
                }
            };
            __webpack_require__.rstest_register_module = async (id, modFactory, resolveMod) => {
              const mod = await modFactory();
              __webpack_require__.cache[id] = { exports: mod } 
              resolveMod()
            };
            __webpack_require__.with_rstest = async function(id, modFactory, resolveMod) {
              const mocked = __webpack_require__.mocked[id]
              return mocked
            };
            __webpack_require__.cache = __webpack_module_cache__
          `
      }
    }

    // 新加一个 runtime module
    compiler.hooks.thisCompilation.tap('CustomPlugin', (compilation) => {
      compilation.hooks.additionalChunkRuntimeRequirements.tap(
        'CustomPlugin',
        (chunk, set) => {
          if (chunk.name?.startsWith('runtime~')) {
            compilation.addRuntimeModule(chunk, new RetestImportRuntimeModule())
          }
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
    //         console.log('👩‍🎨1111', module.name, chunk.name)
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
  source: {
    entry: {
      // esmBundled: './src/esm-bundled.ts',
      // esmExternal: './src/esm-external.ts',
      // requireBundled: './src/require-bundled.ts',
      // mockObj: './src/mock-obj.js',
      // mockExternal: './src/mock-external.js',
      mockImportActual: './src/mock-import-actual.js',
    },
  },
  output: {
    minify: false,
    filenameHash: false,
    externals: {
      'lodash-es/capitalize.js': 'import lodash-es/capitalize.js',
    },
  },
  tools: {
    htmlPlugin: false,
    webpack: {
      node: {
        __dirname: false,
        __filename: false,
      },
      plugins: [new RstestPlugin(), new RstestInternalPlugin()],
      devtool: false,
      target: 'node',
      output: {
        asyncChunks: false,
      },
      experiments: {
        outputModule: true,
        topLevelAwait: true,
      },
      optimization: {
        moduleIds: 'named',
        chunkIds: 'named',
        runtimeChunk: true,
      },
    },
  },
})
