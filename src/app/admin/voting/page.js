'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Swal from 'sweetalert2';
import { Vote, UserPlus, Edit, Trash2, UserCircle, Calendar, FileText, Users } from 'lucide-react';

export default function VotingAdmin() {
    // --- SEMUA LOGIKA STATE DAN FUNGSI ANDA TETAP SAMA ---
    const [events, setEvents] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [eventId, setEventId] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                const activeEvent = data.find(e => e.status === 'active');
                if (activeEvent) setEventId(activeEvent.id);
            });
        fetch('/api/candidates')
            .then(res => res.json())
            .then(data => setCandidates(data.sort((a, b) => a.name.localeCompare(b.name))));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const candidate = { name, description, eventId: Number(eventId) };
            if (editingId) {
                await fetch(`/api/candidates/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(candidate) });
                const updatedCandidate = { ...candidates.find(c => c.id === editingId), name, description, eventId: Number(eventId) };
                setCandidates(candidates.map(c => (c.id === editingId ? updatedCandidate : c)));
                setEditingId(null);
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Kandidat diperbarui.', confirmButtonColor: '#8B5CF6' });
            } else {
                const res = await fetch('/api/candidates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(candidate) });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Gagal menambahkan kandidat');
                }
                const newCandidate = await res.json();
                setCandidates([...candidates, newCandidate].sort((a, b) => a.name.localeCompare(b.name)));
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Kandidat ditambahkan.', confirmButtonColor: '#8B5CF6' });
            }
            setName(''); setDescription('');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Gagal!', text: error.message || 'Gagal menyimpan kandidat.', confirmButtonColor: '#EF4444' });
        }
    };

    const handleEdit = (candidate) => {
        window.scrollTo(0, 0);
        setName(candidate.name);
        setDescription(candidate.description);
        setEventId(candidate.eventId);
        setEditingId(candidate.id);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Anda yakin?', text: "Kandidat yang dihapus tidak dapat dikembalikan!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#EF4444', cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`/api/candidates/${id}`, { method: 'DELETE' });
                    setCandidates(candidates.filter(c => c.id !== id));
                    Swal.fire('Dihapus!', 'Kandidat telah berhasil dihapus.', 'success');
                } catch (error) {
                    Swal.fire('Gagal!', 'Gagal menghapus kandidat.', 'error');
                }
            }
        });
    };
    // --- END OF LOGIC ---

    const cardThemes = [
        { bg: 'from-blue-500/30 to-sky-600/30', accent: 'text-blue-300', shadow: 'shadow-blue-500/20', iconBg: 'bg-blue-500' },
        { bg: 'from-purple-500/30 to-indigo-600/30', accent: 'text-purple-300', shadow: 'shadow-purple-500/20', iconBg: 'bg-purple-500' },
        { bg: 'from-teal-500/30 to-emerald-600/30', accent: 'text-teal-300', shadow: 'shadow-teal-500/20', iconBg: 'bg-teal-500' },
        { bg: 'from-orange-500/30 to-amber-600/30', accent: 'text-orange-300', shadow: 'shadow-orange-500/20', iconBg: 'bg-orange-500' },
    ];

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
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl"><Vote className="w-8 h-8 text-white" /></div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Kelola Kandidat</h1>
                            <p className="text-white/70">Manajemen data kandidat untuk setiap event voting.</p>
                        </div>
                    </header>


                    {/* Formulir */}
                    <section className="bg-black/20 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-xl mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"><UserPlus /><span>{editingId ? 'Edit Kandidat' : 'Tambah Kandidat Baru'}</span></h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><Calendar size={16} /> Event Aktif</label>
                                    <select value={eventId} onChange={(e) => setEventId(e.target.value)} required
                                        className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all appearance-none bg-no-repeat bg-right pr-8" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}>
                                        <option value="" className="bg-gray-800 text-white" disabled>Pilih Event</option>
                                        {events.filter(e => e.status === 'active').map(event => (<option key={event.id} value={event.id} className="bg-gray-800 text-white">{event.name}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><UserCircle size={16} /> Nama Kandidat</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nama Lengkap Kandidat"
                                        className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><FileText size={16} /> Deskripsi (Visi & Misi)</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Jelaskan visi dan misi kandidat..." rows="4"
                                    className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all" />
                            </div>
                            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                                {editingId && (<button type="button" onClick={() => { setEditingId(null); setName(''); setDescription(''); }}
                                    className="py-2 px-5 bg-gray-500/50 text-white rounded-lg hover:bg-gray-500/80 transition-colors">Batal</button>)}
                                <button type="submit" className="py-2 px-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30 flex items-center gap-2">
                                    {editingId ? <><Edit size={16} /> Update Kandidat</> : <><UserPlus size={16} /> Simpan Kandidat</>}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Daftar Kandidat */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6">Daftar Kandidat</h2>
                        {candidates.length === 0 ? (
                            <div className="text-center py-12 bg-black/20 backdrop-blur-sm rounded-2xl"><Users className="w-16 h-16 text-white/30 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-2">Belum Ada Kandidat</h3><p className="text-white/60">Silakan tambahkan kandidat untuk event aktif.</p></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {candidates.map((candidate, index) => {
                                    const theme = cardThemes[index % cardThemes.length];
                                    const eventName = events.find(e => e.id === candidate.eventId)?.name || 'Event tidak ditemukan';

                                    return (
                                        <div key={candidate.id} className={`bg-gradient-to-br ${theme.bg} backdrop-blur-md border border-white/10 rounded-2xl shadow-xl ${theme.shadow} flex flex-col overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02]`}>
                                            <div className="p-5 flex-grow">
                                                <div className="flex justify-between items-start gap-4 mb-4">
                                                    <div className={`p-4 rounded-lg ${theme.iconBg}`}><UserCircle className="w-8 h-8 text-white" /></div>
                                                    <div className="text-right">
                                                        <span className="font-semibold text-xs text-white/70">EVENT</span>
                                                        <p className="font-bold text-sm text-white">{eventName}</p>
                                                    </div>
                                                </div>
                                                <h3 className={`text-2xl font-bold ${theme.accent} truncate`}>{candidate.name}</h3>
                                                <p className="text-sm text-white/80 mt-2 h-20 overflow-hidden line-clamp-4">{candidate.description}</p>
                                            </div>
                                            <div className="bg-black/30 p-3 flex justify-end items-center space-x-2">
                                                <button onClick={() => handleEdit(candidate)} className="p-2 rounded-md bg-sky-500/20 text-sky-300 hover:bg-sky-500/40 transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(candidate.id)} className="p-2 rounded-md bg-pink-500/20 text-pink-300 hover:bg-pink-500/40 transition-colors"><Trash2 size={16} /></button>
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