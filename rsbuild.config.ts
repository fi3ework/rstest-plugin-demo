import { Compiler } from 'webpack'
import { defineConfig } from '@rsbuild/core'
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

      // override identifier(): string {
      //   return 'RSTEST_RUNTIME_MODULE'
      // }

      generate() {
        const compilation = this.compilation
        console.log('👩‍🏭')
        return `
            __webpack_require__.rstest_import = async function(modPath, mod) {
              console.log('🦶', mod)
              const resolved = await mod;
              return resolved
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
  tools: {
    webpack: {
      plugins: [new RstestPlugin()],
      devtool: false,
      target: 'node',
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
