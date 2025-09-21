import * as React from 'react';
import type { Client, Service, UserProfile, BudgetTemplateData, BudgetItem } from '../types.ts';
import { Plus, Trash, Save, Download, Loader2, Type, Pencil, ArrowLeft } from './icons/index.ts';
import ColorPicker from './ColorPicker.tsx';
import LogoUploader from './LogoUploader.tsx';

interface BudgetViewProps {
  clients: Client[];
  services: Service[];
  userProfile: UserProfile;
  initialTemplateData: BudgetTemplateData;
  onTemplateSave: (data: BudgetTemplateData) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const BudgetItemRow: React.FC<{
    item: BudgetItem;
    onUpdate: (item: BudgetItem) => void;
    onRemove: (id: string) => void;
}> = ({ item, onUpdate, onRemove }) => {
    const inputClasses = "w-full px-2 py-1 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-sm";
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onUpdate({ ...item, [name]: name === 'quantity' || name === 'unit_price' ? parseFloat(value) || 0 : value });
    };

    return (
        <tr className="border-b dark:border-slate-700 print:hidden">
            <td className="p-2"><input type="text" name="name" value={item.name} onChange={handleInputChange} className={inputClasses}/></td>
            <td className="p-2"><input type="text" name="description" value={item.description} onChange={handleInputChange} className={inputClasses}/></td>
            <td className="p-2"><input type="number" name="quantity" value={item.quantity} onChange={handleInputChange} className={`${inputClasses} w-20`}/></td>
            <td className="p-2"><input type="number" name="unit_price" value={item.unit_price} onChange={handleInputChange} className={`${inputClasses} w-28`}/></td>
            <td className="p-2 text-right">{(item.quantity * item.unit_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td className="p-2 text-center">
                <button onClick={() => onRemove(item.id)} className="p-1 text-red-500 hover:text-red-700"><Trash className="w-4 h-4"/></button>
            </td>
        </tr>
    )
};


const BudgetView: React.FC<BudgetViewProps> = ({ clients, services, userProfile, initialTemplateData, onTemplateSave, showBackButton, onBack }) => {
    const [viewMode, setViewMode] = React.useState<'editor' | 'template'>('editor');
    const [items, setItems] = React.useState<BudgetItem[]>([]);
    const [selectedClientId, setSelectedClientId] = React.useState<string>('');
    const [templateData, setTemplateData] = React.useState<BudgetTemplateData>(initialTemplateData);
    const [isSavingTemplate, setIsSavingTemplate] = React.useState(false);

    const selectedClient = clients.find(c => c.id === selectedClientId);
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500";


    const handleAddItem = (item: Omit<BudgetItem, 'id'>) => {
        setItems(prev => [...prev, { ...item, id: `item-${Date.now()}` }]);
    };
    
    const handleAddServiceAsItem = (service: Service) => {
        handleAddItem({
            name: service.name,
            description: service.description || '',
            quantity: 1,
            unit_price: service.price
        });
    }

    const handleUpdateItem = (updatedItem: BudgetItem) => {
        setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    const handleRemoveItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };
    
    const handleSaveTemplate = async () => {
        setIsSavingTemplate(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        onTemplateSave(templateData);
        setIsSavingTemplate(false);
    }
    
    const handlePrint = () => {
        const printContent = document.getElementById('budget-preview')?.innerHTML;
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow && printContent) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Orçamento - ${selectedClient?.name || ''}</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            body { 
                                font-family: ${templateData.fontFamily};
                                color: ${templateData.textColor};
                            }
                            @media print {
                                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                                .print-hidden { display: none; }
                            }
                        </style>
                    </head>
                    <body>${printContent}</body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { printWindow.print(); }, 500); // Wait for styles to apply
        }
    };


    const renderTemplateEditor = () => (
        <div className="space-y-6 overflow-y-auto p-4">
            <div>
                <h3 className="font-semibold mb-2">Cores</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ColorPicker label="Cor Primária" color={templateData.primaryColor} onChange={c => setTemplateData(p => ({...p, primaryColor: c}))} />
                    <ColorPicker label="Cor Secundária" color={templateData.secondaryColor} onChange={c => setTemplateData(p => ({...p, secondaryColor: c}))} />
                    <ColorPicker label="Cor do Texto" color={templateData.textColor} onChange={c => setTemplateData(p => ({...p, textColor: c}))} />
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-2">Fonte</h3>
                 <select value={templateData.fontFamily} onChange={e => setTemplateData(p => ({...p, fontFamily: e.target.value}))} className={inputClasses}>
                    <option>Poppins, sans-serif</option><option>Arial, sans-serif</option><option>Verdana, sans-serif</option><option>Times New Roman, serif</option><option>Courier New, monospace</option><option>Lato, sans-serif</option><option>Roboto, sans-serif</option><option>Montserrat, sans-serif</option><option>Merriweather, serif</option>
                </select>
            </div>
            <LogoUploader logoUrl={templateData.logoUrl} onUpload={url => setTemplateData(p => ({...p, logoUrl: url}))} />
            <div className="mt-auto pt-4">
                <button onClick={handleSaveTemplate} disabled={isSavingTemplate} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 disabled:bg-pink-300">
                    {isSavingTemplate ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Save className="w-5 h-5"/> Salvar Modelo</>}
                </button>
            </div>
        </div>
    );
    
    const renderEditorControls = () => {
        const NewItemForm = () => {
            const [name, setName] = React.useState('');
            const [desc, setDesc] = React.useState('');
            const [qty, setQty] = React.useState(1);
            const [price, setPrice] = React.useState(0);
            const formInputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-sm";


            const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                if(!name || !qty || !price) return;
                handleAddItem({name, description: desc, quantity: qty, unit_price: price});
                setName(''); setDesc(''); setQty(1); setPrice(0);
            }
            return (
                <form onSubmit={handleSubmit} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg space-y-2">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome do item" className={formInputClasses} required/>
                    <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição" className={formInputClasses}/>
                    <div className="flex gap-2">
                         <input type="number" value={qty} onChange={e => setQty(parseFloat(e.target.value))} placeholder="Qtd" className={`${formInputClasses} w-1/2`} required/>
                         <input type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} placeholder="Preço" className={`${formInputClasses} w-1/2`} required/>
                    </div>
                    <button type="submit" className="w-full flex justify-center items-center gap-2 px-3 py-1.5 text-sm bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600"><Plus className="w-4 h-4"/> Adicionar Item</button>
                </form>
            )
        }
        
        return (
            <div className="p-4 space-y-4 overflow-y-auto">
                <div>
                    <label className="font-semibold block mb-1">Cliente</label>
                    <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className={inputClasses}>
                        <option value="">Selecione um cliente</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Adicionar Item Manualmente</h3>
                    <NewItemForm />
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Adicionar Serviço</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {services.map(s => (
                            <button key={s.id} onClick={() => handleAddServiceAsItem(s)} className="w-full text-left p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex justify-between items-center text-sm">
                                <span className="text-slate-800 dark:text-slate-200">{s.name}</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mt-auto pt-4">
                    <button onClick={handlePrint} disabled={!selectedClientId || items.length === 0} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        <Download className="w-5 h-5"/> Imprimir / PDF
                    </button>
                </div>
            </div>
        )
    };


    return (
      <div className="flex flex-col md:flex-row h-full gap-6">
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 flex flex-col gap-4">
           <div className="flex items-center gap-2 border-b dark:border-slate-700 pb-2">
                {showBackButton && (
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400" aria-label="Voltar">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Orçamento</h1>
           </div>
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-slate-700 rounded-lg">
                <button onClick={() => setViewMode('editor')} className={`w-full py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${viewMode === 'editor' ? 'bg-white dark:bg-slate-500 shadow' : 'text-gray-600 dark:text-slate-300'}`}><Pencil className="w-4 h-4"/> Editor</button>
                <button onClick={() => setViewMode('template')} className={`w-full py-2 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${viewMode === 'template' ? 'bg-white dark:bg-slate-500 shadow' : 'text-gray-600 dark:text-slate-300'}`}><Type className="w-4 h-4"/> Modelo</button>
            </div>
            <div className="flex-grow overflow-hidden flex flex-col">
                {viewMode === 'editor' ? renderEditorControls() : renderTemplateEditor()}
            </div>
        </aside>

        <main className="flex-1 bg-gray-50 dark:bg-slate-900 rounded-xl shadow-inner flex flex-col overflow-auto p-4 sm:p-8">
            <div id="budget-preview" className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto" style={{fontFamily: templateData.fontFamily, color: templateData.textColor}}>
                <header className="flex justify-between items-start pb-4 border-b-2" style={{borderColor: templateData.primaryColor}}>
                    <div>
                        {templateData.logoUrl && <img src={templateData.logoUrl} alt="Logo" className="max-h-16 mb-2" />}
                        <h2 className="text-2xl font-bold" style={{color: templateData.primaryColor}}>{userProfile.business_name}</h2>
                        <p className="text-sm">{userProfile.business_address}</p>
                        <p className="text-sm">{userProfile.business_phone} | {userProfile.business_email}</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-3xl font-bold uppercase" style={{color: templateData.primaryColor}}>Orçamento</h1>
                        <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                </header>
                <section className="my-6">
                    <h3 className="font-bold text-lg mb-2" style={{color: templateData.primaryColor}}>Para:</h3>
                    {selectedClient ? (
                        <div>
                            <p className="font-semibold">{selectedClient.name}</p>
                            <p>{selectedClient.address}</p>
                            <p>{selectedClient.phone} {selectedClient.email && `| ${selectedClient.email}`}</p>
                        </div>
                    ) : <p className="text-gray-500">Selecione um cliente</p>}
                </section>
                 <section>
                    <table className="w-full text-left">
                        <thead style={{backgroundColor: templateData.secondaryColor}}>
                            <tr>
                                <th className="p-2 font-bold">Item</th>
                                <th className="p-2 font-bold">Descrição</th>
                                <th className="p-2 font-bold">Qtd.</th>
                                <th className="p-2 font-bold">Preço Unit.</th>
                                <th className="p-2 font-bold text-right">Total</th>
                                <th className="p-2 print-hidden"></th>
                            </tr>
                        </thead>
                        <tbody>
                           {items.map(item => <BudgetItemRow key={item.id} item={item} onUpdate={handleUpdateItem} onRemove={handleRemoveItem} />)}
                            {/* Static rows for printing */}
                           {items.map(item => (
                               <tr key={item.id} className="hidden print:table-row border-b">
                                   <td className="p-2">{item.name}</td>
                                   <td className="p-2">{item.description}</td>
                                   <td className="p-2">{item.quantity}</td>
                                   <td className="p-2">{item.unit_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                   <td className="p-2 text-right">{(item.quantity * item.unit_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                     {items.length === 0 && <p className="text-center py-8 text-gray-500">Adicione itens ao orçamento.</p>}
                </section>

                <footer className="mt-8 flex justify-end">
                    <div className="w-full max-w-xs">
                        <div className="flex justify-between py-2 border-b dark:border-slate-600">
                            <span>Subtotal:</span>
                            <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                         <div className="flex justify-between py-2 text-xl font-bold" style={{backgroundColor: templateData.secondaryColor, color: templateData.primaryColor}}>
                            <span className="px-2">TOTAL:</span>
                            <span className="px-2">{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
      </div>
    );
};

export default BudgetView;