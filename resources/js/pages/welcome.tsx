import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { MapPin, Star, Clock, ChevronRight, Search, Filter, TrendingUp, Package, Map } from 'lucide-react';
import { lazy, Suspense } from 'react';

const ShopMap = lazy(() => import('@/components/ShopMap'));

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    // Datos de ejemplo
    const featuredShops = [
        {
            id: 1,
            name: 'Urban Style Barbería',
            image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop',
            rating: 4.9,
            reviews: 324,
            distance: '0.5 km',
            nextAvailable: '15 min',
            specialty: 'Cortes modernos'
        },
        {
            id: 2,
            name: 'Classic Cuts',
            image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop',
            rating: 4.8,
            reviews: 256,
            distance: '1.2 km',
            nextAvailable: '30 min',
            specialty: 'Barbería clásica'
        },
        {
            id: 3,
            name: 'Elite Salon',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop',
            rating: 4.7,
            reviews: 189,
            distance: '2.1 km',
            nextAvailable: '1 hora',
            specialty: 'Coloración y diseño'
        }
    ];

    const nearbyShops = [
        { id: 4, name: 'The Barber Shop', distance: '0.3 km', rating: 4.6, price: '8,000', openNow: true },
        { id: 5, name: 'Estilo Latino', distance: '0.8 km', rating: 4.8, price: '10,000', openNow: true },
        { id: 6, name: 'Modern Cuts Studio', distance: '1.5 km', rating: 4.5, price: '12,000', openNow: false }
    ];

    const promotions = [
        {
            id: 1,
            shop: 'Urban Style',
            product: 'Pomada Matt Finish',
            originalPrice: '15,000',
            discountPrice: '10,500',
            discount: '30',
            image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&auto=format&fit=crop'
        },
        {
            id: 2,
            shop: 'Elite Salon',
            product: 'Kit de Cuidado Barba',
            originalPrice: '25,000',
            discountPrice: '18,000',
            discount: '28',
            image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&auto=format&fit=crop'
        }
    ];

    return (
        <>
            <Head title="StyleCore - Tu barbería ideal" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">StyleCore</h1>
                            <div className="flex items-center gap-2">
                                {auth.user ? (
                                    <Link href={dashboard()} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link href={login()} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
                                            Iniciar sesión
                                        </Link>
                                        {canRegister && (
                                            <Link href={register()} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100">
                                                Registrarse
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="Buscar barberías, servicios..." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 text-gray-900 dark:text-white" />
                            </div>
                            <button className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto px-4 py-6 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-gray-900 dark:text-white" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mejor puntuadas</h2>
                            </div>
                            <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                                Ver todas
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {featuredShops.map((shop) => (
                                <div key={shop.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative h-48">
                                        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg flex items-center gap-1 text-sm font-medium">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-gray-900 dark:text-white">{shop.rating}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{shop.specialty}</p>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                <span>{shop.distance}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span>{shop.nextAvailable}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-500">
                                            {shop.reviews} reseñas
                                        </div>
                                        <button className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 font-medium">
                                            Reservar ahora
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="relative bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden p-8 md:p-12">
                            <div className="relative z-10 max-w-lg">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    Primera cita con 20% de descuento
                                </h2>
                                <p className="text-gray-300 mb-6">
                                    Únete a StyleCore y disfruta de tu primera experiencia con beneficios exclusivos
                                </p>
                                <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100">
                                    Conocer más
                                </button>
                            </div>
                            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10">
                                <div className="w-full h-full bg-gradient-to-l from-white to-transparent"></div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Map className="w-5 h-5 text-gray-900 dark:text-white" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Mapa de establecimientos</h2>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm" style={{ height: '500px' }}>
                            <Suspense fallback={
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
                                        <p className="text-gray-600 dark:text-gray-300">Cargando mapa...</p>
                                    </div>
                                </div>
                            }>
                                <ShopMap />
                            </Suspense>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-900 dark:text-white" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cerca de ti</h2>
                            </div>
                            <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                                Ver todas
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {nearbyShops.map((shop) => (
                                <div key={shop.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{shop.name}</h3>
                                                {shop.openNow && (
                                                    <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                                                        Abierto
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{shop.distance}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-gray-900 dark:text-white font-medium">{shop.rating}</span>
                                                </div>
                                                <span>Desde ₡{shop.price}</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-gray-900 dark:text-white" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Productos en promoción</h2>
                            </div>
                            <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                                Ver todas
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {promotions.map((promo) => (
                                <div key={promo.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex">
                                        <div className="w-32 h-32 flex-shrink-0">
                                            <img src={promo.image} alt={promo.product} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{promo.shop}</div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{promo.product}</h3>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-gray-900 dark:text-white">₡{promo.discountPrice}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">₡{promo.originalPrice}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded font-medium">
                                                    {promo.discount}% OFF
                                                </span>
                                                <button className="text-sm text-gray-900 dark:text-white font-medium hover:underline">
                                                    Ver más
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            <p>2025 StyleCore. Tu plataforma de confianza para servicios de barbería.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
