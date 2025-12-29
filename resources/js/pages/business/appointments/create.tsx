import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Calendar, Clock, MapPin, User, Scissors, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface Service {
    id: number;
    name: string;
    duration_minutes: number;
    price: number;
}

interface Professional {
    id: number;
    name: string;
}

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Props {
    services: Service[];
    professionals: Professional[];
    customers: Customer[];
}

export default function AppointmentCreate({ services, professionals, customers }: Props) {
    const queryParams = new URLSearchParams(window.location.search);
    const initialDate = queryParams.get('scheduled_at') || '';

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        professional_id: '',
        service_id: '',
        scheduled_at: initialDate,
        location_type: 'in_store',
        customer_notes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/business/appointments');
    };

    // Format date for datetime-local input if needed
    // The input type="datetime-local" expects YYYY-MM-DDThh:mm
    const formatDateTimeForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Adjust for timezone offset to show local time in input
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    useEffect(() => {
        if (initialDate) {
            setData('scheduled_at', formatDateTimeForInput(initialDate));
        }
    }, [initialDate]);

    return (
        <AppLayout>
            <Head title="Nueva Cita" />

            <div className="max-w-2xl mx-auto space-y-6 p-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-primary/10"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Nueva Cita
                        </h1>
                        <p className="text-muted-foreground">Programar una nueva cita</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
                        <CardContent className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_id" className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" />
                                        Cliente
                                    </Label>
                                    <Select 
                                        value={data.customer_id} 
                                        onValueChange={(value) => setData('customer_id', value)}
                                    >
                                        <SelectTrigger className={errors.customer_id ? "border-destructive" : ""}>
                                            <SelectValue placeholder="Seleccionar cliente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((customer) => (
                                                <SelectItem key={customer.id} value={customer.id.toString()}>
                                                    {customer.name} ({customer.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.customer_id && <p className="text-sm text-destructive">{errors.customer_id}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="service_id" className="flex items-center gap-2">
                                            <Scissors className="h-4 w-4 text-primary" />
                                            Servicio
                                        </Label>
                                        <Select 
                                            value={data.service_id} 
                                            onValueChange={(value) => setData('service_id', value)}
                                        >
                                            <SelectTrigger className={errors.service_id ? "border-destructive" : ""}>
                                                <SelectValue placeholder="Seleccionar servicio" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {services.map((service) => (
                                                    <SelectItem key={service.id} value={service.id.toString()}>
                                                        {service.name} ({service.duration_minutes} min) - ₡{service.price}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.service_id && <p className="text-sm text-destructive">{errors.service_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="professional_id" className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            Profesional
                                        </Label>
                                        <Select 
                                            value={data.professional_id} 
                                            onValueChange={(value) => setData('professional_id', value)}
                                        >
                                            <SelectTrigger className={errors.professional_id ? "border-destructive" : ""}>
                                                <SelectValue placeholder="Seleccionar profesional" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {professionals.map((professional) => (
                                                    <SelectItem key={professional.id} value={professional.id.toString()}>
                                                        {professional.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.professional_id && <p className="text-sm text-destructive">{errors.professional_id}</p>}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="scheduled_at" className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            Fecha y Hora
                                        </Label>
                                        <Input
                                            id="scheduled_at"
                                            type="datetime-local"
                                            value={data.scheduled_at}
                                            onChange={(e) => setData('scheduled_at', e.target.value)}
                                            className={errors.scheduled_at ? "border-destructive" : ""}
                                        />
                                        {errors.scheduled_at && <p className="text-sm text-destructive">{errors.scheduled_at}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location_type" className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            Ubicación
                                        </Label>
                                        <Select 
                                            value={data.location_type} 
                                            onValueChange={(value) => setData('location_type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar ubicación" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="in_store">En establecimiento</SelectItem>
                                                <SelectItem value="home_service">A domicilio</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.location_type && <p className="text-sm text-destructive">{errors.location_type}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customer_notes">Notas del Cliente (Opcional)</Label>
                                    <Textarea
                                        id="customer_notes"
                                        value={data.customer_notes}
                                        onChange={(e) => setData('customer_notes', e.target.value)}
                                        placeholder="Detalles adicionales..."
                                        className="resize-none"
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Cita
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
