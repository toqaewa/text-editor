import { useCallback } from 'react';

export const useFileOperations = () => {
  const saveToFile = useCallback((content: string, filename: string = 'document.txt') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const loadFromFile = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.md,.html';
      
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('Файл не выбран'));
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      };
      
      input.click();
    });
  }, []);

  const saveToLocalStorage = useCallback((key: string, content: string) => {
    try {
      localStorage.setItem(key, content);
      return true;
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
      return false;
    }
  }, []);

  const loadFromLocalStorage = useCallback((key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Ошибка загрузки из localStorage:', error);
      return null;
    }
  }, []);

  const exportAsHTML = useCallback((content: string, title: string = 'Документ') => {
    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        code {
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div>${content.replace(/\n/g, '<br>')}</div>
</body>
</html>`;
    
    saveToFile(html, `${title}.html`);
  }, [saveToFile]);

  return {
    saveToFile,
    loadFromFile,
    saveToLocalStorage,
    loadFromLocalStorage,
    exportAsHTML,
  };
};