import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlowingBadge } from '@/components/ui/glowing-badge';
import { ArrowLeft, Check, X, Calendar, Clock, User, Scissors, MapPin, DollarSign, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
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

interface Appointment {
    id: number;
    booking_code: string;
    scheduled_at: string;
    scheduled_end_at: string;
    status: string;
    total: number;
    location_type: string;
    customer_notes?: string;
    professional_id: number;
    service_id: number;
    customer: {
        id: number;
        name: string;
        email: string;
        phone?: string;
        profile_photo_url?: string;
    };
    professional: {
        id: number;
        name: string;
        profile_photo_url?: string;
    };
    service: {
        id: number;
        name: string;
        duration_minutes: number;
    };
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    in_progress: 'En progreso',
    completed: 'Completada',
    cancelled_by_customer: 'Cancelada por cliente',
    cancelled_by_establishment: 'Cancelada por establecimiento',
    no_show: 'No asistió',
};

const badgeVariants: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
    pending: 'warning',
    confirmed: 'success',
    in_progress: 'info',
    completed: 'success',
    cancelled_by_customer: 'error',
    cancelled_by_establishment: 'error',
    no_show: 'error',
};

export default function AppointmentShow({ appointment }: { appointment: Appointment }) {
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const updateStatus = (status: string) => {
        router.patch(`/business/appointments/${appointment.id}/status`, {
            status: status,
        });
    };

    return (
        <AppLayout>
            <Head title={`Cita ${appointment.booking_code}`} />

            <div className="space-y-6 max-w-4xl mx-auto p-4">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-primary/10"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Detalles de la Cita
                        </h1>
                        <p className="text-muted-foreground">Código: {appointment.booking_code}</p>
                    </div>
                    <div className="ml-auto">
                        <GlowingBadge variant={badgeVariants[appointment.status]} className="text-sm px-3 py-1">
                            {statusLabels[appointment.status]}
                        </GlowingBadge>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    Información de la Cita
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Fecha</p>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Calendar className="h-4 w-4 text-primary/70" />
                                            {new Date(appointment.scheduled_at).toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Hora</p>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Clock className="h-4 w-4 text-primary/70" />
                                            {new Date(appointment.scheduled_at).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.scheduled_end_at).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Servicio</p>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Scissors className="h-4 w-4 text-primary/70" />
                                            {appointment.service.name}
                                            <span className="text-xs text-muted-foreground font-normal">({appointment.service.duration_minutes} min)</span>
                                        </div>
                                    </div>
                                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                        <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Ubicación</p>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <MapPin className="h-4 w-4 text-primary/70" />
                                            {appointment.location_type === 'in_store' ? 'En establecimiento' : 'A domicilio'}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Notas del Cliente</p>
                                    <p className="text-sm bg-muted/50 p-4 rounded-lg border border-border/50 italic text-muted-foreground">
                                        {appointment.customer_notes || 'Sin notas adicionales'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-full bg-green-500/10 text-green-600">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    Detalles de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center p-4 bg-green-500/5 rounded-lg border border-green-500/10">
                                    <span className="text-lg font-medium">Total</span>
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(appointment.total)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {appointment.status === 'pending' && (
                            <div className="flex gap-4">
                                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant="outline"
                                        className="w-full border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 hover:border-emerald-500 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 shadow-sm hover:shadow-emerald-500/20 transition-all"
                                        onClick={() => updateStatus('confirmed')}
                                    >
                                        <Check className="mr-2 h-4 w-4" />
                                        Aceptar Cita
                                    </Button>
                                </motion.div>
                                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                        variant="outline" 
                                        className="w-full border-red-500/50 text-red-600 hover:bg-red-500/10 hover:border-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 shadow-sm hover:shadow-red-500/20 transition-all"
                                        onClick={() => updateStatus('cancelled_by_establishment')}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        Rechazar Cita
                                    </Button>
                                </motion.div>
                            </div>
                        )}

                        {appointment.status === 'confirmed' && (
                            <div className="flex justify-end">
                                <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button 
                                                variant="outline" 
                                                className="border-red-500/50 text-red-600 hover:bg-red-500/10 hover:border-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 shadow-sm hover:shadow-red-500/20 transition-all"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Cancelar Cita
                                            </Button>
                                        </motion.div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Cancelar Cita?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción cancelará la cita de {appointment.customer.name}. Esta acción no se puede deshacer.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Volver</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={() => {
                                                    updateStatus('cancelled_by_establishment');
                                                    setIsCancelDialogOpen(false);
                                                }}
                                            >
                                                Cancelar Cita
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-600">
                                        <User className="h-5 w-5" />
                                    </div>
                                    Cliente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-2xl border border-primary/20 shadow-inner">
                                        {appointment.customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{appointment.customer.name}</p>
                                        <p className="text-sm text-muted-foreground">{appointment.customer.email}</p>
                                        {appointment.customer.phone && (
                                            <p className="text-sm text-muted-foreground">{appointment.customer.phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border/50">
                                    <Button variant="outline" className="w-full hover:bg-primary/5 hover:border-primary/30 transition-all" asChild>
                                        <Link href={`/business/customers/${appointment.customer.id}`}>Ver Perfil Completo</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="p-2 rounded-full bg-purple-500/10 text-purple-600">
                                        <Scissors className="h-5 w-5" />
                                    </div>
                                    Profesional
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center font-bold text-purple-700 border border-purple-500/20 shadow-inner">
                                        {appointment.professional.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-lg">{appointment.professional.name}</p>
                                        <p className="text-xs text-muted-foreground">Estilista</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border/50 mt-4">
                                    <Button variant="outline" className="w-full hover:bg-purple-500/5 hover:border-purple-500/30 transition-all" asChild>
                                        <Link href={`/business/staff/${appointment.professional.id}`}>Ver Perfil Completo</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
