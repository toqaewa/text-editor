import { useState, useCallback } from 'react';

export const useSelection = () => {
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
    direction: 'none' as 'forward' | 'backward' | 'none',
  });

  const updateSelection = useCallback((
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none'
  ) => {
    setSelection({ start, end, direction: direction || 'none' });
  }, []);

  const getSelectedText = useCallback((content: string) => {
    if (selection.start === selection.end) return '';
    return content.substring(selection.start, selection.end);
  }, [selection]);

  const selectAll = useCallback((content: string) => {
    setSelection({
      start: 0,
      end: content.length,
      direction: 'forward',
    });
  }, []);

  const selectLine = useCallback((content: string, cursorPosition: number) => {
    const textBeforeCursor = content.substring(0, cursorPosition);
    const textAfterCursor = content.substring(cursorPosition);
    
    const lineStart = textBeforeCursor.lastIndexOf('\n') + 1;
    const lineEnd = textAfterCursor.indexOf('\n') !== -1 
      ? cursorPosition + textAfterCursor.indexOf('\n')
      : content.length;
    
    setSelection({
      start: lineStart,
      end: lineEnd,
      direction: 'forward',
    });
  }, []);

  const selectWord = useCallback((content: string, cursorPosition: number) => {
    const wordRegex = /[\wа-яА-ЯёЁ]+/g;
    let match;
    
    while ((match = wordRegex.exec(content)) !== null) {
      if (cursorPosition >= match.index && 
          cursorPosition <= match.index + match[0].length) {
        setSelection({
          start: match.index,
          end: match.index + match[0].length,
          direction: 'forward',
        });
        return;
      }
    }
  }, []);

  return {
    selection,
    updateSelection,
    getSelectedText,
    selectAll,
    selectLine,
    selectWord,
  };
};