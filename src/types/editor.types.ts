export type TextFormat = 'bold' | 'italic' | 'underline' | 'code';
export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

export interface EditorState {
  content: string;
  selection: {
    start: number;
    end: number;
    direction?: 'forward' | 'backward' | 'none';
  };
  history: {
    past: string[];
    future: string[];
  };
  format: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    code: boolean;
  };
}