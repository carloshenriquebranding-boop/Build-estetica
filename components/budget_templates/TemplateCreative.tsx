import * as React from 'react';
import type { Budget, Client, UserProfile, BudgetTemplateData } from '../../types.ts';

interface TemplateProps {
  budget: Budget;
  client: Client;
  userProfile: UserProfile;
  templateData: BudgetTemplateData;
}

const TemplateCreative: React.FC<TemplateProps> = ({ 
  budget, client, userProfile, templateData
}) => {
  const { primaryColor, secondaryColor, textColor, logoUrl, fontFamily } = templateData;
  const safeTextColor = document.body.classList.contains('dark') && textColor === '#1e293b' ? '#e2e8f0' : textColor;
  
  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg relative overflow-hidden" style={{ fontFamily, color: safeTextColor }}>
      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full" style={{ backgroundColor: primaryColor, opacity: 0.1 }}></div>
      <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full" style={{ backgroundColor: secondaryColor, opacity: 0.5 }}></div>
      
      <div className="relative p-8">
        <header className="text-center mb-8">
          {logoUrl && <img src={logoUrl} alt="Logo" className="max-h-16 mx-auto mb-4" />}
          <h1 className="text-3xl font-extrabold" style={{ color: primaryColor }}>{userProfile.business_name}</h1>
          <p className="text-sm tracking-widest uppercase">{userProfile.business_address}</p>
        </header>

        <section className="my-8 p-4 rounded-lg" style={{ backgroundColor: secondaryColor }}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">ORÇAMENTO PARA</p>
              <p className="text-lg font-bold">{client.name}</p>
            </div>
            <div className="text-right">
              <p>#{budget.id.slice(-6).toUpperCase()}</p>
              <p>{new Date(budget.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {budget.items.map((item, index) => (
            <div key={item.id || index} className="flex justify-between items-center p-3 border-l-4" style={{ borderColor: primaryColor }}>
              <div className="flex-grow pr-4">
                  <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.name || 'Nome do Item'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description || 'Descrição...'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-lg" style={{ color: primaryColor }}>{(item.quantity * item.unit_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p className="text-sm opacity-70">{item.quantity} x {(item.unit_price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </div>
          ))}
        </section>
        
        <div className="mt-8 border-t-2 pt-4" style={{ borderColor: primaryColor }}>
            <div className="text-right">
                <p className="text-sm">Subtotal: {budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p className="text-2xl font-bold mt-1">TOTAL: <span style={{ color: primaryColor }}>{budget.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
            </div>
        </div>

        <footer className="text-center mt-8 text-xs opacity-60">
            <p>Obrigado pela sua preferência!</p>
            <p>{userProfile.business_phone} | {userProfile.business_email}</p>
        </footer>
      </div>
    </div>
  );
};

export default TemplateCreative;
