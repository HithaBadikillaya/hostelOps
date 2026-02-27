import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col space-y-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-8 py-5 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-4 animate-in slide-in-from-right-10 fade-in duration-300 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-900' :
                            toast.type === 'error' ? 'bg-rose-50 border-rose-500 text-rose-900' :
                                'bg-white border-black text-black'
                            }`}
                    >
                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
