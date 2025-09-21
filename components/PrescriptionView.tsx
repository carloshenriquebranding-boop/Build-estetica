import * as React from 'react';
import type { Note, Client, UserProfile, PrescriptionTemplate } from '../types.ts';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TextEditorToolbar from './TextEditorToolbar.tsx';
// Fix: Removed 'FilePlus' from the icon imports as it is defined locally within the component file and not exported from the main icons index, resolving a module not found error.
import { Loader2, Save as SaveIcon, Download as DownloadIcon, Type as TypeIcon, Pencil, ArrowLeft } from './icons/index.ts';

type ViewMode = 'editor' | 'template';
type PageFormat = 'a4' | 'a5' | 'a6';

const SettingGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-base font-semibold text-gray-700 dark:text-slate-300 mb-2">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

interface PrescriptionViewProps {
  clients: Client[];
  initialTemplate: PrescriptionTemplate | null;
  userProfile: UserProfile | null;
  onTemplateChange: (updatedTemplateData: PrescriptionTemplate['template_data']) => Promise<void>;
  onSaveNote: (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  showBackButton?: boolean;
  onBack?: () => void;
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({ clients, initialTemplate, userProfile, onTemplateChange, onSaveNote, showBackButton, onBack }) => {
  const [template, setTemplate] = React.useState(initialTemplate?.template_data);
  const [viewMode, setViewMode] = React.useState<ViewMode>('editor');
  const [format, setFormat] = React.useState<PageFormat>('a4');
  const [isSubmittingTemplate, setIsSubmittingTemplate] = React.useState(false);
  const [isSavingNote, setIsSavingNote] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState<string>('');
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  
  const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500";

  const editor = useEditor({
    extensions: [StarterKit, Underline, Table.configure({ resizable: true }), TableRow, TableHeader, TableCell, TextStyle, Color],
    content: '<p>Insira a prescrição para o paciente aqui...</p>',
    editable: viewMode === 'editor',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none flex-grow',
      },
    },
  });
  
  React.useEffect(() => {
    editor?.setEditable(viewMode === 'editor');
  }, [viewMode, editor]);
  
  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTemplate(prev => ({...prev!, [name]: value}));
  };
  
  const handleSaveTemplate = async () => {
    if (!template) return;
    setIsSubmittingTemplate(true);
    await onTemplateChange(template);
    setIsSubmittingTemplate(false);
    alert("Modelo salvo com sucesso!");
  };

  const handleSaveAsNote = async () => {
    if (!selectedClient || !editor?.getText().trim()) {
        alert("Por favor, selecione um paciente и escreva a prescrição antes de salvar.");
        return;
    }
    setIsSavingNote(true);
    
    const newNote: Omit<Note, 'id' | 'created_at' | 'updated_at'> = {
        title: `Prescrição para ${selectedClient.name} - ${new Date().toLocaleDateString('pt-BR')}`,
        content: JSON.stringify(editor.getJSON()),
        client_id: selectedClientId,
        type: 'prescription',
        tags: ['prescrição'],
        user_id: initialTemplate?.user_id,
    };
    await onSaveNote(newNote);
    setIsSavingNote(false);
  }
  
  const handlePrint = () => {
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Prescrição - ${selectedClient?.name || ''}</title>
              <style>
                body { font-family: ${template?.font_family || 'sans-serif'}; color: #333; margin: 20mm; }
                hr { border: 0; border-top: 1px solid #ccc; margin: 1.5rem 0; }
                .header, .footer { text-align: center; }
                .header h1 { margin: 0; font-size: 1.5rem; }
                .header p { margin: 2px 0; font-size: 0.9rem; }
                .client-info { margin: 1.5rem 0; }
                .footer p { margin: 2px 0; font-size: 0.8rem; color: #555; }
                .prose { max-width: 100%; line-height: 1.6; }
                .prose p { margin: 0.5em 0; }
                @media print {
                    body { margin: 0; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>${template?.business_name}</h1>
                <p>${template?.professional_name}</p>
                <p>${template?.professional_info}</p>
              </div>
              <hr/>
              ${selectedClient ? `<div class="client-info"><p><strong>Paciente:</strong> ${selectedClient.name}</p></div>` : ''}
              <div class="prose">${editor?.getHTML() || ''}</div>
              <hr/>
              <div class="footer">
                <p>${template?.address}</p>
                <p>${template?.contact_info}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
  };

  const formats: { id: PageFormat, label: string }[] = [ { id: 'a4', label: 'A4' }, { id: 'a5', label: 'A5' }, { id: 'a6', label: 'A6' } ];

  const PrescriptionContent = () => (
    <>
      <header className="text-center pt-8 px-8">
        <h1 className="text-2xl font-bold">{template?.business_name}</h1>
        <p>{template?.professional_name}</p>
        <p className="text-sm">{template?.professional_info}</p>
      </header>
      <hr className="my-4"/>
      <div className="px-8">
        <p><strong>Paciente:</strong> {selectedClient?.name || '________________'}</p>
      </div>
      <EditorContent editor={editor} className={`px-8 flex-grow flex flex-col ${viewMode === 'template' ? 'opacity-50 pointer-events-none' : ''}`}/>
      <footer className="text-center pb-8 px-8 mt-auto pt-4">
         <hr className="my-4"/>
         <p className="text-sm">{template?.address}</p>
         <p className="text-sm">{template?.contact_info}</p>
      </footer>
    </>
  );

  if (!template || !userProfile) {
    return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin"/></div>
  }

  return (
    <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6">
            {showBackButton && (
              <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-700 dark:text-slate-200">Prescrições</h1>
        </div>
        <div className="flex flex-col md:flex-row flex-grow gap-6">
            <aside className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col gap-6">
                <SettingGroup title="Modo de Visualização">
                    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
                        <button onClick={() => setViewMode('editor')} className={`w-full py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${viewMode === 'editor' ? 'bg-white dark:bg-slate-500 shadow' : 'text-gray-600 dark:text-slate-300'}`}><Pencil className="w-4 h-4"/> Editor</button>
                        <button onClick={() => setViewMode('template')} className={`w-full py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${viewMode === 'template' ? 'bg-white dark:bg-slate-500 shadow' : 'text-gray-600 dark:text-slate-300'}`}><TypeIcon className="w-4 h-4"/> Modelo</button>
                    </div>
                </SettingGroup>
                
                {viewMode === 'editor' ? (
                    <>
                    <SettingGroup title="Documento">
                        <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500">
                            <option value="">Selecione um paciente</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
                        {formats.map(f => <button key={f.id} onClick={() => setFormat(f.id)} className={`w-full py-1.5 rounded-md text-sm font-semibold ${format === f.id ? 'bg-white dark:bg-slate-500 shadow' : 'text-gray-600 dark:text-slate-300'}`}>{f.label}</button>)}
                        </div>
                    </SettingGroup>
                    <div className="space-y-3 mt-auto pt-4">
                        <button onClick={handleSaveAsNote} disabled={isSavingNote || !selectedClientId} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed">
                            {isSavingNote ? <Loader2 className="w-5 h-5 animate-spin"/> : <><FilePlus className="w-5 h-5"/> Salvar como Anotação</>}
                        </button>
                        <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
                            <DownloadIcon className="w-5 h-5"/> Imprimir / PDF
                        </button>
                    </div>
                    </>
                ) : (
                    template && <div className="space-y-4 overflow-y-auto flex-grow pr-2">
                        <SettingGroup title="Personalizar Modelo">
                            <input name="business_name" value={template.business_name} onChange={handleTemplateChange} placeholder="Nome do Negócio" className={inputClasses}/>
                            <input name="professional_name" value={template.professional_name} onChange={handleTemplateChange} placeholder="Seu Nome" className={inputClasses}/>
                            <input name="professional_info" value={template.professional_info} onChange={handleTemplateChange} placeholder="Ex: Esteticista, CRBM 12345" className={inputClasses}/>
                            <input name="address" value={template.address} onChange={handleTemplateChange} placeholder="Endereço" className={inputClasses}/>
                            <input name="contact_info" value={template.contact_info} onChange={handleTemplateChange} placeholder="Telefone, E-mail, etc." className={inputClasses}/>
                            <select name="font_family" value={template.font_family} onChange={handleTemplateChange} className={inputClasses}>
                                <option>Poppins</option><option>Arial</option><option>Verdana</option><option>Times New Roman</option><option>Courier New</option><option>Lato</option><option>Roboto</option><option>Montserrat</option><option>Merriweather</option>
                            </select>
                        </SettingGroup>
                        <div className="mt-auto pt-4">
                            <button onClick={handleSaveTemplate} disabled={isSubmittingTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 disabled:bg-pink-300">
                                {isSubmittingTemplate ? <Loader2 className="w-5 h-5 animate-spin"/> : <><SaveIcon className="w-5 h-5"/> Salvar Modelo</>}
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            <main className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
                {viewMode === 'editor' && editor && <TextEditorToolbar editor={editor} />}
                <div className="a4-sheet-container flex-grow" style={{ fontFamily: template?.font_family }}>
                    <div className="a4-sheet text-slate-900 dark:text-slate-200">
                        <div className={`prescription-wrapper format-${format}`}><PrescriptionContent /></div>
                        {format === 'a6' && (<div className={`prescription-wrapper format-${format} border-l-0`}><PrescriptionContent /></div>)}
                    </div>
                </div>
            </main>
        </div>
    </div>
  );
};
// Add a new icon that might be needed
const FilePlus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="12" y1="18" x2="12" y2="12"></line>
    <line x1="9" y1="15" x2="15" y2="15"></line>
  </svg>
);
export default PrescriptionView;