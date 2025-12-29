import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { resolveUrl, cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { isMobile } = useSidebar();

    if (isMobile) {
        return (
            <div className="grid grid-cols-3 gap-4 p-4">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group flex flex-col items-center justify-center gap-2 text-center"
                        >
                            <div
                                className={cn(
                                    'flex h-14 w-14 items-center justify-center rounded-2xl bg-sidebar-accent/50 shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md',
                                    isActive &&
                                        'bg-primary text-primary-foreground shadow-primary/25',
                                )}
                            >
                                {item.icon && (
                                    <item.icon className="h-7 w-7" />
                                )}
                            </div>
                            <span
                                className={cn(
                                    'text-xs font-medium transition-colors',
                                    isActive
                                        ? 'font-semibold text-primary'
                                        : 'text-muted-foreground group-hover:text-foreground',
                                )}
                            >
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                resolveUrl(item.href),
                            )}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
