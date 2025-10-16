const { build } = require('vite');
const path = require('path');

async function buildProject() {
  try {
    console.log('Starting Vite build...');
    // Set environment variable to skip optional dependencies that might cause issues
    process.env.ROLLUP_DISABLE_NATIVE_ADDONS = '1';
    
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
    
    // If it's a rollup native module error, try installing the missing dependency
    if (error.message && error.message.includes('rollup-linux-x64-gnu')) {
      console.log('Attempting to install missing rollup native dependency...');
      const { execSync } = require('child_process');
      try {
        execSync('npm install @rollup/rollup-linux-x64-gnu --no-save', { stdio: 'inherit' });
        console.log('Retrying build...');
        await build({
          root: path.resolve(__dirname, '..'),
          mode: 'production',
          build: {
            outDir: 'dist',
            target: 'esnext'
          }
        });
        console.log('Build completed successfully on retry!');
      } catch (retryError) {
        console.error('Build failed on retry:', retryError);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

buildProject();