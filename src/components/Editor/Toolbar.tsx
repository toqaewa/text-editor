import React from 'react';
import Button from '../UI/Button';
import Icon from '../UI/Icon';
import Select from '../UI/Select';
import '../../styles/editor.css';

interface ToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onCode: () => void;
  onHeading: (level: number) => void;
  onList: (type: 'bullet' | 'number') => void;
  onLink: () => void;
  onImage: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: (format: 'txt' | 'html' | 'pdf') => void;
  canUndo: boolean;
  canRedo: boolean;
  alignment: string;
  onAlignmentChange: (align: 'left' | 'center' | 'right' | 'justify') => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onBold,
  onItalic,
  onUnderline,
  onCode,
  onHeading,
  onList,
  onLink,
  onImage,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onExport,
  canUndo,
  canRedo,
  alignment,
  onAlignmentChange,
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange,
}) => {
  const headingOptions = [
    { value: 0, label: 'Обычный текст' },
    { value: 1, label: 'Заголовок 1' },
    { value: 2, label: 'Заголовок 2' },
    { value: 3, label: 'Заголовок 3' },
    { value: 4, label: 'Заголовок 4' },
  ];

  const fontSizeOptions = [
    { value: 12, label: '12px' },
    { value: 14, label: '14px' },
    { value: 16, label: '16px' },
    { value: 18, label: '18px' },
    { value: 20, label: '20px' },
    { value: 24, label: '24px' },
    { value: 32, label: '32px' },
  ];

  const fontFamilyOptions = [
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: "'Times New Roman', serif", label: 'Times New Roman' },
    { value: "'Courier New', monospace", label: 'Courier New' },
    { value: "'Georgia', serif", label: 'Georgia' },
    { value: "'Verdana', sans-serif", label: 'Verdana' },
    { value: "'Trebuchet MS', sans-serif", label: 'Trebuchet MS' },
  ];

  const exportOptions = [
    { value: 'txt', label: 'TXT' },
    { value: 'html', label: 'HTML' },
    { value: 'pdf', label: 'PDF' },
  ];

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <Button
          title="Отменить (Ctrl+Z)"
          onClick={onUndo}
          disabled={!canUndo}
          className="toolbar-button"
        >
          <Icon>↶</Icon>
        </Button>
        <Button
          title="Повторить (Ctrl+Shift+Z)"
          onClick={onRedo}
          disabled={!canRedo}
          className="toolbar-button"
        >
          <Icon>↷</Icon>
        </Button>
        <div className="toolbar-divider" />
      </div>

      <div className="toolbar-group">
        <Select
          options={fontFamilyOptions}
          value={fontFamily}
          onChange={(val) => onFontFamilyChange(String(val))}
          size="sm"
          variant="ghost"
          className="font-select"
        />
        
        <Select
          options={fontSizeOptions}
          value={fontSize}
          onChange={(val) => onFontSizeChange(Number(val))}
          size="sm"
          variant="ghost"
          className="size-select"
        />
      </div>

      <div className="toolbar-group">
        <Select
          options={headingOptions}
          value={0}
          onChange={(val) => onHeading(Number(val))}
          placeholder="Заголовок"
          size="sm"
          variant="ghost"
          className="heading-select"
        />
      </div>

      <div className="toolbar-group">
        <Button 
          title="Жирный (Ctrl+B)" 
          onClick={onBold}
          className="toolbar-button"
        >
          <Icon>𝐁</Icon>
        </Button>
        <Button 
          title="Курсив (Ctrl+I)" 
          onClick={onItalic}
          className="toolbar-button"
        >
          <Icon>𝐼</Icon>
        </Button>
        <Button 
          title="Подчеркнутый (Ctrl+U)" 
          onClick={onUnderline}
          className="toolbar-button"
        >
          <Icon>𝑈</Icon>
        </Button>
        <Button 
          title="Код (Ctrl+E)" 
          onClick={onCode}
          className="toolbar-button"
        >
          <Icon>&lt;/&gt;</Icon>
        </Button>
      </div>

      <div className="toolbar-group">
        <Button 
          title="Маркированный список" 
          onClick={() => onList('bullet')}
          className="toolbar-button"
        >
          <Icon>•</Icon>
        </Button>
        <Button 
          title="Нумерованный список" 
          onClick={() => onList('number')}
          className="toolbar-button"
        >
          <Icon>1.</Icon>
        </Button>
      </div>

      <div className="toolbar-group">
        <Button 
          title="Ссылка" 
          onClick={onLink}
          className="toolbar-button"
        >
          <Icon>🔗</Icon>
        </Button>
        <Button 
          title="Изображение" 
          onClick={onImage}
          className="toolbar-button"
        >
          <Icon>🖼️</Icon>
        </Button>
      </div>

      <div className="toolbar-group">
        <Button
          title="Выравнивание по левому краю"
          onClick={() => onAlignmentChange('left')}
          active={alignment === 'left'}
          className="toolbar-button"
        >
          <Icon>⎸--</Icon>
        </Button>
        <Button
          title="Выравнивание по центру"
          onClick={() => onAlignmentChange('center')}
          active={alignment === 'center'}
          className="toolbar-button"
        >
          <Icon>-⎹-</Icon>
        </Button>
        <Button
          title="Выравнивание по правому краю"
          onClick={() => onAlignmentChange('right')}
          active={alignment === 'right'}
          className="toolbar-button"
        >
          <Icon>--⎸</Icon>
        </Button>
        <Button
          title="Выравнивание по ширине"
          onClick={() => onAlignmentChange('justify')}
          active={alignment === 'justify'}
          className="toolbar-button"
        >
          <Icon>⎹--⎸</Icon>
        </Button>
      </div>

      <div className="toolbar-group" style={{ marginLeft: 'auto' }}>
        <Select
          options={exportOptions}
          value=""
          onChange={(val) => onExport(val as 'txt' | 'html' | 'pdf')}
          placeholder="Экспорт"
          size="sm"
          className="export-select"
        />
        
        <Button 
          title="Сохранить" 
          onClick={onSave}
          className="toolbar-button save-button"
        >
          <Icon>💾</Icon>
        </Button>
        <Button 
          title="Загрузить" 
          onClick={onLoad}
          className="toolbar-button load-button"
        >
          <Icon>📂</Icon>
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;