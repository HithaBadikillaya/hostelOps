import React from 'react';
import { ComplaintStatus } from '../types';

interface StatusBadgeProps {
    status: ComplaintStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case ComplaintStatus.PENDING:
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case ComplaintStatus.IN_PROGRESS:
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case ComplaintStatus.RESOLVED:
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${getStyles()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
