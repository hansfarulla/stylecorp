import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationPicker from '@/components/LocationPicker';
import { LocationSelector } from '@/components/LocationSelector';
import { FormEventHandler, useState } from 'react';

interface CreateEstablishmentForm {
    name: string;
    business_name: string;
    type: string;
    address: string;
    province: string;
    canton: string;
    district: string;
    latitude: number | null;
    longitude: number | null;
    phone: string;
    email: string;
    whatsapp: string;
    website: string;
    business_hours: {
        monday: [string, string] | null;
        tuesday: [string, string] | null;
        wednesday: [string, string] | null;
        thursday: [string, string] | null;
        friday: [string, string] | null;
        saturday: [string, string] | null;
        sunday: [string, string] | null;
    };
    accepts_walk_ins: boolean;
    offers_home_service: boolean;
    min_booking_hours: number;
    cancellation_hours: number;
    number_of_workstations: number;
    manager_id: string;
}

interface Manager {
    id: number;
    name: string;
    email: string;
}

const dayLabels: { [key: string]: string } = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
};

export default function CreateEstablishment({ managers = [] }: { managers?: Manager[] }) {
    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm<CreateEstablishmentForm>({
        name: '',
        business_name: '',
        type: 'salon',
        address: '',
        province: '',
        canton: '',
        district: '',
        latitude: null,
        longitude: null,
        phone: '',
        email: '',
        whatsapp: '',
        website: '',
        business_hours: {
            monday: ['09:00', '18:00'],
            tuesday: ['09:00', '18:00'],
            wednesday: ['09:00', '18:00'],
            thursday: ['09:00', '18:00'],
            friday: ['09:00', '18:00'],
            saturday: ['09:00', '17:00'],
            sunday: null
        },
        accepts_walk_ins: true,
        offers_home_service: false,
        min_booking_hours: 2,
        cancellation_hours: 24,
        number_of_workstations: 1,
        manager_id: ''
    });

    const handleHourChange = (day: string, index: number, value: string) => {
        const key = day as keyof CreateEstablishmentForm['business_hours'];
        const newHours = { ...data.business_hours };
        if (!newHours[key]) {
            newHours[key] = ['09:00', '18:00'];
        }
        if (newHours[key]) {
            newHours[key]![index] = value;
        }
        setData('business_hours', newHours);
    };

    const toggleDayClosed = (day: string) => {
        const key = day as keyof CreateEstablishmentForm['business_hours'];
        const newHours = { ...data.business_hours };
        if (newHours[key] === null || newHours[key] === undefined) {
            newHours[key] = ['09:00', '18:00'];
        } else {
            newHours[key] = null;
        }
        setData('business_hours', newHours);
    };

    const getCurrentLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setData({
                        ...data,
                        latitude: lat,
                        longitude: lng
                    });
                },
                (error) => {
                    alert('No se pudo obtener la ubicación: ' + error.message);
                }
            );
        } else {
            alert('Geolocalización no disponible en este navegador');
        }
    };

    const openMapSelector = () => {
        setIsMapPickerOpen(true);
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setData({
            ...data,
            latitude: lat,
            longitude: lng
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/business/establishment');
    };

    return (
        <AppLayout>
            <Head title="Crear Establecimiento" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Crear Nuevo Establecimiento</h1>
                    <p className="text-muted-foreground mt-2">
                        Complete la información de su establecimiento
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Información Básica */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>
                                Datos generales del establecimiento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Establecimiento *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="business_name">Razón Social</Label>
                                    <Input
                                        id="business_name"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                    />
                                    {errors.business_name && <p className="text-sm text-destructive">{errors.business_name}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Establecimiento *</Label>
                                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="salon">Salón de Belleza</SelectItem>
                                        <SelectItem value="barbershop">Barbería</SelectItem>
                                        <SelectItem value="spa">Spa</SelectItem>
                                        <SelectItem value="mixed">Mixto</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Administrador */}
                    {managers && managers.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Administrador (Opcional)</CardTitle>
                                <CardDescription>
                                    Asigna un manager para que administre este establecimiento. Si no seleccionas ninguno, tú serás el administrador.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="manager_id">Manager</Label>
                                    <Select value={data.manager_id || 'none'} onValueChange={(value) => setData('manager_id', value === 'none' ? '' : value)}>
                                        <SelectTrigger id="manager_id">
                                            <SelectValue placeholder="Sin manager asignado (tú administras)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin manager (yo administro)</SelectItem>
                                            {managers.map((manager) => (
                                                <SelectItem key={manager.id} value={manager.id.toString()}>
                                                    {manager.name} ({manager.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.manager_id && <p className="text-sm text-destructive">{errors.manager_id}</p>}
                                    <p className="text-xs text-muted-foreground">
                                        Los managers pueden gestionar múltiples establecimientos y tienen acceso completo a la administración.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Ubicación */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubicación</CardTitle>
                            <CardDescription>
                                Dirección del establecimiento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección Completa *</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Dirección exacta del establecimiento"
                                    required
                                />
                                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                            </div>

                            <LocationSelector
                                provincia={data.province}
                                canton={data.canton}
                                distrito={data.district}
                                onProvinceChange={(value) => setData('province', value)}
                                onCantonChange={(value) => setData('canton', value)}
                                onDistrictChange={(value) => setData('district', value)}
                            />
                            {errors.province && <p className="text-sm text-destructive">{errors.province}</p>}
                            {errors.canton && <p className="text-sm text-destructive">{errors.canton}</p>}
                            {errors.district && <p className="text-sm text-destructive">{errors.district}</p>}

                            <div className="space-y-4">
                                <div>
                                    <Label className="text-base font-semibold">Coordenadas GPS</Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Necesarias para que tu establecimiento aparezca en el mapa
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={getCurrentLocation}
                                        className="flex-1"
                                    >
                                        📍 Obtener mi ubicación actual
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={openMapSelector}
                                        className="flex-1"
                                    >
                                        🗺️ Seleccionar en el mapa
                                    </Button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">Latitud</Label>
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="any"
                                            value={data.latitude || ''}
                                            onChange={(e) => setData('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                                            placeholder="Ej: 9.9281"
                                        />
                                        {errors.latitude && <p className="text-sm text-destructive">{errors.latitude}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">Longitud</Label>
                                        <Input
                                            id="longitude"
                                            type="number"
                                            step="any"
                                            value={data.longitude || ''}
                                            onChange={(e) => setData('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                                            placeholder="Ej: -84.0907"
                                        />
                                        {errors.longitude && <p className="text-sm text-destructive">{errors.longitude}</p>}
                                    </div>
                                </div>
                                {data.latitude && data.longitude && (
                                    <p className="text-sm text-muted-foreground">
                                        📍 Ubicación: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contacto */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Contacto</CardTitle>
                            <CardDescription>
                                Medios de comunicación con el establecimiento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono *</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        required
                                    />
                                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        type="tel"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                    />
                                    {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="website">Sitio Web</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://"
                                    />
                                    {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Estaciones de Trabajo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estaciones de Trabajo</CardTitle>
                            <CardDescription>
                                Define cuántas sillas o áreas de trabajo tiene tu establecimiento. Se crearán automáticamente.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="number_of_workstations">Número de Estaciones/Sillas</Label>
                                <Input
                                    id="number_of_workstations"
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={data.number_of_workstations}
                                    onChange={(e) => setData('number_of_workstations', parseInt(e.target.value) || 1)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Se crearán {data.number_of_workstations} estaciones numeradas (Estación 1, Estación 2, etc.). Podrás editarlas después.
                                </p>
                                {errors.number_of_workstations && <p className="text-sm text-destructive">{errors.number_of_workstations}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Horarios de Atención */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Horarios de Atención</CardTitle>
                            <CardDescription>
                                Define los días y horarios de operación
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.keys(dayLabels).map((day) => {
                                const key = day as keyof CreateEstablishmentForm['business_hours'];
                                const isClosed = data.business_hours[key] === null || data.business_hours[key] === undefined;
                                return (
                                    <div key={day} className="grid grid-cols-[120px_1fr_100px] gap-4 items-center">
                                        <Label>{dayLabels[day]}</Label>
                                        {!isClosed ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="time"
                                                    value={data.business_hours[key]?.[0] || '09:00'}
                                                    onChange={(e) => handleHourChange(day, 0, e.target.value)}
                                                />
                                                <span>-</span>
                                                <Input
                                                    type="time"
                                                    value={data.business_hours[key]?.[1] || '18:00'}
                                                    onChange={(e) => handleHourChange(day, 1, e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-muted-foreground italic">
                                                Cerrado
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id={`closed_${day}`}
                                                checked={isClosed}
                                                onChange={() => toggleDayClosed(day)}
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor={`closed_${day}`} className="text-sm">Cerrado</Label>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Políticas de Reservas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Políticas de Reservas</CardTitle>
                            <CardDescription>
                                Configura las políticas de agendamiento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="accepts_walk_ins"
                                    checked={data.accepts_walk_ins}
                                    onChange={(e) => setData('accepts_walk_ins', e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="accepts_walk_ins">Acepta clientes sin cita previa (Walk-ins)</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="offers_home_service"
                                    checked={data.offers_home_service}
                                    onChange={(e) => setData('offers_home_service', e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="offers_home_service">Ofrece servicio a domicilio</Label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="min_booking_hours">Horas mínimas de anticipación para reservar</Label>
                                    <Input
                                        id="min_booking_hours"
                                        type="number"
                                        min="0"
                                        value={data.min_booking_hours}
                                        onChange={(e) => setData('min_booking_hours', parseInt(e.target.value))}
                                    />
                                    {errors.min_booking_hours && <p className="text-sm text-destructive">{errors.min_booking_hours}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cancellation_hours">Horas mínimas de anticipación para cancelar</Label>
                                    <Input
                                        id="cancellation_hours"
                                        type="number"
                                        min="0"
                                        value={data.cancellation_hours}
                                        onChange={(e) => setData('cancellation_hours', parseInt(e.target.value))}
                                    />
                                    {errors.cancellation_hours && <p className="text-sm text-destructive">{errors.cancellation_hours}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones de Acción */}
                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Crear Establecimiento'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>

                <LocationPicker
                    isOpen={isMapPickerOpen}
                    onClose={() => setIsMapPickerOpen(false)}
                    onLocationSelect={handleLocationSelect}
                    initialLat={data.latitude || 9.9281}
                    initialLng={data.longitude || -84.0907}
                />
            </div>
        </AppLayout>
    );
}
