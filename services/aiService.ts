// Fix: Replaced all instances of the deprecated `GoogleGenerativeAI` with the correct `GoogleGenAI` class.
import { GoogleGenAI, Chat } from "@google/genai";

// A chave da API é obtida da variável de ambiente `process.env.API_KEY`,
// que é configurada externamente no ambiente de execução.
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey: apiKey });
} else {
    console.warn("API key for GoogleGenerativeAI is not set. AI features will not work.");
}


/**
 * Obtém uma sugestão de texto do modelo de IA Gemini Flash.
 * @param prompt O prompt de texto para a IA.
 * @returns Uma promessa que resolve para o texto de resposta da IA.
 */
export const getAiSuggestion = async (prompt: string): Promise<string> => {
  if (!ai) {
      return "O serviço de IA não está configurado.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI suggestion:", error);
    return "Desculpe, não foi possível obter uma sugestão no momento.";
  }
};

const SYSTEM_INSTRUCTION = "Você é um assistente virtual especialista no sistema EstéticaCRM. Seu nome é Gabi. Sua função é ajudar os usuários a entender e usar as funcionalidades do CRM. Responda de forma clara, amigável e concisa. Suas áreas de conhecimento são: Dashboard (visão geral), Funil/Kanban (gerenciamento de clientes em estágios), Clientes (lista e edição), Agenda (agendamentos), Conversas (integração com WhatsApp), Serviços (cadastro de procedimentos), Financeiro (controle de receitas e despesas), Tarefas (gerenciamento de pendências), Notas (anotações gerais), e Prescrições/Orçamentos (criação de documentos). Seja sempre prestativo e guie o usuário para a seção correta do sistema se necessário.";

/**
 * Creates and starts a new chat session with the Gemini model.
 * @returns A Chat instance or null if the AI service is not configured.
 */
export const startChatSession = (): Chat | null => {
    if (!ai) {
        console.error("Cannot start chat session, AI service is not configured.");
        return null;
    }
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
    });
    return chat;
};
