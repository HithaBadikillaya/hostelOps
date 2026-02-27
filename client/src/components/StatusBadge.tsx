import React from 'react';
import { ComplaintStatus } from '../types';

interface StatusBadgeProps {
    status: ComplaintStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case ComplaintStatus.PENDING:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case ComplaintStatus.IN_PROGRESS:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case ComplaintStatus.RESOLVED:
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
