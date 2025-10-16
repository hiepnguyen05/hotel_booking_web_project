const { build } = require('vite');
const path = require('path');

async function buildProject() {
  try {
    console.log('Starting Vite build...');
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
    process.exit(1);
  }
}

buildProject();