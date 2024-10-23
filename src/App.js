// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LanguageSelection from './LanguageSelection';
import KuralSearch from './KuralSearch';
import './App.css'; // Import the global styles

const App = () => {
    const [selectedLanguage, setSelectedLanguage] = useState('Tamil'); // Default to Tamil

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>KuralBot</h1>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<LanguageSelectionWrapper setSelectedLanguage={setSelectedLanguage} />} />
                        <Route path="/search" element={<KuralSearch selectedLanguage={selectedLanguage} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

// Wrapper to handle language selection and navigation to search page
const LanguageSelectionWrapper = ({ setSelectedLanguage }) => {
    const navigate = useNavigate(); // For navigating to /search after selection

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        
            navigate('/search');
        
         // Redirect to the search page after selecting language
    };

    return <LanguageSelection onLanguageChange={handleLanguageChange} />;
};

export default App;
