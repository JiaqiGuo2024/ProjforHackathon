import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Quote,
  List,
  ListOrdered,
  Link,
  Image,
  Sigma,
  MessageSquare,
  Undo,
  Redo,
  Save
} from 'lucide-react';

interface EditorToolbarProps {
  editor: any;
  onSave?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onSave,
  canUndo = false,
  canRedo = false,
}) => {
  if (!editor) {
    return null;
  }

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive = false, disabled = false, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? 'bg-primary-100 text-primary-700'
          : disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );

  const insertMath = () => {
    const selection = editor.state.selection;
    const text = editor.state.doc.textBetween(selection.from, selection.to);
    
    if (text) {
      editor.chain().focus().insertContent(`$${text}$`).run();
    } else {
      editor.chain().focus().insertContent('$formula$').run();
    }
  };

  const insertBlockMath = () => {
    editor.chain().focus().insertContent('\n$$\nformula\n$$\n').run();
  };

  return (
    <div className="flex items-center space-x-1 p-3 border-b border-gray-200 bg-gray-50">
      {/* History */}
      <div className="flex items-center space-x-1 mr-3">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!canUndo}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!canRedo}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Text Formatting */}
      <div className="flex items-center space-x-1 mr-3">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Headings */}
      <div className="flex items-center space-x-1 mr-3">
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? 1 :
            editor.isActive('heading', { level: 2 }) ? 2 :
            editor.isActive('heading', { level: 3 }) ? 3 :
            editor.isActive('heading', { level: 4 }) ? 4 :
            editor.isActive('heading', { level: 5 }) ? 5 :
            editor.isActive('heading', { level: 6 }) ? 6 : 0
          }
          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value={0}>Paragraph</option>
          <option value={1}>Heading 1</option>
          <option value={2}>Heading 2</option>
          <option value={3}>Heading 3</option>
          <option value={4}>Heading 4</option>
          <option value={5}>Heading 5</option>
          <option value={6}>Heading 6</option>
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Lists and Quotes */}
      <div className="flex items-center space-x-1 mr-3">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Math */}
      <div className="flex items-center space-x-1 mr-3">
        <ToolbarButton
          onClick={insertMath}
          title="Inline Math"
        >
          <Sigma className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={insertBlockMath}
          title="Block Math"
        >
          <div className="flex flex-col items-center">
            <Sigma className="h-3 w-3" />
            <div className="w-3 h-px bg-current" />
          </div>
        </ToolbarButton>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      {/* Media and Links */}
      <div className="flex items-center space-x-1 mr-3">
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter link URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          <Link className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt('Enter image URL:');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Add Image"
        >
          <Image className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const content = window.prompt('Add comment:');
            if (content) {
              // Add comment functionality would be implemented here
              console.log('Comment:', content);
            }
          }}
          title="Add Comment"
        >
          <MessageSquare className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Save */}
      {onSave && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <ToolbarButton
            onClick={onSave}
            title="Save Document"
          >
            <Save className="h-4 w-4" />
          </ToolbarButton>
        </>
      )}
    </div>
  );
};