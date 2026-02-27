export const Role = {
    STUDENT: 'student',
    ADMIN: 'admin',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ComplaintStatus = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
} as const;

export type ComplaintStatus = (typeof ComplaintStatus)[keyof typeof ComplaintStatus];

export interface User {
    _id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Complaint {
    _id: string;
    category: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: ComplaintStatus;
    createdBy: User | string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
