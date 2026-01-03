import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '../../../components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, MapPin, Plus, Trash2 } from 'lucide-react';
import LocationPicker from '@/components/LocationPicker';
import { useState } from 'react';

interface Professional {
    id: number;
    name: string;
}

interface Establishment {
    latitude?: number;
    longitude?: number;
}

interface DeliveryTier {
    from_km: string;
    to_km: string;
    fee: string;
}

interface Category {
    value: string;
    label: string;
    icon?: string;
    color?: string;
}

export default function ServicesCreate({ professionals, establishment, categories = [] }: { 
    professionals: Professional[], 
    establishment?: Establishment,
    categories?: Category[]
}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category_id: '',
        base_price: '',
        duration_minutes: '',
        professional_ids: [] as string[],
        available_online: true,
        available_home_service: false,
        home_service_surcharge: '',
        home_service_radius_km: '',
        home_service_latitude: establishment?.latitude || null,
        home_service_longitude: establishment?.longitude || null,
        delivery_tiers: [] as DeliveryTier[],
    });

    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

    const addDeliveryTier = () => {
        setData('delivery_tiers', [
            ...data.delivery_tiers,
            { from_km: '', to_km: '', fee: '' }
        ]);
    };

    const removeDeliveryTier = (index: number) => {
        const newTiers = [...data.delivery_tiers];
        newTiers.splice(index, 1);
        setData('delivery_tiers', newTiers);
    };

    const updateDeliveryTier = (index: number, field: keyof DeliveryTier, value: string) => {
        const newTiers = [...data.delivery_tiers];
        newTiers[index] = { ...newTiers[index], [field]: value };
        setData('delivery_tiers', newTiers);
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setData((prev) => ({
            ...prev,
            home_service_latitude: lat,
            home_service_longitude: lng,
        }));
        setIsLocationPickerOpen(false);
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setData((prev) => ({
                        ...prev,
                        home_service_latitude: position.coords.latitude,
                        home_service_longitude: position.coords.longitude,
                    }));
                },
                (error) => {
                    console.error("Error getting location", error);
                    alert("No se pudo obtener la ubicación actual.");
                }
            );
        } else {
            alert("Geolocalización no soportada por este navegador.");
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/business/services');
    };

    return (
        <AppLayout>
            <Head title="Nuevo Servicio" />

            <div className="max-w-2xl mx-auto space-y-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/business/services">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Nuevo Servicio</h1>
                </div>

                <form onSubmit={submit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles del Servicio</CardTitle>
                            <CardDescription>
                                Configure la información básica del servicio que ofrecerá a sus clientes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Servicio</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Corte de Cabello Clásico"
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="category_id">Categoría</Label>
                                    <Link 
                                        href="/business/service-categories/create"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        + Nueva categoría
                                    </Link>
                                </div>
                                {categories.length === 0 ? (
                                    <div className="p-4 border border-dashed rounded-md text-center">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Aún no has creado categorías
                                        </p>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/business/service-categories/create">
                                                Crear Primera Categoría
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) => setData('category_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.icon && `${category.icon} `}{category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="base_price">Precio Base (CRC)</Label>
                                    <Input
                                        id="base_price"
                                        type="number"
                                        min="0"
                                        step="100"
                                        value={data.base_price}
                                        onChange={(e) => setData('base_price', e.target.value)}
                                        placeholder="0"
                                    />
                                    {errors.base_price && <p className="text-sm text-destructive">{errors.base_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration_minutes">Duración (minutos) (Opcional)</Label>
                                    <Input
                                        id="duration_minutes"
                                        type="number"
                                        min="0"
                                        step="5"
                                        value={data.duration_minutes}
                                        onChange={(e) => setData('duration_minutes', e.target.value)}
                                        placeholder="30"
                                    />
                                    {errors.duration_minutes && <p className="text-sm text-destructive">{errors.duration_minutes}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Profesionales Asignados (Opcional)</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
                                    {professionals.map((professional) => (
                                        <div key={professional.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`professional-${professional.id}`} 
                                                checked={data.professional_ids.includes(professional.id.toString())}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('professional_ids', [...data.professional_ids, professional.id.toString()]);
                                                    } else {
                                                        setData('professional_ids', data.professional_ids.filter(id => id !== professional.id.toString()));
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`professional-${professional.id}`} className="cursor-pointer">
                                                {professional.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Seleccione los profesionales que pueden realizar este servicio. Si no selecciona ninguno, se asumirá que cualquiera puede realizarlo.
                                </p>
                                {errors.professional_ids && <p className="text-sm text-destructive">{errors.professional_ids}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describa qué incluye el servicio..."
                                    className="min-h-[100px]"
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Disponible Online</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Permitir que los clientes agenden este servicio desde la app.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.available_online}
                                        onCheckedChange={(checked) => setData('available_online', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Servicio a Domicilio</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Habilitar este servicio para visitas a domicilio.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.available_home_service}
                                        onCheckedChange={(checked) => setData('available_home_service', checked)}
                                    />
                                </div>

                                {data.available_home_service && (
                                    <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                                        <div className="space-y-2">
                                            <Label htmlFor="home_service_surcharge">Recargo Base por Domicilio (CRC)</Label>
                                            <Input
                                                id="home_service_surcharge"
                                                type="number"
                                                min="0"
                                                value={data.home_service_surcharge}
                                                onChange={(e) => setData('home_service_surcharge', e.target.value)}
                                                placeholder="0"
                                                className="h-11"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Este monto se aplica si no se definen rangos específicos o como base.
                                            </p>
                                            {errors.home_service_surcharge && <p className="text-sm text-destructive">{errors.home_service_surcharge}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Tarifas por Distancia (Opcional)</Label>
                                                <Button type="button" variant="outline" size="sm" onClick={addDeliveryTier}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Agregar Rango
                                                </Button>
                                            </div>
                                            
                                            {data.delivery_tiers.length > 0 ? (
                                                <div className="space-y-3">
                                                    {data.delivery_tiers.map((tier, index) => (
                                                        <div key={index} className="border rounded-lg p-3 md:p-4 space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-sm font-semibold">Rango {index + 1}</Label>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeDeliveryTier(index)}
                                                                    className="border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                                                >
                                                                    <Trash2 className="h-4 w-4 md:mr-2" />
                                                                    <span className="hidden md:inline">Eliminar</span>
                                                                </Button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs">Desde (km)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.1"
                                                                        value={tier.from_km}
                                                                        onChange={(e) => updateDeliveryTier(index, 'from_km', e.target.value)}
                                                                        placeholder="0"
                                                                        className="h-11"
                                                                    />
                                                                    {errors[`delivery_tiers.${index}.from_km`] && <p className="text-xs text-destructive">{errors[`delivery_tiers.${index}.from_km`]}</p>}
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs">Hasta (km)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.1"
                                                                        value={tier.to_km}
                                                                        onChange={(e) => updateDeliveryTier(index, 'to_km', e.target.value)}
                                                                        placeholder="5"
                                                                        className="h-11"
                                                                    />
                                                                    {errors[`delivery_tiers.${index}.to_km`] && <p className="text-xs text-destructive">{errors[`delivery_tiers.${index}.to_km`]}</p>}
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs">Tarifa (CRC)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        value={tier.fee}
                                                                        onChange={(e) => updateDeliveryTier(index, 'fee', e.target.value)}
                                                                        placeholder="1000"
                                                                        className="h-11"
                                                                    />
                                                                    {errors[`delivery_tiers.${index}.fee`] && <p className="text-xs text-destructive">{errors[`delivery_tiers.${index}.fee`]}</p>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">
                                                    No hay rangos definidos. Se usará el recargo base.
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="home_service_radius_km">Radio Máximo de Cobertura (km)</Label>
                                            <Input
                                                id="home_service_radius_km"
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={data.home_service_radius_km}
                                                onChange={(e) => setData('home_service_radius_km', e.target.value)}
                                                placeholder="Ej: 5.0"
                                                className="h-11"
                                            />
                                            {errors.home_service_radius_km && <p className="text-sm text-destructive">{errors.home_service_radius_km}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Centro de Cobertura</Label>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <Button type="button" variant="outline" onClick={() => setIsLocationPickerOpen(true)} className="w-full h-11">
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        Seleccionar en Mapa
                                                    </Button>
                                                    <Button type="button" variant="secondary" onClick={handleUseCurrentLocation} className="w-full h-11">
                                                        Usar Ubicación Actual
                                                    </Button>
                                                </div>
                                                {data.home_service_latitude && data.home_service_longitude && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Ubicación seleccionada: {data.home_service_latitude.toFixed(6)}, {data.home_service_longitude.toFixed(6)}
                                                    </p>
                                                )}
                                                {(errors.home_service_latitude || errors.home_service_longitude) && (
                                                    <p className="text-sm text-destructive">Debe seleccionar una ubicación central.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Guardando...' : 'Guardar Servicio'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
            <LocationPicker
                isOpen={isLocationPickerOpen}
                onClose={() => setIsLocationPickerOpen(false)}
                onLocationSelect={handleLocationSelect}
                initialLat={data.home_service_latitude || 9.9281}
                initialLng={data.home_service_longitude || -84.0907}
            />
        </AppLayout>
    );
}
