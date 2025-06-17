'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {
    Menu,
    X,
    BarChart3,
    Users,
    Calendar,
    Vote,
    LogOut,
    Sparkles,
} from 'lucide-react';

// Ubah komponen untuk menerima 'children' sebagai prop
export default function Sidebar({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Logout berhasil.',
            confirmButtonColor: '#8B5CF6',
        }).then(() => router.push('/'));
    };

    const menuItems = [
        { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Vote, label: 'Voting', path: '/admin/voting' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Calendar, label: 'Events', path: '/admin/events' },
    ];

    const linkClass = (path) => {
        const isActive = pathname === path;
        return `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
            : 'text-white/80 hover:bg-white/10 hover:text-white hover:transform hover:scale-105'
            }`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* ======================= SIDEBAR ======================= */}
            <div className={`z-50 fixed md:sticky top-0 flex flex-col left-0 h-screen w-64 bg-gradient-to-b from-purple-600 via-blue-600 to-cyan-500 shadow-2xl transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300`}>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 left-5 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce delay-300"></div>
                </div>
                <div className="relative p-6 border-b border-white/20">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                            <p className="text-white/70 text-sm">Control Center</p>
                        </div>
                    </div>
                </div>
                <nav className="relative flex-1 p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <a
                            key={item.path}
                            href={item.path}
                            className={linkClass(item.path)}
                            onClick={() => setOpen(false)}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </a>
                    ))}
                </nav>
                <div className="relative p-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 bg-red-500/90 backdrop-blur-sm text-white py-3 rounded-xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            {open && (
                <div onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
                />
            )}

            {/* ======================= KONTEN UTAMA ======================= */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <div className="sticky md:hidden flex justify-between items-center p-4  bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg top-0 z-40">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={() => setOpen(!open)}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                        {open ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
                    </button>
                </div>

                {/* Di sinilah konten dari page.js akan dirender */}
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}