import * as React from 'react';
import type { Editor } from '@tiptap/core';
import { Bold } from './icons/Bold.tsx';
import { Italic } from './icons/Italic.tsx';
import { Underline as UnderlineIcon } from './icons/Underline.tsx';
import { Table as TableIcon } from './icons/Table.tsx';
import { List } from './icons/List.tsx';
import { ListOrdered } from './icons/ListOrdered.tsx';
import { ChevronsUpDown as ChevronsUpDownIcon } from './icons/ChevronsUpDown.tsx';
import { Trash } from './icons/Trash.tsx';
import TableCreator from './TableCreator.tsx';
import { Type as TypeIcon } from './icons/Type.tsx';
import { Eraser } from './icons/Eraser.tsx';
import Dropdown from './Dropdown.tsx';

const ToolbarButton: React.FC<{ onClick?: () => void; isActive?: boolean; children: React.ReactNode, title: string }> = ({ onClick, isActive, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-2 rounded-md transition-colors ${
      isActive
        ? 'bg-pink-600 text-white'
        : 'hover:bg-gray-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300'
    }`}
  >
    {children}
  </button>
);

const ColorPickerButton: React.FC<{ editor: Editor }> = ({ editor }) => {
    const currentColor = editor.getAttributes('textStyle').color;

    return (
        <div className="relative" title="Cor do Texto">
            <input
                type="color"
                onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="p-2 rounded-md text-slate-700 dark:text-slate-300 pointer-events-none">
                <div className="relative">
                    <TypeIcon className="w-5 h-5" />
                    <div className="absolute bottom-0 left-1 right-1 h-1 rounded" style={{ backgroundColor: currentColor || 'transparent' }}></div>
                </div>
            </div>
        </div>
    );
};


const TextEditorToolbar: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }
  
  const handleInsertTable = (rows: number, cols: number) => {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  };

  return (
    <div className="p-2 border-b dark:border-slate-700 flex flex-wrap items-center gap-2 bg-gray-50 dark:bg-slate-800/50">
      <ToolbarButton onClick={() => editor.chain().focus().toggleMark('bold').run()} isActive={editor.isActive('bold')} title="Negrito">
        <Bold className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleMark('italic').run()} isActive={editor.isActive('italic')} title="Itálico">
        <Italic className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Sublinhado">
        <UnderlineIcon className="w-5 h-5" />
      </ToolbarButton>
      <div className="h-6 border-l border-gray-300 dark:border-slate-600 mx-2"></div>
      <ColorPickerButton editor={editor} />
      <ToolbarButton onClick={() => editor.chain().focus().unsetColor().run()} title="Remover Cor">
        <Eraser className="w-5 h-5" />
      </ToolbarButton>
      <div className="h-6 border-l border-gray-300 dark:border-slate-600 mx-2"></div>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Lista com Marcadores">
        <List className="w-5 h-5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Lista Numerada">
        <ListOrdered className="w-5 h-5" />
      </ToolbarButton>
       <div className="h-6 border-l border-gray-300 dark:border-slate-600 mx-2"></div>
      <Dropdown
        trigger={
            <div className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <TableIcon className="w-5 h-5"/>
                <ChevronsUpDownIcon className="w-4 h-4"/>
            </div>
        }
      >
        <TableCreator onSelect={handleInsertTable} />
      </Dropdown>
       {editor.isActive('table') && (
        <>
            <div className="h-6 border-l border-gray-300 dark:border-slate-600 mx-2"></div>
            <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} title="Deletar Tabela">
               <Trash className="w-5 h-5 text-red-500"/>
            </ToolbarButton>
        </>
       )}

    </div>
  );
};

export default TextEditorToolbar;