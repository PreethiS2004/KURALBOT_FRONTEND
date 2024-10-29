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
    const [showSearch, setShowSearch] = useState(true);

    useEffect(() => {
        console.log("Selected Language:", selectedLanguage);
    }, [selectedLanguage]);

    const handleInput = (field) => {
        setSelectedField(field);
        setInputValue('');
        setAllDetails([]);
        setShowSearch(true);
    };

    const handleSearch = async () => {
        let fieldName;
        let apiUrl;

        if (selectedField === 'inputs' && selectedLanguage === 'Tamil') {
            apiUrl = 'http://localhost:5000/api/questions';
            fieldName = 'inputs';
        } else if (selectedField === 'inputs' && selectedLanguage === 'English') {
            apiUrl = 'http://localhost:5000/api/questions';
            fieldName = 'english_input';
        } else {
            fieldName = (() => {
                if (selectedField === 'chapterName') {
                    if (selectedLanguage === 'English') return 'Chapter_Eng';
                    if (selectedLanguage === 'Tamil') return 'chapterName';
                    if (selectedLanguage === 'Russian') return 'Chapter';
                    if (selectedLanguage === 'Hindi') return 'chapter'; // Added Hindi case
                }
                if (selectedField === 'sectionName') {
                    if (selectedLanguage === 'English') return 'section_eng';
                    if (selectedLanguage === 'Tamil') return 'sectionName';
                    if (selectedLanguage === 'Russian') return 'Section';
                    if (selectedLanguage === 'Hindi') return 'section'; // Added Hindi case
                }
                if (selectedField === 'verse') {
                    if (selectedLanguage === 'English' || selectedLanguage === 'Russian') return 'translation';
                    if (selectedLanguage === 'Tamil') return 'verse';
                    if (selectedLanguage === 'Hindi') return 'translation'; // Added Hindi case
                }
                return selectedField;
            })();

            apiUrl = 'http://localhost:5000/api/kurals';
        }

        try {
            const response = await axios.get(apiUrl, { params: { [fieldName]: inputValue, selectedLanguage } });
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
            setShowSearch(false);
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
            <h1>{selectedLanguage === 'Russian' ? 'Поиск Тируккурал' : selectedLanguage === 'Tamil' ? 'திருக்குறளை தேடு' : selectedLanguage === 'Hindi' ? 'तिरुक्कुरल खोजें' : 'Search Thirukkural'}</h1>

            <div>
                <label>{selectedLanguage === 'Russian' ? 'Выберите поле' : selectedLanguage === 'Tamil' ? 'நிலையை தேர்ந்தெடுக்கவும்' : selectedLanguage === 'Hindi' ? 'क्षेत्र चुनें' : 'Select Field'}</label>
                <div className={styles.optionsContainer}>
                    <div className={styles.optionBox} onClick={() => handleInput('chapterName')}>
                        {selectedLanguage === 'Russian' ? 'Название главы' : selectedLanguage === 'Tamil' ? 'அத்தியாயம்' : selectedLanguage === 'Hindi' ? 'अध्याय नाम' : 'Chapter Name'}
                    </div>
                    <div className={styles.optionBox} onClick={() => handleInput('sectionName')}>
                        {selectedLanguage === 'Russian' ? 'Название раздела' : selectedLanguage === 'Tamil' ? 'பிரிவு' : selectedLanguage === 'Hindi' ? 'अनुच्छेद नाम' : 'Section Name'}
                    </div>
                    <div className={styles.optionBox} onClick={() => handleInput('verse')}>
                        {selectedLanguage === 'Russian' ? 'Стих' : selectedLanguage === 'Tamil' ? 'குறள்' : selectedLanguage === 'Hindi' ? 'श्लोक' : 'Verse'}
                    </div>
                    <div className={styles.optionBox} onClick={() => handleInput('inputs')}>
                        {selectedLanguage === 'Russian' ? 'Другие вопросы' : selectedLanguage === 'Tamil' ? 'மற்ற கேள்விகள்' : selectedLanguage === 'Hindi' ? 'अन्य प्रश्न' : 'Other Questions'}
                    </div>
                    <div className={styles.optionBox} onClick={fetchAllDetails}>
                        {selectedLanguage === 'Russian' ? 'Все детали' : selectedLanguage === 'Tamil' ? 'எல்லா விவரங்களும்' : selectedLanguage === 'Hindi' ? 'सभी विवरण' : 'All Details'}
                    </div>
                </div>
            </div>

            {selectedField && (
                <div>
                    <label>{selectedLanguage === 'Russian' ? selectedField === 'chapterName' ? 'Название главы' : selectedField === 'sectionName' ? 'Название раздела' : selectedField === 'verse' ? 'Стих' : 'Введите:' : selectedLanguage === 'Tamil' ? selectedField === 'chapterName' ? 'அத்தியாயம்' : selectedField === 'sectionName' ? 'பிரிவு' : selectedField === 'verse' ? 'குறள்' : 'நுழையவும்:' : selectedLanguage === 'Hindi' ? selectedField === 'chapterName' ? 'अध्याय नाम' : selectedField === 'sectionName' ? 'अनुच्छेद नाम' : selectedField === 'verse' ? 'श्लोक' : 'प्रविष्ट करें:' : selectedField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                    />
                </div>
            )}

            {showSearch && <button onClick={handleSearch}>{selectedLanguage === 'Russian' ? 'Поиск' : selectedLanguage === 'Tamil' ? 'தேடு' : selectedLanguage === 'Hindi' ? 'खोजें' : 'Search'}</button>}

            {error && <p className={styles.error}>{error}</p>}

            <ul>
                {results.length > 0 ? results.map((kural, index) => (
                    <li key={index}>
                        {selectedField === 'inputs' ? (
                            <>
                                <p>{selectedLanguage === 'Russian' ? 'Ответ:' : selectedLanguage === 'Tamil' ? 'பதில்:' : selectedLanguage === 'Hindi' ? 'उत्तर:' : 'Answer:'} {kural.targets}</p>
                                <p>{selectedLanguage === 'Russian' ? 'Номер:' : selectedLanguage === 'Tamil' ? 'எண்:' : selectedLanguage === 'Hindi' ? 'संख्या:' : 'Number:'} {kural.number}</p>
                            </>
                        ) : (
                            <>
                            {selectedLanguage === 'English' ? (
                                <>
                                    <p>Chapter Name: {kural.Chapter_Eng}</p>
                                    <p>Chapter Group: {kural.chapter_group_eng}</p>
                                    <p>Section Name: {kural.section_eng}</p>
                                    <p>Verse{kural.translation || 'Not available'}</p>
                                    <p>Explanation{kural.explanation || 'Not available'}</p>
                                </>
                            ) : selectedLanguage === 'Russian' ? (
                                <>
                                    <p>Название главы: {kural.Chapter || 'Название главы не доступно'}</p>
                                    <p>Группа глав: {kural.Chapter_group || 'Группа глав не доступна'}</p>
                                    <p>Название раздела: {kural.Section || 'Раздел не доступен'}</p>
                                    <p>Стих: {kural.translation || 'Не доступно'}</p>
                                </>
                            ) : selectedLanguage === 'Tamil' ? (
                                <>
                                    <p>அதிகாரம் பெயர்: {kural.chapterName || 'அத்தியாயம் கிடைக்கவில்லை'}</p>
                                    <p>அதிகாரம் குழு: {kural.chapter_group_tamil || 'அத்தியாய குழு கிடைக்கவில்லை'}</p>
                                    <p>பகுதி பெயர்: {kural.sectionName || 'பிரிவு கிடைக்கவில்லை'}</p>
                                    <p>குறள்: {kural.verse || 'குறள் கிடைக்கவில்லை'}</p>
                                </>
                            ) : selectedLanguage === 'Hindi' ? (
                                <>
                                    <p>अध्याय का नाम: {kural.chapter || 'अध्याय नाम उपलब्ध नहीं है'}</p>
                                    <p>अध्याय समूह: {kural.chapter_group || 'अध्याय समूह उपलब्ध नहीं है'}</p>
                                    <p>खंड का नाम: {kural.section || 'अनुच्छेद उपलब्ध नहीं है'}</p>
                                    <p>श्लोक: {kural.translation || 'श्लोक उपलब्ध नहीं है'}</p>
                                </>
                            ) : null}
                            </>
                        )}
                    </li>
                )) : <p>{selectedLanguage === 'Russian' ? 'Нет результатов' : selectedLanguage === 'Tamil' ? 'முடிவுகள் இல்லை' : selectedLanguage === 'Hindi' ? 'कोई परिणाम नहीं' : 'No results found'}</p>}
            </ul>

            {allDetails.length > 0 && (
                <div>
                    <h2>{selectedLanguage === 'Russian' ? 'Все детали' : selectedLanguage === 'Tamil' ? 'எல்லா விவரங்களும்' : selectedLanguage === 'Hindi' ? 'सभी विवरण' : 'All Details'}</h2>
                    <ul>
                        {allDetails.map((chapter) => (
                            <li key={chapter._id}>
                                <h3 onClick={() => toggleChapter(chapter._id)}>
                                    {selectedLanguage === 'Russian' ? chapter.Chapter : selectedLanguage === 'Tamil' ? chapter.chapterName : selectedLanguage === 'Hindi' ? chapter.chapterNameHindi : chapter.Chapter_Eng}
                                </h3>
                                {expandedChapters.includes(chapter._id) && (
                                    <div>
                                        <ul>
                                            {chapter.sections.map((section, sectionIndex) => (
                                                <li key={sectionIndex}>
                                                    <h4 onClick={() => toggleSection(chapter._id, sectionIndex)}>
                                                        {selectedLanguage === 'Russian' ? section.Section : selectedLanguage === 'Tamil' ? section.sectionName : selectedLanguage === 'Hindi' ? section.sectionNameHindi : section.section_eng}
                                                    </h4>
                                                    {expandedSections[chapter._id]?.includes(sectionIndex) && (
                                                        <ul>
                                                            <li>{selectedLanguage === 'Russian' ? 'Стих:' : selectedLanguage === 'Tamil' ? 'குறள்:' : selectedLanguage === 'Hindi' ? 'श्लोक:' : 'Verse:'} {selectedLanguage === 'Russian' ? section.verse : section.verse}</li>
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
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
