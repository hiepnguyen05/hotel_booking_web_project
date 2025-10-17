const { networkInterfaces } = require('os');

// Function to get local IP address that can be accessed from other devices
function getLocalIP() {
  const interfaces = networkInterfaces();
  
  // Try to find a suitable IP address
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and IPv6 addresses
      if (iface.internal || iface.family !== 'IPv4') {
        continue;
      }
      
      // Skip docker and virtual interfaces that start with 172.16
      if (iface.address.startsWith('172.16')) {
        continue;
      }
      
      // Return the first non-internal IPv4 address that's not a docker/virtual interface
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  
  // Fallback to localhost if no suitable IP found
  return 'localhost';
}

// Function to get all local IP addresses (excluding problematic ones)
function getAllLocalIPs() {
  const interfaces = networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and IPv6 addresses
      if (iface.internal || iface.family !== 'IPv4') {
        continue;
      }
      
      // Skip docker and virtual interfaces that start with 172.16
      if (iface.address.startsWith('172.16')) {
        continue;
      }
      
      // Add non-internal IPv4 addresses
      if (!iface.internal && iface.family === 'IPv4') {
        ips.push(iface.address);
      }
    }
  }
  
  return ips;
}

// Display network information
function showNetworkInfo() {
  const localIPs = getAllLocalIPs();
  const port = process.env.PORT || 3000;
  const backendPort = 5000;
  
  console.log('========================================');
  console.log('Frontend Development Server');
  console.log('========================================');
  console.log(`Local access: http://localhost:${port}`);
  
  if (localIPs.length > 0) {
    console.log('\nNetwork access:');
    localIPs.forEach(ip => {
      console.log(`  Frontend: http://${ip}:${port}`);
      console.log(`  Backend:  http://${ip}:${backendPort}`);
    });
    console.log(`\nAccess from other devices on your network using any of the above addresses.`);
  } else {
    console.log('\nCould not automatically detect network IP addresses.');
    console.log('Please check your network settings and firewall configuration.');
  }
  
  console.log('========================================');
  console.log('API calls from frontend will automatically use the correct backend address.');
  console.log('========================================');
}

showNetworkInfo();