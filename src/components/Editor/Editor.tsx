import React, { useEffect, useState } from 'react';
import { useEditor } from '../../hooks/useEditor';
import { useHistory } from '../../hooks/useHistory';
import { useFileOperations } from '../../hooks/useFileOperations';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import { markdownToHTML } from '../../utils/markdownParser';
import '../../styles/editor.css';

interface EditorProps {
  autoSave?: boolean;
  theme?: 'light' | 'dark';
  onExportHTML?: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  autoSave = false,
  theme = 'light',
  onExportHTML,
}) => {
  const editor = useEditor(autoSave);
  const history = useHistory<string>(editor.content);
  const fileOps = useFileOperations();
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    history.update(editor.content);
  }, [editor.content]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Сочетания клавиш
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          editor.wrapSelection('**');
          break;
        case 'i':
          e.preventDefault();
          editor.wrapSelection('*');
          break;
        case 'u':
          e.preventDefault();
          editor.wrapSelection('__');
          break;
        case 'e':
          e.preventDefault();
          editor.wrapSelection('`');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            history.redo();
          } else {
            history.undo();
          }
          break;
      }
    }
  };

  const handleInsertLink = () => {
    const url = prompt('Введите URL ссылки:', 'https://');
    const text = prompt('Введите текст ссылки:', '');
    if (url) {
      editor.insertLink(url, text || '');
    }
  };

  const handleInsertImage = () => {
    const url = prompt('Введите URL изображения:', 'https://');
    const alt = prompt('Введите описание изображения:', '');
    if (url) {
      editor.insertImage(url, alt || '');
    }
  };

  const handleSave = () => {
    const filename = prompt('Введите имя файла:', 'document.txt');
    if (filename) {
      fileOps.saveToFile(editor.content, filename);
    }
  };

  const handleLoad = async () => {
    try {
      const content = await fileOps.loadFromFile();
      editor.setContent(content);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      alert('Не удалось загрузить файл');
    }
  };

  const handleExport = (format: 'txt' | 'html' | 'pdf') => {
    switch (format) {
      case 'txt':
        fileOps.saveToFile(editor.content, 'document.txt');
        break;
      case 'html':
        if (onExportHTML) {
          onExportHTML(editor.content);
        } else {
          fileOps.exportAsHTML(editor.content, 'Документ');
        }
        break;
      case 'pdf':
        alert('Экспорт в PDF пока не реализован. Используйте браузерную печать (Ctrl+P)');
        break;
    }
  };

  const handleInsertList = (type: 'bullet' | 'number') => {
    if (type === 'bullet') {
      editor.insertText('* ');
    } else {
      editor.insertText('1. ');
    }
  };

  return (
    <div className={`editor-container ${theme === 'dark' ? 'dark' : ''}`}>
      <Toolbar
        onBold={() => editor.wrapSelection('**')}
        onItalic={() => editor.wrapSelection('*')}
        onUnderline={() => editor.wrapSelection('__')}
        onCode={() => editor.wrapSelection('`')}
        onHeading={editor.insertHeading}
        onList={handleInsertList}
        onLink={handleInsertLink}
        onImage={handleInsertImage}
        onUndo={history.undo}
        onRedo={history.redo}
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        alignment={editor.alignment}
        onAlignmentChange={editor.setAlignment}
        fontSize={editor.fontSize}
        onFontSizeChange={editor.setFontSize}
        fontFamily={editor.fontFamily}
        onFontFamilyChange={editor.setFontFamily}
      />
      
      <div className="editor-content">
        {mode === 'edit' ? (
          <textarea
            ref={editor.textareaRef}
            className="editor-textarea"
            value={editor.content}
            onChange={(e) => editor.setContent(e.target.value)}
            onSelect={(e) => {
              const target = e.target as HTMLTextAreaElement;
              editor.setSelection({
                start: target.selectionStart,
                end: target.selectionEnd,
              });
            }}
            onKeyDown={handleKeyDown}
            placeholder="Начните печатать..."
            spellCheck={true}
            style={{
              fontSize: `${editor.fontSize}px`,
              fontFamily: editor.fontFamily,
            }}
          />
        ) : (
          <div className="preview-container">
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: markdownToHTML(editor.content) }}
            />
          </div>
        )}
      </div>
      
      <StatusBar
        charCount={editor.content.length}
        lineCount={editor.content.split('\n').length}
        selection={editor.selection}
        content={editor.content}
        mode={mode}
        onModeChange={setMode}
      />
    </div>
  );
};

export default Editor;