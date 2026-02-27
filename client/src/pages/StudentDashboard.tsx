import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Complaint } from '../types';
import { ComplaintStatus } from '../types';
import ComplaintCard from '../components/ComplaintCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useToast } from '../context/ToastContext';

const StudentDashboard: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
    const { showToast } = useToast();
    const [filter, setFilter] = useState<ComplaintStatus | 'All'>('All');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        priority: 'Medium' as 'Low' | 'Medium' | 'High'
    });

    const fetchComplaints = async () => {
        try {
            const response = await api.get(`/complaints?t=${Date.now()}`);
            setComplaints(response.data);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingComplaint) {
                await api.patch(`/complaints/${editingComplaint._id}`, formData);
                showToast('Complaint updated successfully', 'success');
            } else {
                await api.post('/complaints', formData);
                showToast('Complaint submitted successfully', 'success');
            }
            setShowModal(false);
            setFormData({ category: '', description: '', priority: 'Medium' });
            fetchComplaints();
        } catch (err) {
            showToast('Failed to submit complaint', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/complaints/${deleteId}`);
            setComplaints(complaints.filter(c => c._id !== deleteId));
            showToast('Complaint deleted', 'success');
            setDeleteId(null);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8 mt-8 relative z-10">
                <div>
                    <h1 className="text-2xl font-bold text-black tracking-widest uppercase">My Reports</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Personal / Records</p>
                </div>
                <button
                    onClick={() => {
                        setEditingComplaint(null);
                        setFormData({ category: '', description: '', priority: 'Medium' });
                        setShowModal(true);
                    }}
                    className="btn-primary flex items-center space-x-2 shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Entry</span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
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
                <div className="bg-white border border-slate-200 p-20 text-center shadow-sm relative z-10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">No {filter !== 'All' ? filter.toLowerCase() : ''} data detected</h3>
                    <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-widest">
                        {filter === 'All' ? 'System ready for new entry' : 'Modify filter parameters'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {filteredComplaints.map(complaint => (
                        <div key={complaint._id} className="h-full">
                            <ComplaintCard
                                complaint={complaint}
                                onDelete={(id) => setDeleteId(id)}
                                onEdit={(c) => {
                                    setEditingComplaint(c);
                                    setFormData({ category: c.category, description: c.description, priority: c.priority });
                                    setShowModal(true);
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Entry Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingComplaint ? 'Update Report' : 'Submit New Report'}
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            form="complaint-form"
                            type="submit"
                            className="btn-primary"
                        >
                            {editingComplaint ? 'Update' : 'Submit'}
                        </button>
                    </>
                }
            >
                <form id="complaint-form" onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Category</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Room Maintenance, Plumbing"
                            className="input-minimal"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Priority</label>
                        <div className="grid grid-cols-3 border border-slate-100 p-1 bg-slate-50">
                            {['Low', 'Medium', 'High'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: p as any })}
                                    className={`py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${formData.priority === p
                                        ? 'bg-[#5d4037] text-white shadow-sm'
                                        : 'text-slate-400 hover:text-black'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Provide details about the issue..."
                            className="input-minimal resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
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
                        Are you sure you want to remove this report? This action cannot be reversed.
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default StudentDashboard;
