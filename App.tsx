import React, { useState, useEffect } from 'react';
import { Mail, Shield, UserPlus, Users, Settings, Trash2, UserCog, BookOpen, MessageSquare, Ban } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  rank: number;
  isAdmin: boolean;
  createdAt: string;
  messageCount: number;
  roleId?: number;
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

interface Permission {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Role {
  id: number;
  name: string;
  permissions: string[];
  createdAt: string;
  autoAssign?: boolean;
  description?: string;
}

const DEFAULT_PERMISSIONS: Permission[] = [
  { id: 'create_forum', name: 'Créer des forums', description: 'Permet de créer de nouveaux forums', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'delete_forum', name: 'Supprimer des forums', description: 'Permet de supprimer des forums existants', icon: <Trash2 className="h-5 w-5" /> },
  { id: 'moderate_posts', name: 'Modérer les messages', description: 'Permet de modérer les messages des utilisateurs', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'pin_topics', name: 'Épingler des sujets', description: 'Permet d\'épingler des sujets importants', icon: <Shield className="h-5 w-5" /> },
  { id: 'ban_users', name: 'Bannir des utilisateurs', description: 'Permet de bannir des utilisateurs', icon: <Ban className="h-5 w-5" /> },
  { id: 'edit_users', name: 'Éditer les utilisateurs', description: 'Permet de modifier les informations des utilisateurs', icon: <UserCog className="h-5 w-5" /> },
];

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [section, setSection] = useState('home');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [forums, setForums] = useState<Forum[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState({ 
    name: '', 
    permissions: [] as string[],
    description: '',
    autoAssign: false 
  });
  const [adminSection, setAdminSection] = useState('overview');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      setRoles(JSON.parse(storedRoles));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (username === 'Admin' && password === 'adminlbrpus1') {
      const adminUser = {
        id: 1,
        username: 'Admin',
        email: 'admin@example.com',
        rank: 3,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        messageCount: 0
      };
      setCurrentUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      setMessage({ text: 'Connexion réussie!', type: 'success' });
      setSection('home');
      return;
    }

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

    // Find auto-assign role if any exists
    const autoAssignRole = roles.find(role => role.autoAssign);
    
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password,
      rank: 1,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      messageCount: 0,
      roleId: autoAssignRole?.id
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setMessage({ text: `Inscription réussie! ${autoAssignRole ? `Rôle attribué: ${autoAssignRole.name}` : ''}`, type: 'success' });
    setSection('login');
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === resetEmail);

    if (user) {
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

  const handleCreateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRole.name || newRole.permissions.length === 0) {
      setMessage({ text: 'Veuillez remplir tous les champs requis', type: 'error' });
      return;
    }

    if (newRole.autoAssign && roles.some(r => r.autoAssign)) {
      setMessage({ text: 'Un seul rôle peut être assigné automatiquement', type: 'error' });
      return;
    }

    const newRoleObj: Role = {
      id: roles.length + 1,
      name: newRole.name,
      permissions: newRole.permissions,
      createdAt: new Date().toISOString(),
      description: newRole.description,
      autoAssign: newRole.autoAssign
    };

    const updatedRoles = [...roles, newRoleObj];
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
    setNewRole({ name: '', permissions: [], description: '', autoAssign: false });
    setMessage({ text: 'Rôle créé avec succès', type: 'success' });
  };

  const handleDeleteRole = (roleId: number) => {
    const updatedRoles = roles.filter(role => role.id !== roleId);
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
    setMessage({ text: 'Rôle supprimé avec succès', type: 'success' });
  };

  const togglePermission = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const renderAdminContent = () => {
    switch (adminSection) {
      case 'roles':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Créer un nouveau rôle</h3>
              <form onSubmit={handleCreateRole} className="space-y-4">
                <div>
                  <label className="block mb-1">Nom du rôle</label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoAssign"
                    checked={newRole.autoAssign}
                    onChange={(e) => setNewRole(prev => ({ ...prev, autoAssign: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="autoAssign">Assigner automatiquement ce rôle aux nouveaux utilisateurs</label>
                </div>

                <div>
                  <label className="block mb-2">Permissions</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DEFAULT_PERMISSIONS.map(permission => (
                      <div key={permission.id} className="flex items-center p-3 border rounded hover:bg-gray-50">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={newRole.permissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          {permission.icon}
                          <div className="ml-3">
                            <label htmlFor={permission.id} className="font-medium block">
                              {permission.name}
                            </label>
                            <span className="text-sm text-gray-500">{permission.description}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  Créer le rôle
                </button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Rôles existants</h3>
              <div className="space-y-4">
                {roles.map(role => (
                  <div key={role.id} className="border p-4 rounded hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-medium">{role.name}</h4>
                          {role.autoAssign && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Auto-assigné
                            </span>
                          )}
                        </div>
                        {role.description && (
                          <p className="text-gray-600">{role.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Créé le {new Date(role.createdAt).toLocaleDateString()}
                        </p>
                        <div>
                          <p className="font-medium mb-1">Permissions :</p>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map(permId => {
                              const permission = DEFAULT_PERMISSIONS.find(p => p.id === permId);
                              return permission ? (
                                <span key={permId} className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-sm">
                                  {permission.icon}
                                  <span className="ml-1">{permission.name}</span>
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {roles.length === 0 && (
                  <p className="text-gray-600">Aucun rôle n'a été créé pour le moment.</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'forums':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Gestion des forums</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const name = (form.elements.namedItem('name') as HTMLInputElement).value;
              const description = (form.elements.namedItem('description') as HTMLInputElement).value;
              
              const newForum = {
                id: forums.length + 1,
                name,
                description,
                createdBy: currentUser!.username,
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
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Nombre d'utilisateurs</span>
                  <span className="font-bold">{JSON.parse(localStorage.getItem('users') || '[]').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nombre de forums</span>
                  <span className="font-bold">{forums.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Nombre de rôles</span>
                  <span className="font-bold">{roles.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setAdminSection('roles')}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  Gérer les rôles
                </button>
                <button
                  onClick={() => setAdminSection('forums')}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Gérer les forums
                </button>
              </div>
            </div>
          </div>
        );
    }
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
                  <button onClick={() => setSection('admin')} className="hover:text-indigo-200">Administration</button>
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
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex space-x-4">
                <button
                  onClick={() => setAdminSection('overview')}
                  className={`px-4 py-2 rounded ${adminSection === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setAdminSection('roles')}
                  className={`px-4 py-2 rounded ${adminSection === 'roles' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  Gestion des rôles
                </button>
                <button
                  onClick={() => setAdminSection('forums')}
                  className={`px-4 py-2 rounded ${adminSection === 'forums' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  Gestion des forums
                </button>
              </div>
            </div>
            
            {renderAdminContent()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
