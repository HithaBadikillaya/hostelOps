import React from 'react';
import type { Complaint } from '../types';
import { ComplaintStatus } from '../types';
import StatusBadge from './StatusBadge';

interface ComplaintCardProps {
    complaint: Complaint;
    onUpdateStatus?: (id: string, status: ComplaintStatus) => void;
    onDelete?: (id: string) => void;
    onEdit?: (complaint: Complaint) => void;
    isAdmin?: boolean;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({
    complaint,
    onUpdateStatus,
    onDelete,
    onEdit,
    isAdmin
}) => {

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg transition-all hover:border-primary-500/50">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">{complaint.category}</h3>
                    <p className="text-xs text-slate-400">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                        {isAdmin && typeof complaint.createdBy !== 'string' && ` • ${complaint.createdBy.name}`}
                    </p>
                </div>
                <StatusBadge status={complaint.status} />
            </div>

            <p className="text-slate-300 text-sm mb-6 line-clamp-3">{complaint.description}</p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${complaint.priority === 'High' ? 'border-red-500/40 text-red-400 bg-red-400/10' :
                        complaint.priority === 'Medium' ? 'border-yellow-500/40 text-yellow-400 bg-yellow-400/10' :
                            'border-green-500/40 text-green-400 bg-green-400/10'
                        }`}>
                        {complaint.priority}
                    </span>
                </div>

                <div className="flex space-x-2">
                    {isAdmin ? (
                        <div className="flex space-x-2">
                            <select
                                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 outline-none focus:border-primary-500"
                                value={complaint.status}
                                onChange={(e) => onUpdateStatus?.(complaint._id, e.target.value as ComplaintStatus)}
                            >
                                {Object.values(ComplaintStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => onDelete?.(complaint._id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            {complaint.status === ComplaintStatus.PENDING && (
                                <button
                                    onClick={() => onEdit?.(complaint)}
                                    className="p-1.5 text-slate-400 hover:text-primary-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            )}
                            {complaint.status === ComplaintStatus.PENDING && (
                                <button
                                    onClick={() => onDelete?.(complaint._id)}
                                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintCard;
