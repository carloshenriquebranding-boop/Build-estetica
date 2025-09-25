
import * as React from 'react';
import type { BudgetTemplateData, UserProfile, Client, Budget, BudgetItem, Service, Stage } from '../types.ts';
import ColorPicker from './ColorPicker.tsx';
import LogoUploader from './LogoUploader.tsx';
import NewBudgetModal from './NewBudgetModal.tsx';
import { Save, Loader2, Send, Plus, Trash, X } from './icons/index.ts';
import { INPUT_CLASSES } from '../constants.ts';
import TemplateClassic from './budget_templates/TemplateClassic.tsx';
import TemplateModern from './budget_templates/TemplateModern.tsx';
import TemplateCreative from './budget_templates/TemplateCreative.tsx';
import ViewHeader from './ViewHeader.tsx';

interface BudgetEditorProps {
  initialBudget: Budget;
  clients: Client[];
  services: Service[];
  stages: Stage[];
  userProfile: UserProfile;
  initialTemplateData: BudgetTemplateData;
  onTemplateSave: (data: BudgetTemplateData) => Promise<void>;
  onSave: (budget: Budget) => Promise<Budget>;
  onAddClient: (clientData: Omit<Client, 'id' | 'user_id' | 'stage_id' | 'created_at'>, stageId: string) => Promise<Client | undefined>;
  onBack: () => void;
}

const ControlPanelSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-gray-200 dark:border-slate-700 pb-4 mb-4">
    <h3 className="font-semibold text-gray-800 dark:text-slate-200 mb-3">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const TemplateCustomizerView: React.FC<BudgetEditorProps> = (props) => {
  const { initialBudget, clients, services, stages, userProfile, initialTemplateData, onTemplateSave, onSave, onAddClient, onBack } = props;
  
  const [budget, setBudget] = React.useState<Budget>(initialBudget);
  const [design, setDesign] = React.useState<BudgetTemplateData>(initialTemplateData);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isNewClientModalOpen, setNewClientModalOpen] = React.useState(false);

  const client = React.useMemo(() => clients.find(c => c.id === budget.client_id), [clients, budget.client_id]);

  React.useEffect(() => {
    const total = budget.items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0), 0);
    setBudget(b => ({ ...b, total }));
  }, [budget.items]);

  const handleClientChange = (clientId: string) => {
    setBudget(b => ({ ...b, client_id: clientId }));
  };
  
  const handleClientCreated = (newClient: Client) => {
     handleClientChange(newClient.id);
     setNewClientModalOpen(false);
  }

  const handleItemChange = (index: number, field: keyof Omit<BudgetItem, 'id'>, value: string) => {
    const newItems = [...budget.items];
    const item = { ...newItems[index] };

    if (field === 'quantity' || field === 'unit_price') {
        item[field] = parseFloat(value) || 0;
    } else {
        item[field] = value;
    }
    
    newItems[index] = item;
    setBudget(b => ({ ...b, items: newItems }));
  };

  const handleAddItem = () => {
    const newItem: BudgetItem = { id: `item-${Date.now()}`, name: '', description: '', quantity: 1, unit_price: 0 };
    setBudget(b => ({ ...b, items: [...b.items, newItem] }));
  };

  const handleRemoveItem = (index: number) => {
    setBudget(b => ({ ...b, items: b.items.filter((_, i) => i !== index) }));
  };

  const handleDesignChange = (field: keyof BudgetTemplateData, value: any) => {
    setDesign(d => ({ ...d, [field]: value }));
  };
  
  const handleTemplateIdChange = (templateId: string) => {
      setBudget(b => ({ ...b, template_id: templateId }));
  }

  const handleSaveClick = async (andSend = false) => {
    if (!budget.client_id) {
        alert("Por favor, selecione um cliente para o orçamento.");
        return;
    }
    
    if (andSend) setIsSending(true);
    else setIsSaving(true);

    await onTemplateSave(design);
    await onSave({ ...budget, status: andSend ? 'sent' : budget.status });

    setIsSending(false);
    setIsSaving(false);
  };
  
  const renderPreview = () => {
    const templateProps = {
      budget,
      client: client!,
      userProfile,
      templateData: design,
    };
    switch (budget.template_id) {
      case 'modern': return <TemplateModern {...templateProps} />;
      case 'creative': return <TemplateCreative {...templateProps} />;
      case 'classic': default: return <TemplateClassic {...templateProps} />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ViewHeader title={initialBudget.id.startsWith('new-') ? "Novo Orçamento" : "Editar Orçamento"} showBackButton={true} onBack={onBack}>
        <div className="flex gap-2">
            <button onClick={() => handleSaveClick(false)} disabled={isSaving || isSending} className="flex justify-center items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg w-40">
              {isSaving ? <Loader2 className="animate-spin w-5 h-5"/> : <><Save className="w-5 h-5"/> Salvar Rascunho</>}
            </button>
            <button onClick={() => handleSaveClick(true)} disabled={isSaving || isSending || !client} className="flex justify-center items-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg w-40 disabled:bg-pink-300">
              {isSending ? <Loader2 className="animate-spin w-5 h-5"/> : <><Send className="w-5 h-5"/> Salvar e Enviar</>}
            </button>
          </div>
      </ViewHeader>
      
      <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Panel: Preview */}
        <main className="flex-1 bg-gray-50 dark:bg-slate-900 rounded-xl shadow-inner flex flex-col overflow-auto p-4 sm:p-8 items-center justify-start">
            <div className="w-full max-w-4xl">
              {client ? renderPreview() : (
                  <div className="h-full flex items-center justify-center text-center text-gray-500">
                      <p>Selecione um cliente no painel à direita para começar.</p>
                  </div>
              )}
            </div>
        </main>
        
        {/* Right Panel: Controls */}
        <aside className="w-full md:w-96 flex-shrink-0 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col">
            <div className="overflow-y-auto pr-2 -mr-2">
                <ControlPanelSection title="1. Cliente">
                    <select value={budget.client_id} onChange={e => handleClientChange(e.target.value)} className={INPUT_CLASSES}>
                        <option value="" disabled>Selecione um cliente</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button onClick={() => setNewClientModalOpen(true)} className="text-sm font-semibold text-pink-600 hover:underline">
                        + Adicionar novo cliente
                    </button>
                </ControlPanelSection>

                <ControlPanelSection title="2. Itens do Orçamento">
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {budget.items.map((item, index) => (
                            <div key={item.id} className="p-2 border rounded-md dark:border-slate-600 relative">
                                <button onClick={() => handleRemoveItem(index)} className="absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full"><X className="w-3 h-3"/></button>
                                <input type="text" placeholder="Nome do Serviço" value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} className={INPUT_CLASSES} />
                                <div className="grid grid-cols-2 gap-2 mt-1">
                                    <input type="number" placeholder="Qtd" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className={INPUT_CLASSES} />
                                    <input type="number" placeholder="Preço" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', e.target.value)} className={INPUT_CLASSES} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddItem} className="text-sm font-semibold text-pink-600 hover:underline flex items-center gap-1"><Plus className="w-4 h-4"/> Adicionar Item</button>
                </ControlPanelSection>

                <ControlPanelSection title="3. Design e Aparência">
                     <select value={budget.template_id} onChange={e => handleTemplateIdChange(e.target.value)} className={INPUT_CLASSES}>
                        <option value="classic">Clássico</option>
                        <option value="modern">Moderno</option>
                        <option value="creative">Criativo</option>
                    </select>
                    <LogoUploader logoUrl={design.logoUrl} onUpload={url => handleDesignChange('logoUrl', url)} />
                    <ColorPicker label="Cor Principal" color={design.primaryColor} onChange={c => handleDesignChange('primaryColor', c)} />
                </ControlPanelSection>
            </div>
        </aside>
      </div>

      <NewBudgetModal 
        isOpen={isNewClientModalOpen}
        onClose={() => setNewClientModalOpen(false)}
        stages={stages}
        onClientCreated={handleClientCreated}
        onAddNewClient={onAddClient}
      />
    </div>
  );
};

export default TemplateCustomizerView;