import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function RoleIndex({ roles }) {
    const deleteRole = (id) => {
        router.delete(route('business.roles.destroy', id));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Roles y Permisos', href: '/business/roles' }]}>
            <Head title="Roles y Permisos" />

            <div className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Roles y Permisos</h2>
                        <p className="text-muted-foreground">Gestiona los roles y permisos de tu equipo.</p>
                    </div>
                    <Link href={route('business.roles.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Rol
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => {
                        const isProtected = ['Administrador', 'User'].includes(role.name);
                        return (
                            <Card key={role.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        {role.name}
                                        {isProtected && <Lock className="h-3 w-3 text-muted-foreground" />}
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Link href={route('business.roles.edit', role.id)}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        {!isProtected && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el rol
                                                            y revocará los permisos de los usuarios asignados.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteRole(role.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xs text-muted-foreground mb-4">
                                        {role.permissions.length} permisos asignados
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {role.permissions.slice(0, 5).map((permission) => (
                                            <Badge key={permission.id} variant="secondary" className="text-xs">
                                                {permission.label || permission.name}
                                            </Badge>
                                        ))}
                                        {role.permissions.length > 5 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{role.permissions.length - 5} más
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
