import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LocationPicker from '@/components/LocationPicker';
import { LocationSelector } from '@/components/LocationSelector';
import { Building2, Save, ArrowLeft, Phone, Mail, MapPin, Clock, User } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Manager {
    id: number;
    name: string;
    email: string;
}

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
    business_hours?: string;
    accepts_walk_ins: boolean;
    offers_home_service: boolean;
    min_booking_hours: number;
    cancellation_hours: number;
    manager_id?: number;
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

export default function EstablishmentEdit({ establishment, managers = [] }: { establishment: Establishment; managers?: Manager[] }) {
    const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
    let businessHours: Record<string, string[] | null> = {};
    try {
        if (establishment.business_hours) {
            businessHours = JSON.parse(establishment.business_hours);
        }
    } catch (e) {
        // ignore
    }

    const { data, setData, put, processing, errors } = useForm({
        name: establishment.name || '',
        business_name: establishment.business_name || '',
        tax_id: establishment.tax_id || '',
        type: establishment.type || 'barbershop',
        email: establishment.email || '',
        phone: establishment.phone || '',
        whatsapp: establishment.whatsapp || '',
        address: establishment.address || '',
        province: establishment.province || '',
        canton: establishment.canton || '',
        district: establishment.district || '',
        latitude: establishment.latitude || null,
        longitude: establishment.longitude || null,
        business_hours: businessHours,
        accepts_walk_ins: establishment.accepts_walk_ins,
        offers_home_service: establishment.offers_home_service,
        min_booking_hours: establishment.min_booking_hours,
        cancellation_hours: establishment.cancellation_hours,
        manager_id: establishment.manager_id ? establishment.manager_id.toString() : '',
    });

    const handleHourChange = (day: string, index: number, value: string) => {
        const newHours = { ...data.business_hours };
        if (!newHours[day]) {
            newHours[day] = ['09:00', '18:00'];
        }
        if (newHours[day]) {
            newHours[day][index] = value;
        }
        setData('business_hours', newHours);
    };

    const toggleDayClosed = (day: string) => {
        const newHours = { ...data.business_hours };
        if (newHours[day] === null || newHours[day] === undefined) {
            newHours[day] = ['09:00', '18:00'];
        } else {
            newHours[day] = null;
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/business/establishment/${establishment.id}`);
    };

    return (
        <AppLayout>
            <Head title={`Editar ${establishment.name}`} />
            
            <div className="space-y-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-start"
                >
                    <div>
                        <Link href="/business/establishment">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Editar Establecimiento
                        </h1>
                    </div>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-2 rounded-full border border-blue-500/20">
                                            <Building2 className="h-4 w-4 text-blue-500" />
                                        </div>
                                        Información Básica
                                    </CardTitle>
                                    <CardDescription>
                                        Actualiza la información principal del establecimiento
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nombre del Establecimiento *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="business_name">Razón Social</Label>
                                    <Input
                                        id="business_name"
                                        value={data.business_name}
                                        onChange={(e) => setData('business_name', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tax_id">Cédula Jurídica</Label>
                                    <Input
                                        id="tax_id"
                                        value={data.tax_id}
                                        onChange={(e) => setData('tax_id', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="type">Tipo *</Label>
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
                                </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 p-2 rounded-full border border-green-500/20">
                                            <Phone className="h-4 w-4 text-green-500" />
                                        </div>
                                        Contacto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="phone">Teléfono *</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+506 2222-3333"
                                        className={errors.phone ? 'border-red-500' : ''}
                                    />
                                    {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="whatsapp">WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        placeholder="+506 8888-9999"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="info@establecimiento.com"
                                    />
                                </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {managers.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-2 rounded-full border border-purple-500/20">
                                                <User className="h-4 w-4 text-purple-500" />
                                            </div>
                                            Administrador (Opcional)
                                        </CardTitle>
                                        <CardDescription>
                                            Asigna un manager que pueda administrar este establecimiento
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                    <div>
                                        <Label htmlFor="manager">Manager del Establecimiento</Label>
                                        <Select
                                            value={data.manager_id || 'none'}
                                            onValueChange={(value) => setData('manager_id', value === 'none' ? '' : value)}
                                        >
                                            <SelectTrigger id="manager">
                                                <SelectValue placeholder="Seleccionar manager" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Sin manager asignado</SelectItem>
                                                {managers.map((manager) => (
                                                    <SelectItem key={manager.id} value={manager.id.toString()}>
                                                        {manager.name} - {manager.email}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {data.manager_id
                                                ? "El manager seleccionado podrá administrar el establecimiento junto al propietario."
                                                : "No hay manager asignado. El propietario administra directamente."}
                                        </p>
                                        {errors.manager_id && <p className="text-sm text-red-500 mt-1">{errors.manager_id}</p>}
                                    </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/10 p-2 rounded-full border border-amber-500/20">
                                            <MapPin className="h-4 w-4 text-amber-500" />
                                        </div>
                                        Ubicación
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="address">Dirección *</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={2}
                                        className={errors.address ? 'border-red-500' : ''}
                                    />
                                    {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                                </div>

                                <LocationSelector
                                    provincia={data.province}
                                    canton={data.canton}
                                    distrito={data.district}
                                    onProvinceChange={(value) => setData('province', value)}
                                    onCantonChange={(value) => setData('canton', value)}
                                    onDistrictChange={(value) => setData('district', value)}
                                />
                                {errors.province && <p className="text-sm text-red-500 mt-1">{errors.province}</p>}
                                {errors.canton && <p className="text-sm text-red-500 mt-1">{errors.canton}</p>}
                                {errors.district && <p className="text-sm text-red-500 mt-1">{errors.district}</p>}

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
                                        <div>
                                            <Label htmlFor="latitude">Latitud</Label>
                                            <Input
                                                id="latitude"
                                                type="number"
                                                step="any"
                                                value={data.latitude || ''}
                                                onChange={(e) => setData('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                                                placeholder="Ej: 9.9281"
                                            />
                                            {errors.latitude && <p className="text-sm text-red-500 mt-1">{errors.latitude}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="longitude">Longitud</Label>
                                            <Input
                                                id="longitude"
                                                type="number"
                                                step="any"
                                                value={data.longitude || ''}
                                                onChange={(e) => setData('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                                                placeholder="Ej: -84.0907"
                                            />
                                            {errors.longitude && <p className="text-sm text-red-500 mt-1">{errors.longitude}</p>}
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
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 p-2 rounded-full border border-indigo-500/20">
                                            <Clock className="h-4 w-4 text-indigo-500" />
                                        </div>
                                        Horarios de Atención
                                    </CardTitle>
                                    <CardDescription>
                                        Configura los horarios de apertura y cierre para cada día
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                {Object.keys(dayLabels).map((day) => {
                                    const isClosed = data.business_hours[day] === null || data.business_hours[day] === undefined;
                                    return (
                                        <div key={day} className="grid grid-cols-[120px_1fr_100px] gap-4 items-center">
                                            <Label>{dayLabels[day]}</Label>
                                            {!isClosed ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="time"
                                                        value={data.business_hours[day]?.[0] || '09:00'}
                                                        onChange={(e) => handleHourChange(day, 0, e.target.value)}
                                                    />
                                                    <span>-</span>
                                                    <Input
                                                        type="time"
                                                        value={data.business_hours[day]?.[1] || '18:00'}
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
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 p-2 rounded-full border border-emerald-500/20">
                                            <Clock className="h-4 w-4 text-emerald-500" />
                                        </div>
                                        Políticas de Reservas
                                    </CardTitle>
                                    <CardDescription>
                                        Configura las opciones de reserva para este establecimiento
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        id="accepts_walk_ins"
                                        checked={data.accepts_walk_ins}
                                        onChange={(e) => setData('accepts_walk_ins', e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="accepts_walk_ins">Acepta citas sin reserva (Walk-ins)</Label>
                                </div>

                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        id="offers_home_service"
                                        checked={data.offers_home_service}
                                        onChange={(e) => setData('offers_home_service', e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="offers_home_service">Ofrece servicio a domicilio</Label>
                                </div>

                                <div>
                                    <Label htmlFor="min_booking_hours">Horas mínimas para reservar</Label>
                                    <Input
                                        id="min_booking_hours"
                                        type="number"
                                        min="0"
                                        value={data.min_booking_hours}
                                        onChange={(e) => setData('min_booking_hours', parseInt(e.target.value))}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cancellation_hours">Horas para cancelar sin cargo</Label>
                                    <Input
                                        id="cancellation_hours"
                                        type="number"
                                        min="0"
                                        value={data.cancellation_hours}
                                        onChange={(e) => setData('cancellation_hours', parseInt(e.target.value))}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        </motion.div>

                        <motion.div 
                            className="flex gap-3 pt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button type="submit" disabled={processing} className="min-w-[140px] shadow-lg">
                                    {processing ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                className="mr-2"
                                            >
                                                <Save className="h-4 w-4" />
                                            </motion.div>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                            <Link href="/business/establishment">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>
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
