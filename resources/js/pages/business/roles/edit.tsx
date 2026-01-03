import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoleEdit({ role, permissions, rolePermissions }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions || []
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('business.roles.update', role.id));
    };

    const togglePermission = (permissionName) => {
        if (data.permissions.includes(permissionName)) {
            setData('permissions', data.permissions.filter(p => p !== permissionName));
        } else {
            setData('permissions', [...data.permissions, permissionName]);
        }
    };

    const isProtected = ['Administrador', 'User'].includes(role.name);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Roles', href: '/business/roles' },
            { title: 'Editar Rol', href: `/business/roles/${role.id}/edit` }
        ]}>
            <Head title="Editar Rol" />

            <div className="p-4 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Editar Rol: {role.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Rol</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Ej: Estilista Senior"
                                    disabled={isProtected}
                                />
                                {isProtected && (
                                    <p className="text-xs text-muted-foreground">
                                        Este es un rol predeterminado del sistema y su nombre no puede ser modificado.
                                    </p>
                                )}
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label>Permisos</Label>
                                <div className="border p-4 rounded-md space-y-6">
                                    {Object.entries(permissions.reduce((acc, permission) => {
                                        const category = permission.category || 'Otros';
                                        if (!acc[category]) acc[category] = [];
                                        acc[category].push(permission);
                                        return acc;
                                    }, {} as Record<string, typeof permissions>)).map(([category, categoryPermissions]) => (
                                        <div key={category}>
                                            <h3 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                                                {category}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {categoryPermissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-start space-x-2">
                                                        <Checkbox
                                                            id={`perm-${permission.id}`}
                                                            checked={data.permissions.includes(permission.name)}
                                                            onCheckedChange={() => togglePermission(permission.name)}
                                                        />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <Label 
                                                                htmlFor={`perm-${permission.id}`} 
                                                                className="cursor-pointer font-medium"
                                                            >
                                                                {permission.label || permission.name}
                                                            </Label>
                                                            {permission.description && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {permission.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link href={route('business.roles.index')}>
                                    <Button variant="outline" type="button">Cancelar</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    Guardar Cambios
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
