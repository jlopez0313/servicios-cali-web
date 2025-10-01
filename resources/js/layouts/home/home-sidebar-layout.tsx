import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/templates/Servicios/Menu/app-sidebar';
import { AppSidebarHeader } from '@/templates/Servicios/Menu/app-sidebar-header';
import { SidebarOverlay } from '@/templates/Servicios/Menu/SidebarOverlay';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function HomeSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <SidebarOverlay />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
