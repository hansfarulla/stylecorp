import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlowingBadge } from '@/components/ui/glowing-badge';
import { ArrowLeft, Calendar, Clock, Mail, Phone, MapPin, DollarSign, User as UserIcon, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    profile_photo_url?: string;
    created_at: string;
}

interface Appointment {
    id: number;
    booking_code: string;
    scheduled_at: string;
    status: string;
    total: number;
    service: {
        name: string;
    };
    professional: {
        name: string;
    };
}

interface Stats {
    total_appointments: number;
    completed_appointments: number;
    cancelled_appointments: number;
    total_spent: number;
    last_visit?: string;
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    in_progress: 'En progreso',
    completed: 'Completada',
    cancelled_by_customer: 'Cancelada (Cliente)',
    cancelled_by_establishment: 'Cancelada (Establecimiento)',
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

export default function CustomerShow({ customer, appointments, stats }: { customer: Customer, appointments: Appointment[], stats: Stats }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title={`Cliente: ${customer.name}`} />

            <div className="space-y-6 max-w-6xl mx-auto p-4">
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
                            Perfil del Cliente
                        </h1>
                        <p className="text-muted-foreground">Detalles e historial</p>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Sidebar: Customer Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10 overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
                            <CardContent className="relative pt-0">
                                <div className="absolute -top-12 left-6">
                                    <div className="h-24 w-24 rounded-full bg-background p-1 shadow-xl">
                                        <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-3xl border border-primary/20">
                                            {customer.profile_photo_url ? (
                                                <img src={customer.profile_photo_url} alt={customer.name} className="h-full w-full rounded-full object-cover" />
                                            ) : (
                                                customer.name.charAt(0)
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-14 space-y-4">
                                    <div>
                                        <h2 className="text-xl font-bold">{customer.name}</h2>
                                        <p className="text-sm text-muted-foreground">Cliente desde {new Date(customer.created_at).getFullYear()}</p>
                                    </div>
                                    
                                    <div className="space-y-3 pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <span className="truncate">{customer.email}</span>
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="p-2 rounded-full bg-primary/10 text-primary">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                <span>{customer.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Estadísticas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Total Gastado</span>
                                    <span className="font-bold text-green-600">{formatCurrency(stats.total_spent)}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Citas Completadas</span>
                                    <span className="font-bold">{stats.completed_appointments}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                    <span className="text-sm text-muted-foreground">Cancelaciones</span>
                                    <span className="font-bold text-destructive">{stats.cancelled_appointments}</span>
                                </div>
                                {stats.last_visit && (
                                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Última Visita</span>
                                        <span className="font-bold text-xs">
                                            {new Date(stats.last_visit).toLocaleDateString('es-CR')}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Main Content: History */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Historial de Citas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {appointments.length > 0 ? (
                                    <div className="space-y-4">
                                        {appointments.map((appointment) => (
                                            <Link 
                                                key={appointment.id} 
                                                href={`/business/appointments/${appointment.id}`}
                                                className="block group"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-primary/5 border border-primary/10 text-primary">
                                                            <span className="text-xs font-bold uppercase">
                                                                {new Date(appointment.scheduled_at).toLocaleDateString('es-CR', { month: 'short' })}
                                                            </span>
                                                            <span className="text-xl font-bold">
                                                                {new Date(appointment.scheduled_at).getDate()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-semibold group-hover:text-primary transition-colors">
                                                                    {appointment.service.name}
                                                                </h3>
                                                                <GlowingBadge variant={badgeVariants[appointment.status]} className="text-[10px] h-5 px-1.5">
                                                                    {statusLabels[appointment.status]}
                                                                </GlowingBadge>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(appointment.scheduled_at).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Scissors className="h-3 w-3" />
                                                                    {appointment.professional.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 sm:mt-0 text-right">
                                                        <p className="font-bold text-lg">{formatCurrency(appointment.total)}</p>
                                                        <p className="text-xs text-muted-foreground">{appointment.booking_code}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                        <p>No hay historial de citas para este cliente.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
