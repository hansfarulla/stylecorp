import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlowingBadge } from '@/components/ui/glowing-badge';
import { Plus, Edit, Eye, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Service {
    id: number;
    name: string;
    description?: string;
    category: string;
    base_price: number;
    duration_minutes: number;
    professional?: {
        name: string;
    };
    is_active: boolean;
}

const categoryLabels: Record<string, string> = {
    cut: 'Corte',
    beard: 'Barba',
    coloring: 'Coloración',
    styling: 'Peinado',
    treatment: 'Tratamiento',
    waxing: 'Depilación',
    facial: 'Facial',
    massage: 'Masaje',
    nails: 'Uñas',
    makeup: 'Maquillaje',
    other: 'Otro',
};

export default function ServicesIndex({ services }: { services: Service[] }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const groupedServices = services.reduce((acc, service) => {
        if (!acc[service.category]) {
            acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    return (
        <AppLayout>
            <Head title="Servicios" />
            
            <div className="space-y-6 p-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center"
                >
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Servicios</h1>
                    <Link href="/business/services/create">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="shadow-lg hover:shadow-xl transition-all">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Servicio
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {Object.entries(groupedServices).map(([category, categoryServices]) => (
                    <div key={category} className="space-y-4">
                        <h2 className="text-xl font-semibold">{categoryLabels[category]}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryServices.map((service, idx) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="h-full"
                                >
                                <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 overflow-hidden relative group">
                                    {/* Efecto de brillo en hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{service.name}</CardTitle>
                                            <GlowingBadge variant={service.is_active ? 'success' : 'secondary'}>
                                                {service.is_active ? 'Activo' : 'Inactivo'}
                                            </GlowingBadge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {service.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {service.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{service.duration_minutes} minutos</span>
                                        </div>

                                        <div>
                                            <p className="text-2xl font-bold">{formatCurrency(service.base_price)}</p>
                                        </div>

                                        {service.professional && (
                                            <div>
                                                <p className="text-sm text-muted-foreground">Profesional</p>
                                                <p className="text-sm font-medium">{service.professional.name}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-4 border-t border-border/50">
                                            <Link href={`/business/services/${service.id}`} className="flex-1">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                                                    <Button variant="outline" size="sm" className="w-full transition-all hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Ver
                                                    </Button>
                                                </motion.div>
                                            </Link>
                                            <Link href={`/business/services/${service.id}/edit`} className="flex-1">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                                                    <Button variant="outline" size="sm" className="w-full transition-all hover:bg-primary/10 hover:border-primary/50">
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </Button>
                                                </motion.div>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground mb-4">No hay servicios registrados</p>
                            <Link href="/business/services/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Primer Servicio
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
