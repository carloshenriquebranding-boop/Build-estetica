import * as React from 'react';
import { Loader2 } from './icons/Loader2.tsx';

const AuthView: React.FC = () => {
  const [loading, setLoading] = React.useState(true); // Start as loading to simulate auth check
  const [email, setEmail] = React.useState('maria@esteticacrm.com');
  const [password, setPassword] = React.useState('123456');
  const [isLoginView, setIsLoginView] = React.useState(true);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  // This component is now for UI demonstration only.
  // The actual auth flow is simulated in App.tsx's useEffect.
  // A real implementation would replace this with calls to an auth service.
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    // Simulate a login attempt
    setTimeout(() => {
        // This is where a real auth call would happen.
        // The app will transition automatically based on App.tsx's logic.
        setMessage("Tentando conectar...");
        setError('');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-pink-500">EstéticaCRM</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">{isLoginView ? 'Acesse sua conta' : 'Crie sua conta'}</p>
        </div>

        {message && <div className="mb-4 text-center bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-lg">{error}</div>}
        
        {loading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        )}

        {!loading && (
          <>
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">Endereço de e-mail</label>
                <input
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-slate-300">Senha</label>
                <input
                  id="password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Entrar
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center text-sm">
                <button onClick={() => { setIsLoginView(!isLoginView); setError(''); setMessage(''); }} className="font-medium text-pink-600 hover:text-pink-500">
                    {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthView;