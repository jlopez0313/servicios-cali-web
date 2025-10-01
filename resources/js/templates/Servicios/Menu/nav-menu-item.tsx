import { usePermission } from '@/hooks/usePermission';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { NavMenuSubItem } from './nav-menu-sub-item';

export const NavMenuItem = ({ items = [] }: { items: NavItem[] | undefined }) => {
    const page = usePage();
    const hasPermission = usePermission();

    return (
        <ul>
            {items.map((item, idx) =>
                item.children ? (
                    <NavMenuSubItem key={item.title} item={item} />
                ) : (
                    <li key={item.title} className='list-item'>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        
                    </li>
                ),
            )}
        </ul>
    );
};
