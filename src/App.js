// src/App.js
import React from 'react';
import KuralSearch from './KuralSearch';
import './App.css'; // Import the global styles

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Thirukkural Search App</h1>
            </header>
            <main>
                <KuralSearch />
            </main>
        </div>
    );
};

export default App;
