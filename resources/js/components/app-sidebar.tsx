import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { EstablishmentSwitcher } from '@/components/establishment-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Store, 
    Users, 
    Calendar, 
    Package, 
    BarChart3,
    Settings,
    FileText,
    Briefcase,
    UserCheck,
    FolderKanban,
    ShieldCheck
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    
    // Menú para negocios (owner, manager)
    const businessNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/business/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Establecimiento',
            href: '/business/establishment',
            icon: Store,
        },
        {
            title: 'Estaciones',
            href: '/business/workstations',
            icon: Briefcase,
        },
        // {
        //     title: 'Ofertas',
        //     href: '/business/offers',
        //     icon: FileText,
        // },
        // {
        //     title: 'Solicitudes',
        //     href: '/business/applications',
        //     icon: UserCheck,
        // },
        {
            title: 'Personal',
            href: '/business/staff',
            icon: Users,
        },
        {
            title: 'Roles y Permisos',
            href: '/business/roles',
            icon: ShieldCheck,
        },
        {
            title: 'Citas',
            href: '/business/appointments',
            icon: Calendar,
        },
        {
            title: 'Servicios',
            href: '/business/services',
            icon: Package,
        },
        {
            title: 'Categorías',
            href: '/business/service-categories',
            icon: FolderKanban,
        },
        {
            title: 'Reportes',
            href: '/business/reports',
            icon: BarChart3,
        },
        {
            title: 'Configuración',
            href: '/business/settings',
            icon: Settings,
        },
    ];

    // Menú por defecto
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Determinar qué menú mostrar según el rol
    const navItems = ['owner', 'manager', 'super_admin'].includes(auth.user.role) 
        ? businessNavItems 
        : mainNavItems;

    return (
        <Sidebar collapsible="offcanvas" variant="floating">
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
                
                {/* Selector de establecimiento solo para usuarios business */}
                {['owner', 'manager', 'super_admin'].includes(auth.user.role) && (
                    <div className="px-2 py-2">
                        <EstablishmentSwitcher />
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>
        </Sidebar>
    );
}
