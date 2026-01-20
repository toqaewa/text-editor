import { useState, useCallback, useRef, useEffect } from 'react';
import type { TextFormat, TextAlignment } from '../types/editor.types';

export const useEditor = (autoSave: boolean = false) => {
  const [content, setContent] = useState<string>('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [alignment, setAlignment] = useState<TextAlignment>('left');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const timeoutRef = useRef<number | null>(null);

  // Автосохранение
  useEffect(() => {
    if (autoSave && content) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        localStorage.setItem('editor_autosave', content);
        console.log('Автосохранено:', new Date().toLocaleTimeString());
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, autoSave]);

  // Восстановление из автосохранения
  useEffect(() => {
    const saved = localStorage.getItem('editor_autosave');
    if (saved && autoSave) {
      setContent(saved);
    }
  }, [autoSave]);

  const insertText = useCallback((text: string, position?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = position ?? textarea.selectionStart;
    const end = position ?? textarea.selectionEnd;
    
    const newContent = content.substring(0, start) + 
                      text + 
                      content.substring(end);
    
    setContent(newContent);
    
    // Восстанавливаем позицию курсора
    setTimeout(() => {
      const newPosition = start + text.length;
      textarea.selectionStart = textarea.selectionEnd = newPosition;
      textarea.focus();
      setSelection({ start: newPosition, end: newPosition });
    }, 0);
  }, [content]);

  const wrapSelection = useCallback((wrapper: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newText = `${wrapper}${selectedText}${wrapper}`;
    const newContent = content.substring(0, start) + 
                      newText + 
                      content.substring(end);
    
    setContent(newContent);
    
    setTimeout(() => {
      if (selectedText.length === 0) {
        // Если ничего не выделено, курсор между wrapper'ами
        textarea.selectionStart = textarea.selectionEnd = start + wrapper.length;
      } else {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + newText.length;
      }
      textarea.focus();
      setSelection({ 
        start: textarea.selectionStart, 
        end: textarea.selectionEnd 
      });
    }, 0);
  }, [content]);

  const insertLink = useCallback((url: string, text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const linkText = text || selectedText || 'ссылка';
    
    const link = `[${linkText}](${url})`;
    const newContent = content.substring(0, start) + 
                      link + 
                      content.substring(end);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.selectionStart = start;
      textarea.selectionEnd = start + link.length;
      textarea.focus();
      setSelection({ start, end: start + link.length });
    }, 0);
  }, [content]);

  const insertImage = useCallback((url: string, alt: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const image = `![${alt}](${url})`;
    const newContent = content.substring(0, start) + 
                      image + 
                      content.substring(start);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + image.length;
      textarea.focus();
      setSelection({ 
        start: start + image.length, 
        end: start + image.length 
      });
    }, 0);
  }, [content]);

  const insertHeading = useCallback((level: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const hashes = '#'.repeat(level);
    
    let newContent;
    let newSelection;
    
    if (selectedText.length > 0) {
      // Если есть выделенный текст, оборачиваем его
      newContent = content.substring(0, start) + 
                  `${hashes} ${selectedText}` + 
                  content.substring(end);
      newSelection = { 
        start: start, 
        end: start + hashes.length + 1 + selectedText.length 
      };
    } else {
      // Если нет выделения, вставляем заголовок на новой строке
      const beforeCursor = content.substring(0, start);
      const afterCursor = content.substring(start);
      const isStartOfLine = start === 0 || content.charAt(start - 1) === '\n';
      
      if (!isStartOfLine) {
        newContent = beforeCursor + '\n' + hashes + ' ' + afterCursor;
        newSelection = { 
          start: start + hashes.length + 2, 
          end: start + hashes.length + 2 
        };
      } else {
        newContent = beforeCursor + hashes + ' ' + afterCursor;
        newSelection = { 
          start: start + hashes.length + 1, 
          end: start + hashes.length + 1 
        };
      }
    }
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.selectionStart = newSelection.start;
      textarea.selectionEnd = newSelection.end;
      textarea.focus();
      setSelection(newSelection);
    }, 0);
  }, [content]);

  const insertList = useCallback((type: 'bullet' | 'number') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = content.substring(0, start);
    const afterCursor = content.substring(start);
    
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const lineContent = content.substring(lineStart, start);
    
    const bullet = type === 'bullet' ? '* ' : '1. ';
    const newContent = content.substring(0, lineStart) + 
                      bullet + lineContent + 
                      afterCursor;
    
    setContent(newContent);
    
    setTimeout(() => {
      const newPosition = start + bullet.length;
      textarea.selectionStart = textarea.selectionEnd = newPosition;
      textarea.focus();
      setSelection({ start: newPosition, end: newPosition });
    }, 0);
  }, [content]);

  const clearFormatting = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    // Удаляем Markdown форматирование
    const cleanedText = selectedText
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/`(.*?)`/g, '$1');
    
    const newContent = content.substring(0, start) + 
                      cleanedText + 
                      content.substring(end);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.selectionStart = start;
      textarea.selectionEnd = start + cleanedText.length;
      textarea.focus();
      setSelection({ start, end: start + cleanedText.length });
    }, 0);
  }, [content]);

  const duplicateLine = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = content.substring(0, start);
    const afterCursor = content.substring(start);
    
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const lineEnd = afterCursor.indexOf('\n') !== -1 
      ? start + afterCursor.indexOf('\n')
      : content.length;
    
    const lineContent = content.substring(lineStart, lineEnd);
    const newContent = content.substring(0, lineEnd) + 
                      '\n' + lineContent + 
                      content.substring(lineEnd);
    
    setContent(newContent);
    
    setTimeout(() => {
      const newPosition = lineEnd + 1 + lineContent.length;
      textarea.selectionStart = textarea.selectionEnd = newPosition;
      textarea.focus();
      setSelection({ start: newPosition, end: newPosition });
    }, 0);
  }, [content]);

  const deleteLine = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = content.substring(0, start);
    const afterCursor = content.substring(start);
    
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const lineEnd = afterCursor.indexOf('\n') !== -1 
      ? start + afterCursor.indexOf('\n')
      : content.length;
    
    // Сохраняем \n перед строкой если он есть
    const hasNewlineBefore = lineStart > 0 && content.charAt(lineStart - 1) === '\n';
    const deleteStart = hasNewlineBefore ? lineStart - 1 : lineStart;
    
    const newContent = content.substring(0, deleteStart) + 
                      content.substring(lineEnd);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = deleteStart;
      textarea.focus();
      setSelection({ start: deleteStart, end: deleteStart });
    }, 0);
  }, [content]);

  const moveLine = useCallback((direction: 'up' | 'down') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const beforeCursor = content.substring(0, start);
    const afterCursor = content.substring(start);
    
    // Находим текущую строку
    const lineStart = beforeCursor.lastIndexOf('\n') + 1;
    const lineEnd = afterCursor.indexOf('\n') !== -1 
      ? start + afterCursor.indexOf('\n')
      : content.length;
    
    const lineContent = content.substring(lineStart, lineEnd);
    
    if (direction === 'up') {
      // Находим предыдущую строку
      const textBeforeLine = content.substring(0, lineStart);
      const prevLineEnd = lineStart - 1;
      const prevLineStart = textBeforeLine.lastIndexOf('\n', prevLineEnd - 1) + 1;
      
      if (prevLineStart < 0) return; // Уже на первой строке
      
      const prevLineContent = content.substring(prevLineStart, prevLineEnd);
      
      // Меняем строки местами
      const newContent = 
        content.substring(0, prevLineStart) +
        lineContent + '\n' +
        prevLineContent +
        content.substring(lineEnd);
      
      setContent(newContent);
      
      setTimeout(() => {
        const newPosition = prevLineStart;
        textarea.selectionStart = textarea.selectionEnd = newPosition;
        textarea.focus();
        setSelection({ start: newPosition, end: newPosition });
      }, 0);
    } else {
      // Находим следующую строку
      const nextLineStart = lineEnd + 1;
      if (nextLineStart >= content.length) return; // Уже на последней строке
      
      const textAfterLine = content.substring(nextLineStart);
      const nextLineEnd = textAfterLine.indexOf('\n') !== -1 
        ? nextLineStart + textAfterLine.indexOf('\n')
        : content.length;
      
      const nextLineContent = content.substring(nextLineStart, nextLineEnd);
      
      // Меняем строки местами
      const newContent = 
        content.substring(0, lineStart) +
        nextLineContent + '\n' +
        lineContent +
        content.substring(nextLineEnd);
      
      setContent(newContent);
      
      setTimeout(() => {
        const newPosition = lineStart + nextLineContent.length + 1;
        textarea.selectionStart = textarea.selectionEnd = newPosition;
        textarea.focus();
        setSelection({ start: newPosition, end: newPosition });
      }, 0);
    }
  }, [content]);

  return {
    content,
    setContent,
    selection,
    setSelection,
    alignment,
    setAlignment,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    textareaRef,
    insertText,
    wrapSelection,
    insertLink,
    insertImage,
    insertHeading,
    insertList,
    clearFormatting,
    duplicateLine,
    deleteLine,
    moveLine,
  };
};