import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Complaint } from '../types';
import { ComplaintStatus } from '../types';
import ComplaintCard from '../components/ComplaintCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';

const AdminDashboard: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
    const { showToast } = useToast();
    const [filter, setFilter] = useState<ComplaintStatus | 'All'>('All');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchComplaints = async () => {
        try {
            const response = await api.get(`/complaints?t=${Date.now()}`);
            const data = response.data as Complaint[];
            setComplaints(data);

            const counts = {
                pending: data.filter(c => c.status === ComplaintStatus.PENDING).length,
                inProgress: data.filter(c => c.status === ComplaintStatus.IN_PROGRESS).length,
                resolved: data.filter(c => c.status === ComplaintStatus.RESOLVED).length
            };
            setStats(counts);
        } catch (err) {
            console.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();

        // Dynamic updates: poll every 5 seconds
        const intervalId = setInterval(fetchComplaints, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleUpdateStatus = async (id: string, status: ComplaintStatus) => {
        try {
            await api.patch(`/complaints/${id}`, { status });
            showToast(`Status updated to ${status}`, 'success');
            fetchComplaints();
        } catch (err) {
            showToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/complaints/${deleteId}`);
            showToast('Complaint deleted', 'success');
            setDeleteId(null);
            fetchComplaints();
        } catch (err) {
            showToast('Failed to delete complaint', 'error');
        }
    };

    const filteredComplaints = filter === 'All'
        ? complaints
        : complaints.filter(c => c.status === filter);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-12 pb-20 relative">
            <div className="floating-bg opacity-50"></div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8 mt-8 relative z-10">
                <div>
                    <h1 className="text-2xl font-bold text-black tracking-widest uppercase">Console</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Administrative / Control</p>
                </div>
                <div className="bg-white border border-slate-200 px-4 py-2 shadow-sm">
                    <span className="text-[10px] font-bold text-[#5d4037] uppercase tracking-widest">System / Live</span>
                </div>
            </div>

            <div className="bento-grid relative z-10">
                {[
                    { label: 'Pending / Case', count: stats.pending, status: ComplaintStatus.PENDING, span: 'col-span-12 md:col-span-4' },
                    { label: 'Active / Progress', count: stats.inProgress, status: ComplaintStatus.IN_PROGRESS, span: 'col-span-12 md:col-span-4' },
                    { label: 'Resolved / End', count: stats.resolved, status: ComplaintStatus.RESOLVED, span: 'col-span-12 md:col-span-4' }
                ].map((stat) => (
                    <button
                        key={stat.label}
                        onClick={() => setFilter(stat.status)}
                        className={`${stat.span} p-8 border text-left transition-all ${filter === stat.status ? 'border-[#5d4037] bg-slate-50' : 'border-slate-200 bg-white hover:border-[#5d4037] shadow-sm'}`}
                    >
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                        <p className="text-5xl font-bold text-black leading-none">{stat.count.toString()}</p>
                    </button>
                ))}
            </div>

            <div className="space-y-8 relative z-10 text-black">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                        <h2 className="text-xs font-bold text-black uppercase tracking-widest whitespace-nowrap">Stream / Activity</h2>
                        <div className="h-[1px] flex-1 bg-slate-200"></div>
                    </div>

                    <div className="flex border border-slate-200 p-1 bg-white shadow-sm">
                        {['All', ComplaintStatus.PENDING, ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s as any)}
                                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${filter === s
                                        ? 'bg-[#5d4037] text-white'
                                        : 'text-slate-400 hover:text-black'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredComplaints.length === 0 ? (
                    <div className="bg-white border border-slate-200 p-20 text-center shadow-sm">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No {filter !== 'All' ? filter : ''} records detected</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredComplaints.map(complaint => (
                            <div key={complaint._id}>
                                <ComplaintCard
                                    complaint={complaint}
                                    isAdmin
                                    onUpdateStatus={handleUpdateStatus}
                                    onDelete={(id) => setDeleteId(id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Confirm Removal"
                footer={
                    <>
                        <button
                            onClick={() => setDeleteId(null)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="btn-primary bg-rose-600 border-rose-600 hover:bg-rose-700 hover:border-rose-700"
                        >
                            Confirm Delete
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Are you certain you wish to permanently remove this record from the system? This action cannot be undone.
                    </p>
                    <div className="p-4 bg-slate-50 border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Record ID: {deleteId}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
