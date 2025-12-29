import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler, useState } from 'react';

interface Establishment {
    id: number;
    name: string;
}

interface Workstation {
    id: number;
    name: string;
    number?: string;
}

export default function CreateStaff({ establishment, workstations = [] }: { establishment: Establishment; workstations?: Workstation[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        role: 'staff',
        employment_type: 'employee',
        commission_model: 'percentage',
        commission_percentage: '',
        base_salary: '',
        booth_rental_fee: '',
        workstation_id: '',
        workstation_start_time: '',
        workstation_end_time: '',
        workstation_notes: '',
    });

    const [showCommissionFields, setShowCommissionFields] = useState(true);
    const [showSalaryField, setShowSalaryField] = useState(false);
    const [showBoothRentalField, setShowBoothRentalField] = useState(false);

    const handleCommissionModelChange = (value: string) => {
        setData('commission_model', value);
        
        // Resetear campos
        setData('commission_percentage', '');
        setData('base_salary', '');
        setData('booth_rental_fee', '');

        // Mostrar campos según el modelo
        switch (value) {
            case 'percentage':
                setShowCommissionFields(true);
                setShowSalaryField(false);
                setShowBoothRentalField(false);
                break;
            case 'salary_plus':
                setShowCommissionFields(true);
                setShowSalaryField(true);
                setShowBoothRentalField(false);
                break;
            case 'booth_rental':
                setShowCommissionFields(false);
                setShowSalaryField(false);
                setShowBoothRentalField(true);
                break;
            case 'fixed_per_service':
                setShowCommissionFields(false);
                setShowSalaryField(true);
                setShowBoothRentalField(false);
                break;
            case 'salary_only':
                setShowCommissionFields(false);
                setShowSalaryField(true);
                setShowBoothRentalField(false);
                break;
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/business/staff');
    };

    return (
        <AppLayout>
            <Head title="Agregar Empleado" />
            
            <div className="max-w-2xl mx-auto space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold">Agregar Empleado</h1>
                    <p className="text-muted-foreground mt-2">
                        Registra un nuevo miembro del equipo para {establishment.name}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Información Personal */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>
                                Datos básicos del empleado
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Correo Electrónico *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                <p className="text-xs text-muted-foreground">
                                    Se enviará una contraseña temporal a este correo
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="8888-8888"
                                />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Rol *</Label>
                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                    <SelectTrigger id="role">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="staff">Staff (Personal)</SelectItem>
                                        <SelectItem value="manager">Manager (Administrador)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                                <p className="text-xs text-muted-foreground">
                                    {data.role === 'manager' 
                                        ? 'Los managers pueden administrar el establecimiento'
                                        : 'El personal solo tiene acceso a sus propias funciones'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Asignación de Estación (Opcional) */}
                    {workstations.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Asignación de Estación (Opcional)</CardTitle>
                                <CardDescription>
                                    Asigna una silla/estación de trabajo con horario específico
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="workstation">Estación de Trabajo</Label>
                                    <Select 
                                        value={data.workstation_id || 'none'} 
                                        onValueChange={(value) => setData('workstation_id', value === 'none' ? '' : value)}
                                    >
                                        <SelectTrigger id="workstation">
                                            <SelectValue placeholder="Sin asignar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sin asignar</SelectItem>
                                            {workstations.map((ws) => (
                                                <SelectItem key={ws.id} value={ws.id.toString()}>
                                                    {ws.name} {ws.number && `(#${ws.number})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.workstation_id && <p className="text-sm text-destructive">{errors.workstation_id}</p>}
                                    <p className="text-xs text-muted-foreground">
                                        {data.workstation_id 
                                            ? "Este empleado trabajará en la estación seleccionada"
                                            : "Sin estación asignada - puede usar cualquiera"}
                                    </p>
                                </div>

                                {data.workstation_id && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="start_time">Hora Inicio (Opcional)</Label>
                                                <Input
                                                    id="start_time"
                                                    type="time"
                                                    value={data.workstation_start_time}
                                                    onChange={(e) => setData('workstation_start_time', e.target.value)}
                                                />
                                                {errors.workstation_start_time && <p className="text-sm text-destructive">{errors.workstation_start_time}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="end_time">Hora Fin (Opcional)</Label>
                                                <Input
                                                    id="end_time"
                                                    type="time"
                                                    value={data.workstation_end_time}
                                                    onChange={(e) => setData('workstation_end_time', e.target.value)}
                                                />
                                                {errors.workstation_end_time && <p className="text-sm text-destructive">{errors.workstation_end_time}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="workstation_notes">Notas</Label>
                                            <Input
                                                id="workstation_notes"
                                                value={data.workstation_notes}
                                                onChange={(e) => setData('workstation_notes', e.target.value)}
                                                placeholder="Ej: Turno matutino, Solo lunes y miércoles"
                                            />
                                            {errors.workstation_notes && <p className="text-sm text-destructive">{errors.workstation_notes}</p>}
                                            <p className="text-xs text-muted-foreground">
                                                Información adicional sobre esta asignación
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Modelo de Comisión */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Modelo de Compensación</CardTitle>
                            <CardDescription>
                                Define cómo se le pagará al empleado. Los freelancers deben aplicar a través de las ofertas publicadas.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="commission_model">Modelo de Comisión *</Label>
                                <Select
                                    value={data.commission_model}
                                    onValueChange={handleCommissionModelChange}
                                >
                                    <SelectTrigger id="commission_model">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Comisión por Porcentaje</SelectItem>
                                        <SelectItem value="salary_plus">Salario + Comisión</SelectItem>
                                        <SelectItem value="booth_rental">Alquiler de Silla</SelectItem>
                                        <SelectItem value="fixed_per_service">Fijo por Servicio</SelectItem>
                                        <SelectItem value="salary_only">Solo Salario</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.commission_model && <p className="text-sm text-destructive">{errors.commission_model}</p>}
                            </div>

                            {showCommissionFields && (
                                <div className="space-y-2">
                                    <Label htmlFor="commission_percentage">Porcentaje de Comisión (%)</Label>
                                    <Input
                                        id="commission_percentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={data.commission_percentage}
                                        onChange={(e) => setData('commission_percentage', e.target.value)}
                                        placeholder="50"
                                    />
                                    {errors.commission_percentage && <p className="text-sm text-destructive">{errors.commission_percentage}</p>}
                                    <p className="text-xs text-muted-foreground">
                                        Porcentaje que recibe del precio del servicio
                                    </p>
                                </div>
                            )}

                            {showSalaryField && (
                                <div className="space-y-2">
                                    <Label htmlFor="base_salary">
                                        {data.commission_model === 'salary_only' ? 'Salario' : 'Salario Base'}
                                    </Label>
                                    <Input
                                        id="base_salary"
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={data.base_salary}
                                        onChange={(e) => setData('base_salary', e.target.value)}
                                        placeholder="300000"
                                    />
                                    {errors.base_salary && <p className="text-sm text-destructive">{errors.base_salary}</p>}
                                    <p className="text-xs text-muted-foreground">
                                        {data.commission_model === 'fixed_per_service' 
                                            ? 'Monto fijo por cada servicio realizado'
                                            : 'Salario mensual en colones'}
                                    </p>
                                </div>
                            )}

                            {showBoothRentalField && (
                                <div className="space-y-2">
                                    <Label htmlFor="booth_rental_fee">Tarifa de Alquiler de Silla</Label>
                                    <Input
                                        id="booth_rental_fee"
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={data.booth_rental_fee}
                                        onChange={(e) => setData('booth_rental_fee', e.target.value)}
                                        placeholder="150000"
                                    />
                                    {errors.booth_rental_fee && <p className="text-sm text-destructive">{errors.booth_rental_fee}</p>}
                                    <p className="text-xs text-muted-foreground">
                                        Monto mensual que paga por el espacio de trabajo
                                    </p>
                                </div>
                            )}

                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm font-medium mb-2">📋 Modelos de Compensación:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li><strong>Comisión por %:</strong> Solo gana % del servicio</li>
                                    <li><strong>Salario + Comisión:</strong> Salario fijo + % de servicios</li>
                                    <li><strong>Alquiler de Silla:</strong> Paga renta, se queda con todo</li>
                                    <li><strong>Fijo por Servicio:</strong> Gana monto fijo por cada servicio</li>
                                    <li><strong>Solo Salario:</strong> Salario mensual sin comisiones</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={processing}
                        >
                            {processing ? 'Guardando...' : 'Agregar Empleado'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
