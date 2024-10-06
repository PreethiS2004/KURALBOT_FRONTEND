import React, { useState } from 'react';
import axios from 'axios';
import styles from './KuralSearch.module.css';

const KuralSearch = () => {
    const [selectedField, setSelectedField] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    // Utility functions to classify input
    const isTamil = (text) => /[\u0B80-\u0BFF]/.test(text);  // Check for Tamil characters

    const isPhoneticEnglish = (text) => {
        const commonPhoneticPatterns =[
            'aa', 'ee', 'ii', 'oo', 'uu', 'la', 'ra', 'na', 'th', 'zh', 'ng', 'ch',
            'ka', 'ki', 'ku', 'ke', 'kai', 'ko', 'kau', 'kh', 'kha', 'khi', 'khu',
            'ga', 'gi', 'gu', 'ge', 'gai', 'go', 'gau', 'gh', 'gha', 'ghi', 'ghu',
            'cha', 'chi', 'chu', 'che', 'chai', 'cho', 'chau', 'chh', 'chha', 'chhi', 'chhu',
            'ja', 'ji', 'ju', 'je', 'jai', 'jo', 'jau', 'jh', 'jha', 'jhi', 'jhu',
            'ta', 'ti', 'tu', 'te', 'tai', 'to', 'tau', 'th', 'tha', 'thi', 'thu',
            'da', 'di', 'du', 'de', 'dai', 'do', 'dau', 'dh', 'dha', 'dhi', 'dhu',
            'na', 'ni', 'nu', 'ne', 'nai', 'no', 'nau', 'nh', 'nha', 'nhi', 'nhu',
            'pa', 'pi', 'pu', 'pe', 'pai', 'po', 'pau', 'ph', 'pha', 'phi', 'phu',
            'ba', 'bi', 'bu', 'be', 'bai', 'bo', 'bau', 'bh', 'bha', 'bhi', 'bhu',
            'ma', 'mi', 'mu', 'me', 'mai', 'mo', 'mau', 'mh', 'mha', 'mhi', 'mhu',
            'ya', 'yi', 'yu', 'ye', 'yai', 'yo', 'yau', 'yh', 'yha', 'yhi', 'yhu',
            'ra', 'ri', 'ru', 're', 'rai', 'ro', 'rau', 'rh', 'rha', 'rhi', 'rhu',
            'la', 'li', 'lu', 'le', 'lai', 'lo', 'lau', 'lh', 'lha', 'lhi', 'lhu',
            'va', 'vi', 'vu', 've', 'vai', 'vo', 'vau', 'vh', 'vha', 'vhi', 'vhu',
            'sa', 'si', 'su', 'se', 'sai', 'so', 'sau', 'sh', 'sha', 'shi', 'shu',
            'ha', 'hi', 'hu', 'he', 'hai', 'ho', 'hau', 'hh', 'hha', 'hhi', 'hhu',
        ];
        return commonPhoneticPatterns.some(pattern => text.includes(pattern));
    };

    const classifyInput = (text) => {
        if (isTamil(text)) {
            return "Tamil";
        } else if (isPhoneticEnglish(text)) {
            return "Phonetic";
        } else {
            return "English";
        }
    };

    const handleSearch = async () => {
        console.log('Selected Field:', selectedField);
        console.log('Input Value:', inputValue);

        // Classify the input
        const inputType = classifyInput(inputValue);
        console.log('Input Type:', inputType); // Log the type of input

        const fieldName = (() => {
            if (selectedField === 'chapterName' && inputType === 'English') {
                return 'Chapter_Eng';
            } 
            else if(selectedField === 'chapterName' && inputType==='Phonetic') {
                return 'Chapter';
            }
            else if (selectedField === 'sectionName' && inputType === 'English') {
                return 'section_eng';
            }
            else if (selectedField === 'sectionName' && inputType==='Phonetic') {
                return 'section_trans';
            }
            else if (selectedField === 'verse' && inputType === 'English') {
                return 'translation';
            }
            else if (selectedField === 'verse' && inputType==='Phonetic') {
                return 'verse';
            }
            return selectedField; // Default case
        })();

        console.log('Field Name to Search:', fieldName); // Log the determined field name

        try {
            const response = await axios.get('http://localhost:5000/api/kurals', {
                params: {
                    [fieldName]: inputValue
                }
            });

            console.log('API Response:', response.data); // Log the response data

            setResults(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching data:', err); // Log any errors that occur
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
                    <input 
                        type={selectedField === 'number' ? 'number' : 'text'} 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                    />
                </div>
            )}
            
            <button onClick={handleSearch}>Search</button>

            {error && <p className={styles.error}>{error}</p>}

            <ul>
                {results.length > 0 ? results.map((kural, index) => (
                    <li key={index}>
                        <p>Chapter Name: {kural.chapterName}</p>
                        <p>Section Name: {kural.sectionName}</p>
                        <p>Verse: {kural.verse}</p>
                        <p>{kural.translation}</p>
                        <p>{kural.explanation}</p>
                        <p>Number: {kural.number}</p>
                    </li>
                )) : <p>No results found.</p>}
            </ul>
        </div>
    );
};

export default KuralSearch;