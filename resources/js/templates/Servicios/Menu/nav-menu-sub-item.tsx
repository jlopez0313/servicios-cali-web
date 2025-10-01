import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';

export const NavMenuSubItem = ({ item }: { item: NavItem }) => {
    const page = usePage();

    const isChildOpen = (item: NavItem) => {
        if (item.children?.some((child) => page.url.startsWith(typeof child.href === 'string' ? child.href : child.href.url))) {
            return true;
        }

        return false;
    };

    return (
        <Collapsible key={item.title} asChild defaultOpen={isChildOpen(item)} className="group/collasible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className='list-item'>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronDown className="group-data-[state=open/collapsible:rotate-90 ml-auto transition-transform duration-200" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children?.map((child) =>
                            child.children ? (
                                <NavMenuSubItem key={child.title} item={child} />
                            ) : (
                                <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                                    >
                                        <Link href={child.href} prefetch>
                                            {child.icon && <child.icon />}
                                            <span>{child.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ),
                        )}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
};
