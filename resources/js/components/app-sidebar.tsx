import { index as categorias } from '@/actions/App/Http/Controllers/CategoriasController';
import { index as comercios } from '@/actions/App/Http/Controllers/ComerciosController';
import { index as faq } from '@/actions/App/Http/Controllers/FaqController';
import { index as secciones } from '@/actions/App/Http/Controllers/SeccionesController';
import { index as sedes } from '@/actions/App/Http/Controllers/SedesController';
import { index as usuarios } from '@/actions/App/Http/Controllers/UsuariosController';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Building2, HelpCircle, LayoutGrid, Store, Tag, Tags, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Usuarios',
        href: usuarios(),
        roles:['admin'],
        icon: Users,
    },
    {
        title: 'Categorias',
        href: categorias(),
        roles:['admin'],
        icon: Tag,
    },
    {
        title: 'Comercios',
        href: comercios(),
        roles:['admin', 'proveedor'],
        icon: Building2,
    },
    {
        title: 'Secciones',
        href: secciones(),
        roles:['admin'],
        icon: Tags,
    },
    {
        title: 'Sedes',
        href: sedes(),
        roles:['admin', 'proveedor'],
        icon: Store,
    },
    {
        title: 'Preguntas Frecuentes',
        href: faq(),
        roles:['admin', 'proveedor'],
        icon: HelpCircle,
    },
];

const footerNavItems: NavItem[] = [
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
