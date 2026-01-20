import React, { useState, useCallback, useEffect } from 'react';
import Editor from './components/Editor/Editor';
import { markdownToHTML } from './utils/markdownParser';
import './styles/editor.css';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [autoSave, setAutoSave] = useState(true);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const handleExportHTML = useCallback((content: string) => {
    const html = markdownToHTML(content);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <div className="app-controls">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={autoSave} 
              onChange={(e) => setAutoSave(e.target.checked)} 
            />
            <span className="slider">Автосохранение</span>
          </label>
        </div>
      </header>
      
      <main className="app-main">
        <Editor 
          autoSave={autoSave}
          onExportHTML={handleExportHTML}
          theme={theme}
        />
      </main>
    </div>
  );
};

export default App;