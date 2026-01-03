import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Shield, ShieldAlert, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

interface Permission {
    id: number;
    name: string;
    label: string;
    description: string;
    category: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Props {
    staff: User;
    permissions: Record<string, Permission[]>;
    userPermissions: number[];
    rolePermissions: string[];
    establishment: { id: number; name: string };
}

const categoryLabels: Record<string, string> = {
    establishment: 'Establecimiento',
    staff: 'Personal',
    services: 'Servicios',
    bookings: 'Citas',
    inventory: 'Inventario',
    payments: 'Pagos',
    reports: 'Reportes',
    settings: 'Configuración',
    schedule: 'Horarios',
    customers: 'Clientes',
};

const categoryIcons: Record<string, string> = {
    establishment: '🏢',
    staff: '👥',
    services: '✂️',
    bookings: '📅',
    inventory: '📦',
    payments: '💰',
    reports: '📊',
    settings: '⚙️',
    schedule: '🕐',
    customers: '👤',
};

export default function StaffPermissions({ staff, permissions, userPermissions, rolePermissions, establishment }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        permissions: userPermissions,
    });

    const handlePermissionToggle = (permissionId: number) => {
        if (data.permissions.includes(permissionId)) {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        } else {
            setData('permissions', [...data.permissions, permissionId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/business/staff/${staff.id}/permissions`);
    };

    const isPermissionInRole = (permissionName: string) => {
        return rolePermissions.includes(permissionName);
    };

    return (
        <AppLayout>
            <Head title={`Permisos - ${staff.name}`} />

            <div className="space-y-6 p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Permisos Granulares
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Configurar permisos específicos para {staff.name}
                        </p>
                    </div>
                </motion.div>

                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Permisos Personalizados</AlertTitle>
                    <AlertDescription>
                        Los permisos marcados en <Badge variant="secondary" className="mx-1">azul</Badge> son los permisos base del rol <strong>{staff.role}</strong>.
                        Puedes agregar permisos adicionales seleccionando las casillas abajo.
                    </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(permissions).map(([category, categoryPermissions]) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="text-2xl">{categoryIcons[category]}</span>
                                            {categoryLabels[category] || category}
                                        </CardTitle>
                                        <CardDescription>
                                            Permisos relacionados con {(categoryLabels[category] || category).toLowerCase()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {categoryPermissions.map((permission) => {
                                            const isInRole = isPermissionInRole(permission.name);
                                            const isChecked = data.permissions.includes(permission.id);

                                            return (
                                                <div
                                                    key={permission.id}
                                                    className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                                                        isInRole ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-muted/50'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        id={`permission-${permission.id}`}
                                                        checked={isChecked}
                                                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                        disabled={isInRole}
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <Label
                                                            htmlFor={`permission-${permission.id}`}
                                                            className={`cursor-pointer ${isInRole ? 'cursor-not-allowed' : ''}`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">{permission.label}</span>
                                                                {isInRole && (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        Incluido en rol
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {permission.description && (
                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                    {permission.description}
                                                                </p>
                                                            )}
                                                        </Label>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="sticky bottom-4 mt-6 flex justify-end gap-3 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-primary/20 shadow-2xl">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Permisos
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
