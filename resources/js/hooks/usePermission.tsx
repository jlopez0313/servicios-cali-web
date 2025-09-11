import { usePage } from '@inertiajs/react';

type Permission = {
    name: string;
};

export function usePermission() {
    const { auth }: any = usePage().props;
    const permissions = auth?.permissions ?? [];

    return (permiso: string): boolean => {
        return permissions.some((p: string) => p == permiso);
    };
}
