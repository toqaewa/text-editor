import React from 'react';
import { getWordCount, getReadingTime } from '../../utils/textFormatter';
import '../../styles/editor.css';

interface StatusBarProps {
  charCount: number;
  lineCount: number;
  selection: { start: number; end: number };
  content: string;
  mode: 'edit' | 'preview';
  onModeChange: (mode: 'edit' | 'preview') => void;
}

const StatusBar: React.FC<StatusBarProps> = ({
  charCount,
  lineCount,
  selection,
  content,
  mode,
  onModeChange,
}) => {
  const wordCount = getWordCount(content);
  const readingTime = getReadingTime(content);
  const selectedText = selection.end > selection.start 
    ? content.substring(selection.start, selection.end) 
    : '';

  return (
    <div className="status-bar">
      <div className="status-left">
        <span>Строк: {lineCount}</span>
        <span>Символов: {charCount}</span>
        <span>Слов: {wordCount}</span>
        <span>Время чтения: {readingTime} мин</span>
        {selection.end > selection.start && (
          <span>Выделено: {selectedText.length} симв.</span>
        )}
      </div>
      
      <div className="status-right">
        <div className="mode-switcher">
          <button
            className={`mode-button ${mode === 'edit' ? 'active' : ''}`}
            onClick={() => onModeChange('edit')}
          >
            Редактор
          </button>
          <button
            className={`mode-button ${mode === 'preview' ? 'active' : ''}`}
            onClick={() => onModeChange('preview')}
          >
            Превью
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;