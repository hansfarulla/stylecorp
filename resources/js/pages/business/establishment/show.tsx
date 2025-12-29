import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Mail, Globe, Clock, DollarSign, Edit, Trash2, Map } from 'lucide-react';

interface Establishment {
    id: number;
    name: string;
    business_name?: string;
    tax_id?: string;
    type: string;
    address: string;
    province: string;
    canton: string;
    district: string;
    latitude?: number;
    longitude?: number;
    phone: string;
    email?: string;
    whatsapp?: string;
    website?: string;
    status: string;
    business_hours?: string;
    accepts_walk_ins: boolean;
    offers_home_service: boolean;
    min_booking_hours: number;
    cancellation_hours: number;
    cancellation_fee: number;
    no_show_fee: number;
    payment_flow: string;
    payment_methods?: string;
    rating: number;
    total_reviews: number;
    total_bookings: number;
}

const typeLabels: Record<string, string> = {
    barbershop: 'Barbería',
    salon: 'Salón',
    spa: 'Spa',
    mixed: 'Mixto',
};

const paymentFlowLabels: Record<string, string> = {
    centralized: 'Centralizado',
    decentralized: 'Descentralizado',
    mixed: 'Mixto',
};

export default function EstablishmentShow({ establishment }: { establishment: Establishment }) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que deseas eliminar este establecimiento?')) {
            router.delete(`/business/establishment/${establishment.id}`);
        }
    };

    let businessHours: Record<string, string[]> = {};
    try {
        if (establishment.business_hours) {
            businessHours = JSON.parse(establishment.business_hours);
        }
    } catch (e) {
        // ignore
    }

    const dayLabels: Record<string, string> = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
    };

    return (
        <AppLayout>
            <Head title={establishment.name} />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">{establishment.name}</h1>
                        {establishment.business_name && (
                            <p className="text-muted-foreground">{establishment.business_name}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/business/establishment/${establishment.id}/edit`}>
                            <Button>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Información General
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Tipo</p>
                                <Badge variant="outline">{typeLabels[establishment.type]}</Badge>
                            </div>
                            
                            {establishment.tax_id && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Cédula Jurídica</p>
                                    <p className="font-medium">{establishment.tax_id}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-muted-foreground">Estado</p>
                                <Badge variant={establishment.status === 'active' ? 'default' : 'secondary'}>
                                    {establishment.status === 'active' ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Calificación</p>
                                <p className="font-medium">⭐ {establishment.rating} ({establishment.total_reviews} reseñas)</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Reservas Totales</p>
                                <p className="font-medium">{establishment.total_bookings}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Ubicación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Dirección</p>
                                <p className="font-medium">{establishment.address}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Distrito</p>
                                    <p className="font-medium">{establishment.district}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Cantón</p>
                                    <p className="font-medium">{establishment.canton}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Provincia</p>
                                    <p className="font-medium">{establishment.province}</p>
                                </div>
                            </div>
                            {establishment.latitude && establishment.longitude && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">Coordenadas GPS</p>
                                    <p className="font-medium text-sm">📍 {establishment.latitude.toFixed(6)}, {establishment.longitude.toFixed(6)}</p>
                                    <a 
                                        href={`https://www.google.com/maps?q=${establishment.latitude},${establishment.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                                    >
                                        <Map className="h-4 w-4" />
                                        Ver en Google Maps
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Contacto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Teléfono</p>
                                <p className="font-medium">{establishment.phone}</p>
                            </div>
                            
                            {establishment.whatsapp && (
                                <div>
                                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                                    <p className="font-medium">{establishment.whatsapp}</p>
                                </div>
                            )}

                            {establishment.email && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{establishment.email}</p>
                                </div>
                            )}

                            {establishment.website && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Sitio Web</p>
                                    <a href={establishment.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {establishment.website}
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Horarios y Políticas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {Object.keys(businessHours).length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Horario de Atención</p>
                                    <div className="space-y-1">
                                        {Object.entries(dayLabels).map(([day, label]) => {
                                            const hours = businessHours[day];
                                            const isClosed = !hours || hours === null;
                                            return (
                                                <div key={day} className="flex justify-between text-sm">
                                                    <span>{label}</span>
                                                    {isClosed ? (
                                                        <span className="text-muted-foreground italic">Cerrado</span>
                                                    ) : (
                                                        <span className="font-medium">{hours[0]} - {hours[1]}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-muted-foreground">Acepta Walk-ins</p>
                                <p className="font-medium">{establishment.accepts_walk_ins ? 'Sí' : 'No'}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Servicio a Domicilio</p>
                                <p className="font-medium">{establishment.offers_home_service ? 'Sí' : 'No'}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Horas Mínimas para Reservar</p>
                                <p className="font-medium">{establishment.min_booking_hours} horas</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Cancelación sin Cargo</p>
                                <p className="font-medium">{establishment.cancellation_hours} horas antes</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Pagos y Cargos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">Flujo de Pago</p>
                                <Badge variant="outline">{paymentFlowLabels[establishment.payment_flow]}</Badge>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Cargo por Cancelación Tardía</p>
                                <p className="font-medium">{formatCurrency(establishment.cancellation_fee)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Cargo por No Asistir</p>
                                <p className="font-medium">{formatCurrency(establishment.no_show_fee)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex gap-2">
                    <Link href="/business/establishment">
                        <Button variant="outline">Volver a Lista</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
