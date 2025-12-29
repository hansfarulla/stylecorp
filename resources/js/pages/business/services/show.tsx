import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Clock, DollarSign, User, MapPin, Globe } from 'lucide-react';
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

interface Service {
    id: number;
    name: string;
    description?: string;
    category: string;
    base_price: number;
    duration_minutes: number;
    is_active: boolean;
    available_online: boolean;
    available_home_service: boolean;
    home_service_surcharge?: number;
    home_service_radius_km?: number;
    home_service_latitude?: number;
    home_service_longitude?: number;
    delivery_tiers?: { from_km: number; to_km: number; fee: number }[];
    professionals?: {
        id: number;
        name: string;
    }[];
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

export default function ServicesShow({ service }: { service: Service }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = () => {
        router.delete(`/business/services/${service.id}`);
    };

    return (
        <AppLayout>
            <Head title={service.name} />

            <div className="max-w-3xl mx-auto space-y-6 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/business/services">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{service.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline">{categoryLabels[service.category]}</Badge>
                                <Badge variant={service.is_active ? 'default' : 'secondary'}>
                                    {service.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/business/services/${service.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    Eliminar
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. El servicio dejará de estar disponible para nuevas citas.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                        Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Información General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {service.description && (
                                <div>
                                    <h3 className="font-semibold mb-1">Descripción</h3>
                                    <p className="text-muted-foreground">{service.description}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Duración</p>
                                        <p className="font-medium">{service.duration_minutes} minutos</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                    <DollarSign className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Precio Base</p>
                                        <p className="font-medium">{formatCurrency(service.base_price)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Globe className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Reservas Online</p>
                                        <p className="text-xs text-muted-foreground">Visible en la app</p>
                                    </div>
                                </div>
                                <Badge variant={service.available_online ? 'success' : 'secondary'}>
                                    {service.available_online ? 'Sí' : 'No'}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">A Domicilio</p>
                                        <p className="text-xs text-muted-foreground">Servicio móvil</p>
                                    </div>
                                </div>
                                <Badge variant={service.available_home_service ? 'success' : 'secondary'}>
                                    {service.available_home_service ? 'Sí' : 'No'}
                                </Badge>
                            </div>

                            {service.available_home_service && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                        <span className="text-sm">Recargo por domicilio</span>
                                        <span className="font-medium">{formatCurrency(service.home_service_surcharge || 0)}</span>
                                    </div>
                                    {service.home_service_radius_km && (
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                            <span className="text-sm">Radio de cobertura</span>
                                            <span className="font-medium">{service.home_service_radius_km} km</span>
                                        </div>
                                    )}
                                    {service.home_service_latitude && service.home_service_longitude && (
                                        <div className="p-3 rounded-lg bg-muted/30">
                                            <p className="text-sm mb-1">Centro de cobertura</p>
                                            <p className="text-xs text-muted-foreground">
                                                {service.home_service_latitude.toFixed(6)}, {service.home_service_longitude.toFixed(6)}
                                            </p>
                                        </div>
                                    )}
                                    {service.delivery_tiers && service.delivery_tiers.length > 0 && (
                                        <div className="p-3 rounded-lg bg-muted/30 space-y-2">
                                            <p className="text-sm font-medium">Tarifas por Distancia</p>
                                            <div className="space-y-1">
                                                {service.delivery_tiers.map((tier, index) => (
                                                    <div key={index} className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">{tier.from_km} - {tier.to_km} km</span>
                                                        <span>{formatCurrency(tier.fee)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Asignación</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Profesionales Asignados</p>
                                    {service.professionals && service.professionals.length > 0 ? (
                                        <ul className="space-y-1">
                                            {service.professionals.map(professional => (
                                                <li key={professional.id} className="font-medium">
                                                    {professional.name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="font-medium">Cualquiera disponible</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
