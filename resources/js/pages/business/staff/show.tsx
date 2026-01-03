import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Mail, Phone, Briefcase, DollarSign, Calendar, User, Clock, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowingBadge } from '@/components/ui/glowing-badge';

interface Staff {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    roles?: Array<{
        id: number;
        name: string;
    }>;
    status: string;
    created_at: string;
    workstations?: Array<{
        id: number;
        name: string;
        number?: string;
        pivot?: {
            start_time?: string;
            end_time?: string;
            notes?: string;
        };
    }>;
}

interface PivotData {
    employment_type: string;
    commission_model: string;
    commission_percentage?: number;
    base_salary?: number;
    booth_rental_fee?: number;
    status: string;
    start_date?: string;
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
    customer: {
        name: string;
    };
}

interface Stats {
    total_appointments: number;
    completed_appointments: number;
    upcoming_appointments: number;
    total_revenue: number;
}

const employmentLabels: Record<string, string> = {
    employee: 'Empleado',
    freelancer: 'Freelancer',
};

const roleLabels: Record<string, string> = {
    staff: 'Staff (Personal)',
    manager: 'Manager (Administrador)',
};

const commissionLabels: Record<string, string> = {
    percentage: 'Comisión %',
    salary_plus: 'Salario + %',
    booth_rental: 'Alquiler silla',
    fixed_per_service: 'Fijo por servicio',
    salary_only: 'Solo salario',
};

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

export default function StaffShow({ staff, pivotData, appointments = [], stats }: { staff: Staff; pivotData: PivotData | null; appointments?: Appointment[]; stats?: Stats }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title={`Personal - ${staff.name}`} />
            
            <div className="space-y-6 max-w-6xl mx-auto p-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-start"
                >
                    <div>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mb-2"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {staff.name}
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            {pivotData ? (
                                <>
                                    <GlowingBadge variant={pivotData.status === 'active' ? 'success' : 'error'}>
                                        {pivotData.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </GlowingBadge>
                                    <span className="text-sm text-muted-foreground">
                                        {staff.roles && staff.roles.length > 0 ? staff.roles[0].name : roleLabels[staff.role]} • {employmentLabels[pivotData.employment_type] || pivotData.employment_type}
                                    </span>
                                </>
                            ) : (
                                <GlowingBadge variant="warning">
                                    Sin asignación
                                </GlowingBadge>
                            )}
                        </div>
                    </div>
                    <Link href={`/business/staff/${staff.id}/edit`}>
                        <Button className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Perfil
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Sidebar: Info & Stats */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Información Personal
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <span className="truncate">{staff.email}</span>
                                </div>
                                {staff.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <span>{staff.phone}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <span>Miembro desde {formatDate(staff.created_at)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {stats && (
                            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                                <CardHeader>
                                    <CardTitle className="text-lg">Rendimiento</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Ingresos Generados</span>
                                        <span className="font-bold text-green-600">{formatCurrency(stats.total_revenue)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Citas Completadas</span>
                                        <span className="font-bold">{stats.completed_appointments}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <span className="text-sm text-muted-foreground">Próximas Citas</span>
                                        <span className="font-bold text-blue-600">{stats.upcoming_appointments}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                    Contrato
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {pivotData ? (
                                    <>
                                        <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modelo de Comisión</p>
                                            <p className="font-medium">{commissionLabels[pivotData.commission_model] || pivotData.commission_model}</p>
                                        </div>
                                        
                                        {pivotData.base_salary && (
                                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                                <span className="text-sm text-muted-foreground">Salario Base</span>
                                                <span className="font-bold">{formatCurrency(pivotData.base_salary)}</span>
                                            </div>
                                        )}
                                        
                                        {pivotData.commission_percentage && (
                                            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                                <span className="text-sm text-muted-foreground">Comisión</span>
                                                <span className="font-bold">{pivotData.commission_percentage}%</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground text-sm">
                                        No hay información de contrato disponible.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Main Content: Schedule & History */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Workstations */}
                        {staff.workstations && staff.workstations.length > 0 && (
                            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Scissors className="h-5 w-5 text-primary" />
                                        Estaciones Asignadas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {staff.workstations.map((ws) => (
                                            <div key={ws.id} className="p-4 rounded-xl border border-border/50 bg-card/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold">{ws.name}</h3>
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                        #{ws.number}
                                                    </span>
                                                </div>
                                                {ws.pivot && (
                                                    <div className="text-sm text-muted-foreground space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{ws.pivot.start_time?.slice(0, 5)} - {ws.pivot.end_time?.slice(0, 5)}</span>
                                                        </div>
                                                        {ws.pivot.notes && (
                                                            <p className="italic text-xs mt-2">"{ws.pivot.notes}"</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Appointment History */}
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
                                                                    <User className="h-3 w-3" />
                                                                    {appointment.customer.name}
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
                                        <p>No hay historial de citas para este profesional.</p>
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
