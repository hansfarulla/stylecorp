import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, User, Clock, AlertCircle, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowingBadge } from '@/components/ui/glowing-badge';

interface User {
    id: number;
    name: string;
    email: string;
    pivot?: {
        start_time?: string;
        end_time?: string;
        days?: string;
        notes?: string;
    };
}

interface Workstation {
    id: number;
    name: string;
    number?: string;
    description?: string;
    status: string;
    assigned_users?: User[];
    created_at: string;
}

const statusLabels: Record<string, string> = {
    available: 'Disponible',
    occupied: 'Ocupada',
    maintenance: 'Mantenimiento',
    disabled: 'Deshabilitada',
};

const statusVariants: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
    available: 'success',
    occupied: 'info',
    maintenance: 'warning',
    disabled: 'error',
};

export default function ShowWorkstation({ workstation }: { workstation: Workstation }) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const parseDays = (daysJson?: string): string[] => {
        if (!daysJson) return [];
        try {
            return JSON.parse(daysJson);
        } catch {
            return [];
        }
    };

    const dayLabels: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return (
        <AppLayout>
            <Head title={`Estación - ${workstation.name}`} />
            
            <div className="space-y-6 max-w-4xl mx-auto p-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-start"
                >
                    <div>
                        <Link href="/business/workstations">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a Estaciones
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {workstation.name}
                            {workstation.number && <span className="text-muted-foreground ml-2">(#{workstation.number})</span>}
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <GlowingBadge variant={statusVariants[workstation.status]}>
                                {statusLabels[workstation.status]}
                            </GlowingBadge>
                        </div>
                    </div>
                    <Link href={`/business/workstations/${workstation.id}/edit`}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="shadow-lg">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Información General */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-2 rounded-full border border-blue-500/20">
                                        <Briefcase className="h-4 w-4 text-blue-500" />
                                    </div>
                                    Información General
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {workstation.number && (
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-blue-500/30 bg-blue-500/5"
                                    >
                                        <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Número</p>
                                            <p className="font-semibold text-lg">#{workstation.number}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {workstation.description && (
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-green-500/30 bg-green-500/5"
                                    >
                                        <AlertCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm text-muted-foreground">Descripción</p>
                                            <p className="font-medium">{workstation.description}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className="flex items-start gap-3 p-3 rounded-lg border-l-4 border-purple-500/30 bg-purple-500/5"
                                >
                                    <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">Fecha de Creación</p>
                                        <p className="font-medium">{formatDate(workstation.created_at)}</p>
                                    </div>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Estado */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 p-2 rounded-full border border-indigo-500/20">
                                        <AlertCircle className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    Estado Actual
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg text-center border border-primary/20"
                                >
                                    <GlowingBadge 
                                        variant={statusVariants[workstation.status]}
                                        className="text-lg px-4 py-2"
                                    >
                                        {statusLabels[workstation.status]}
                                    </GlowingBadge>
                                    <p className="text-sm text-muted-foreground mt-3">
                                        {workstation.status === 'available' && 'Esta estación está disponible para asignar empleados'}
                                        {workstation.status === 'occupied' && 'Esta estación tiene empleados asignados'}
                                        {workstation.status === 'maintenance' && 'Esta estación está en mantenimiento'}
                                        {workstation.status === 'disabled' && 'Esta estación está deshabilitada'}
                                    </p>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Empleados Asignados */}
                {workstation.assigned_users && workstation.assigned_users.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-2 rounded-full border border-purple-500/20">
                                        <User className="h-4 w-4 text-purple-500" />
                                    </div>
                                    Empleados Asignados ({workstation.assigned_users.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {workstation.assigned_users.map((user) => {
                                    const days = parseDays(user.pivot?.days);
                                    return (
                                        <motion.div
                                            key={user.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            whileHover={{ x: 4 }}
                                            className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary/30 p-4 rounded-lg space-y-2 transition-all hover:border-primary/50 hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <motion.div 
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                    className="bg-gradient-to-br from-primary/30 to-primary/20 p-2.5 rounded-full border border-primary/30 shadow-sm"
                                                >
                                                    <User className="h-4 w-4 text-primary" />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-base">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>

                                            {(user.pivot?.start_time || user.pivot?.end_time) && (
                                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Clock className="h-4 w-4 text-primary" />
                                                        <span className="font-semibold">Horario:</span>
                                                        <span>
                                                            {user.pivot.start_time} - {user.pivot.end_time}
                                                        </span>
                                                    </div>
                                                    {days.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-1">
                                                            {days.map((day) => (
                                                                <span
                                                                    key={day}
                                                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                                                                >
                                                                    {dayLabels[day]}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {user.pivot?.notes && (
                                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                                    <p className="text-sm">
                                                        <span className="font-semibold">Notas:</span> {user.pivot.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {(!workstation.assigned_users || workstation.assigned_users.length === 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-dashed">
                            <CardContent className="py-10 text-center">
                                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground mb-2">Sin empleados asignados</p>
                                <p className="text-sm text-muted-foreground">
                                    Esta estación no tiene empleados asignados actualmente
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </AppLayout>
    );
}
