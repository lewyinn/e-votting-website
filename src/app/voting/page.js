'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Calendar, Clock, Users, Vote, LogOut, Trophy, Sparkles } from 'lucide-react';

export default function Voting() {
    const [events, setEvents] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const router = useRouter();

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                const activeEvent = data.find(e => e.status === 'active' && new Date(e.endDate) >= new Date());
                setEvents(data);
                if (activeEvent) {
                    fetch('/api/candidates')
                        .then(res => res.json())
                        .then(candidates => setCandidates(candidates.filter(c => c.eventId === activeEvent.id)));

                    const session = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('session='))
                        ?.split('=')[1];
                    if (session) {
                        const user = JSON.parse(session);
                        fetch(`/api/votes?eventId=${activeEvent.id}`)
                            .then(res => res.json())
                            .then(votes => {
                                if (votes.some(vote => vote.userId === user.id)) {
                                    setHasVoted(true);
                                }
                            });
                    }
                }
            });
    }, []);

    // Countdown timer
    useEffect(() => {
        const activeEvent = events.find(e => e.status === 'active' && new Date(e.endDate) >= new Date());
        if (!activeEvent) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const eventEnd = new Date(activeEvent.endDate).getTime();
            const distance = eventEnd - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [events]);

    const handleVoteClick = (candidate) => {
        if (hasVoted) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: 'Anda sudah melakukan voting untuk event ini!',
                confirmButtonColor: '#8B5CF6',
            });
            return;
        }
        setSelectedCandidate(candidate);
        setIsModalOpen(true);
    };

    const handleConfirmVote = async () => {
        const session = document.cookie
            .split('; ')
            .find(row => row.startsWith('session='))
            ?.split('=')[1];
        if (!session) {
            router.push('/');
            return;
        }

        const user = JSON.parse(session);
        const activeEvent = events.find(e => e.status === 'active' && new Date(e.endDate) >= new Date());
        if (!activeEvent) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: 'Tidak ada event aktif!',
                confirmButtonColor: '#8B5CF6',
            });
            return;
        }

        try {
            await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, candidateId: selectedCandidate.id, eventId: activeEvent.id }),
            });
            setHasVoted(true);
            setIsModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Vote Anda telah disimpan.',
                confirmButtonColor: '#8B5CF6',
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: 'Gagal menyimpan vote.',
                confirmButtonColor: '#8B5CF6',
            });
        }
    };

    const handleLogout = () => {
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Logout berhasil.',
            confirmButtonColor: '#8B5CF6',
        }).then(() => router.push('/'));
    };

    const activeEvent = events.find(e => e.status === 'active' && new Date(e.endDate) >= new Date());

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-400">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                {/* Floating shapes */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/30 rounded-full animate-bounce delay-100"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-pink-400/30 rounded-full animate-bounce delay-300"></div>
                <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-400/30 rounded-full animate-bounce delay-500"></div>
                <div className="absolute bottom-20 right-40 w-12 h-12 bg-orange-400/30 rounded-full animate-bounce delay-700"></div>

                {/* Geometric shapes */}
                <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/20 rotate-45 animate-spin"></div>
                <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-white/20 rotate-45 animate-spin delay-1000"></div>

                {/* Sparkle effects */}
                <div className="absolute top-10 right-10 text-white/30 animate-pulse">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div className="absolute bottom-10 left-10 text-white/30 animate-pulse delay-500">
                    <Sparkles className="w-8 h-8" />
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                            <Vote className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                                E-Voting System
                            </h1>
                            <p className="text-white/80 text-sm md:text-base">Demokratis • Transparan • Modern</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 py-3 px-6 bg-red-500/90 backdrop-blur-sm text-white rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Logout</span>
                    </button>
                </div>

                {activeEvent ? (
                    <>
                        {/* Event Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                                <span className="text-white font-medium">Event Aktif</span>
                                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg animate-pulse">
                                {activeEvent.name}
                            </h2>
                            <p className="text-white/80 text-lg">Suaramu Menentukan Masa Depan!</p>
                        </div>

                        {/* Countdown Timer */}
                        <div className="max-w-4xl mx-auto mb-12">
                            <div className="text-center mb-6">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center justify-center">
                                    <Clock className="w-6 h-6 mr-2 animate-pulse" />
                                    Waktu Tersisa
                                </h3>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {[
                                    { label: 'Hari', value: timeLeft.days, color: 'from-pink-500 to-rose-500' },
                                    { label: 'Jam', value: timeLeft.hours, color: 'from-purple-500 to-violet-500' },
                                    { label: 'Menit', value: timeLeft.minutes, color: 'from-blue-500 to-cyan-500' },
                                    { label: 'Detik', value: timeLeft.seconds, color: 'from-green-500 to-emerald-500' }
                                ].map((item, index) => (
                                    <div key={index} className="text-center">
                                        <div className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 md:p-6 shadow-xl transform hover:scale-105 transition-all duration-300`}>
                                            <div className="text-2xl md:text-4xl font-bold text-white mb-1">
                                                {String(item.value).padStart(2, '0')}
                                            </div>
                                            <div className="text-white/90 text-sm md:text-base font-medium">
                                                {item.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Candidates Section */}
                        {candidates.length === 0 ? (
                            <div className="text-center">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                    <Users className="w-16 h-16 text-white/60 mx-auto mb-4" />
                                    <p className="text-white text-xl">Belum ada kandidat untuk event ini.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                        Pilih Kandidat Terbaikmu!
                                    </h3>
                                    <p className="text-white/80">Klik pada kandidat untuk memberikan suara</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {candidates.map((candidate, index) => (
                                        <div
                                            key={candidate.id}
                                            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:bg-white/20 animate-[slide-up_0.5s_ease-out]"
                                            style={{ animationDelay: `${index * 0.2}s` }}
                                        >
                                            {/* Candidate Avatar */}
                                            <div className="text-center mb-4">
                                                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${index % 3 === 0 ? 'from-yellow-400 to-orange-500' :
                                                        index % 3 === 1 ? 'from-pink-400 to-purple-500' :
                                                            'from-blue-400 to-cyan-500'
                                                    } rounded-full flex items-center justify-center mb-3 shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                                                    <span className="text-2xl font-bold text-white">
                                                        {candidate.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-center space-x-1 mb-2">
                                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-yellow-400 font-semibold text-sm">Kandidat #{index + 1}</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-yellow-200 transition-colors">
                                                {candidate.name}
                                            </h3>
                                            <p className="text-white/80 text-sm leading-relaxed mb-6 text-center">
                                                {candidate.description}
                                            </p>

                                            <button
                                                onClick={() => handleVoteClick(candidate)}
                                                disabled={hasVoted}
                                                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 transform ${hasVoted
                                                        ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                                                    }`}
                                            >
                                                {hasVoted ? (
                                                    <span className="flex items-center justify-center">
                                                        <Vote className="w-4 h-4 mr-2" />
                                                        Sudah Voting
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center group">
                                                        <Vote className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                                                        Pilih Kandidat
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center mt-20">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 max-w-md mx-auto">
                            <Calendar className="w-16 h-16 text-white/60 mx-auto mb-4 animate-pulse" />
                            <h3 className="text-2xl font-bold text-white mb-2">Tidak Ada Event Aktif</h3>
                            <p className="text-white/80">Tunggu pengumuman event voting selanjutnya!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmVote}
                title="Konfirmasi Voting"
                message={`Apakah Anda yakin ingin memilih ${selectedCandidate?.name}?`}
            />
        </div>
    );
}