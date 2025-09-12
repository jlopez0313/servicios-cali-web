import { usePage } from '@inertiajs/react';

export const useRole = () => {
    const { auth }: any = usePage().props;

    const hasRoles = (roles: any) => {
        if (!auth.user || !auth.user.roles.length) {
            return null;
        } else {
            return auth.user.roles.some((r: string) => roles.includes(r));
        }
    }

    return {
        hasRoles
    };
}
