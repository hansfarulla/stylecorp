import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Users, Shield, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface StaffMember {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions_count: number;
}

interface Props {
    staff: StaffMember[];
    establishment: {
        id: number;
        name: string;
    };
}

const roleLabels: Record<string, string> = {
    manager: 'Administrador',
    staff: 'Profesional',
    freelancer: 'Freelancer',
};

const roleBadgeColors: Record<string, "default" | "secondary" | "outline"> = {
    manager: 'default',
    staff: 'secondary',
    freelancer: 'outline',
};

export default function StaffPermissionsIndex({ staff, establishment }: Props) {
    return (
        <AppLayout>
            <Head title="Gestión de Permisos" />
            
            <div className="space-y-6 p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Gestión de Permisos
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Asigna permisos granulares a tu equipo en {establishment.name}
                            </p>
                        </div>
                        <Link href="/business/settings">
                            <Button variant="outline">
                                Volver a Configuración
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <CardTitle className="text-lg">Control de Acceso Granular</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">
                                Asigna permisos específicos a cada miembro del equipo. Los permisos se suman a los que ya tiene su rol por defecto.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-primary" />
                                    <span>29 permisos disponibles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-primary" />
                                    <span>Múltiples administradores</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-primary" />
                                    <span>Control por establecimiento</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Staff List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Miembros del Equipo</CardTitle>
                            <CardDescription>
                                Selecciona un miembro para gestionar sus permisos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {staff.length > 0 ? (
                                <div className="space-y-3">
                                    {staff.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-lg font-bold text-primary">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{member.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{member.email}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant={roleBadgeColors[member.role]}>
                                                            {roleLabels[member.role] || member.role}
                                                        </Badge>
                                                        {member.permissions_count > 0 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                <Lock className="w-3 h-3 mr-1" />
                                                                {member.permissions_count} {member.permissions_count === 1 ? 'permiso' : 'permisos'}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href={route('business.staff.permissions.edit', member.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Settings className="w-4 h-4 mr-2" />
                                                    Gestionar Permisos
                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="mb-2">No hay miembros del equipo</p>
                                    <p className="text-sm">
                                        Invita a personal desde el{' '}
                                        <Link href="/business/staff" className="text-primary hover:underline">
                                            módulo de personal
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
