'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Swal from 'sweetalert2';
import { Users, UserPlus, Edit, Trash2, User, Mail, Lock, Shield } from 'lucide-react';

export default function UsersAdmin() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(data.sort((a, b) => a.name.localeCompare(b.name))));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = { name, email, role };
            if (password) {
                user.password = password;
            }

            if (editingId) {
                await fetch(`/api/users/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
                const updatedUser = { ...users.find(u => u.id === editingId), name, email, role };
                setUsers(users.map(u => (u.id === editingId ? updatedUser : u)));
                setEditingId(null);
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'User diperbarui.', confirmButtonColor: '#8B5CF6' });
            } else {
                const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Gagal menambahkan user');
                }
                const newUser = await res.json();
                setUsers([...users, newUser].sort((a,b) => a.name.localeCompare(b.name)));
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'User ditambahkan.', confirmButtonColor: '#8B5CF6' });
            }
            setName(''); setEmail(''); setPassword(''); setRole('user');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Gagal!', text: error.message || 'Gagal menyimpan user.', confirmButtonColor: '#EF4444' });
        }
    };

    const handleEdit = (user) => {
        window.scrollTo(0, 0);
        setName(user.name);
        setEmail(user.email);
        setPassword('');
        setRole(user.role);
        setEditingId(user.id);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Anda yakin?', text: "Data pengguna yang dihapus tidak dapat dikembalikan!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#EF4444', cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`/api/users/${id}`, { method: 'DELETE' });
                    setUsers(users.filter(u => u.id !== id));
                    Swal.fire('Dihapus!', 'Pengguna telah berhasil dihapus.', 'success');
                } catch (error) {
                    Swal.fire('Gagal!', 'Gagal menghapus pengguna.', 'error');
                }
            }
        });
    };
    // --- END OF LOGIC ---

    // Palet Warna Dinamis untuk Kartu User
    const cardThemes = [
        { bg: 'from-sky-500/30 to-blue-600/30', accent: 'text-sky-300', shadow: 'shadow-sky-500/20', iconBg: 'bg-sky-500' },
        { bg: 'from-amber-500/30 to-red-500/30', accent: 'text-amber-300', shadow: 'shadow-amber-500/20', iconBg: 'bg-amber-500' },
        { bg: 'from-emerald-500/30 to-green-600/30', accent: 'text-emerald-300', shadow: 'shadow-emerald-500/20', iconBg: 'bg-emerald-500' },
        { bg: 'from-rose-500/30 to-fuchsia-600/30', accent: 'text-rose-300', shadow: 'shadow-rose-500/20', iconBg: 'bg-rose-500' },
    ];

    // Info untuk Role Badge
    const roleInfo = {
        admin: { text: "Admin", color: "bg-purple-400/90 border-purple-300 text-purple-950", icon: <Shield size={14} /> },
        user: { text: "User", color: "bg-blue-400/80 border-blue-300 text-blue-950", icon: <User size={14} /> }
    };

    return (
        <Sidebar>
             {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                {/* Floating elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full animate-pulse delay-100"></div>
                <div className="absolute bottom-40 right-20 w-24 h-24 bg-pink-400/20 rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400/20 rounded-full animate-bounce delay-500"></div>
                <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-orange-400/20 rounded-full animate-pulse delay-700"></div>
            </div>

            <div className="relative w-full min-h-full">
                <div className="p-4 md:p-8">
                    {/* Header Halaman */}
                    <header className="mb-8 flex items-center space-x-4">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl"><Users className="w-8 h-8 text-white" /></div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Kelola Users</h1>
                            <p className="text-white/70">Manajemen data pengguna dan hak akses.</p>
                        </div>
                    </header>

                    {/* Formulir */}
                    <section className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-xl mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"><UserPlus /><span>{editingId ? 'Edit User' : 'Tambah User Baru'}</span></h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><User size={16} /> Nama Lengkap</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe"
                                        className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><Mail size={16} /> Alamat Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john.doe@example.com"
                                        className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><Lock size={16} /> Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={!editingId} placeholder={editingId ? 'Kosongkan jika tidak diubah' : '••••••••'}
                                        className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all" />
                                </div>
                                 <div>
                                    <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><Shield size={16} /> Peran (Role)</label>
                                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all appearance-none bg-no-repeat bg-right pr-8" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`}}>
                                        <option value="user" className="bg-gray-800 text-white">User</option>
                                        <option value="admin" className="bg-gray-800 text-white">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                                {editingId && (<button type="button" onClick={() => { setEditingId(null); setName(''); setEmail(''); setPassword(''); setRole('user'); }}
                                    className="py-2 px-5 bg-gray-500/50 text-white rounded-lg hover:bg-gray-500/80 transition-colors">Batal</button>)}
                                <button type="submit" className="py-2 px-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30 flex items-center gap-2">
                                    {editingId ? <><Edit size={16} /> Update User</> : <><UserPlus size={16} /> Simpan User</>}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Daftar User */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6">Daftar Pengguna</h2>
                        {users.length === 0 ? (
                            <div className="text-center py-12 bg-black/20 backdrop-blur-sm rounded-2xl"><Users className="w-16 h-16 text-white/30 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-2">Belum Ada Pengguna</h3><p className="text-white/60">Silakan tambahkan pengguna baru.</p></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {users.map((user, index) => {
                                    const theme = cardThemes[index % cardThemes.length];
                                    const currentRole = roleInfo[user.role] || roleInfo.user;
                                    
                                    return (
                                        <div key={user.id} className={`bg-gradient-to-br ${theme.bg} backdrop-blur-md border border-white/10 rounded-2xl shadow-xl ${theme.shadow} flex flex-col overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02]`}>
                                            <div className="p-5 flex-grow">
                                                <div className="flex justify-between items-start gap-4 mb-4">
                                                    <div className={`p-3 rounded-lg ${theme.iconBg}`}><User className="w-6 h-6 text-white" /></div>
                                                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${currentRole.color}`}>{currentRole.icon}{currentRole.text}</span>
                                                </div>
                                                <h3 className={`text-xl font-bold ${theme.accent} truncate`}>{user.name}</h3>
                                                <p className="text-sm text-white/70 truncate">{user.email}</p>
                                            </div>
                                            <div className="bg-black/30 p-3 flex justify-end items-center space-x-2">
                                                <button onClick={() => handleEdit(user)} className="p-2 rounded-md bg-sky-500/20 text-sky-300 hover:bg-sky-500/40 transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(user.id)} className="p-2 rounded-md bg-pink-500/20 text-pink-300 hover:bg-pink-500/40 transition-colors"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </Sidebar>
    );
}