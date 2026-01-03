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
    ShieldCheck,
    Clock,
    DollarSign,
    User
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth, ...props } = usePage<{ auth: { user: { role: string }, canAccessBusiness?: boolean, permissions?: string[] } }>().props;
    const url = usePage().url;
    
    const hasPermission = (permission?: string) => {
        if (!permission) return true;
        if (['owner', 'manager', 'super_admin'].includes(auth.user.role)) return true;
        return auth.permissions?.includes(permission);
    };

    // Menú para negocios (owner, manager, o staff con permisos)
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
            permission: 'establishment.view',
        },
        {
            title: 'Estaciones',
            href: '/business/workstations',
            icon: Briefcase,
            permission: 'establishment.view',
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
            permission: 'staff.view',
        },
        {
            title: 'Roles y Permisos',
            href: '/business/roles',
            icon: ShieldCheck,
            permission: 'staff.permissions',
        },
        {
            title: 'Citas',
            href: '/business/appointments',
            icon: Calendar,
            permission: 'bookings.view',
        },
        {
            title: 'Servicios',
            href: '/business/services',
            icon: Package,
            permission: 'services.view',
        },
        {
            title: 'Categorías',
            href: '/business/service-categories',
            icon: FolderKanban,
            permission: 'services.view',
        },
        {
            title: 'Reportes',
            href: '/business/reports',
            icon: BarChart3,
            permission: 'reports.view',
        },
        {
            title: 'Configuración',
            href: '/business/settings',
            icon: Settings,
            permission: 'settings.view',
        },
    ];

    // Menú para profesionales (staff, freelancer)
    const professionalNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/professional/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Mis Citas',
            href: '/professional/appointments',
            icon: Calendar,
        },
        {
            title: 'Mi Horario',
            href: '/professional/schedule',
            icon: Clock,
        },
        {
            title: 'Mis Ganancias',
            href: '/professional/earnings',
            icon: DollarSign,
        },
        {
            title: 'Mi Perfil',
            href: '/professional/profile',
            icon: User,
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

    // Determinar qué menú mostrar según el contexto (URL) y permisos
    let navItems = mainNavItems;

    if (url.startsWith('/business') && auth.canAccessBusiness) {
        navItems = businessNavItems.filter(item => hasPermission(item.permission));
    } else if (url.startsWith('/professional')) {
        navItems = professionalNavItems;
    } else if (['owner', 'manager', 'super_admin'].includes(auth.user.role)) {
        // Fallback para owners/managers si no están en una ruta específica
        navItems = businessNavItems;
    } else if (['staff', 'freelancer'].includes(auth.user.role)) {
        // Fallback para staff si no están en una ruta específica
        navItems = professionalNavItems;
    }

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
                
                {/* Selector de establecimiento solo visible en contexto de negocio */}
                {url.startsWith('/business') && auth.canAccessBusiness && (
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
