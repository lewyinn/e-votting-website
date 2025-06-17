'use client';
import { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    Calendar,
    TrendingUp,
    Activity,
    Trophy,
    Target,
    Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [votes, setVotes] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                if (data.length > 0) setSelectedEvent(data[0].id);
            });
        fetch('/api/users').then(res => res.json()).then(setUsers);
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            fetch('/api/candidates')
                .then(res => res.json())
                .then(data => setCandidates(data.filter(c => c.eventId === selectedEvent)));
            fetch(`/api/votes?eventId=${selectedEvent}`)
                .then(res => res.json())
                .then(setVotes);
        }
    }, [selectedEvent]);

    const chartData = candidates.map(candidate => ({
        name: candidate.name,
        votes: votes.filter(v => v.candidateId === candidate.id).length,
    }));

    const pieColors = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
    
    // Logika warna dikembalikan persis seperti kode asli Anda
    const pieData = chartData.map((item, index) => ({
        ...item,
        color: pieColors[index % pieColors.length + 1] 
    }));

    const statsCards = [
        {
            title: 'Total Users',
            value: users.length,
            icon: Users,
            color: 'from-blue-500 to-cyan-500',
            bgPattern: 'bg-blue-500/10'
        },
        {
            title: 'Total Candidates',
            value: candidates.length,
            icon: Target,
            color: 'from-purple-500 to-pink-500',
            bgPattern: 'bg-purple-500/10'
        },
        {
            title: 'Total Votes',
            value: votes.length,
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500',
            bgPattern: 'bg-green-500/10'
        }
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

            {/* Konten Utama */}
            <div className="relative flex-1 p-6 z-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Activity className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                                Dashboard Analytics
                            </h1>
                            <p className="text-white/80">Real-time voting statistics and insights</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {statsCards.map((stat, index) => (
                        <div
                            key={stat.title}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <Zap className="w-5 h-5 text-white/60 animate-pulse" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                            <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${stat.color} animate-pulse`} style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Event Selector */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-xl mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <Calendar className="w-6 h-6 text-white" />
                        <h2 className="text-xl font-semibold text-white">Pilih Event</h2>
                    </div>
                    <select
                        value={selectedEvent || ''}
                        onChange={(e) => setSelectedEvent(Number(e.target.value))}
                        className="w-full p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:border-purple-400 focus:outline-none transition-colors"
                    >
                        {events.map(event => (
                            <option key={event.id} value={event.id} className="bg-purple-600 text-white">
                                {event.name} ({event.status})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Charts Section */}
                {chartData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-xl">
                            <div className="flex items-center space-x-3 mb-6">
                                <BarChart3 className="w-6 h-6 text-white" />
                                <h3 className="text-xl font-semibold text-white">Voting Results</h3>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: 'white', fontSize: 12 }}
                                            axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                        />
                                        <YAxis
                                            tick={{ fill: 'white', fontSize: 12 }}
                                            axisLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(139, 92, 246, 0.9)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: 'white'
                                            }}
                                        />
                                        <Bar
                                            dataKey="votes"
                                            fill="url(#barGradient)"
                                            radius={[8, 8, 0, 0]}
                                        />
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#8B5CF6" />
                                                <stop offset="100%" stopColor="#EC4899" />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-xl">
                            <div className="flex items-center space-x-3 mb-6">
                                <Trophy className="w-6 h-6 text-white" />
                                <h3 className="text-xl font-semibold text-white">Vote Distribution</h3>
                            </div>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="votes"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(139, 92, 246, 0.9)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: 'white'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12">
                            <Activity className="w-16 h-16 text-white/60 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">No Data Available</h3>
                            <p className="text-white/80">Belum ada data untuk event ini.</p>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}