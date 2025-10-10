import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Log access information when the app starts
console.log('[Frontend Access Log] App loaded at:', new Date().toISOString());
console.log('[Frontend Access Log] Host:', window.location.host);
console.log('[Frontend Access Log] Hostname:', window.location.hostname);
console.log('[Frontend Access Log] Protocol:', window.location.protocol);
console.log('[Frontend Access Log] Port:', window.location.port);

// Additional network information
if (typeof navigator !== 'undefined') {
  console.log('[Frontend Access Log] User Agent:', navigator.userAgent);
  console.log('[Frontend Access Log] Platform:', navigator.platform);
  console.log('[Frontend Access Log] Language:', navigator.language);
}

createRoot(document.getElementById("root")!).render(<App />);