import { usePage } from '@inertiajs/react';

export default function RoleCheck({ children, role }: any) {
    const { auth }: any = usePage().props;

    if ( role ) {
        if ( !auth.user || !auth.user.role ) {
            return null;
        } else if(typeof role == 'string') {
            if ( auth.user.role !== role ) {
                return null;
            }
        } else if(typeof role == 'object') {
            if ( !role.includes(auth.user.role) ) {
                return null;
            }
        }
    }

    return children;
}
