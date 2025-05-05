import { useDispatch, useSelector } from 'react-redux';
import { ToggleButton } from 'react-bootstrap';
import { useEffect } from 'react';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };
  useEffect(() => {
    const theme = darkMode ? 'dark-theme' : 'light-theme';
    document.body.className = theme;
  }, [darkMode]);

  return (
    <div className="position-fixed top-0 end-0 p-3">
      <ToggleButton
        type="checkbox"
        variant={darkMode ? 'light' : 'dark'}
        checked={darkMode}
        value="1"
        onClick={toggleTheme}
      >
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </ToggleButton>
    </div>
  );
};

export default ThemeToggle;
