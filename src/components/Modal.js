'use client';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
    useEffect(() => {
        if (!isOpen) return; 

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 animate-[fade-in_0.5s_ease-out]">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold text-[var(--color-neutral)] mb-4">{title}</h2>
                <p className="text-[var(--color-neutral)] mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-[var(--color-neutral)] rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Tidak
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-md hover:bg-[var(--color-primary)] transition-colors"
                    >
                        Ya
                    </button>
                </div>
            </div>
        </div>
    );
}