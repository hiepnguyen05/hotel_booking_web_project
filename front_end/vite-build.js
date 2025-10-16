const { build } = require('vite');
const path = require('path');

async function buildProject() {
  console.log('Starting Vite build using API...');
  
  try {
    await build({
      root: __dirname,
      mode: 'production',
      build: {
        outDir: path.resolve(__dirname, 'build'),
        emptyOutDir: true,
        rollupOptions: {
          // Add any specific rollup options here if needed
        }
      },
      logLevel: 'info'
    });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProject();