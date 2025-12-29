import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
    TrendingUp, 
    Users, 
    Calendar, 
    DollarSign, 
    Star, 
    AlertCircle, 
    BarChart3,
    Store,
    UserPlus,
    Package,
    Settings,
    FileText,
    QrCode,
    Camera,
    Search,
    Play,
    CheckCircle2,
    X
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Establishment {
    id: number;
    name: string;
    type: string;
    address: string;
    phone: string;
    rating: number;
}

interface Stats {
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    todayAppointments: number;
    pendingAppointments: number;
    activeStaff: number;
    totalStaff: number;
    rating: number;
    totalReviews: number;
    newClients: number;
    monthExpenses: number;
}

interface StaffMember {
    id: number;
    name: string;
    avatar: string | null;
    appointments: number;
    revenue: number;
    rating: number;
    employment_type: string;
    commission_model: string;
}

interface Activity {
    id: number;
    type: string;
    message: string;
    time: string;
    status: string;
}

interface Product {
    id: number;
    name: string;
    stock: number;
    min: number;
}

interface DailyRevenue {
    date: string;
    amount: number;
}

// Mock Appointment Interface for the list
interface Appointment {
    id: number;
    clientName: string;
    service: string;
    time: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed';
    booking_code: string;
}

interface Props {
    establishment: Establishment;
    stats: Stats;
    topStaff: StaffMember[];
    recentActivity: Activity[];
    lowStockProducts: Product[];
    dailyRevenue: DailyRevenue[];
    maxRevenue: number;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0,
    }).format(amount);
};

const getEmploymentLabel = (type: string) => {
    const labels: Record<string, string> = {
        employee: 'Empleado',
        freelancer: 'Freelancer',
    };
    return labels[type] || type;
};

const getCommissionLabel = (model: string) => {
    const labels: Record<string, string> = {
        percentage: 'Comisión %',
        salary_plus: 'Salario + Comisión',
        booth_rental: 'Alquiler silla',
        fixed_per_service: 'Por servicio',
        salary_only: 'Solo salario',
    };
    return labels[model] || model;
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function BusinessDashboard({ 
    establishment, 
    stats, 
    topStaff, 
    recentActivity, 
    lowStockProducts,
    dailyRevenue,
    maxRevenue
}: Props) {
    const [isStartServiceOpen, setIsStartServiceOpen] = useState(false);
    const [isAppointmentsListOpen, setIsAppointmentsListOpen] = useState(false);
    const [isServiceSummaryOpen, setIsServiceSummaryOpen] = useState(false);
    const [bookingCode, setBookingCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Mock appointments data (replace with real data from props if available)
    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: 1, clientName: 'Juan Pérez', service: 'Corte de Cabello', time: '10:00 AM', status: 'confirmed', booking_code: 'APP-001' },
        { id: 2, clientName: 'María Rodríguez', service: 'Manicure', time: '11:30 AM', status: 'pending', booking_code: 'APP-002' },
        { id: 3, clientName: 'Carlos Ruiz', service: 'Barba', time: '02:00 PM', status: 'confirmed', booking_code: 'APP-003' },
    ]);

    const netProfit = stats.monthRevenue - stats.monthExpenses;
    const profitMargin = stats.monthRevenue > 0 
        ? ((netProfit / stats.monthRevenue) * 100).toFixed(1) 
        : 0;

    const startScan = async () => {
        setIsScanning(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera", err);
            setIsScanning(false);
            alert("No se pudo acceder a la cámara. Por favor verifique los permisos.");
        }
    };

    const stopScan = () => {
        setIsScanning(false);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        return () => {
            stopScan();
        };
    }, []);

    const handleStartService = (code: string) => {
        const appointment = appointments.find(a => a.booking_code === code);
        
        if (appointment) {
            setSelectedAppointment(appointment);
            setIsStartServiceOpen(false);
            setBookingCode('');
            stopScan();
            setIsServiceSummaryOpen(true);
        } else {
            // In a real app, you might want to show a toast notification here
            alert("Cita no encontrada con ese código.");
        }
    };

    const confirmStartService = () => {
        if (!selectedAppointment) return;

        // Optimistic update
        setAppointments(appointments.map(app => 
            app.id === selectedAppointment.id 
                ? { ...app, status: 'completed' } 
                : app
        ));

        // API Call
        router.patch(route('business.appointments.update-status', selectedAppointment.id), {
            status: 'completed'
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Success handling if needed
            }
        });

        setIsServiceSummaryOpen(false);
        setSelectedAppointment(null);
    };

    const openStartServiceModal = (appointment?: Appointment) => {
        if (appointment) {
            setBookingCode(appointment.booking_code);
            setSelectedAppointment(appointment);
        } else {
            setBookingCode('');
            setSelectedAppointment(null);
        }
        setIsStartServiceOpen(true);
    };

    return (
        <AppLayout>
            <Head title={`Dashboard - ${establishment.name}`} />
            
            <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
                <div className="p-4 space-y-6">
                    {/* Header Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                                    <Store className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                        {establishment.name}
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        {establishment.address}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="relative hidden md:block">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Código de cita..." 
                                        className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48"
                                        value={bookingCode}
                                        onChange={(e) => setBookingCode(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && bookingCode) {
                                                handleStartService(bookingCode);
                                            }
                                        }}
                                    />
                                </div>
                                <Button 
                                    onClick={() => openStartServiceModal()}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Iniciar Servicio
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <motion.div variants={item} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <DollarSign className="w-16 h-16 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                            +12% vs ayer
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos hoy</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {formatCurrency(stats.todayRevenue)}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                        Semana: {formatCurrency(stats.weekRevenue)}
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div 
                                variants={item} 
                                whileHover={{ y: -5 }} 
                                onClick={() => setIsAppointmentsListOpen(true)}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden group cursor-pointer ring-2 ring-transparent hover:ring-blue-500/20 transition-all"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Calendar className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                                            {stats.pendingAppointments} pendientes
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Citas hoy</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stats.todayAppointments}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium flex items-center gap-1">
                                        Ver lista completa <Search className="w-3 h-3" />
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div variants={item} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Personal activo</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stats.activeStaff}
                                        <span className="text-sm font-normal text-gray-400 ml-2">
                                            / {stats.totalStaff}
                                        </span>
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div variants={item} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Star className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                            <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                                            {stats.totalReviews} reseñas
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Calificación</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.rating}
                                        </p>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    className={`w-4 h-4 ${i < Math.floor(stats.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Alertas de pérdidas */}
                        {netProfit < 0 && (
                            <motion.div variants={item} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                                            ⚠️ Pérdida este mes
                                        </h3>
                                        <p className="text-sm text-red-800 dark:text-red-400">
                                            Los gastos ({formatCurrency(stats.monthExpenses)}) superan los ingresos ({formatCurrency(stats.monthRevenue)}). 
                                            Pérdida neta: <strong>{formatCurrency(Math.abs(netProfit))}</strong>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {lowStockProducts.length > 0 && (
                            <motion.div variants={item} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-1">
                                            Productos con stock bajo
                                        </h3>
                                        <ul className="text-sm text-orange-800 dark:text-orange-400 space-y-1">
                                            {lowStockProducts.map(product => (
                                                <li key={product.id}>
                                                    {product.name} - {product.stock} unidades (mínimo: {product.min})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button className="text-sm font-medium text-orange-700 dark:text-orange-300 hover:underline">
                                        Reabastecer
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Personal destacado */}
                            <motion.div variants={item} className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Top Performers
                                        </h2>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {topStaff.length > 0 ? (
                                        topStaff.map((staff, index) => (
                                            <motion.div 
                                                key={staff.id} 
                                                whileHover={{ x: 5 }}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 transition-colors hover:bg-white dark:hover:bg-gray-700 hover:shadow-md"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold shadow-lg ${
                                                        index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                                                        index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400' :
                                                        'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                                    }`}>
                                                        #{index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            {staff.name}
                                                        </h3>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {staff.appointments} citas
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                                {staff.rating}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(staff.revenue)}
                                                    </p>
                                                    <div className="flex gap-2 justify-end mt-1">
                                                        <span className="text-[10px] px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300">
                                                            {getEmploymentLabel(staff.employment_type)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                            No hay datos de personal este mes
                                        </div>
                                    )}
                                </div>

                                {/* Gráfica de ingresos diarios */}
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-gray-400" />
                                            Ingresos últimos 7 días
                                        </h3>
                                    </div>
                                    <div className="h-48 flex items-end justify-around gap-3 px-2">
                                        {dailyRevenue.map((day, i) => {
                                            const heightPercent = maxRevenue > 0 
                                                ? (day.amount / maxRevenue) * 100 
                                                : 0;
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                    <div className="relative w-full flex-1 flex items-end">
                                                        <motion.div 
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${Math.max(heightPercent, 5)}%` }}
                                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                                            className="w-full bg-blue-500/80 dark:bg-blue-600/80 rounded-t-lg group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors relative"
                                                        >
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                                                {formatCurrency(day.amount)}
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {day.date}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Actividad reciente */}
                                <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-5 bg-blue-500 rounded-full"></div>
                                        Actividad reciente
                                    </h2>

                                    <div className="space-y-0 relative">
                                        {/* Linea conectora vertical */}
                                        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

                                        {recentActivity.length > 0 ? (
                                            recentActivity.map((activity) => {
                                                const statusColors: Record<string, string> = {
                                                    pending: 'bg-yellow-500 ring-yellow-100 dark:ring-yellow-900',
                                                    confirmed: 'bg-blue-500 ring-blue-100 dark:ring-blue-900',
                                                    completed: 'bg-green-500 ring-green-100 dark:ring-green-900',
                                                    cancelled_by_customer: 'bg-red-500 ring-red-100 dark:ring-red-900',
                                                    cancelled_by_establishment: 'bg-red-500 ring-red-100 dark:ring-red-900',
                                                };
                                                return (
                                                    <div key={activity.id} className="flex gap-4 relative py-3 group">
                                                        <div className={`w-5 h-5 mt-1 rounded-full flex-shrink-0 ring-4 ${statusColors[activity.status] || 'bg-gray-500 ring-gray-100'} z-10 transition-transform group-hover:scale-110`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                {activity.message}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                                                                {activity.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                                No hay actividad reciente
                                            </p>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Resumen rápido */}
                                <motion.div variants={item} className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-lg p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <BarChart3 className="w-32 h-32" />
                                    </div>
                                    <h2 className="text-lg font-bold mb-6 relative z-10">
                                        Resumen del Mes
                                    </h2>
                                    
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">
                                                Ingresos
                                            </span>
                                            <span className="text-lg font-semibold text-green-400">
                                                {formatCurrency(stats.monthRevenue)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">
                                                Gastos
                                            </span>
                                            <span className="text-lg font-semibold text-red-400">
                                                {formatCurrency(stats.monthExpenses)}
                                            </span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold">
                                                    Ganancia neta
                                                </span>
                                                <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
                                                    {formatCurrency(netProfit)}
                                                </span>
                                            </div>
                                            <div className="flex justify-end mt-1">
                                                <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300">
                                                    Margen: {profitMargin}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-sm text-gray-400">
                                                Clientes nuevos
                                            </span>
                                            <span className="text-lg font-semibold text-blue-400">
                                                +{stats.newClients}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Acciones rápidas */}
                                <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                        Acciones rápidas
                                    </h2>
                                    <div className="space-y-2">
                                        {[
                                            { icon: UserPlus, label: 'Agregar empleado', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                                            { icon: Package, label: 'Ver inventario', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                                            { icon: Settings, label: 'Configurar servicios', color: 'text-gray-600', bg: 'bg-gray-50 dark:bg-gray-700/50' },
                                            { icon: FileText, label: 'Generar reporte', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                                        ].map((action, i) => (
                                            <motion.button 
                                                key={i}
                                                whileHover={{ x: 5 }}
                                                className="w-full py-3 px-4 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600 flex items-center gap-3 group"
                                            >
                                                <div className={`p-2 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                                                    <action.icon className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium">{action.label}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Start Service Modal */}
                <Dialog open={isStartServiceOpen} onOpenChange={setIsStartServiceOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Iniciar Servicio</DialogTitle>
                            <DialogDescription>
                                Ingrese el código de la cita o escanee el código QR del cliente.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                            {isScanning ? (
                                <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        playsInline 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 border-2 border-blue-500/50 m-8 rounded-lg animate-pulse"></div>
                                    <Button 
                                        variant="secondary" 
                                        size="sm" 
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2"
                                        onClick={stopScan}
                                    >
                                        Detener Escaneo
                                    </Button>
                                </div>
                            ) : (
                                <div 
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    onClick={startScan}
                                >
                                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <QrCode className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-medium text-gray-900 dark:text-white">Escanear QR</p>
                                        <p className="text-sm text-gray-500">Click para activar cámara</p>
                                    </div>
                                </div>
                            )}

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        O ingresar código
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="booking_code">Código de Cita</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        id="booking_code" 
                                        placeholder="Ej. APP-123" 
                                        value={bookingCode}
                                        onChange={(e) => setBookingCode(e.target.value)}
                                        className="uppercase"
                                    />
                                    <Button onClick={() => handleStartService(bookingCode)} disabled={!bookingCode}>
                                        <Play className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Service Summary Modal */}
                <Dialog open={isServiceSummaryOpen} onOpenChange={setIsServiceSummaryOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Resumen del Servicio</DialogTitle>
                            <DialogDescription>
                                Confirme los detalles para iniciar el servicio.
                            </DialogDescription>
                        </DialogHeader>
                        
                        {selectedAppointment && (
                            <div className="space-y-6 py-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                            {selectedAppointment.clientName}
                                        </h4>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Servicio</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {selectedAppointment.service}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Hora</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {selectedAppointment.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Al iniciar, el servicio se marcará como completado.</span>
                                </div>
                            </div>
                        )}
                        
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsServiceSummaryOpen(false)}>
                                Cancelar
                            </Button>
                            <Button 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={confirmStartService}
                            >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Confirmar e Iniciar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Today's Appointments List Modal */}
                <Dialog open={isAppointmentsListOpen} onOpenChange={setIsAppointmentsListOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Citas de Hoy</DialogTitle>
                            <DialogDescription>
                                Lista de citas programadas para el día de hoy.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                            {appointments.map((appointment) => (
                                <div 
                                    key={appointment.id} 
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-10 rounded-full ${
                                            appointment.status === 'completed' ? 'bg-green-500' :
                                            appointment.status === 'confirmed' ? 'bg-blue-500' : 
                                            appointment.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                                        }`}></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {appointment.clientName}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {appointment.service} • {appointment.time}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            Ver
                                        </Button>
                                        {appointment.status !== 'completed' && (
                                            <Button 
                                                size="sm" 
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                onClick={() => {
                                                    setIsAppointmentsListOpen(false);
                                                    openStartServiceModal(appointment);
                                                }}
                                            >
                                                <Play className="w-3 h-3 mr-1" />
                                                Iniciar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAppointmentsListOpen(false)}>
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
