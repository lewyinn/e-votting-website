'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Swal from 'sweetalert2';
import { Calendar, PlusCircle, Edit, Trash2, CheckCircle, PlayCircle, Clock, FileText, CalendarDays } from 'lucide-react';

export default function EventsAdmin() {
    const [events, setEvents] = useState([]);
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => setEvents(data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(endDate) < new Date(startDate)) {
            Swal.fire({ icon: 'error', title: 'Tanggal Tidak Valid', text: 'Tanggal selesai tidak boleh sebelum tanggal mulai.', confirmButtonColor: '#8B5CF6' });
            return;
        }
        try {
            const event = { name, startDate, endDate };
            if (editingId) {
                await fetch(`/api/events/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) });
                setEvents(events.map(e => (e.id === editingId ? { ...e, ...event } : e)));
                setEditingId(null);
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Event diperbarui.', confirmButtonColor: '#8B5CF6' });
            } else {
                const activeEvents = events.filter(e => e.status === 'active');
                if (activeEvents.length > 0) {
                    Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Hanya satu event aktif yang diizinkan.', confirmButtonColor: '#EF4444' });
                    return;
                }
                const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) });
                const newEvent = await res.json();
                setEvents([newEvent, ...events]);
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Event ditambahkan.', confirmButtonColor: '#8B5CF6' });
            }
            setName(''); setStartDate(''); setEndDate('');
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Gagal menyimpan event.', confirmButtonColor: '#EF4444' });
        }
    };
    const handleEdit = (event) => {
        window.scrollTo(0, 0);
        setName(event.name);
        setStartDate(new Date(event.startDate).toISOString().split('T')[0]);
        setEndDate(new Date(event.endDate).toISOString().split('T')[0]);
        setEditingId(event.id);
    };
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Anda yakin?', text: "Event yang dihapus tidak dapat dikembalikan!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#EF4444', cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await fetch(`/api/events/${id}`, { method: 'DELETE' });
                    setEvents(events.filter(e => e.id !== id));
                    Swal.fire('Dihapus!', 'Event telah berhasil dihapus.', 'success');
                } catch (error) {
                    Swal.fire('Gagal!', 'Gagal menghapus event.', 'error');
                }
            }
        });
    };
    const handleEndEvent = async (id) => {
        try {
            await fetch(`/api/events/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'finished' }) });
            setEvents(events.map(e => (e.id === id ? { ...e, status: 'finished' } : e)));
            Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Event diakhiri.', confirmButtonColor: '#8B5CF6' });
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Gagal mengakhiri event.', confirmButtonColor: '#EF4444' });
        }
    };

    const cardThemes = [
        { bg: 'from-cyan-500/30 to-blue-500/30', accent: 'text-cyan-300', shadow: 'shadow-cyan-500/20', iconBg: 'bg-cyan-500' },
        { bg: 'from-pink-500/30 to-purple-500/30', accent: 'text-pink-300', shadow: 'shadow-pink-500/20', iconBg: 'bg-pink-500' },
        { bg: 'from-green-500/30 to-teal-500/30', accent: 'text-green-300', shadow: 'shadow-green-500/20', iconBg: 'bg-green-500' },
        { bg: 'from-yellow-500/30 to-orange-500/30', accent: 'text-yellow-300', shadow: 'shadow-yellow-500/20', iconBg: 'bg-yellow-500' },
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
                {/* Latar Belakang */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 -z-10"></div>

                <div className="p-4 md:p-8">
                    {/* Header Halaman */}
                    <header className="mb-8 flex items-center space-x-4">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl"><Calendar className="w-8 h-8 text-white" /></div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Kelola Events</h1>
                            <p className="text-white/70">Atur semua event voting Anda dari sini.</p>
                        </div>
                    </header>

                    {/* Formulir */}
                    <section className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-xl mb-8">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3"><PlusCircle /><span>{editingId ? 'Edit Event' : 'Tambah Event Baru'}</span></h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><FileText size={16} /> Nama Event</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Contoh: Pemilihan Ketua OSIS 2025"
                                        className="w-full p-3 bg-black/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><CalendarDays size={16} /> Tanggal Mulai</label>
                                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required
                                            className="w-full p-3 bg-black/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-white/80 mb-2 font-medium"><CalendarDays size={16} /> Tanggal Selesai</label>
                                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required
                                            className="w-full p-3 bg-black/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                                {editingId && (<button type="button" onClick={() => { setEditingId(null); setName(''); setStartDate(''); setEndDate(''); }}
                                    className="py-2 px-5 bg-gray-500/50 text-white rounded-lg hover:bg-gray-500/80 transition-colors">Batal</button>)}
                                <button type="submit" className="py-2 px-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/30 flex items-center gap-2">
                                    {editingId ? <><Edit size={16} /> Update Event</> : <><PlusCircle size={16} /> Simpan Event</>}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Daftar Event */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6">Daftar Event</h2>
                        {events.length === 0 ? (
                            <div className="text-center py-12 bg-black/20 backdrop-blur-sm rounded-2xl"><Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-2">Belum Ada Event</h3><p className="text-white/60">Silakan tambahkan event baru.</p></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event, index) => {
                                    const theme = cardThemes[index % cardThemes.length];
                                    const statusInfo = {
                                        active: { text: "Aktif", color: "bg-green-400/90 border-green-300 text-green-950", icon: <PlayCircle size={14} /> },
                                        finished: { text: "Selesai", color: "bg-gray-400/80 border-gray-300 text-gray-950", icon: <CheckCircle size={14} /> },
                                        upcoming: { text: "Akan Datang", color: "bg-yellow-400/90 border-yellow-300 text-yellow-950", icon: <Clock size={14} /> }
                                    };
                                    const currentStatus = statusInfo[event.status] || statusInfo.finished;

                                    return (
                                        <div key={event.id} className={`bg-gradient-to-br ${theme.bg} backdrop-blur-md border border-white/10 rounded-2xl shadow-xl ${theme.shadow} flex flex-col overflow-hidden transition-all duration-300 hover:border-white/20 hover:scale-[1.02]`}>
                                            <div className="p-5 flex-grow">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className={`p-3 rounded-lg ${theme.iconBg} mb-4`}><CalendarDays className="w-6 h-6 text-white" /></div>
                                                    <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${currentStatus.color}`}>{currentStatus.icon}{currentStatus.text}</span>
                                                </div>
                                                <h3 className={`text-xl font-bold ${theme.accent} mb-2`}>{event.name}</h3>
                                                <div className="text-sm text-white/70 space-y-1 mt-4 border-t border-white/10 pt-4">
                                                    <p><strong>Mulai:</strong> {new Date(event.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    <p><strong>Selesai:</strong> {new Date(event.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="bg-black/30 p-3 flex justify-end items-center space-x-2">
                                                {event.status === 'active' && (<button onClick={() => handleEndEvent(event.id)} className="p-2 rounded-md bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40 transition-colors"><CheckCircle size={16} /></button>)}
                                                <button onClick={() => handleEdit(event)} disabled={event.status === 'finished'} className="p-2 rounded-md bg-sky-500/20 text-sky-300 hover:bg-sky-500/40 disabled:bg-gray-500/10 disabled:text-gray-500 transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(event.id)} disabled={event.status === 'finished'} className="p-2 rounded-md bg-pink-500/20 text-pink-300 hover:bg-pink-500/40 disabled:bg-gray-500/10 disabled:text-gray-500 transition-colors"><Trash2 size={16} /></button>
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