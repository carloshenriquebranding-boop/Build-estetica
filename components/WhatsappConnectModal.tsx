import * as React from 'react';
import QRCode from 'qrcode.react';
import { X } from './icons/X.tsx';
import { Loader2 } from './icons/Loader2.tsx';
import { CheckCircle } from './icons/CheckCircle.tsx';
import { RefreshCw } from './icons/RefreshCw.tsx';
import { Copy } from './icons/Copy.tsx';

interface WhatsappConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: () => void;
}

type ConnectionStep = 'idle' | 'generating_qr' | 'awaiting_scan' | 'connected' | 'error';

// IMPORTANTE: Esta URL deve ser substituída pela URL que o Coolify fornecerá.
// Pedi ao usuário que me fornecesse esta URL.
const BACKEND_URL = 'https://SEU_COOLIFY_URL_AQUI'; 

const WhatsappConnectModal: React.FC<WhatsappConnectModalProps> = ({ isOpen, onClose, onConnectSuccess }) => {
    const [step, setStep] = React.useState<ConnectionStep>('idle');
    const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isOpen) {
            // Reseta o estado quando o modal é fechado
            setStep('idle');
            setQrCodeDataUrl(null);
            setError(null);
        }
    }, [isOpen]);

    const handleGenerateQR = async () => {
        setStep('generating_qr');
        setError(null);
        setQrCodeDataUrl(null);

        // Verifica se a URL de placeholder foi substituída
        if (BACKEND_URL === 'https://SEU_COOLIFY_URL_AQUI') {
            setError('A URL do servidor backend ainda não foi configurada. Por favor, forneça a URL do Coolify para o desenvolvedor.');
            setStep('error');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/api/whatsapp/connect`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao iniciar a conexão com o servidor.');
            }

            const data = await response.json();
            if (data.qr) {
                setQrCodeDataUrl(data.qr); // O backend agora envia uma Data URL
                setStep('awaiting_scan');
            } else {
                 throw new Error('O servidor não retornou um QR code válido.');
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Um erro inesperado ocorreu. Verifique se o servidor backend está rodando e acessível.');
            setStep('error');
        }
    };

    React.useEffect(() => {
        if (step !== 'awaiting_scan' || !isOpen) {
            return;
        }

        const eventSource = new EventSource(`${BACKEND_URL}/api/whatsapp/status`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.status === 'connected') {
                setStep('connected');
                eventSource.close();
                setTimeout(() => {
                    onConnectSuccess();
                }, 1500);
            } else if (data.status === 'error' || data.status === 'timeout') {
                setError(data.message || 'A conexão expirou ou falhou.');
                setStep('error');
                eventSource.close();
            }
        };

        eventSource.onerror = () => {
            setError('Erro de conexão com o servidor de status. Verifique se o backend está rodando.');
            setStep('error');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [step, onConnectSuccess, isOpen]);
    
    const handleCopyToClipboard = () => {
        if(qrCodeDataUrl) {
            navigator.clipboard.writeText(qrCodeDataUrl);
            alert("Dados do QR Code copiados para a área de transferência!");
        }
    }

    const renderContent = () => {
        switch(step) {
            case 'generating_qr':
                return (
                    <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
                        <p className="mt-4 font-semibold text-gray-700 dark:text-slate-200">Gerando QR Code...</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Conectando ao servidor...</p>
                    </div>
                );
            case 'awaiting_scan':
                return (
                    <div className="text-center">
                        <p className="font-semibold text-gray-700 dark:text-slate-200 mb-2">Escaneie para conectar</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Abra o WhatsApp no seu celular, vá em <span className="font-semibold">Aparelhos Conectados</span> e escaneie o código.</p>
                        <div className="flex justify-center bg-white p-4 border rounded-lg relative">
                           {qrCodeDataUrl ? <img src={qrCodeDataUrl} alt="QR Code" width={256} height={256} /> : <div className="w-64 h-64 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-md"></div>}
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            <button onClick={handleGenerateQR} className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 hover:text-pink-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                <RefreshCw className="w-3 h-3" />
                                Recarregar QR Code
                            </button>
                        </div>
                         <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 animate-pulse">Aguardando confirmação...</p>
                    </div>
                );
            case 'connected':
                 return (
                    <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <p className="mt-4 text-xl font-bold text-gray-800 dark:text-slate-100">WhatsApp Conectado!</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Aguarde, a janela fechará em instantes.</p>
                    </div>
                );
             case 'error':
                return (
                     <div className="text-center py-12">
                        <p className="mt-4 font-semibold text-red-600">Ocorreu um erro</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">{error || 'Não foi possível conectar. Tente novamente.'}</p>
                         <button onClick={handleGenerateQR} className="mt-4 w-full px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg">Tentar Novamente</button>
                    </div>
                )
            case 'idle':
            default:
                return (
                    <div className="text-center">
                        <p className="font-semibold text-gray-700 dark:text-slate-200 mb-2">Conectar ao WhatsApp</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Para habilitar o envio de mensagens e lembretes automáticos, conecte sua conta do WhatsApp.</p>
                        <button
                            onClick={handleGenerateQR}
                            className="w-full px-4 py-3 bg-pink-500 text-white font-bold rounded-lg shadow-md hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400"
                        >
                            Gerar QR Code
                        </button>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-4">Sua sessão será gerenciada de forma segura em nosso servidor.</p>
                    </div>
                );
        }
    }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm m-4 transform transition-all duration-300 scale-100">
        <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Conexão WhatsApp</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WhatsappConnectModal;