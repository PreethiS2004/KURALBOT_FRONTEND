import React from 'react';
import styles from './language.module.css'; // Import the CSS module

const LanguageSelection = ({ onLanguageChange }) => {
    const handleLanguageChange = (language) => {
        onLanguageChange(language); // Send the selected language to the parent component
    };

    return (
        <div className={styles.languageSelection}>
            <label className={styles.c1}>Select Language:</label>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={() => handleLanguageChange('Tamil')}>
                    Tamil
                </button>
                <button className={styles.button} onClick={() => handleLanguageChange('English')}>
                    English
                </button>
                <button className={styles.button} onClick={() => handleLanguageChange('Russian')}>
                    Russian
                </button>
                <button className={styles.button} onClick={() => handleLanguageChange('Hindi')}>
                    Hindi
                </button>
            </div>
        </div>
    );
};

export default LanguageSelection;
//Араттуппаал,Порутпаал
