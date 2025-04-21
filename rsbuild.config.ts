import { Compiler } from 'webpack'
import HarmonyImportDependency from 'webpack/lib/dependencies/HarmonyImportDependency.js'
import { defineConfig } from '@rsbuild/core'
import { RstestPlugin as RstestInternalPlugin } from 'webpack'
import { webpackProvider } from '@rsbuild/webpack'
import { pluginSwc } from '@rsbuild/plugin-webpack-swc'

class RstestPlugin {
  constructor() {}

  apply(compiler: Compiler) {
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
              if(!__webpack_require__.mocked) {
                __webpack_require__.mocked = {}
              }
              __webpack_require__.mocked[id] = mod;
              resolveMod()
            };
            __webpack_require__.with_rstest = async function(id, modFactory, resolveMod) {
              const mocked = __webpack_require__.mocked[id]
              return mocked
              // const mod = await modFactory();
              // __webpack_modules__[id] = mod;
              // resolveMod()
            };
          `
      }
    }

    // 新加一个 runtime module
    compiler.hooks.thisCompilation.tap('CustomPlugin', (compilation) => {
      compilation.hooks.additionalChunkRuntimeRequirements.tap(
        'CustomPlugin',
        (chunk, set) => {
          compilation.addRuntimeModule(chunk, new RetestImportRuntimeModule())
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
      mockObj: './src/mock-obj.js',
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
