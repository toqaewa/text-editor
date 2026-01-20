export const formatText = (
  text: string,
  start: number,
  end: number,
  format: string
): [string, number, number] => {
  const selectedText = text.substring(start, end);
  const formattedText = `${format}${selectedText}${format}`;
  
  const newText = 
    text.substring(0, start) + 
    formattedText + 
    text.substring(end);
  
  return [newText, start, start + formattedText.length];
};

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const getReadingTime = (text: string): number => {
  const words = getWordCount(text);
  return Math.ceil(words / 200); // 200 слов в минуту
};