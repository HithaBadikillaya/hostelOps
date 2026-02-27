import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import type { Complaint } from '../types';
import { ComplaintStatus } from '../types';
import ComplaintCard from '../components/ComplaintCard';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });

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
            fetchComplaints();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await api.delete(`/complaints/${id}`);
                fetchComplaints();
            } catch (err) {
                alert('Failed to delete complaint');
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Console</h1>
                <p className="text-slate-400 mt-1 text-sm">Overview of all hostel complaints and issues</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Pending', count: stats.pending, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                    { label: 'In Progress', count: stats.inProgress, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'Resolved', count: stats.resolved, color: 'text-green-400', bg: 'bg-green-400/10' }
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-2xl p-6 border border-slate-800 bg-slate-900 shadow-xl`}>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                        <p className={`text-4xl font-black ${stat.color}`}>{stat.count}</p>
                    </div>
                ))}
            </div>

            {complaints.length === 0 ? (
                <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                    No complaints reported yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {complaints.map(complaint => (
                        <ComplaintCard
                            key={complaint._id}
                            complaint={complaint}
                            isAdmin
                            onUpdateStatus={handleUpdateStatus}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
