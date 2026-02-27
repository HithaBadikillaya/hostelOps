import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Complaint } from '../types';
import ComplaintCard from '../components/ComplaintCard';
import LoadingSpinner from '../components/LoadingSpinner';

const StudentDashboard: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);

    const [formData, setFormData] = useState({
        category: '',
        description: '',
        priority: 'Medium' as 'Low' | 'Medium' | 'High'
    });

    const fetchComplaints = async () => {
        try {
            const response = await api.get('/complaints');
            setComplaints(response.data);
        } catch (err) {
            console.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingComplaint) {
                await api.patch(`/complaints/${editingComplaint._id}`, formData);
            } else {
                await api.post('/complaints', formData);
            }
            setShowModal(false);
            setFormData({ category: '', description: '', priority: 'Medium' });
            fetchComplaints();
        } catch (err) {
            alert('Failed to submit complaint');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await api.delete(`/complaints/${id}`);
                setComplaints(complaints.filter(c => c._id !== id));
            } catch (err) {
                alert('Failed to delete complaint');
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Complaints</h1>
                    <p className="text-slate-400 mt-1 text-sm">Track and manage your hostel-related issues</p>
                </div>
                <button
                    onClick={() => {
                        setEditingComplaint(null);
                        setShowModal(true);
                    }}
                    className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Complaint</span>
                </button>
            </div>

            {complaints.length === 0 ? (
                <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-2xl mb-4 border border-slate-800">
                        <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">No complaints found</h3>
                    <p className="text-slate-400 text-sm">Click the button above to submit your first complaint.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints.map(complaint => (
                        <ComplaintCard
                            key={complaint._id}
                            complaint={complaint}
                            onDelete={handleDelete}
                            onEdit={(c) => {
                                setEditingComplaint(c);
                                setFormData({ category: c.category, description: c.description, priority: c.priority });
                                setShowModal(true);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {editingComplaint ? 'Edit Complaint' : 'New Complaint'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Category</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Electricity, Water, Wi-Fi"
                                    className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-primary-500 transition-all"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Priority</label>
                                <div className="flex space-x-3">
                                    {['Low', 'Medium', 'High'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, priority: p as any })}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${formData.priority === p
                                                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                                : 'border-slate-700 bg-slate-950 text-slate-500 hover:border-slate-600'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Describe the issue in detail..."
                                    className="w-full bg-slate-950 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-primary-500 transition-all resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/20 transition-all transform active:scale-[0.98]"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
