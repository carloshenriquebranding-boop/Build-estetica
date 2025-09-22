import * as React from 'react';
import { QRCodeSVG } from 'qrcode.react';
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

const WhatsappConnectModal: React.FC<WhatsappConnectModalProps> = ({ isOpen, onClose, onConnectSuccess }) => {
    const [step, setStep] = React.useState<ConnectionStep>('idle');
    const [qrCodeString, setQrCodeString] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isOpen) {
            setStep('idle');
            setQrCodeString(null);
            setError(null);
        }
    }, [isOpen]);

    const handleGenerateQR = async () => {
        setStep('generating_qr');
        setError(null);
        
        // --- Simulação de Backend ---
        // TODO: Substituir por uma chamada de API real para seu backend.
        // Ex: const response = await fetch('/api/whatsapp/connect');
        //     const data = await response.json();
        //     if (response.ok) {
        //         setQrCodeString(data.qr);
        //         setStep('awaiting_scan');
        //         listenForConnection(); // Iniciar escuta por WebSocket
        //     } else {
        //         setError(data.message);
        //         setStep('error');
        //     }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulação de sucesso
        setQrCodeString(`2@1AbcdeFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstu==,1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t==,1a2b3c4d5e6f7g8h9i0j==,1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t==`);
        setStep('awaiting_scan');

        // Simula o usuário escaneando o código e a confirmação via WebSocket
        // TODO: Substituir por um listener de WebSocket real.
        // Ex: socket.on('whatsapp-connected', () => { ... });
        setTimeout(() => {
            setStep('connected');
            setTimeout(() => {
                onConnectSuccess();
            }, 1500);
        }, 8000);
    };
    
    const handleCopyToClipboard = () => {
        if(qrCodeString) {
            navigator.clipboard.writeText(qrCodeString);
            alert("Dados do QR Code copiados para a área de transferência!");
        }
    }


    const renderContent = () => {
        switch(step) {
            case 'generating_qr':
                return (
                    <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto" />
                        <p className="mt-4 font-semibold text-gray-700">Gerando QR Code...</p>
                        <p className="text-sm text-gray-500">Conectando ao servidor...</p>
                    </div>
                );
            case 'awaiting_scan':
                return (
                    <div className="text-center">
                        <p className="font-semibold text-gray-700 mb-2">Escaneie para conectar</p>
                        <p className="text-sm text-gray-500 mb-4">Abra o WhatsApp no seu celular, vá em <span className="font-semibold">Aparelhos Conectados</span> e escaneie o código.</p>
                        <div className="flex justify-center bg-white border rounded-lg relative">
                           {qrCodeString ? <QRCodeSVG value={qrCodeString} size={256} /> : <div className="w-64 h-64 bg-gray-200 animate-pulse"></div>}
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            <button onClick={handleGenerateQR} className="flex items-center gap-2 text-xs text-gray-500 hover:text-pink-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <RefreshCw className="w-3 h-3" />
                                Recarregar QR Code
                            </button>
                             <button onClick={handleCopyToClipboard} className="flex items-center gap-2 text-xs text-gray-500 hover:text-pink-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <Copy className="w-3 h-3" />
                                Copiar dados
                            </button>
                        </div>
                         <p className="text-xs text-gray-400 mt-2 animate-pulse">Aguardando confirmação...</p>
                    </div>
                );
            case 'connected':
                 return (
                    <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <p className="mt-4 text-xl font-bold text-gray-800">WhatsApp Conectado!</p>
                        <p className="text-sm text-gray-500">Aguarde, a janela fechará em instantes.</p>
                    </div>
                );
             case 'error':
                return (
                     <div className="text-center py-12">
                        <p className="mt-4 font-semibold text-red-600">Ocorreu um erro</p>
                        <p className="text-sm text-gray-500 bg-red-50 p-2 rounded-md">{error || 'Não foi possível conectar. Tente novamente.'}</p>
                         <button onClick={handleGenerateQR} className="mt-4 w-full px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg">Tentar Novamente</button>
                    </div>
                )
            case 'idle':
            default:
                return (
                    <div className="text-center">
                        <p className="font-semibold text-gray-700 mb-2">Conectar ao WhatsApp</p>
                        <p className="text-sm text-gray-500 mb-6">Para habilitar o envio de mensagens e lembretes automáticos, conecte sua conta do WhatsApp.</p>
                        <button
                            onClick={handleGenerateQR}
                            className="w-full px-4 py-3 bg-pink-500 text-white font-bold rounded-lg shadow-md hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400"
                        >
                            Gerar QR Code
                        </button>
                        <p className="text-xs text-gray-400 mt-4">Sua sessão será gerenciada de forma segura em nosso servidor.</p>
                    </div>
                );
        }
    }


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm m-4 transform transition-all duration-300 scale-100">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Conexão WhatsApp</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
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