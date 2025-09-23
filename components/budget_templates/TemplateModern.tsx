import * as React from 'react';
import type { Budget, Client, UserProfile, BudgetTemplateData } from '../../types.ts';

interface TemplateProps {
  budget: Budget;
  client: Client;
  userProfile: UserProfile;
  templateData: BudgetTemplateData;
}

const TemplateModern: React.FC<TemplateProps> = ({ 
  budget, client, userProfile, templateData
}) => {
  const { primaryColor, secondaryColor, textColor, logoUrl, fontFamily } = templateData;
  const safeTextColor = document.body.classList.contains('dark') && textColor === '#1e293b' ? '#e2e8f0' : textColor;

  return (
    <div className="bg-white dark:bg-slate-800 shadow-md" style={{ fontFamily, color: safeTextColor }}>
      <header className="p-8 flex justify-between items-center" style={{ backgroundColor: secondaryColor }}>
        <div>
          {logoUrl && <img src={logoUrl} alt="Logo" className="max-h-12 mb-2" />}
          <p className="font-light">{userProfile.business_name}</p>
          <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>Orçamento</h1>
        </div>
        <div className="text-right text-sm">
          <p>{userProfile.business_address}</p>
          <p>{userProfile.business_phone}</p>
          <p>{userProfile.business_email}</p>
        </div>
      </header>

      <section className="p-8 grid grid-cols-2 gap-8">
        <div className="text-sm">
          <p className="uppercase text-xs font-bold mb-1" style={{ color: primaryColor }}>Cliente</p>
          <p className="font-semibold">{client.name}</p>
          <p>{client.phone}</p>
        </div>
        <div className="text-sm text-right">
          <p><strong>Orçamento:</strong> #{budget.id.slice(-6).toUpperCase()}</p>
          <p><strong>Data:</strong> {new Date(budget.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
      </section>

      <section className="px-8 pb-8">
        <div className="space-y-2">
            <div className="grid grid-cols-12 gap-4 text-xs uppercase font-bold p-2" style={{ color: primaryColor }}>
                <div className="col-span-7">Descrição</div>
                <div className="col-span-1 text-center">Qtd</div>
                <div className="col-span-2 text-right">Preço</div>
                <div className="col-span-2 text-right">Total</div>
            </div>
            {budget.items.map((item, index) => (
                <div key={item.id || index} className="grid grid-cols-12 gap-4 p-3 rounded-lg items-center" style={{ backgroundColor: secondaryColor }}>
                    <div className="col-span-7">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{item.name || 'Nome do Item'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description || 'Descrição...'}</p>
                    </div>
                    <div className="col-span-1 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right">{(item.unit_price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    <div className="col-span-2 text-right font-semibold">{(item.quantity * item.unit_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                </div>
            ))}
        </div>
      </section>

      <footer className="p-8 flex justify-end" style={{ backgroundColor: secondaryColor }}>
        <div className="w-full sm:w-1/2 space-y-2 text-sm">
            <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
             <div className="flex justify-between font-bold text-xl pt-2 border-t" style={{ borderColor: primaryColor, color: primaryColor }}>
                <span>TOTAL:</span>
                <span>{budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateModern;
