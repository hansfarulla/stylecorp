import { Head } from '@inertiajs/react';
import { Calendar, Heart, MapPin, Clock, TrendingUp, Star, User } from 'lucide-react';

export default function CustomerDashboard() {
    // Datos de ejemplo
    const upcomingAppointments = [
        {
            id: 1,
            shop: 'Urban Style Barbería',
            service: 'Corte + Barba',
            barber: 'Luis Martínez',
            date: '2025-12-28',
            time: '14:00',
            location: 'San José Centro',
        },
        {
            id: 2,
            shop: 'Classic Cuts',
            service: 'Corte Clásico',
            barber: 'Miguel Torres',
            date: '2026-01-05',
            time: '10:30',
            location: 'Escazú',
        }
    ];

    const favorites = [
        { id: 1, name: 'Luis Martínez', shop: 'Urban Style', rating: 4.9, image: 'https://ui-avatars.com/api/?name=Luis+Martinez' },
        { id: 2, name: 'Miguel Torres', shop: 'Classic Cuts', rating: 4.8, image: 'https://ui-avatars.com/api/?name=Miguel+Torres' },
        { id: 3, name: 'Urban Style Barbería', type: 'shop', rating: 4.9, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200' },
    ];

    const recentVisits = [
        { id: 1, shop: 'Urban Style', service: 'Corte Fade', date: '2025-12-20', rating: 5 },
        { id: 2, shop: 'Classic Cuts', service: 'Barba', date: '2025-12-10', rating: 4 },
    ];

    const nearbyShops = [
        { id: 1, name: 'The Barber Shop', distance: '0.3 km', rating: 4.6, nextAvailable: 'Hoy 16:00' },
        { id: 2, name: 'Estilo Latino', distance: '0.8 km', rating: 4.8, nextAvailable: 'Mañana 09:00' },
    ];

    return (
        <>
            <Head title="Mi Dashboard" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mi Dashboard</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Bienvenido de vuelta</p>
                            </div>
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <User className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna principal */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Próximas citas */}
                            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-gray-900 dark:text-white" />
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Próximas citas</h2>
                                    </div>
                                    <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                        Ver todas
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {upcomingAppointments.map((appointment) => (
                                        <div key={appointment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">{appointment.shop}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{appointment.service}</p>
                                                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            <span>{appointment.barber}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{appointment.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{appointment.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {new Date(appointment.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}
                                                    </div>
                                                    <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                                        Gestionar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="mt-4 w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100">
                                    Agendar nueva cita
                                </button>
                            </section>

                            {/* Explorar cercanos */}
                            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-gray-900 dark:text-white" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cerca de ti</h2>
                                </div>

                                <div className="space-y-3">
                                    {nearbyShops.map((shop) => (
                                        <div key={shop.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{shop.name}</h3>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>{shop.distance}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        <span>{shop.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                    Disponible
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                                    {shop.nextAvailable}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Historial reciente */}
                            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Visitas recientes</h2>
                                </div>

                                <div className="space-y-3">
                                    {recentVisits.map((visit) => (
                                        <div key={visit.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">{visit.shop}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{visit.service}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < visit.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                                    ))}
                                                </div>
                                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                    {new Date(visit.date).toLocaleDateString('es-CR')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Barra lateral */}
                        <div className="space-y-6">
                            {/* Favoritos */}
                            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Favoritos</h2>
                                </div>

                                <div className="space-y-3">
                                    {favorites.map((favorite) => (
                                        <div key={favorite.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                            <img 
                                                src={favorite.image} 
                                                alt={favorite.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                                    {favorite.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {favorite.shop && (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">{favorite.shop}</p>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-xs text-gray-900 dark:text-white">{favorite.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Stats rápidas */}
                            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Estadísticas</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Visitas este mes</span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">3</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Total de visitas</span>
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">24</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Puntos acumulados</span>
                                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">180</span>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
