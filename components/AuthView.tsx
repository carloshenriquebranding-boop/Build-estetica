import * as React from 'react';
import { Loader2 } from './icons/Loader2.tsx';
import { supabase } from '../services/supabaseClient.ts';

const AuthView: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [view, setView] = React.useState<'login' | 'signup' | 'reset_password'>('login');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const clearMessagesAndFields = () => {
    setMessage('');
    setError('');
    // Keep email for password reset flow if user clicks from login
    if (view !== 'login') {
        setEmail('');
    }
    setPassword('');
  };

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (view === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      }
      // onAuthStateChange in App.tsx will handle successful login
    } else if (view === 'signup') {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
            data: {
                name: 'Novo Usuário',
                business_name: 'Minha Clínica'
            }
        }
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Cadastro realizado! Verifique seu email para confirmação.');
      }
    }
    setLoading(false);
  };
  
  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Link de recuperação enviado! Verifique seu email.');
    }
    setLoading(false);
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-pink-500">EstéticaCRM</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
                {view === 'login' && 'Acesse sua conta'}
                {view === 'signup' && 'Crie sua conta'}
                {view === 'reset_password' && 'Recupere sua senha'}
            </p>
        </div>

        {message && <div className="mb-4 text-center bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-3 rounded-lg">{message}</div>}
        {error && <div className="mb-4 text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-3 rounded-lg">{error}</div>}
        
        {view === 'reset_password' ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
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
                    disabled={loading}
                    />
                </div>
                <div>
                    <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-400"
                    disabled={loading}
                    >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Enviar link de recuperação'}
                    </button>
                </div>
                <div className="mt-6 text-center text-sm">
                    <button type="button" onClick={() => { setView('login'); clearMessagesAndFields(); }} className="font-medium text-pink-600 hover:text-pink-500">
                        Voltar para o login
                    </button>
                </div>
            </form>
        ) : (
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
                    disabled={loading}
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center">
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-slate-300">Senha</label>
                        {view === 'login' && (
                            <button type="button" onClick={() => { setView('reset_password'); clearMessagesAndFields(); }} className="text-sm font-medium text-pink-600 hover:text-pink-500">
                                Esqueceu a senha?
                            </button>
                        )}
                    </div>
                    <input
                    id="password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    />
                </div>
                <div>
                    <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:bg-pink-400"
                    disabled={loading}
                    >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : (view === 'login' ? 'Entrar' : 'Cadastrar')}
                    </button>
                </div>
                 <div className="mt-6 text-center text-sm">
                    <button type="button" onClick={() => { setView(view === 'login' ? 'signup' : 'login'); clearMessagesAndFields(); }} className="font-medium text-pink-600 hover:text-pink-500">
                        {view === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default AuthView;
