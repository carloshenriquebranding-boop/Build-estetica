
import * as React from 'react';
import type { Note, Client, UserProfile, PrescriptionTemplate } from '../types.ts';
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
import { Loader2, Save as SaveIcon, Download as DownloadIcon, Type as TypeIcon, Pencil, FilePlus } from './icons/index.ts';
import ViewHeader from './ViewHeader.tsx';
import { INPUT_CLASSES } from '../constants.ts';

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
  onSaveNote: (note: Omit<Note, 'id' | 'user_id'>) => Promise<void>;
  showBackButton?: boolean;
  onBack?: () => void;
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({ clients, initialTemplate, userProfile, onTemplateChange, onSaveNote, showBackButton, onBack }) => {
  const [template, setTemplate] = React.useState<PrescriptionTemplate['template_data'] | undefined>(initialTemplate?.template_data);
  const [viewMode, setViewMode] = React.useState<ViewMode>('editor');
  const [format, setFormat] = React.useState<PageFormat>('a4');
  const [isSubmittingTemplate, setIsSubmittingTemplate] = React.useState(false);
  const [isSavingNote, setIsSavingNote] = React.useState(false);
  const [selectedClientId, setSelectedClientId] = React.useState<string>('');
  
  const selectedClient = clients.find(c => c.id === selectedClientId);
  
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
    content: '<p>Insira a prescrição para o paciente aqui...</p>',
    editable: viewMode === 'editor',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none flex-grow',
      },
    },
  });
  
  // Effect to initialize template state if one doesn't exist for the user
  React.useEffect(() => {
    if (!initialTemplate?.template_data && userProfile) {
        setTemplate({
            business_name: userProfile.business_name || 'Sua Clínica',
            professional_name: userProfile.name || 'Seu Nome',
            professional_info: 'Sua Especialidade',
            address: userProfile.business_address || 'Seu Endereço',
            contact_info: userProfile.business_phone || 'Seu Contato',
            font_family: 'Poppins',
        });
    } else if (initialTemplate?.template_data) {
        setTemplate(initialTemplate.template_data);
    }
  }, [initialTemplate, userProfile]);
  
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
    
    const newNote: Omit<Note, 'id' | 'user_id'> = {
        title: `Prescrição para ${selectedClient.name} - ${new Date().toLocaleDateString('pt-BR')}`,
        content: JSON.stringify(editor.getJSON()),
        client_id: selectedClientId,
        type: 'prescription',
        tags: ['prescrição'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
  
  const renderSheetContent = () => {
    const wrapperBaseClass = "prescription-wrapper";
    switch (format) {
      case 'a5':
        return (
          <>
            <div className={`${wrapperBaseClass} format-a5`}>
              <PrescriptionContent />
            </div>
            <div className={`${wrapperBaseClass} format-a5`}>
              <PrescriptionContent />
            </div>
          </>
        );
      case 'a6':
        return (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`${wrapperBaseClass} format-a6`}>
                <PrescriptionContent />
              </div>
            ))}
          </>
        );
      case 'a4':
      default:
        return (
          <div className={`${wrapperBaseClass} format-a4`}>
            <PrescriptionContent />
          </div>
        );
    }
  };

  if (!template || !userProfile) {
    return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin"/></div>
  }

  return (
    <div className="flex flex-col h-full">
        <ViewHeader title="Prescrições" showBackButton={showBackButton} onBack={onBack} />
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
                    {editor && <TextEditorToolbar editor={editor} />}
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
                            <input name="business_name" value={template.business_name} onChange={handleTemplateChange} placeholder="Nome do Negócio" className={INPUT_CLASSES}/>
                            <input name="professional_name" value={template.professional_name} onChange={handleTemplateChange} placeholder="Seu Nome" className={INPUT_CLASSES}/>
                            <input name="professional_info" value={template.professional_info} onChange={handleTemplateChange} placeholder="Ex: Esteticista, CRBM 12345" className={INPUT_CLASSES}/>
                            <input name="address" value={template.address} onChange={handleTemplateChange} placeholder="Endereço" className={INPUT_CLASSES}/>
                            <input name="contact_info" value={template.contact_info} onChange={handleTemplateChange} placeholder="Telefone, E-mail, etc." className={INPUT_CLASSES}/>
                            <select name="font_family" value={template.font_family} onChange={handleTemplateChange} className={INPUT_CLASSES}>
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

            <main className="flex-1 bg-gray-50 dark:bg-slate-900 rounded-xl shadow-inner flex flex-col overflow-auto p-4 sm:p-8">
                <div className="a4-sheet text-slate-900 dark:text-slate-200">
                    {renderSheetContent()}
                </div>
            </main>
        </div>
    </div>
  );
};

export default PrescriptionView;
