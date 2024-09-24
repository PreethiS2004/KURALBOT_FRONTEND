
// src/components/KuralSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import styles from './KuralSearch.module.css';

const KuralSearch = () => {
    const [selectedField, setSelectedField] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        console.log('Selected Field:', selectedField);
        console.log('Input Value:', inputValue);
        try {
            const response = await axios.get('http://localhost:5000/api/kurals', {
                params: {
                    [selectedField]: inputValue
                }
            });
            
            setResults(response.data);
            setError('');
        } catch (err) {
            setError('Error fetching data');
            setResults([]);
        }
    };
    

    return (
        <div className={styles.container}>
            <h1>Search Thirukkural</h1>
            
            <div>
                <label>Select Field:</label>
                <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
                    <option value="">Select a field</option>
                    <option value="chapterName">Chapter Name</option>
                    <option value="sectionName">Section Name</option>
                    <option value="verse">Verse</option>
                  
                </select>
            </div>

            {selectedField && (
                <div>
                    <label>{selectedField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                    <input type={selectedField === 'number' ? 'number' : 'text'} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                </div>
            )}
            
            <button onClick={handleSearch}>Search</button>

            {error && <p className={styles.error}>{error}</p>}

            <ul>
                {results.map((kural, index) => (
                    <li key={index}>
                        <p>Chapter Name: {kural.chapterName}</p>
                        <p>Section Name: {kural.sectionName}</p>
                        <p>Verse: {kural.verse}</p>
                        <p>{kural.translation}</p>
                        <p>{kural.explanation}</p>
                        <p>Number: {kural.number}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KuralSearch;
