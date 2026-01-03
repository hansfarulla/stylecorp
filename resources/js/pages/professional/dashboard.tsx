import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, TrendingUp, Clock, Star, Users, Award, Eye, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowingBadge } from '@/components/ui/glowing-badge';

interface Appointment {
    id: number;
    booking_code: string;
    client: string;
    service: string;
    time: string;
    price: number;
    status: string;
    location_type: string;
}

interface Review {
    id: number;
    client: string;
    rating: number;
    comment: string;
    date: string;
}

interface Stats {
    todayEarnings: number;
    weekEarnings: number;
    monthEarnings: number;
    todayAppointments: number;
    weekAppointments: number;
    rating: number;
    reviews: number;
}

interface Props {
    stats: Stats;
    todayAppointments: Appointment[];
    upcomingAppointments?: Appointment[];
    recentReviews: Review[];
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

const badgeVariants: Record<string, "default" | "success" | "warning" | "error"> = {
    pending: 'warning',
    confirmed: 'success',
    in_progress: 'default',
    completed: 'success',
    cancelled_by_customer: 'error',
    cancelled_by_establishment: 'error',
    no_show: 'error',
};

export default function ProfessionalDashboard({ stats, todayAppointments, upcomingAppointments = [], recentReviews }: Props) {
    return (
        <AppLayout>
            <Head title="Dashboard Profesional" />
            
            <div className="space-y-6 p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Dashboard Profesional
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {new Date().toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Hoy</CardTitle>
                                <DollarSign className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(stats.todayEarnings)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stats.todayAppointments} {stats.todayAppointments === 1 ? 'cita' : 'citas'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Esta Semana</CardTitle>
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(stats.weekEarnings)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stats.weekAppointments} {stats.weekAppointments === 1 ? 'cita' : 'citas'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Este Mes</CardTitle>
                                <Calendar className="h-4 w-4 text-purple-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(stats.monthEarnings)}
                                </div>
                                <Link href="/professional/earnings" className="text-xs text-primary hover:underline mt-1 inline-block">
                                    Ver detalles
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="hover:shadow-xl transition-all duration-300 border-primary/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Calificación</CardTitle>
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    {stats.rating.toFixed(1)}
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stats.reviews} {stats.reviews === 1 ? 'reseña' : 'reseñas'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Agenda del día */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-primary/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Agenda de Hoy
                                    </CardTitle>
                                    <Link href="/professional/appointments">
                                        <Button variant="outline" size="sm">
                                            Ver todas
                                            <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {todayAppointments.length > 0 ? (
                                    todayAppointments.map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                                                    <span className="text-xs text-muted-foreground">
                                                        {apt.time.split(':')[0]}
                                                    </span>
                                                    <span className="text-lg font-bold">
                                                        {apt.time.split(':')[1]}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{apt.client}</h3>
                                                    <p className="text-sm text-muted-foreground">{apt.service}</p>
                                                    <GlowingBadge variant={badgeVariants[apt.status]} className="mt-1">
                                                        {statusLabels[apt.status]}
                                                    </GlowingBadge>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold">
                                                    {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(apt.price)}
                                                </p>
                                                <Link href={`/professional/appointments/${apt.id}`}>
                                                    <Button variant="ghost" size="sm" className="mt-1">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Ver
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No tienes citas programadas para hoy</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Reseñas recientes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    Reseñas Recientes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentReviews.length > 0 ? (
                                    recentReviews.map((review) => (
                                        <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">{review.client}</span>
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${
                                                                i < review.rating
                                                                    ? 'text-yellow-500 fill-yellow-500'
                                                                    : 'text-muted'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(review.date).toLocaleDateString('es-CR')}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Aún no tienes reseñas</p>
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
