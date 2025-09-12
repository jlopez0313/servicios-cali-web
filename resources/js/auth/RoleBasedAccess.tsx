import { usePage } from '@inertiajs/react';

export default function RoleCheck({ children, roles }: any) {
    const { auth }: any = usePage().props;

    if (roles && !auth.user.roles.some((r: string) => roles.includes(r))) {
        return null;
    }

    return children;
}
