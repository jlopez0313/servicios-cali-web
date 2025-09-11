import { usePage } from '@inertiajs/react';

export const useRole = () => {
    const { auth }: any = usePage().props;

    const hasRoles = (role: any) => {
        if (!auth.user || !auth.user.role) {
            return null;
        } else {
            return role.some((r: string) => r == auth.user.role);
        }
    }

    return {
        hasRoles
    };
}
