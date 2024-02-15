// Types for our data models

// InviteStatus enum
export enum InviteStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Declined = 'declined',
}

export enum RoleId {
    admin = 'admin',
    member = 'member',
}

// Invite type
export interface Invite {
    invite_id: string; // UUID
    recipient_email: string;
    org_id: string; // UUID
    org_name?: string; // set by server
    role_id: string;
    status: InviteStatus;
    created_at: Date;
    accepted_at?: Date | null;
}

// Organization type
export interface Organization {
    org_id: string; // UUID
    org_name: string;
    created_by: string; // User ID
    created_at: Date;
}

// Role type
export interface Role {
    role_id: RoleId;
}

// UserOrgRole type
export interface UserOrgRole {
    user_id: string; // User ID
    org_id: string; // UUID
    role_id: RoleId;
}

// APIKey type
export interface APIKey {
    api_key_id: string; // UUID
    key: string;
    created_by: string; // User ID
    org_id: string; // UUID
    is_active: boolean;
    created_at: Date;
}
