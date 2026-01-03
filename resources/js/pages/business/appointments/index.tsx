import { Head, Link, router, useRemember, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarPlus, Eye, Calendar as CalendarIcon, List, ChevronDown, Check, X as XIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { GlowingBadge } from '@/components/ui/glowing-badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Service {
    id: number;
    name: string;
    duration_minutes: number;
    price: number;
}

interface Professional {
    id: number;
    name: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Appointment {
    id: number;
    booking_code: string;
    scheduled_at: string;
    scheduled_end_at: string;
    status: string;
    customer: {
        name: string;
    };
    professional: {
        name: string;
    };
    service: {
        name: string;
    };
    total: number;
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    in_progress: 'En progreso',
    completed: 'Completada',
    cancelled_by_customer: 'Cancelada',
    cancelled_by_establishment: 'Cancelada',
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

const SwipeableAppointmentCard = ({ appointment, onUpdateStatus }: { appointment: Appointment, onUpdateStatus: (id: number, status: string) => void }) => {
    const x = useMotionValue(0);
    const opacityRight = useTransform(x, [50, 150], [0, 1]);
    const opacityLeft = useTransform(x, [-150, -50], [1, 0]);
    const bg = useTransform(x, [-150, 0, 150], ["rgba(16, 185, 129, 0.2)", "rgba(0,0,0,0)", "rgba(239, 68, 68, 0.2)"]);
    const [confirmAction, setConfirmAction] = useState<'confirm' | 'reject' | null>(null);

    const handleDragEnd = (event: any, info: PanInfo) => {
        // Threshold reduced to 80 for better sensitivity
        if (info.offset.x < -80) {
            // Swipe Left -> Accept (Confirmed)
            if (appointment.status === 'pending') {
                setConfirmAction('confirm');
            }
        } else if (info.offset.x > 80) {
            // Swipe Right -> Reject (Cancelled)
            if (appointment.status === 'pending' || appointment.status === 'confirmed') {
                setConfirmAction('reject');
            }
        }
    };

    const handleConfirm = () => {
        if (confirmAction === 'confirm') {
            onUpdateStatus(appointment.id, 'confirmed');
        } else if (confirmAction === 'reject') {
            onUpdateStatus(appointment.id, 'cancelled_by_establishment');
        }
        setConfirmAction(null);
    };

    return (
        <>
            <div className="relative overflow-hidden rounded-xl">
                {/* Background Actions */}
                <motion.div 
                    style={{ backgroundColor: bg }}
                    className="absolute inset-0 flex items-center justify-between px-6 z-0"
                >
                    <motion.div style={{ opacity: opacityRight }} className="flex items-center gap-2 text-destructive font-bold">
                        <XIcon className="h-6 w-6" />
                        <span>Rechazar</span>
                    </motion.div>
                    <motion.div style={{ opacity: opacityLeft }} className="flex items-center gap-2 text-emerald-600 font-bold">
                        <span>Aceptar</span>
                        <Check className="h-6 w-6" />
                    </motion.div>
                </motion.div>

                {/* Card */}
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    style={{ x }}
                    className="relative z-10 bg-card"
                >
                    <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-gradient-to-br from-card to-card/50 overflow-hidden relative group border-primary/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                        <CardContent className="py-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 grid md:grid-cols-5 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Código</p>
                                        <p className="font-medium">{appointment.booking_code}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fecha y Hora</p>
                                        <p className="font-medium">
                                            {new Date(appointment.scheduled_at).toLocaleString('es-CR')}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Cliente</p>
                                        <p className="font-medium">{appointment.customer.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Profesional</p>
                                        <p className="font-medium">{appointment.professional.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Servicio</p>
                                        <p className="font-medium">{appointment.service.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 ml-4">
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total</p>
                                        <p className="font-bold text-lg">{new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(appointment.total)}</p>
                                    </div>
                                    
                                    <GlowingBadge variant={badgeVariants[appointment.status]}>
                                        {statusLabels[appointment.status]}
                                    </GlowingBadge>

                                    <Link href={`/business/appointments/${appointment.id}`}>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {confirmAction === 'confirm' ? '¿Aceptar Cita?' : '¿Rechazar Cita?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {confirmAction === 'confirm' 
                                ? `¿Estás seguro de que deseas aceptar la cita de ${appointment.customer.name}?`
                                : `¿Estás seguro de que deseas rechazar/cancelar la cita de ${appointment.customer.name}? Esta acción no se puede deshacer.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className={confirmAction === 'reject' ? "bg-destructive hover:bg-destructive/90" : "bg-emerald-600 hover:bg-emerald-700"}
                            onClick={handleConfirm}
                        >
                            {confirmAction === 'confirm' ? 'Aceptar' : 'Rechazar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default function AppointmentsIndex({ appointments, services = [], professionals = [], customers = [] }: { appointments: { data: Appointment[] }, services?: Service[], professionals?: Professional[], customers?: Customer[] }) {
    const [viewMode, setViewMode] = useRemember<'calendar' | 'list'>('calendar', 'AppointmentsIndex:viewMode');
    const [isMobile, setIsMobile] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
    const calendarRef = useRef<FullCalendar>(null);
    const [calendarView, setCalendarView] = useRemember('dayGridMonth', 'AppointmentsIndex:calendarView');
    const [calendarDate, setCalendarDate] = useRemember<string | null>(null, 'AppointmentsIndex:calendarDate');
    
    // Create Modal State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        customer_id: '',
        professional_id: '',
        service_id: '',
        scheduled_at: '',
        location_type: 'in_store',
        customer_notes: '',
    });

    const openCreateDialog = (dateStr?: string) => {
        clearErrors();
        reset();
        if (dateStr) {
            // Format date for datetime-local input
            const date = new Date(dateStr);
            const offset = date.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
            setData('scheduled_at', localISOTime);
        } else {
            // Default to now if no date provided
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
            setData('scheduled_at', localISOTime);
        }
        setIsCreateDialogOpen(true);
    };

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/business/appointments', {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                reset();
                // Refresh calendar if needed
                if (calendarRef.current) {
                    calendarRef.current.getApi().refetchEvents();
                }
            }
        });
    };

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getAppointmentsForDate = (date: Date) => {
        return appointments.data.filter(app => {
            const appDate = new Date(app.scheduled_at);
            return appDate.getDate() === date.getDate() &&
                   appDate.getMonth() === date.getMonth() &&
                   appDate.getFullYear() === date.getFullYear();
        });
    };

    const changeView = (viewName: string) => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.changeView(viewName);
            calendarApi.today();
        }
    };

    // Convertir citas a eventos de FullCalendar
    const calendarEvents = appointments.data.map((appointment) => {
        const statusColorMap: Record<string, string> = {
            pending: '#f59e0b',
            confirmed: '#10b981',
            in_progress: '#3b82f6',
            completed: '#6366f1',
            cancelled_by_customer: '#ef4444',
            cancelled_by_establishment: '#ef4444',
            no_show: '#9ca3af',
        };

        return {
            id: appointment.id.toString(),
            title: `${appointment.customer.name} - ${appointment.service.name}`,
            start: appointment.scheduled_at,
            end: appointment.scheduled_end_at,
            backgroundColor: statusColorMap[appointment.status] || '#3b82f6',
            borderColor: statusColorMap[appointment.status] || '#3b82f6',
            extendedProps: {
                appointment: appointment,
            },
        };
    });

    const updateStatus = (id: number, status: string) => {
        router.patch(`/business/appointments/${id}/status`, {
            status: status
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Citas" />
            
            <div className="space-y-6 p-4">
                
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Citas
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">Gestiona tus citas y horarios</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex gap-1 border rounded-lg p-1 bg-muted/20">
                            <Button
                                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('calendar')}
                                className="transition-all"
                            >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Calendario</span>
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="transition-all"
                            >
                                <List className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Lista</span>
                            </Button>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                                onClick={() => openCreateDialog()}
                                className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90"
                            >
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Nueva Cita</span>
                                <span className="sm:hidden">Nueva</span>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {viewMode === 'calendar' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 overflow-hidden relative group border-primary/20">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                            <CardContent className="p-2 sm:p-6 relative z-10">
                                <style>{`
                                    .fc {
                                        --fc-border-color: color-mix(in srgb, var(--border), transparent 80%);
                                        --fc-button-bg-color: var(--primary);
                                        --fc-button-border-color: var(--primary);
                                        --fc-button-hover-bg-color: color-mix(in srgb, var(--primary), transparent 10%);
                                        --fc-button-hover-border-color: color-mix(in srgb, var(--primary), transparent 10%);
                                        --fc-button-active-bg-color: color-mix(in srgb, var(--primary), transparent 20%);
                                        --fc-button-active-border-color: color-mix(in srgb, var(--primary), transparent 20%);
                                        --fc-today-bg-color: color-mix(in srgb, var(--primary), transparent 95%);
                                        --fc-page-bg-color: transparent;
                                        --fc-neutral-bg-color: color-mix(in srgb, var(--muted), transparent 80%);
                                        --fc-list-event-hover-bg-color: color-mix(in srgb, var(--muted), transparent 70%);
                                    }
                                    .fc .fc-button {
                                        text-transform: capitalize;
                                        font-weight: 600;
                                        padding: 0.625rem 1.25rem;
                                        border-radius: 0.75rem;
                                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                        color: var(--primary-foreground);
                                        background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary), transparent 10%));
                                        border: none;
                                    }
                                    .fc .fc-button:hover {
                                        transform: translateY(-2px) scale(1.02);
                                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                                        filter: brightness(1.1);
                                    }
                                    .fc .fc-button:active {
                                        transform: translateY(0) scale(0.98);
                                    }
                                    .fc .fc-button-primary:disabled {
                                        opacity: 0.5;
                                        transform: none;
                                    }
                                    .fc .fc-toolbar-title {
                                        font-size: 1.125rem;
                                        font-weight: 800;
                                        color: var(--foreground);
                                        background: linear-gradient(135deg, var(--foreground), color-mix(in srgb, var(--foreground), transparent 40%));
                                        -webkit-background-clip: text;
                                        -webkit-text-fill-color: transparent;
                                        background-clip: text;
                                        letter-spacing: -0.025em;
                                    }
                                    @media (min-width: 640px) {
                                        .fc .fc-toolbar-title {
                                            font-size: 1.5rem;
                                        }
                                    }
                                    @media (min-width: 768px) {
                                        .fc .fc-toolbar-title {
                                            font-size: 1.75rem;
                                        }
                                    }
                                    .fc .fc-button {
                                        font-size: 0.75rem;
                                        padding: 0.5rem 0.75rem;
                                    }
                                    @media (min-width: 640px) {
                                        .fc .fc-button {
                                            font-size: 0.875rem;
                                            padding: 0.625rem 1rem;
                                        }
                                    }
                                    @media (min-width: 768px) {
                                        .fc .fc-button {
                                            padding: 0.625rem 1.25rem;
                                        }
                                    }
                                    .fc .fc-col-header-cell {
                                        padding: 0.5rem 0.25rem;
                                        font-weight: 700;
                                        font-size: 0.625rem;
                                        text-transform: uppercase;
                                        letter-spacing: 0.05em;
                                        background: linear-gradient(180deg, color-mix(in srgb, var(--muted), transparent 60%), color-mix(in srgb, var(--muted), transparent 80%));
                                        border: none;
                                        position: relative;
                                    }
                                    @media (min-width: 640px) {
                                        .fc .fc-col-header-cell {
                                            padding: 0.75rem 0.375rem;
                                            font-size: 0.75rem;
                                        }
                                    }
                                    @media (min-width: 768px) {
                                        .fc .fc-col-header-cell {
                                            padding: 1rem 0.5rem;
                                            font-size: 0.8125rem;
                                        }
                                    }
                                    .fc .fc-col-header-cell::after {
                                        content: '';
                                        position: absolute;
                                        bottom: 0;
                                        left: 10%;
                                        right: 10%;
                                        height: 2px;
                                        background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--primary), transparent 70%), transparent);
                                    }
                                    .fc .fc-col-header-cell-cushion {
                                        color: color-mix(in srgb, var(--foreground), transparent 20%);
                                        transition: all 0.2s ease;
                                    }
                                    .fc .fc-daygrid-day-number {
                                        color: color-mix(in srgb, var(--foreground), transparent 10%);
                                        transition: all 0.3s ease;
                                        padding: 0.25rem;
                                        font-weight: 600;
                                        border-radius: 0.375rem;
                                        font-size: 0.875rem;
                                    }
                                    @media (min-width: 640px) {
                                        .fc .fc-daygrid-day-number {
                                            padding: 0.375rem;
                                            font-size: 1rem;
                                            border-radius: 0.5rem;
                                        }
                                    }
                                    .fc .fc-daygrid-day {
                                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                        position: relative;
                                        background: linear-gradient(135deg, transparent, color-mix(in srgb, var(--muted), transparent 98%));
                                    }
                                    .fc .fc-daygrid-day:hover {
                                        background: linear-gradient(135deg, color-mix(in srgb, var(--primary), transparent 95%), color-mix(in srgb, var(--primary), transparent 98%));
                                    }
                                    .fc .fc-daygrid-day:hover .fc-daygrid-day-number {
                                        background: color-mix(in srgb, var(--primary), transparent 90%);
                                        color: var(--primary);
                                        transform: scale(1.1);
                                    }
                                    .fc .fc-daygrid-day.has-appointments {
                                        background: linear-gradient(135deg, color-mix(in srgb, #10b981, transparent 95%), color-mix(in srgb, #10b981, transparent 98%)) !important;
                                    }
                                    .fc .fc-daygrid-day.has-appointments .fc-daygrid-day-number {
                                        font-weight: 700;
                                        color: #059669 !important;
                                        background-color: color-mix(in srgb, #10b981, transparent 85%) !important;
                                        box-shadow: 0 0 0 1px color-mix(in srgb, #10b981, transparent 70%);
                                        transform: scale(1.05);
                                    }
                                    .fc .fc-daygrid-day-frame {
                                        min-height: 60px;
                                    }
                                    @media (min-width: 640px) {
                                        .fc .fc-daygrid-day-frame {
                                            min-height: 80px;
                                        }
                                    }
                                    @media (min-width: 768px) {
                                        .fc .fc-daygrid-day-frame {
                                            min-height: 110px;
                                        }
                                    }
                                    .fc .fc-daygrid-day-top {
                                        flex-direction: row;
                                        padding: 0.25rem;
                                    }
                                    @media (min-width: 640px) {
                                        .fc .fc-daygrid-day-top {
                                            padding: 0.5rem;
                                        }
                                    }
                                    .fc .fc-event {
                                        cursor: pointer;
                                        border-radius: 0.5rem;
                                        border: none;
                                        padding: 2px 4px;
                                        margin: 1px 2px;
                                        font-size: 0.625rem;
                                        font-weight: 600;
                                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
                                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                                        backdrop-filter: blur(12px);
                                        position: relative;
                                        overflow: hidden;
                                        line-height: 1.2;
                                    }
                                    @media (min-width: 640px) {
                                        .fc .fc-event {
                                            padding: 4px 6px;
                                            margin: 2px 3px;
                                            font-size: 0.75rem;
                                            border-radius: 0.625rem;
                                        }
                                    }
                                    @media (min-width: 768px) {
                                        .fc .fc-event {
                                            padding: 6px 10px;
                                            margin: 3px 5px;
                                            font-size: 0.8125rem;
                                            border-radius: 0.75rem;
                                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
                                        }
                                    }
                                    .fc .fc-event::before {
                                        content: '';
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        right: 0;
                                        bottom: 0;
                                        background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
                                        opacity: 0;
                                        transition: opacity 0.3s ease;
                                    }
                                    .fc .fc-event:hover::before {
                                        opacity: 1;
                                    }
                                    .fc .fc-event-title,
                                    .fc .fc-event-time {
                                        color: white !important;
                                        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                                        position: relative;
                                        z-index: 1;
                                    }
                                    .fc .fc-event:hover {
                                        transform: translateY(-3px) scale(1.02);
                                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2), 0 3px 8px rgba(0, 0, 0, 0.12);
                                        filter: brightness(1.15) saturate(1.1);
                                    }
                                    .fc .fc-event:active {
                                        transform: translateY(-1px) scale(1.01);
                                    }
                                    .fc .fc-daygrid-day.fc-day-today {
                                        background: linear-gradient(135deg, color-mix(in srgb, var(--primary), transparent 92%), color-mix(in srgb, var(--primary), transparent 97%)) !important;
                                        position: relative;
                                    }
                                    .fc .fc-daygrid-day.fc-day-today::before {
                                        content: '';
                                        position: absolute;
                                        inset: 0;
                                        background: linear-gradient(135deg, color-mix(in srgb, var(--primary), transparent 90%), transparent);
                                        opacity: 0.5;
                                        pointer-events: none;
                                    }
                                    .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                                        background: linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary), transparent 20%));
                                        color: var(--primary-foreground);
                                        border-radius: 0.5rem;
                                        padding: 0.25rem 0.75rem;
                                        display: inline-block;
                                        font-weight: 800;
                                        box-shadow: 0 4px 12px color-mix(in srgb, var(--primary), transparent 70%);
                                        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                                    }
                                    @keyframes pulse {
                                        0%, 100% {
                                            box-shadow: 0 4px 12px color-mix(in srgb, var(--primary), transparent 70%);
                                        }
                                        50% {
                                            box-shadow: 0 4px 20px color-mix(in srgb, var(--primary), transparent 50%);
                                        }
                                    }
                                    .fc .fc-timegrid-slot {
                                        height: 3.5rem;
                                        border-bottom: 1px solid color-mix(in srgb, var(--border), transparent 80%);
                                        transition: background-color 0.2s ease;
                                    }
                                    .fc .fc-timegrid-slot:hover {
                                        background: color-mix(in srgb, var(--muted), transparent 90%);
                                    }
                                    .fc .fc-timegrid-slot-label {
                                        color: color-mix(in srgb, var(--foreground), transparent 40%);
                                        font-weight: 600;
                                        font-size: 0.75rem;
                                    }
                                    .fc .fc-timegrid-event {
                                        border-radius: 0.75rem;
                                        border-left-width: 4px !important;
                                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                                    }
                                    .fc .fc-timegrid-now-indicator-line {
                                        border-color: var(--primary);
                                        border-width: 2px;
                                        box-shadow: 0 0 8px color-mix(in srgb, var(--primary), transparent 60%);
                                    }
                                    .fc .fc-timegrid-now-indicator-arrow {
                                        border-color: var(--primary);
                                        border-width: 6px;
                                    }
                                    .fc-list-event {
                                        transition: all 0.2s ease;
                                        border-radius: 0.5rem;
                                    }
                                    .fc-list-event:hover td {
                                        background: linear-gradient(90deg, color-mix(in srgb, var(--primary), transparent 90%), color-mix(in srgb, var(--muted), transparent 70%)) !important;
                                    }
                                    .fc-list-event-dot {
                                        border-radius: 50% !important;
                                        width: 12px !important;
                                        height: 12px !important;
                                        box-shadow: 0 0 0 3px currentColor, 0 2px 4px rgba(0, 0, 0, 0.2);
                                    }
                                    .fc-list-event-time,
                                    .fc-list-event-title {
                                        color: var(--foreground) !important;
                                        font-weight: 600;
                                    }
                                    .fc-list-day-cushion {
                                        background: linear-gradient(90deg, color-mix(in srgb, var(--muted), transparent 60%), color-mix(in srgb, var(--muted), transparent 80%));
                                        color: var(--foreground);
                                        font-weight: 700;
                                        padding: 0.75rem 1rem;
                                    }
                                    .fc .fc-scrollgrid {
                                        border-color: color-mix(in srgb, var(--border), transparent 80%);
                                        border-radius: 1rem;
                                        overflow: hidden;
                                    }
                                    .fc .fc-scrollgrid td {
                                        border-color: color-mix(in srgb, var(--border), transparent 85%);
                                    }
                                    .fc .fc-toolbar {
                                        margin-bottom: 1.5rem;
                                        gap: 1rem;
                                        flex-wrap: wrap;
                                    }
                                    .fc .fc-toolbar-chunk {
                                        display: flex;
                                        align-items: center;
                                    }
                                    .fc-daygrid-day-events {
                                        display: ${isMobile ? 'none' : 'block'};
                                    }
                                    .fc-daygrid-day-bottom {
                                        display: ${isMobile ? 'none' : 'block'};
                                    }
                                    @media (max-width: 768px) {
                                        .fc .fc-toolbar {
                                            display: flex;
                                            flex-direction: column;
                                            gap: 0.75rem;
                                            align-items: stretch;
                                        }
                                        .fc .fc-toolbar-chunk {
                                            display: flex;
                                            justify-content: space-between;
                                            align-items: center;
                                        }
                                        .fc .fc-toolbar-chunk:nth-child(1) {
                                            order: 2;
                                        }
                                        .fc .fc-toolbar-chunk:nth-child(2) {
                                            order: 1;
                                        }
                                        .fc .fc-toolbar-chunk:nth-child(3) {
                                            order: 2;
                                        }
                                        .fc-header-toolbar {
                                            display: grid !important;
                                            grid-template-columns: 1fr auto;
                                            grid-template-rows: auto auto;
                                            gap: 0.75rem;
                                            width: 100%;
                                        }
                                        .fc-header-toolbar .fc-toolbar-chunk:nth-child(1) {
                                            grid-column: 1;
                                            grid-row: 2;
                                            justify-self: start;
                                        }
                                        .fc-header-toolbar .fc-toolbar-chunk:nth-child(2) {
                                            grid-column: 1 / -1;
                                            grid-row: 1;
                                            justify-self: center;
                                        }
                                        .fc-header-toolbar .fc-toolbar-chunk:nth-child(3) {
                                            grid-column: 2;
                                            grid-row: 2;
                                            justify-self: end;
                                        }
                                        .fc .fc-toolbar-title {
                                            font-size: 1rem;
                                            text-align: center;
                                            width: 100%;
                                        }
                                        .fc .fc-button {
                                            padding: 0.4rem 0.6rem;
                                            font-size: 0.8rem;
                                        }
                                        .fc .fc-daygrid-day-frame {
                                            min-height: 80px;
                                            display: flex;
                                            flex-direction: column;
                                            align-items: center;
                                            justify-content: flex-start;
                                        }
                                        .fc .fc-daygrid-day-top {
                                            justify-content: center;
                                            width: 100%;
                                        }
                                    }
                                `}</style>
                                <FullCalendar
                                    ref={calendarRef}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                    initialView={isMobile ? "dayGridMonth" : calendarView}
                                    initialDate={calendarDate || undefined}
                                    customButtons={{
                                        myDayGridMonth: {
                                            text: 'Mes',
                                            click: () => {
                                                const calendarApi = calendarRef.current?.getApi();
                                                calendarApi?.changeView('dayGridMonth');
                                                calendarApi?.today();
                                            }
                                        },
                                        myTimeGridWeek: {
                                            text: 'Semana',
                                            click: () => {
                                                const calendarApi = calendarRef.current?.getApi();
                                                calendarApi?.changeView('timeGridWeek');
                                                calendarApi?.today();
                                            }
                                        },
                                        myTimeGridDay: {
                                            text: 'Día',
                                            click: () => {
                                                const calendarApi = calendarRef.current?.getApi();
                                                calendarApi?.changeView('timeGridDay');
                                                calendarApi?.today();
                                            }
                                        },
                                        myListWeek: {
                                            text: 'Lista',
                                            click: () => {
                                                const calendarApi = calendarRef.current?.getApi();
                                                calendarApi?.changeView('listWeek');
                                                calendarApi?.today();
                                            }
                                        }
                                    }}
                                    headerToolbar={isMobile ? {
                                        left: 'prev,next',
                                        center: 'title',
                                        right: 'today' // Balance the layout
                                    } : {
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'myDayGridMonth,myTimeGridWeek,myTimeGridDay,myListWeek'
                                    }}
                                    locale={esLocale}
                                    buttonText={{
                                        today: 'Hoy',
                                        month: 'Mes',
                                        week: 'Semana',
                                        day: 'Día',
                                        list: 'Lista'
                                    }}
                                    events={calendarEvents}
                                    datesSet={(dateInfo) => {
                                        if (!isMobile) {
                                            setCalendarView(dateInfo.view.type);
                                            setCalendarDate(dateInfo.startStr);
                                        }
                                    }}
                                    eventClick={(info) => {
                                        router.visit(`/business/appointments/${info.event.id}`);
                                    }}
                                    dateClick={(arg) => {
                                        if (arg.view.type.includes('timeGrid')) {
                                            openCreateDialog(arg.dateStr);
                                        } else if (isMobile) {
                                            setSelectedDate(arg.date);
                                            setIsSheetOpen(true);
                                        }
                                    }}
                                    dayCellClassNames={(arg) => {
                                        const count = getAppointmentsForDate(arg.date).length;
                                        return count > 0 ? ['has-appointments'] : [];
                                    }}
                                    dayCellContent={(arg) => {
                                        if (isMobile) {
                                            const count = getAppointmentsForDate(arg.date).length;
                                            return (
                                                <div className="flex flex-col items-center gap-1">
                                                    <span>{arg.dayNumberText}</span>
                                                    {count > 0 && (
                                                        <Badge variant="secondary" className="h-5 min-w-[1.25rem] px-1 flex items-center justify-center rounded-md text-[10px]">
                                                            {count}
                                                        </Badge>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return arg.dayNumberText;
                                    }}
                                    height="auto"
                                    slotMinTime="07:00:00"
                                    slotMaxTime="22:00:00"
                                    allDaySlot={false}
                                    nowIndicator={true}
                                    weekends={true}
                                    editable={false}
                                    selectable={true}
                                    selectMirror={true}
                                />
                                
                                {/* Mobile View Switcher */}
                                {isMobile && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="default" size="sm" className="h-8 gap-1 shadow-md">
                                                    <CalendarIcon className="h-3.5 w-3.5" />
                                                    <span className="text-xs">Vista</span>
                                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => changeView('dayGridMonth')}>
                                                    Mes
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => changeView('listWeek')}>
                                                    Agenda Semanal
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => changeView('timeGridDay')}>
                                                    Día
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {appointments.data.map((appointment, idx) => (
                            <motion.div
                                key={appointment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <SwipeableAppointmentCard 
                                    appointment={appointment} 
                                    onUpdateStatus={updateStatus} 
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent side="bottom" className="h-[80vh] rounded-t-[20px]">
                        <SheetHeader className="mb-4">
                            <SheetTitle>
                                {selectedDate?.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </SheetTitle>
                            <SheetDescription>
                                {selectedDate && getAppointmentsForDate(selectedDate).length} citas programadas
                            </SheetDescription>
                        </SheetHeader>
                        <div className="overflow-y-auto h-full pb-20 space-y-4">
                            {selectedDate && getAppointmentsForDate(selectedDate).length > 0 ? (
                                getAppointmentsForDate(selectedDate).map((appointment) => (
                                    <SwipeableAppointmentCard 
                                        key={appointment.id}
                                        appointment={appointment} 
                                        onUpdateStatus={updateStatus} 
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <p>No hay citas para este día</p>
                                    <Button 
                                        variant="link" 
                                        className="mt-2"
                                        onClick={() => {
                                            setIsSheetOpen(false);
                                            openCreateDialog(selectedDate?.toISOString());
                                        }}
                                    >
                                        Programar Cita
                                    </Button>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>

                <AlertDialog open={!!appointmentToCancel} onOpenChange={(open) => !open && setAppointmentToCancel(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Cancelar Cita?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción cancelará la cita de {appointmentToCancel?.customer.name} programada para el {appointmentToCancel && new Date(appointmentToCancel.scheduled_at).toLocaleString('es-CR')}. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Volver</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => {
                                    if (appointmentToCancel) {
                                        router.patch(`/business/appointments/${appointmentToCancel.id}/status`, {
                                            status: 'cancelled_by_establishment'
                                        }, {
                                            onSuccess: () => setAppointmentToCancel(null)
                                        });
                                    }
                                }}
                            >
                                Cancelar Cita
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {appointments.data.length === 0 && (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground mb-4">No hay citas registradas</p>
                            <Button onClick={() => openCreateDialog()}>
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Crear Primera Cita
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Nueva Cita</DialogTitle>
                            <DialogDescription>
                                Complete los detalles para agendar una nueva cita.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitCreate} className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="customer_id">Cliente</Label>
                                    <Select
                                        value={data.customer_id}
                                        onValueChange={(value) => setData('customer_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.customer_id && <p className="text-sm text-destructive">{errors.customer_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="professional_id">Profesional</Label>
                                    <Select
                                        value={data.professional_id}
                                        onValueChange={(value) => setData('professional_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar profesional" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {professionals.map((professional) => (
                                                <SelectItem key={professional.id} value={professional.id.toString()}>
                                                    {professional.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.professional_id && <p className="text-sm text-destructive">{errors.professional_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="service_id">Servicio</Label>
                                    <Select
                                        value={data.service_id}
                                        onValueChange={(value) => setData('service_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar servicio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {services.map((service) => (
                                                <SelectItem key={service.id} value={service.id.toString()}>
                                                    {service.name} - {formatCurrency(service.price)} ({service.duration_minutes} min)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.service_id && <p className="text-sm text-destructive">{errors.service_id}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="scheduled_at">Fecha y Hora</Label>
                                    <Input
                                        id="scheduled_at"
                                        type="datetime-local"
                                        value={data.scheduled_at}
                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                    />
                                    {errors.scheduled_at && <p className="text-sm text-destructive">{errors.scheduled_at}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="location_type">Ubicación</Label>
                                    <Select
                                        value={data.location_type}
                                        onValueChange={(value) => setData('location_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar ubicación" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="in_store">En el local</SelectItem>
                                            <SelectItem value="at_home">A domicilio</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.location_type && <p className="text-sm text-destructive">{errors.location_type}</p>}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="customer_notes">Notas (Opcional)</Label>
                                    <Textarea
                                        id="customer_notes"
                                        value={data.customer_notes}
                                        onChange={(e) => setData('customer_notes', e.target.value)}
                                        placeholder="Instrucciones especiales..."
                                    />
                                    {errors.customer_notes && <p className="text-sm text-destructive">{errors.customer_notes}</p>}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Guardando...' : 'Agendar Cita'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
