import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { w } from 'windstitch';

const ThemeToggleButtonContainer = w('div', {
    className: '',
});

const ThemeToggleButton = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkMode = localStorage.getItem('theme') === 'dark';
        setIsDarkMode(darkMode);
        document.documentElement.classList.toggle('dark', darkMode);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
    };

    return (
        <ThemeToggleButtonContainer>
            <button onClick={toggleTheme} className="text-lg">
                {!isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
        </ThemeToggleButtonContainer>
    );
};

export default ThemeToggleButton;