import { Head } from '@inertiajs/react';
import { Calendar, DollarSign, TrendingUp, Clock, Star, Users, Award } from 'lucide-react';

export default function ProfessionalDashboard() {
    const todayAppointments = [
        { id: 1, client: 'Juan Pérez', service: 'Corte + Barba', time: '14:00', price: 15000, status: 'confirmed' },
        { id: 2, client: 'Carlos Mora', service: 'Corte Fade', time: '15:30', price: 10000, status: 'confirmed' },
        { id: 3, client: 'Luis Castro', service: 'Diseño Barba', time: '17:00', price: 8000, status: 'pending' },
    ];

    const stats = {
        todayEarnings: 45000,
        weekEarnings: 180000,
        monthEarnings: 720000,
        todayAppointments: 3,
        weekAppointments: 18,
        rating: 4.9,
        reviews: 156,
    };

    const recentReviews = [
        { id: 1, client: 'Juan Pérez', rating: 5, comment: 'Excelente servicio, muy profesional', date: '2025-12-25' },
        { id: 2, client: 'María González', rating: 5, comment: 'Siempre impecable', date: '2025-12-24' },
    ];

    return (
        <>
            <Head title="Dashboard Profesional" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Profesional</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {new Date().toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Hoy</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        ₡{stats.todayEarnings.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Esta semana</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        ₡{stats.weekEarnings.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Citas hoy</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {stats.todayAppointments}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Calificación</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rating}</p>
                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    </div>
                                </div>
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Agenda del día */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-gray-900 dark:text-white" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Agenda de hoy</h2>
                                </div>
                                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    Ver calendario
                                </button>
                            </div>

                            <div className="space-y-3">
                                {todayAppointments.map((apt) => (
                                    <div key={apt.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {apt.time.split(':')[0]}
                                                </span>
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {apt.time.split(':')[1]}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{apt.client}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{apt.service}</p>
                                                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${
                                                    apt.status === 'confirmed' 
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                                }`}>
                                                    {apt.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                ₡{apt.price.toLocaleString()}
                                            </p>
                                            <button className="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                                Gestionar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {todayAppointments.length === 0 && (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>No tienes citas programadas para hoy</p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Reseñas recientes */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reseñas recientes</h2>
                                </div>

                                <div className="space-y-4">
                                    {recentReviews.map((review) => (
                                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm text-gray-900 dark:text-white">{review.client}</span>
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                                            <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
                                                {new Date(review.date).toLocaleDateString('es-CR')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resumen del mes */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Este mes</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Ingresos totales</span>
                                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                            ₡{stats.monthEarnings.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total clientes</span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">48</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Nuevos seguidores</span>
                                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">+12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
