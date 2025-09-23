import * as React from 'react';
import type { Budget, Client, UserProfile, BudgetTemplateData } from '../../types.ts';

interface TemplateProps {
  budget: Budget;
  client: Client;
  userProfile: UserProfile;
  templateData: BudgetTemplateData;
}

const TemplateClassic: React.FC<TemplateProps> = ({ 
  budget, client, userProfile, templateData
}) => {
  const { primaryColor, textColor, logoUrl, fontFamily } = templateData;
  const safeTextColor = document.body.classList.contains('dark') && textColor === '#1e293b' ? '#e2e8f0' : textColor;

  return (
    <div className="bg-white dark:bg-slate-800 p-8 shadow-md" style={{ fontFamily }}>
      <header className="flex justify-between items-start pb-4 border-b" style={{ borderColor: primaryColor }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>{userProfile.business_name}</h1>
          <p className="text-sm" style={{ color: safeTextColor }}>{userProfile.business_address}</p>
          <p className="text-sm" style={{ color: safeTextColor }}>{userProfile.business_phone}</p>
        </div>
        {logoUrl && <img src={logoUrl} alt="Logo" className="max-h-16" />}
      </header>

      <section className="my-6">
        <h2 className="text-lg font-semibold" style={{ color: safeTextColor }}>ORÇAMENTO</h2>
        <div className="grid grid-cols-2 gap-4 mt-2 text-sm" style={{ color: safeTextColor }}>
          <div>
            <p className="font-semibold">PARA:</p>
            <p>{client.name}</p>
            <p>{client.phone}</p>
          </div>
          <div className="text-right">
            <p><strong>Nº do Orçamento:</strong> {budget.id.slice(-6).toUpperCase()}</p>
            <p><strong>Data:</strong> {new Date(budget.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </section>

      <section>
        <table className="w-full text-left text-sm" style={{ color: safeTextColor }}>
          <thead style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}>
            <tr>
              <th className="p-2 w-1/2">Serviço / Item</th>
              <th className="p-2 text-center">Qtd.</th>
              <th className="p-2 text-right">Preço Unit.</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {budget.items.map((item, index) => (
              <tr key={item.id || index} className="border-b dark:border-slate-600">
                <td className="p-2">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{item.name || 'Nome do Item'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.description || 'Descrição...'}</p>
                </td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">{(item.unit_price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-2 text-right">{(item.quantity * item.unit_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="mt-6 flex justify-end">
        <div className="w-full sm:w-1/2 text-sm" style={{ color: safeTextColor }}>
          <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-700 rounded-t-md">
            <span className="font-semibold">Subtotal</span>
            <span>{budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
          <div className="flex justify-between p-3 font-bold text-lg rounded-b-md" style={{ backgroundColor: primaryColor, color: '#FFFFFF' }}>
            <span>TOTAL</span>
            <span>{budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TemplateClassic;
