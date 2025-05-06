import React, { useState, useEffect } from 'react';
import { Mail, Shield, UserPlus, Users, Settings, Trash2, UserCog, BookOpen, MessageSquare, Ban, User } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  rank: number;
  isAdmin: boolean;
  createdAt: string;
  messageCount: number;
  roles: number[];
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  lastActive?: string;
  website?: string;
  signature?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
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
  color?: string;
  icon?: string;
  priority?: number;
}

const DEFAULT_PERMISSIONS: Permission[] = [
  { id: 'create_forum', name: 'Créer des forums', description: 'Permet de créer de nouveaux forums', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'delete_forum', name: 'Supprimer des forums', description: 'Permet de supprimer des forums existants', icon: <Trash2 className="h-5 w-5" /> },
  { id: 'moderate_posts', name: 'Modérer les messages', description: 'Permet de modérer les messages des utilisateurs', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'pin_topics', name: 'Épingler des sujets', description: 'Permet d\'épingler des sujets importants', icon: <Shield className="h-5 w-5" /> },
  { id: 'ban_users', name: 'Bannir des utilisateurs', description: 'Permet de bannir des utilisateurs', icon: <Ban className="h-5 w-5" /> },
  { id: 'edit_users', name: 'Éditer les utilisateurs', description: 'Permet de modifier les informations des utilisateurs', icon: <UserCog className="h-5 w-5" /> },
  { id: 'manage_roles', name: 'Gérer les rôles', description: 'Permet de créer et modifier les rôles', icon: <Shield className="h-5 w-5" /> },
];

const DEFAULT_ROLE: Role = {
  id: 1,
  name: "Membre",
  permissions: ['create_forum'],
  createdAt: new Date().toISOString(),
  description: "Rôle par défaut pour les nouveaux membres",
  color: "#6B7280",
  autoAssign: true,
  priority: 0
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [section, setSection] = useState('home');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [forums, setForums] = useState<Forum[]>([]);
  const [roles, setRoles] = useState<Role[]>([DEFAULT_ROLE]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState({ 
    name: '', 
    permissions: [] as string[],
    description: '',
    autoAssign: false,
    color: '#6B7280',
    priority: 0
  });
  const [adminSection, setAdminSection] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      setRoles(JSON.parse(storedRoles));
    } else {
      localStorage.setItem('roles', JSON.stringify([DEFAULT_ROLE]));
    }
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
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
        messageCount: 0,
        roles: [1],
        joinDate: new Date().toISOString(),
      };
      setCurrentUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      setMessage({ text: 'Connexion réussie!', type: 'success' });
      setSection('home');
      return;
    }

    const user = users.find(u => u.username === username && u.password === password);
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

    if (users.some(u => u.username === username || u.email === email)) {
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
      roles: [DEFAULT_ROLE.id],
      createdAt: new Date().toISOString(),
      messageCount: 0,
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setMessage({ text: 'Inscription réussie!', type: 'success' });
    setSection('login');
  };

  const handleCreateRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newRole.name || newRole.permissions.length === 0) {
      setMessage({ text: 'Veuillez remplir tous les champs requis', type: 'error' });
      return;
    }

    const roleId = roles.length + 1;
    const newRoleObj: Role = {
      id: roleId,
      name: newRole.name,
      permissions: newRole.permissions,
      createdAt: new Date().toISOString(),
      description: newRole.description,
      autoAssign: newRole.autoAssign,
      color: newRole.color,
      priority: newRole.priority
    };

    const updatedRoles = [...roles, newRoleObj];
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
    setNewRole({ 
      name: '', 
      permissions: [], 
      description: '', 
      autoAssign: false,
      color: '#6B7280',
      priority: 0
    });
    setMessage({ text: 'Rôle créé avec succès', type: 'success' });
  };

  const handleUpdateUserRoles = (userId: number, roleIds: number[]) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, roles: roleIds };
      }
      return user;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setMessage({ text: 'Rôles mis à jour avec succès', type: 'success' });
  };

  const handleUpdateProfile = (userId: number, profileData: Partial<User>) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, ...profileData };
      }
      return user;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setMessage({ text: 'Profil mis à jour avec succès', type: 'success' });
  };

  const renderUserProfile = (user: User) => {
    const userRoles = roles.filter(role => user.roles.includes(role.id));

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {userRoles.map(role => (
                <span
                  key={role.id}
                  className="px-2 py-1 rounded text-sm"
                  style={{ backgroundColor: role.color, color: '#fff' }}
                >
                  {role.name}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-gray-600">
              <p><strong>Membre depuis:</strong> {new Date(user.joinDate).toLocaleDateString()}</p>
              <p><strong>Dernière activité:</strong> {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Jamais'}</p>
              <p><strong>Messages:</strong> {user.messageCount}</p>
              {user.location && <p><strong>Localisation:</strong> {user.location}</p>}
              {user.website && <p><strong>Site web:</strong> <a href={user.website} className="text-blue-600 hover:underline">{user.website}</a></p>}
            </div>
            {user.bio && (
              <div className="mt-4">
                <h3 className="font-semibold">À propos</h3>
                <p className="mt-1 text-gray-600">{user.bio}</p>
              </div>
            )}
            {user.socialLinks && (
              <div className="mt-4">
                <h3 className="font-semibold">Réseaux sociaux</h3>
                <div className="flex space-x-4 mt-2">
                  {user.socialLinks.twitter && (
                    <a href={user.socialLinks.twitter} className="text-blue-400 hover:text-blue-600">
                      Twitter
                    </a>
                  )}
                  {user.socialLinks.github && (
                    <a href={user.socialLinks.github} className="text-gray-800 hover:text-gray-600">
                      GitHub
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a href={user.socialLinks.linkedin} className="text-blue-600 hover:text-blue-800">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {currentUser?.isAdmin && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-4">Gestion des rôles</h3>
            <div className="space-y-2">
              {roles.map(role => (
                <label key={role.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={user.roles.includes(role.id)}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...user.roles, role.id]
                        : user.roles.filter(id => id !== role.id);
                      handleUpdateUserRoles(user.id, newRoles);
                    }}
                    className="rounded text-indigo-600"
                  />
                  <span style={{ color: role.color }}>{role.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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

                <div>
                  <label className="block mb-1">Couleur</label>
                  <input
                    type="color"
                    value={newRole.color}
                    onChange={(e) => setNewRole(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full p-1 border rounded"
                  />
                </div>

                <div>
                  <label className="block mb-1">Priorité</label>
                  <input
                    type="number"
                    value={newRole.priority}
                    onChange={(e) => setNewRole(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded"
                    min="0"
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
                          onChange={() => {
                            setNewRole(prev => ({
                              ...prev,
                              permissions: prev.permissions.includes(permission.id)
                                ? prev.permissions.filter(p => p !== permission.id)
                                : [...prev.permissions, permission.id]
                            }));
                          }}
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
                          <h4 className="text-lg font-medium" style={{ color: role.color }}>{role.name}</h4>
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
                      {role.id !== DEFAULT_ROLE.id && (
                        <button
                          onClick={() => {
                            const updatedRoles = roles.filter(r => r.id !== role.id);
                            setRoles(updatedRoles);
                            localStorage.setItem('roles', JSON.stringify(updatedRoles));
                            setMessage({ text: 'Rôle supprimé avec succès', type: 'success' });
                          }}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h3>
            <div className="space-y-4">
              {users.map(user => (
                <div key={user.id} className="border p-4 rounded hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-medium">{user.username}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                      Voir le profil
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                  <span className="font-bold">{users.length}</span>
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
                  onClick={() => setAdminSection('users')}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Gérer les utilisateurs
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
                <button onClick={() => setSection('profile')} className="hover:text-indigo-200">Profil</button>
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

        {section === 'profile' && currentUser && renderUserProfile(currentUser)}

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
                  onClick={() => setAdminSection('users')}
                  className={`px-4 py-2 rounded ${adminSection === 'users' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
                >
                  Gestion des utilisateurs
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

        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {renderUserProfile(selectedUser)}
                <button
                  onClick={() => setSelectedUser(null)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;