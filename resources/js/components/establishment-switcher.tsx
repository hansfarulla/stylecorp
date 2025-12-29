import { router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Establishment {
    id: number;
    name: string;
    type: string;
}

export function EstablishmentSwitcher() {
    const { auth } = usePage<{
        auth: {
            activeEstablishment: Establishment | null;
            establishments: Establishment[];
        };
    }>().props;

    const { activeEstablishment, establishments } = auth;

    const handleSwitch = (establishmentId: number) => {
        router.post('/business/switch-establishment', {
            establishment_id: establishmentId,
        });
    };

    if (!establishments || establishments.length === 0) {
        return null;
    }

    if (establishments.length === 1) {
        return (
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{activeEstablishment?.name}</span>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    <div className="flex items-center gap-2 truncate">
                        <Store className="h-4 w-4 shrink-0" />
                        <span className="truncate">
                            {activeEstablishment?.name || 'Seleccionar establecimiento'}
                        </span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[250px]">
                <DropdownMenuLabel>Mis Establecimientos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {establishments.map((establishment) => (
                    <DropdownMenuItem
                        key={establishment.id}
                        onClick={() => handleSwitch(establishment.id)}
                        className="cursor-pointer"
                    >
                        <Check
                            className={cn(
                                'mr-2 h-4 w-4',
                                activeEstablishment?.id === establishment.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                            )}
                        />
                        <div className="flex flex-col">
                            <span className="font-medium">{establishment.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">
                                {establishment.type}
                            </span>
                        </div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.visit('/business/establishment/create')}
                    className="cursor-pointer text-primary"
                >
                    <Store className="mr-2 h-4 w-4" />
                    Crear nuevo establecimiento
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
