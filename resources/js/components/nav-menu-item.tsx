import RoleCheck from "@/auth/RoleBasedAccess";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePermission } from "@/hooks/usePermission";
import { type NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { NavMenuSubItem } from "./nav-menu-sub-item";

export const NavMenuItem = ({
    items = [],
}: {
    items: NavItem[] | undefined;
}) => {
    const page = usePage();
    const hasPermission = usePermission();

    return (
        <SidebarMenu>
            {items.map((item, idx) => (
                <RoleCheck key={idx} roles={item.roles}>
                    {item.children ? (
                        <NavMenuSubItem key={item.title} item={item} />
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </RoleCheck>
            ))}
        </SidebarMenu>
    );
};
