'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'user' }),
            });
            const data = await res.json();
            if (!data.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal!',
                    text: data.message,
                    confirmButtonColor: 'var(--color-secondary)',
                });
                return;
            }
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Registrasi berhasil, silakan login.',
                confirmButtonColor: 'var(--color-secondary)',
            }).then(() => router.push('/'));
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Terjadi kesalahan saat registrasi.',
                confirmButtonColor: 'var(--color-secondary)',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-accent)] flex items-center justify-center animate-[fade-in_0.5s_ease-out]">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-[var(--color-neutral)] mb-6 text-center">Registrasi</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[var(--color-neutral)] mb-1">Nama</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[var(--color-neutral)] mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[var(--color-neutral)] mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:border-[var(--color-secondary)] focus:outline-none transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-[var(--color-secondary)] text-white rounded-md hover:bg-[var(--color-primary)] transition-colors"
                    >
                        Daftar
                    </button>
                </form>
                <p className="text-center text-[var(--color-neutral)] mt-4">
                    Sudah punya akun? <a href="/" className="text-[var(--color-secondary)] hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}