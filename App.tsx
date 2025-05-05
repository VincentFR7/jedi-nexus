import React from 'react';

function App() {
  return (import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  rank: number;
  isAdmin: boolean;
  createdAt: string;
  messageCount: number;
}

interface Forum {
  id: number;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  permissions: {
    read: number[];
    write: number[];
  };
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [section, setSection] = useState('home');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [forums, setForums] = useState<Forum[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      setMessage({ text: 'Connexion réussie!', type: 'success' });
      setSection('home');
    } else {
      setMessage({ text: 'Identifiants incorrects', type: 'error' });
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: any) => u.username === username || u.email === email)) {
      setMessage({ text: 'Nom d\'utilisateur ou email déjà utilisé', type: 'error' });
      return;
    }

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password,
      rank: 1,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      messageCount: 0
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setMessage({ text: 'Inscription réussie! Vous pouvez maintenant vous connecter.', type: 'success' });
    setSection('login');
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === resetEmail);

    if (user) {
      // In a real app, send email with reset link
      setMessage({ text: 'Instructions de réinitialisation envoyées par email', type: 'success' });
    } else {
      setMessage({ text: 'Email non trouvé', type: 'error' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setSection('home');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={() => setSection('home')} className="hover:text-indigo-200">Accueil</button>
            {currentUser && (
              <>
                <button onClick={() => setSection('forums')} className="hover:text-indigo-200">Forums</button>
                {currentUser.isAdmin && (
                  <button onClick={() => setSection('admin')} className="hover:text-indigo-200">Admin</button>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span>{currentUser.username}</span>
                <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setSection('login')} className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-700">
                  Connexion
                </button>
                <button onClick={() => setSection('register')} className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
                  Inscription
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        {message.text && (
          <div className={`mb-4 p-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {section === 'login' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Connexion</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-1">Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                Se connecter
              </button>
            </form>
            <button
              onClick={() => setSection('resetPassword')}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Mot de passe oublié?
            </button>
          </div>
        )}

        {section === 'register' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Inscription</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block mb-1">Nom d'utilisateur</label>
                <input
                  type="text"
                  name="username"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                S'inscrire
              </button>
            </form>
          </div>
        )}

        {section === 'resetPassword' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Réinitialisation du mot de passe</h2>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                Réinitialiser le mot de passe
              </button>
            </form>
          </div>
        )}

        {section === 'forums' && currentUser && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Forums</h2>
            {forums.length === 0 ? (
              <p className="text-gray-600">Aucun forum n'a été créé pour le moment.</p>
            ) : (
              <div className="space-y-4">
                {forums.map(forum => (
                  <div key={forum.id} className="border p-4 rounded">
                    <h3 className="text-xl font-semibold">{forum.name}</h3>
                    <p className="text-gray-600">{forum.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === 'admin' && currentUser?.isAdmin && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Administration</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem('name') as HTMLInputElement).value;
              const description = (form.elements.namedItem('description') as HTMLInputElement).value;
              
              const newForum = {
                id: forums.length + 1,
                name,
                description,
                createdBy: currentUser.username,
                createdAt: new Date().toISOString(),
                permissions: {
                  read: [1, 2, 3],
                  write: [2, 3]
                }
              };

              setForums([...forums, newForum]);
              form.reset();
            }} className="space-y-4">
              <div>
                <label className="block mb-1">Nom du forum</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Créer un forum
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p>Start prompting (or editing) to see magic happen :)</p>
    </div>
  );
}

export default App;
