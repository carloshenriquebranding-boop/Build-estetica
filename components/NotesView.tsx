
import * as React from 'react';
import type { Note, Client } from '../types.ts';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
// Fix: Import the Underline extension to make it available to the editor.
import Underline from '@tiptap/extension-underline';
import TextEditorToolbar from './TextEditorToolbar.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';
import { Loader2, Plus as PlusIcon, Save as SaveIcon, Trash as TrashIcon, CheckCircle } from './icons/index.ts';
import ViewHeader from './ViewHeader.tsx';
import { INPUT_CLASSES } from '../constants.ts';

interface NotesViewProps {
  notes: Note[];
  clients: Client[];
  // Fix: Omitted `user_id` from the save handler type.
  onSave: (data: Omit<Note, 'id' | 'user_id'> & { id?: string }) => Promise<Note>;
  onDelete: (id: string) => Promise<void>;
  initialSearchTerm: string;
  onSearchTermChange: (term: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

type SaveState = 'idle' | 'saving' | 'success';

const NotesView: React.FC<NotesViewProps> = ({ notes, clients, onSave, onDelete, initialSearchTerm, onSearchTermChange, showBackButton, onBack }) => {
  const [selectedNote, setSelectedNote] = React.useState<Note | null>(null);
  const [title, setTitle] = React.useState('');
  const [clientId, setClientId] = React.useState<string | null>(null);
  const [saveState, setSaveState] = React.useState<SaveState>('idle');
  const [noteToDelete, setNoteToDelete] = React.useState<Note | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit, 
      Underline, 
      Table.configure({ resizable: true }), 
      TableRow, 
      TableHeader, 
      TableCell, 
      TextStyle, 
      Color
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none p-4 focus:outline-none flex-grow',
      },
    },
  });

  // Effect to load a note found via external navigation (e.g., from client modal)
  React.useEffect(() => {
    if(initialSearchTerm && notes.length > 0) {
        const foundNote = notes.find(n => n.title.toLowerCase().includes(initialSearchTerm.toLowerCase()));
        if (foundNote && foundNote.id !== selectedNote?.id) {
            setSelectedNote(foundNote);
        }
    }
  }, [initialSearchTerm, notes, selectedNote]);

  // Effect to load selected note into the editor fields
  React.useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setClientId(selectedNote.client_id);
      try {
        const content = JSON.parse(selectedNote.content);
        editor?.commands.setContent(content, { emitUpdate: false });
      } catch (e) {
        editor?.commands.setContent(`<p>${selectedNote.content}</p>`, { emitUpdate: false });
      }
    } else {
      setTitle('');
      setClientId(null);
      editor?.commands.clearContent();
    }
  }, [selectedNote, editor]);

  const filteredNotes = React.useMemo(() => {
    return notes
      .filter(note => note.title.toLowerCase().includes(initialSearchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [notes, initialSearchTerm]);

  const handleNewNote = () => {
    setSelectedNote(null);
  };

  const handleSaveNote = async () => {
    if (!title.trim() || !editor) return;
    setSaveState('saving');
    
    const contentJSON = JSON.stringify(editor.getJSON());
    
    // Fix: Removed `user_id` from the payload to match the updated handler signature.
    const noteData = {
        id: selectedNote?.id,
        title,
        content: contentJSON,
        client_id: clientId,
        type: 'standard' as Note['type'],
        tags: [],
        created_at: selectedNote?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    try {
      const savedNote = await onSave(noteData);
      if (!selectedNote) {
          setSelectedNote(savedNote);
      }
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch(error) {
      console.error("Failed to save note:", error);
      setSaveState('idle'); // Reset on error
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;
    await onDelete(noteToDelete.id);
    
    if (selectedNote?.id === noteToDelete.id) {
        handleNewNote();
    }
    setNoteToDelete(null);
  };
  
  const getSaveButtonContent = () => {
    switch(saveState) {
        case 'saving':
            return <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</>;
        case 'success':
            return <><CheckCircle className="w-5 h-5"/> Salvo!</>;
        case 'idle':
        default:
            return <><SaveIcon className="w-5 h-5" /> Salvar</>;
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] gap-6">
        {/* Notes List */}
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <ViewHeader title="Anotações" showBackButton={showBackButton} onBack={onBack}/>
            <button onClick={handleNewNote} title="Nova Anotação" className="p-2 text-pink-500 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/50">
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Pesquisar anotações..."
            value={initialSearchTerm}
            onChange={e => onSearchTermChange(e.target.value)}
            className={`${INPUT_CLASSES} mb-4`}
          />
          <ul className="overflow-y-auto space-y-2 flex-grow">
            {filteredNotes.map(note => (
              <li key={note.id}>
                <button
                  onClick={() => setSelectedNote(note)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${selectedNote?.id === note.id ? 'bg-pink-100 dark:bg-pink-900/50' : 'hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                >
                  <h3 className="font-semibold text-gray-800 dark:text-slate-200 truncate">{note.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Modificado em: {new Date(note.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </button>
              </li>
            ))}
             {filteredNotes.length === 0 && (
                <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-4">Nenhuma anotação encontrada.</p>
             )}
          </ul>
        </aside>

        {/* Editor View */}
        <main className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
          {editor && (
            <>
              <div className="p-4 border-b dark:border-slate-700 space-y-3">
                 <input
                  type="text"
                  placeholder="Título da anotação"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-transparent focus:outline-none text-gray-800 dark:text-slate-100"
                />
                <select 
                  value={clientId || ''}
                  onChange={e => setClientId(e.target.value || null)}
                  className="w-full md:w-1/2 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md px-3 py-1 text-sm focus:outline-none"
                >
                  <option value="">Associar a um cliente (opcional)</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <TextEditorToolbar editor={editor} />
              <div className="flex-grow overflow-y-auto">
                <EditorContent editor={editor} />
              </div>
              <div className="p-4 border-t dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/50">
                <div>
                  {selectedNote && (
                    <button onClick={() => setNoteToDelete(selectedNote)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50">
                      <TrashIcon className="w-4 h-4"/> Excluir
                    </button>
                  )}
                </div>
                <button 
                  onClick={handleSaveNote} 
                  disabled={saveState !== 'idle' || !title.trim()} 
                  className={`flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-lg shadow-md w-36 transition-colors duration-300
                    ${saveState === 'success' ? 'bg-green-500 text-white' : 'bg-pink-500 text-white hover:bg-pink-600'}
                    disabled:bg-opacity-70 disabled:cursor-not-allowed`}
                >
                  {getSaveButtonContent()}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
       {noteToDelete && (
            <ConfirmationModal
                isOpen={!!noteToDelete}
                onClose={() => setNoteToDelete(null)}
                onConfirm={handleDeleteNote}
                title="Excluir Anotação"
            >
                <p>Tem certeza que deseja excluir a anotação <span className="font-bold">{noteToDelete.title}</span>? Esta ação não pode ser desfeita.</p>
            </ConfirmationModal>
        )}
    </>
  );
};

export default NotesView;
