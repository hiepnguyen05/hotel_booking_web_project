import React, { useState, useEffect } from 'react';
import { getAccessLogs } from '../utils/networkUtils';

interface AccessLog {
  timestamp: string;
  type: string;
  [key: string]: any;
}

const AccessLogViewer = () => {
  const [logs, setLogs] = useState([] as any[]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Update logs every second
    const interval = setInterval(() => {
      setLogs(getAccessLogs());
    }, 1000);

    // Initial load
    setLogs(getAccessLogs());

    return () => clearInterval(interval);
  }, []);

  if (!visible) {
    return (
      <button 
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Show Access Logs
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '300px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '10px',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>Access Logs</h3>
        <div>
          <button 
            onClick={() => setVisible(false)}
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ccc',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Hide
          </button>
          <button 
            onClick={() => setLogs([])}
            style={{
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <div style={{ 
        overflowY: 'auto', 
        flex: 1,
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        {logs.length === 0 ? (
          <p>No access logs yet.</p>
        ) : (
          logs.map((log: any, index: number) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '5px',
                padding: '5px',
                backgroundColor: log.type.includes('ERROR') ? '#f8d7da' : '#f8f9fa',
                borderRadius: '3px'
              }}
            >
              <div><strong>{log.timestamp}</strong></div>
              <div>Type: {log.type}</div>
              {Object.entries(log).map(([key, value]) => {
                if (key !== 'timestamp' && key !== 'type') {
                  return <div key={key}>{key}: {JSON.stringify(value)}</div>;
                }
                return null;
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AccessLogViewer;