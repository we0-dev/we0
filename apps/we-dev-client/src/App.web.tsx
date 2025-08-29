import React from 'react';

function App() {
  console.log('App component rendering...');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#7c3aed', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>
        <h1>We Dev</h1>
        <p>Web Version - Working!</p>
      </div>
    </div>
  );
}

export default App;