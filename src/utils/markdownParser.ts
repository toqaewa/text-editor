export const markdownToHTML = (markdown: string): string => {
  let html = markdown;
  
  // Заголовки
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Жирный текст
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Курсив
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Зачеркнутый текст
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
  
  // Код
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Блоки кода
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Списки
  html = html.replace(/^\s*\* (.*$)/gm, '<li>$1</li>');
  html = html.replace(/^\s*\- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Нумерованные списки
  html = html.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');
  
  // Ссылки
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Изображения
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  
  // Горизонтальная линия
  html = html.replace(/^\*\*\*$/gm, '<hr>');
  html = html.replace(/^---$/gm, '<hr>');
  
  // Цитаты
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  
  // Абзацы
  const lines = html.split('\n');
  let inParagraph = false;
  let result: string[] = [];
  
  for (const line of lines) {
    if (line.trim() === '') {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push('');
    } else if (!line.startsWith('<') || line.startsWith('<li>')) {
      if (!inParagraph) {
        result.push('<p>');
        inParagraph = true;
      }
      result.push(line);
    } else {
      if (inParagraph) {
        result.push('</p>');
        inParagraph = false;
      }
      result.push(line);
    }
  }
  
  if (inParagraph) {
    result.push('</p>');
  }
  
  return result.join('\n');
};

export const htmlToMarkdown = (html: string): string => {
  let markdown = html;
  
  // Заголовки
  markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n');
  markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n');
  markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n');
  
  // Жирный текст
  markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');
  
  // Курсив
  markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
  markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');
  
  // Зачеркнутый текст
  markdown = markdown.replace(/<del>(.*?)<\/del>/g, '~~$1~~');
  
  // Код
  markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
  
  // Блоки кода
  markdown = markdown.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```');
  
  // Списки
  markdown = markdown.replace(/<ul>\n?((?:<li>.*<\/li>\n?)+)<\/ul>/g, (match, list) => {
    return list.replace(/<li>(.*?)<\/li>/g, '* $1\n');
  });
  
  // Нумерованные списки
  markdown = markdown.replace(/<ol>\n?((?:<li>.*<\/li>\n?)+)<\/ol>/g, (match, list) => {
    let counter = 1;
    return list.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`);
  });
  
  // Ссылки
  markdown = markdown.replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
  
  // Изображения
  markdown = markdown.replace(/<img src="([^"]+)" alt="([^"]*)"[^>]*>/g, '![$2]($1)');
  
  // Горизонтальная линия
  markdown = markdown.replace(/<hr\/?>/g, '---\n');
  
  // Цитаты
  markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1\n');
  
  // Абзацы
  markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
  
  // Удаление лишних тегов
  markdown = markdown.replace(/<[^>]*>/g, '');
  
  // Очистка
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  
  return markdown.trim();
};