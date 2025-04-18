import { Compiler } from 'webpack'
import HarmonyImportDependency from 'webpack/lib/dependencies/HarmonyImportDependency.js'
import { defineConfig } from '@rsbuild/core'
import { RstestPlugin as RstestInternalPlugin } from 'webpack'
import { webpackProvider } from '@rsbuild/webpack'
import { pluginSwc } from '@rsbuild/plugin-webpack-swc'

console.log('🧶', RstestInternalPlugin)

class RstestPlugin {
  constructor() {}

  apply(compiler: Compiler) {
    const { RuntimeModule } = compiler.webpack
    class RetestImportRuntimeModule extends RuntimeModule {
      constructor() {
        super('rstest runtime')
      }

      // override identifier(): string {
      //   return 'RSTEST_RUNTIME_MODULE'
      // }

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
          `
      }
    }

    // 新加一个 runtime module
    compiler.hooks.thisCompilation.tap('CustomPlugin', (compilation) => {
      compilation.hooks.additionalChunkRuntimeRequirements.tap(
        'CustomPlugin',
        (chunk, set) => {
          console.log('😩', chunk.name)
          compilation.addRuntimeModule(chunk, new RetestImportRuntimeModule())
        }
      )
    })

    // compiler.hooks.thisCompilation.tap('RepackTargetPlugin', (compilation) => {
    //   const { RuntimeGlobals } = compiler.webpack;
    //   compilation.hooks.runtimeModule.tap(
    //     'RepackTargetPlugin',
    //     (module, chunk) => {
    //       console.log('👩‍🎨', module.name);
    //       const originSource = module.source?.source.toString('utf-8');
    //       module.source!.source = Buffer.from(
    //         `${originSource}/* QQQ */`,
    //         'utf-8',
    //       );
    //     },
    //   );
    // });
  }
}

export default defineConfig({
  provider: webpackProvider,
  plugins: [pluginSwc()],
  source: {
    entry: {
      esmBundled: './src/esm-bundled.ts',
      esmExternal: './src/esm-external.ts',
      requireBundled: './src/require-bundled.ts',
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
