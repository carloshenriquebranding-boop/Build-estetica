// Shared class strings for consistent styling across components.

/**
 * Standard classes for form input elements like <input>, <select>, and <textarea>.
 * Includes styling for borders, background, text color, focus rings, and dark mode.
 */
export const INPUT_CLASSES = "mt-1 block w-full px-4 py-2.5 border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500/80 focus:border-pink-500";

/**
 * Descriptions for upcoming features to be used in tooltips and previews.
 */
export const FEATURE_PREVIEWS = {
  omnichannel: {
    title: "Atendimento via WhatsApp",
    description: "Em breve, atenda seus clientes e capture leads do WhatsApp diretamente no CRM, encaminhando-os para o funil com um clique."
  },
  campaigns: {
    title: "Campanhas de Marketing",
    description: "Em breve, crie e dispare campanhas em massa por WhatsApp e Email para engajar sua base de clientes e gerar novas vendas."
  },
  ai_agents: {
    title: "Agentes com IA",
    description: "Em breve, configure robôs inteligentes para qualificar leads, agendar horários e responder dúvidas 24/7, liberando seu tempo."
  },
  integrations: {
    title: "Automações & API",
    description: "Em breve, crie automações personalizadas e integre o CRM com suas ferramentas favoritas para otimizar todo o seu fluxo de trabalho."
  }
};
