export type MaybeNull<T> = T | null;
export type MaybeUndefined<T> = T | undefined;
export type MaybeNullOrUndefined<T> = T | null | undefined;

export interface AdminAvailableButtonType {
    label: string;
    icon: string;
    datasetId: string;
    visible?: boolean;
    showAdminIcon?: boolean;
    adminPrivileges?: boolean;
    disabled?: boolean;
    class?: string;
}
