// Set environment variables to handle Rollup native modules
process.env.ROLLUP_DISABLE_NATIVE_ADDONS = '1';
process.env.npm_config_platform = 'linux';
process.env.npm_config_arch = 'x64';

const { build } = require('vite');
const path = require('path');

async function buildProject() {
  try {
    console.log('Starting Vite build...');
    console.log('Environment variables:');
    console.log('- ROLLUP_DISABLE_NATIVE_ADDONS:', process.env.ROLLUP_DISABLE_NATIVE_ADDONS);
    console.log('- npm_config_platform:', process.env.npm_config_platform);
    console.log('- npm_config_arch:', process.env.npm_config_arch);
    
    await build({
      root: path.resolve(__dirname, '..'),
      mode: 'production',
      build: {
        outDir: 'dist',
        target: 'esnext'
      }
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    
    // If it's a rollup native module error, try a different approach
    if (error.message && error.message.includes('rollup-linux-x64-gnu')) {
      console.log('Attempting alternative build approach...');
      // Try building with different settings
      try {
        await build({
          root: path.resolve(__dirname, '..'),
          mode: 'production',
          build: {
            outDir: 'dist',
            target: 'esnext',
            rollupOptions: {
              // Disable native plugins
              plugins: []
            }
          }
        });
        console.log('Build completed successfully with alternative approach!');
      } catch (retryError) {
        console.error('Alternative build failed:', retryError);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

buildProject();