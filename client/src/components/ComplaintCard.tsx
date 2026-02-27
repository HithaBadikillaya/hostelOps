import React from 'react';
import type { Complaint } from '../types';
import { ComplaintStatus } from '../types';
import StatusBadge from './StatusBadge';

interface ComplaintCardProps {
    complaint: Complaint;
    onUpdateStatus?: (id: string, status: ComplaintStatus) => void;
    onDelete: (id: string) => void;
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
        <div className="interactive-card p-8 h-full flex flex-col group border-slate-200">
            <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</span>
                    <h3 className="text-xl font-bold text-black tracking-tight">{complaint.category}</h3>
                </div>
                <StatusBadge status={complaint.status} />
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                {complaint.description}
            </p>

            <div className="pt-6 border-t border-slate-100 mt-auto">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</span>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${complaint.priority === 'High' ? 'text-rose-600' :
                            complaint.priority === 'Medium' ? 'text-[#5d4037]' :
                                'text-slate-500'
                            }`}>
                            {complaint.priority}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        {isAdmin && onUpdateStatus && complaint.status !== ComplaintStatus.RESOLVED && (
                            <div className="flex space-x-2">
                                {complaint.status === ComplaintStatus.PENDING && (
                                    <button
                                        onClick={() => onUpdateStatus(complaint._id, ComplaintStatus.IN_PROGRESS)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-[#5d4037] hover:underline"
                                    >
                                        Start
                                    </button>
                                )}
                                <button
                                    onClick={() => onUpdateStatus(complaint._id, ComplaintStatus.RESOLVED)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:underline"
                                >
                                    Resolve
                                </button>
                            </div>
                        )}

                        {!isAdmin && onEdit && complaint.status === ComplaintStatus.PENDING && (
                            <button
                                onClick={() => onEdit(complaint)}
                                className="text-[10px] font-bold uppercase tracking-widest text-[#5d4037] hover:underline"
                            >
                                Edit
                            </button>
                        )}

                        <button
                            onClick={() => onDelete(complaint._id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintCard;
