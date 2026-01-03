import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { type User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings, Briefcase, User as UserIcon } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const { url, props } = usePage();
    const { auth } = props as any;
    const canAccessBusiness = auth.canAccessBusiness;
    const isProfessional = user.role === 'staff' || user.role === 'freelancer';

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                {canAccessBusiness && !url.startsWith('/business') && (
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full"
                            href="/business/dashboard"
                            as="button"
                            prefetch
                            onClick={cleanup}
                        >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Administrar Negocio
                        </Link>
                    </DropdownMenuItem>
                )}
                {url.startsWith('/business') && isProfessional && (
                    <DropdownMenuItem asChild>
                        <Link
                            className="block w-full"
                            href="/professional/dashboard"
                            as="button"
                            prefetch
                            onClick={cleanup}
                        >
                            <UserIcon className="mr-2 h-4 w-4" />
                            Panel Profesional
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full"
                        href={edit()}
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
