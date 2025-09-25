import * as React from 'react';
import { LayoutGrid, CalendarDays, DollarSign, Wand2, Star, Check } from './icons/index.ts';

interface LandingPageProps {
  onNavigateToAuth: () => void;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-slate-600 dark:text-slate-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
    {children}
  </a>
);

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
    <div className="inline-block p-3 bg-pink-100 dark:bg-pink-900/50 rounded-lg text-pink-600 dark:text-pink-400 mb-4">
      {React.cloneElement(icon, { className: "w-7 h-7" })}
    </div>
    <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400">{text}</p>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; role: string; avatar: string }> = ({ quote, name, role, avatar }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
    <div className="flex text-yellow-400 mb-4">
        <Star className="w-5 h-5" /><Star className="w-5 h-5" /><Star className="w-5 h-5" /><Star className="w-5 h-5" /><Star className="w-5 h-5" />
    </div>
    <p className="text-slate-600 dark:text-slate-300 flex-grow">"{quote}"</p>
    <div className="flex items-center mt-6">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div className="ml-4">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
      </div>
    </div>
  </div>
);

const PricingCard: React.FC<{ plan: string; price: string; description: string; features: string[]; isFeatured?: boolean; onSelectPlan: () => void }> = ({ plan, price, description, features, isFeatured, onSelectPlan }) => (
  <div className={`p-8 rounded-2xl border ${isFeatured ? 'bg-slate-900 dark:bg-slate-800 border-pink-500' : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}>
    {isFeatured && <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white bg-pink-500 rounded-full mb-4">MAIS POPULAR</span>}
    <h3 className={`text-2xl font-bold ${isFeatured ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>{plan}</h3>
    <p className={`mt-2 ${isFeatured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>{description}</p>
    <p className="mt-6">
      <span className={`text-5xl font-extrabold ${isFeatured ? 'text-white' : 'text-slate-900 dark:text-slate-50'}`}>{price}</span>
      <span className={`ml-2 text-lg ${isFeatured ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>/mês</span>
    </p>
    <ul className="mt-8 space-y-4">
      {features.map((feature, i) => (
        <li key={i} className={`flex items-start gap-3 ${isFeatured ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>
          <Check className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <button onClick={onSelectPlan} className={`w-full py-3 mt-8 text-lg font-semibold rounded-lg transition-colors ${isFeatured ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-pink-50 text-pink-600 hover:bg-pink-100 dark:bg-pink-900/50 dark:text-pink-300 dark:hover:bg-pink-900'}`}>
      Começar Agora
    </button>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToAuth }) => {
  return (
    <div className="bg-stone-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-pink-500">EstéticaCRM</div>
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink href="#features">Funcionalidades</NavLink>
              <NavLink href="#testimonials">Depoimentos</NavLink>
              <NavLink href="#pricing">Preços</NavLink>
            </nav>
            <button onClick={onNavigateToAuth} className="px-5 py-2 bg-pink-500 text-white font-semibold rounded-full shadow-md hover:bg-pink-600 transition-transform hover:scale-105">
              Acessar
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="hero" className="pt-32 pb-20 text-center bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Transforme sua Clínica de Estética.
              <br/>
              <span className="text-pink-500">Mais Clientes, Menos Caos.</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
              O CRM completo para organizar agendamentos, automatizar o funil de vendas e encantar seus clientes, tudo em um só lugar.
            </p>
            <div className="mt-10">
              <button onClick={onNavigateToAuth} className="px-8 py-4 bg-pink-500 text-white text-lg font-bold rounded-full shadow-lg hover:bg-pink-600 transition-transform hover:scale-105">
                Quero Organizar Minha Clínica
              </button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Tudo que você precisa para crescer</h2>
              <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">Deixe a burocracia de lado e foque no que realmente importa: seus clientes.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={<LayoutGrid />} title="Funil de Vendas Visual" text="Nunca mais perca um lead. Organize seus contatos em um funil Kanban intuitivo e acompanhe cada oportunidade." />
              <FeatureCard icon={<CalendarDays />} title="Agenda Inteligente" text="Gerencie seus agendamentos, evite conflitos de horário e envie lembretes automáticos para reduzir faltas." />
              <FeatureCard icon={<DollarSign />} title="Financeiro Descomplicado" text="Controle receitas e despesas com facilidade. Tenha uma visão clara da saúde financeira da sua clínica." />
              <FeatureCard icon={<Wand2 />} title="Automação com IA" text="Deixe que nossos agentes de IA qualifiquem leads e respondam dúvidas 24/7, liberando seu tempo para atender." />
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Amado por profissionais da estética</h2>
              <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">Veja o que nossas clientes estão dizendo sobre o EstéticaCRM.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard quote="O funil de vendas mudou completamente meu negócio. Consigo ver exatamente onde cada cliente está e não perco mais nenhuma oportunidade!" name="Juliana Andrade" role="Esteticista & Micropigmentadora" avatar="https://randomuser.me/api/portraits/women/44.jpg" />
              <TestimonialCard quote="Finalmente encontrei uma ferramenta que entende as necessidades de uma clínica de estética. A agenda é fantástica e a automação me poupa horas de trabalho." name="Beatriz Costa" role="Biomédica Esteta" avatar="https://randomuser.me/api/portraits/women/68.jpg" />
              <TestimonialCard quote="O controle financeiro integrado é um divisor de águas. Agora sei exatamente para onde meu dinheiro está indo e consigo planejar o crescimento da clínica com segurança." name="Larissa Mendes" role="Dona de Clínica de Estética" avatar="https://randomuser.me/api/portraits/women/34.jpg" />
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold">Um plano para cada fase do seu negócio</h2>
              <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">Comece hoje e eleve o nível da sua clínica. Simples e sem surpresas.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCard 
                plan="Essencial" 
                price="R$97" 
                description="Perfeito para quem está começando e quer organizar a base de clientes."
                features={["Gerenciamento de Clientes", "Funil de Vendas Kanban", "Agenda de Agendamentos", "Controle Financeiro Básico"]}
                onSelectPlan={onNavigateToAuth}
              />
              <PricingCard 
                plan="Profissional" 
                price="R$147"
                description="Para clínicas que buscam automatizar e crescer com inteligência."
                features={["Tudo do plano Essencial, mais:", "Automações com IA (WhatsApp)", "Campanhas de Marketing", "Integrações & API", "Relatórios Avançados"]}
                isFeatured={true}
                onSelectPlan={onNavigateToAuth}
              />
            </div>
          </div>
        </section>

        <section id="cta" className="py-20 bg-pink-500 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Pronta para organizar e crescer?</h2>
                <p className="mt-4 max-w-xl mx-auto text-pink-100">Junte-se a centenas de clínicas que já estão transformando sua gestão.</p>
                <div className="mt-8">
                    <button onClick={onNavigateToAuth} className="px-8 py-4 bg-white text-pink-600 text-lg font-bold rounded-full shadow-lg hover:bg-pink-50 transition-transform hover:scale-105">
                        Comece seu teste gratuito
                    </button>
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} EstéticaCRM. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
