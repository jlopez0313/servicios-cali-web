import HomeSidebarLayout from '@/layouts/home/home-sidebar-layout';
import { SidebarProvider } from '@/templates/Servicios/Menu/sidebar';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface HomeLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: HomeLayoutProps) => {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    return (
    <SidebarProvider defaultOpen={isOpen}>
        <HomeSidebarLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </HomeSidebarLayout>
    </SidebarProvider>
)};
