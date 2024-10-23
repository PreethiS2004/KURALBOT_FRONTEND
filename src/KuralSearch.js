import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './KuralSearch.module.css';

const KuralSearch = ({ selectedLanguage }) => {
    const [selectedField, setSelectedField] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);
    const [allDetails, setAllDetails] = useState([]);
    const [expandedChapters, setExpandedChapters] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});
    const [error, setError] = useState('');
    const [showSearch, setShowSearch] = useState(true); // State to manage the visibility of the search button

    useEffect(() => {
        console.log("Selected Language:", selectedLanguage);
    }, [selectedLanguage]);

    const handleInput = (field) => {
        setSelectedField(field);
        setInputValue('');
        setAllDetails([]);
        setShowSearch(true); // Show the search button when a field is selected
    };

    const handleSearch = async () => {
        let fieldName;
        let apiUrl;

        // Determine the API URL and field name based on selected language and field
        if (selectedField === 'inputs' && selectedLanguage === 'Tamil') {
            apiUrl = 'http://localhost:5000/api/questions';
            fieldName = 'inputs';
        } else if (selectedField === 'inputs' && selectedLanguage === 'English') {
            apiUrl = 'http://localhost:5000/api/questions';
            fieldName = 'english_input';
        } else {
            fieldName = (() => {
                if (selectedField === 'chapterName' && selectedLanguage === 'English') {
                    return 'Chapter_Eng';
                }
                if (selectedField === 'chapterName' && selectedLanguage === 'Tamil') {
                    return 'chapterName';
                }
                if (selectedField === 'chapterName' && selectedLanguage === 'Hindi') {
                    return 'chapterName';
                }
                if (selectedField === 'sectionName' && selectedLanguage === 'English') {
                    return 'section_eng';
                }
                if (selectedField === 'sectionName' && selectedLanguage === 'Tamil') {
                    return 'sectionName';
                }
                if (selectedField === 'verse' && selectedLanguage === 'English') {
                    return 'translation';
                }
                if (selectedField === 'verse' && selectedLanguage === 'Tamil') {
                    return 'verse';
                }
                return selectedField;
            })();

            apiUrl = 'http://localhost:5000/api/kurals';
        }

        try {
            const response = await axios.get(apiUrl, { params: { [fieldName]: inputValue,selectedLanguage: selectedLanguage } });
            setResults(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Error fetching data');
            setResults([]);
        }
    };

    const fetchAllDetails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/all-details', {
                params: { selectedLanguage }
            });
            setAllDetails(response.data);
            setError('');
            setShowSearch(false); // Hide the search button when fetching all details
        } catch (err) {
            console.error('Error fetching all details:', err);
            setError('Error fetching all details');
            setAllDetails([]);
        }
    };

    const toggleChapter = (chapterId) => {
        setExpandedChapters((prev) => 
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    const toggleSection = (chapterId, sectionIndex) => {
        setExpandedSections((prev) => ({
            ...prev,
            [chapterId]: prev[chapterId]?.includes(sectionIndex)
                ? prev[chapterId].filter(idx => idx !== sectionIndex)
                : [...(prev[chapterId] || []), sectionIndex]
        }));
    };

    return (
        <div className={styles.container}>
            <h1>Search Thirukkural</h1>

            <div>
                <label>Select Field</label>
                <div className={styles.optionsContainer}>
                    <div className={styles.optionBox} onClick={() => handleInput('chapterName')}>Chapter Name</div>
                    <div className={styles.optionBox} onClick={() => handleInput('sectionName')}>Section Name</div>
                    <div className={styles.optionBox} onClick={() => handleInput('verse')}>Verse</div>
                    <div className={styles.optionBox} onClick={() => handleInput('inputs')}>Other Questions</div>
                    <div className={styles.optionBox} onClick={fetchAllDetails}>All Details</div>
                </div>
            </div>

            {selectedField && (
                <div>
                    <label>{selectedField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                    />
                </div>
            )}

            {/* Conditionally render the search button based on showSearch state */}
            {showSearch && <button onClick={handleSearch}>Search</button>}

            {error && <p className={styles.error}>{error}</p>}

            {/* Displaying the results based on selectedField */}
            <ul>
                {results.length > 0 ? results.map((kural, index) => (
                    <li key={index}>
                        {selectedField === 'inputs' ? (
                            <>
                                <p>Answer: {kural.targets}</p>
                                <p>Number: {kural.number}</p>
                            </>
                        ) : (
                            <>
                            {selectedLanguage === 'English' ? (
                    <>
                        <p>Chapter Name: {kural.Chapter_Eng}</p>
                        <p>Chapter Group:  {kural.chapter_group_eng}</p>
                        <p> Section Name: {kural.section_eng}</p>
                        <p>{kural.translation || 'Not available'}</p>
                        <p>{kural.explanation || 'Not available'}</p>
                    </>
                ) : (
                    <>
                        <p>அத்தியாயம் :{kural.chapterName}</p>
                        <p>அத்தியாயக் குழு: {kural.chapter_group_tam}</p>
                        <p>பிரிவு: {kural.sectionName}</p>
                        <p>திருக்குறள்: {kural.verse}</p>
                        
                    </>
                )}
                <p>Number: {kural.number}</p>
                            
                            </>
                        )}
                    </li>
                )) : <p></p>}
            </ul>

            {/* Displaying all details with collapsing chapters and sections */}
            {allDetails.length > 0 && (
                <div>
                    <h2>All Details:</h2>
                    <ul>
                        {allDetails.slice(0, 3).map((chapter, index) => (
                            <li key={index}>
                                <h3 onClick={() => toggleChapter(chapter._id)}>
                                    {chapter._id} - {chapter.sections.reduce((sum, section) => sum + section.verses.length, 0)}
                                    {expandedChapters.includes(chapter._id) ? " ▲" : " ▼"}
                                </h3>

                                {expandedChapters.includes(chapter._id) && (
                                    <div>
                                        {chapter.sections.map((section, secIndex) => (
                                            <div key={secIndex}>
                                                <h4 onClick={() => toggleSection(chapter._id, secIndex)}>
                                                    {section.sectionName}- {section.verses.length}
                                                    {expandedSections[chapter._id]?.includes(secIndex) ? " ▲" : " ▼"}
                                                </h4>

                                                {expandedSections[chapter._id]?.includes(secIndex) && (
                                                    <ul>
                                                        {section.verses.map((verse, verseIndex) => (
                                                            <li key={verseIndex}>
                                                                <p> {verse.verse}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default KuralSearch;
