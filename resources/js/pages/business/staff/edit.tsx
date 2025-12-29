import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Briefcase, User, Clock } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Staff {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    workstations?: Array<{
        id: number;
        name: string;
        number?: string;
        pivot?: {
            start_time?: string;
            end_time?: string;
            notes?: string;
        };
    }>;
}

interface PivotData {
    employment_type: string;
    commission_model: string;
    commission_percentage?: number;
    base_salary?: number;
    booth_rental_fee?: number;
    auto_accept_appointments?: boolean;
}

interface Workstation {
    id: number;
    name: string;
    number?: string;
}

interface WorkstationAssignment {
    workstation_id: number;
    start_time: string;
    end_time: string;
    notes: string;
}

export default function EditStaff({ staff, pivotData, workstations = [] }: { 
    staff: Staff; 
    pivotData: PivotData | null;
    workstations?: Workstation[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role || 'staff',
        employment_type: pivotData?.employment_type || 'employee',
        commission_model: pivotData?.commission_model || 'percentage',
        commission_percentage: pivotData?.commission_percentage?.toString() || '',
        base_salary: pivotData?.base_salary?.toString() || '',
        auto_accept_appointments: pivotData?.auto_accept_appointments || false,
        booth_rental_fee: pivotData?.booth_rental_fee?.toString() || '',
        workstation_assignments: (staff.workstations || []).map(ws => ({
            workstation_id: ws.id,
            start_time: ws.pivot?.start_time || '09:00',
            end_time: ws.pivot?.end_time || '17:00',
            notes: ws.pivot?.notes || '',
        })),
        ignore_conflicts: false,
    });

    const [showCommissionFields, setShowCommissionFields] = useState(
        ['percentage', 'salary_plus'].includes(data.commission_model)
    );
    const [showSalaryField, setShowSalaryField] = useState(
        ['salary_plus', 'fixed_per_service', 'salary_only'].includes(data.commission_model)
    );
    const [showBoothRentalField, setShowBoothRentalField] = useState(
        data.commission_model === 'booth_rental'
    );
    const [conflicts, setConflicts] = useState<Record<string, string>>({});
    const [showConflictWarning, setShowConflictWarning] = useState(false);

    const addWorkstationAssignment = (workstationId: number) => {
        setData('workstation_assignments', [
            ...data.workstation_assignments,
            { workstation_id: workstationId, start_time: '09:00', end_time: '17:00', notes: '' }
        ]);
    };

    const removeWorkstationAssignment = (index: number) => {
        setData('workstation_assignments', data.workstation_assignments.filter((_, i) => i !== index));
    };

    const updateWorkstationAssignment = (index: number, field: keyof WorkstationAssignment, value: string | number) => {
        const updated = [...data.workstation_assignments];
        updated[index] = { ...updated[index], [field]: value };
        setData('workstation_assignments', updated);
    };

    const updateVisibility = (value: string) => {
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

    const handleCommissionModelChange = (value: string) => {
        setData('commission_model', value);
        updateVisibility(value);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('business.staff.update', staff.id), {
            onError: (errors) => {
                // Check if there are conflict warnings
                const conflictErrors: Record<string, string> = {};
                let hasConflicts = false;
                
                Object.keys(errors).forEach(key => {
                    if (key.includes('workstation_assignments') && key.includes('workstation_id')) {
                        conflictErrors[key] = errors[key];
                        hasConflicts = true;
                    }
                });
                
                if (hasConflicts) {
                    setConflicts(conflictErrors);
                    setShowConflictWarning(true);
                    setData('ignore_conflicts', false);
                }
            },
            onSuccess: () => {
                setConflicts({});
                setShowConflictWarning(false);
            }
        });
    };

    return (
        <AppLayout>
            <Head title={`Editar - ${staff.name}`} />
            
            <div className="max-w-2xl mx-auto space-y-6 p-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link href={`/business/staff/${staff.id}`}>
                        <Button variant="ghost" size="sm" className="mb-2">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Editar Empleado
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Actualiza la información de {staff.name}
                    </p>
                </motion.div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Información Personal */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-2 rounded-full border border-blue-500/20">
                                        <User className="h-4 w-4 text-blue-500" />
                                    </div>
                                    Información Personal
                                </CardTitle>
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
                                        className="transition-all focus:scale-[1.01]"
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
                                        className="transition-all focus:scale-[1.01]"
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="8888-8888"
                                        className="transition-all focus:scale-[1.01]"
                                    />
                                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Rol *</Label>
                                    <Select 
                                        value={data.role} 
                                        onValueChange={(value) => setData('role', value)}
                                    >
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
                    </motion.div>

                    {/* Información Laboral */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 p-2 rounded-full border border-indigo-500/20">
                                        <Briefcase className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    Información Laboral
                                </CardTitle>
                                <CardDescription>
                                    Tipo de empleo y contrato
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="employment_type">Tipo de Empleo</Label>
                                    <div className="bg-muted/50 border rounded-lg p-3">
                                        <p className="font-semibold text-base">
                                            {data.employment_type === 'employee' ? '👔 Empleado' : '💼 Freelancer'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            El tipo de empleo no puede modificarse después de la contratación
                                        </p>
                                    </div>
                                </div>

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
                                            <SelectItem value="percentage">Solo Comisión (%)</SelectItem>
                                            <SelectItem value="salary_plus">Salario + Comisión</SelectItem>
                                            <SelectItem value="booth_rental">Alquiler de Silla</SelectItem>
                                            <SelectItem value="fixed_per_service">Fijo por Servicio</SelectItem>
                                            <SelectItem value="salary_only">Solo Salario</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.commission_model && <p className="text-sm text-destructive">{errors.commission_model}</p>}
                                </div>

                                {showCommissionFields && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="commission_percentage">Porcentaje de Comisión</Label>
                                        <Input
                                            id="commission_percentage"
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            value={data.commission_percentage}
                                            onChange={(e) => setData('commission_percentage', e.target.value)}
                                            placeholder="15"
                                            className="transition-all focus:scale-[1.01]"
                                        />
                                        {errors.commission_percentage && <p className="text-sm text-destructive">{errors.commission_percentage}</p>}
                                    </motion.div>
                                )}

                                {showSalaryField && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="base_salary">Salario Base (CRC)</Label>
                                        <Input
                                            id="base_salary"
                                            type="number"
                                            min="0"
                                            step="1000"
                                            value={data.base_salary}
                                            onChange={(e) => setData('base_salary', e.target.value)}
                                            placeholder="500000"
                                            className="transition-all focus:scale-[1.01]"
                                        />
                                        {errors.base_salary && <p className="text-sm text-destructive">{errors.base_salary}</p>}
                                    </motion.div>
                                )}

                                {showBoothRentalField && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="booth_rental_fee">Costo de Alquiler (CRC/mes)</Label>
                                        <Input
                                            id="booth_rental_fee"
                                            type="number"
                                            min="0"
                                            step="1000"
                                            value={data.booth_rental_fee}
                                            onChange={(e) => setData('booth_rental_fee', e.target.value)}
                                            placeholder="150000"
                                            className="transition-all focus:scale-[1.01]"
                                        />
                                        {errors.booth_rental_fee && <p className="text-sm text-destructive">{errors.booth_rental_fee}</p>}
                                    </motion.div>
                                )}

                                {data.employment_type !== 'freelancer' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-start space-x-2 pt-4 border-t"
                                    >
                                        <Checkbox 
                                            id="auto_accept" 
                                            checked={data.auto_accept_appointments}
                                            onCheckedChange={(checked) => setData('auto_accept_appointments', checked as boolean)}
                                            className="mt-1"
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="auto_accept" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Aceptar citas automáticamente
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Si se activa, las citas se confirmarán automáticamente sin necesidad de aprobación manual.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Advertencia de conflictos */}
                    {showConflictWarning && Object.keys(conflicts).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500 rounded-lg p-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="bg-amber-500 p-2 rounded-full">
                                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h4 className="font-semibold text-amber-900 dark:text-amber-200">Conflictos de Horario Detectados</h4>
                                    <div className="space-y-1">
                                        {Object.entries(conflicts).map(([key, message]) => (
                                            <p key={key} className="text-sm text-amber-800 dark:text-amber-300">
                                                • {message}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 bg-white dark:bg-slate-800 p-3 rounded border border-amber-300">
                                        <input
                                            type="checkbox"
                                            id="ignore-conflicts"
                                            checked={data.ignore_conflicts}
                                            onChange={(e) => setData('ignore_conflicts', e.target.checked)}
                                            className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <label htmlFor="ignore-conflicts" className="text-sm font-medium cursor-pointer">
                                            Confirmo que deseo proceder a pesar de estos conflictos
                                        </label>
                                    </div>
                                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                                        💡 Los empleados pueden trabajar en diferentes días u horarios específicos. Asegúrate de coordinar con el equipo.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Estaciones de Trabajo - Con Horarios */}
                    {workstations.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-2 rounded-full border border-purple-500/20">
                                            <Briefcase className="h-4 w-4 text-purple-500" />
                                        </div>
                                        Estaciones de Trabajo
                                    </CardTitle>
                                    <CardDescription>
                                        Asigna estaciones y define horarios. Se validará que no haya conflictos con otros empleados.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Selector para agregar estaciones */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label>Agregar Estación</Label>
                                            {errors['workstation_assignments'] && (
                                                <p className="text-xs text-destructive">
                                                    {errors['workstation_assignments']}
                                                </p>
                                            )}
                                        </div>
                                        <Select
                                            value=""
                                            onValueChange={(value) => {
                                                const id = parseInt(value);
                                                if (!data.workstation_assignments.some(wa => wa.workstation_id === id)) {
                                                    addWorkstationAssignment(id);
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar estación..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {workstations
                                                    .filter(ws => !data.workstation_assignments.some(wa => wa.workstation_id === ws.id))
                                                    .map((ws) => (
                                                        <SelectItem key={ws.id} value={ws.id.toString()}>
                                                            {ws.name} {ws.number && `(#${ws.number})`}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        {workstations.filter(ws => !data.workstation_assignments.some(wa => wa.workstation_id === ws.id)).length === 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                Todas las estaciones ya están asignadas
                                            </p>
                                        )}
                                    </div>

                                    {/* Lista de estaciones asignadas con horarios editables */}
                                    {data.workstation_assignments.length > 0 ? (
                                        <div className="space-y-3">
                                            <Label>Estaciones Asignadas ({data.workstation_assignments.length})</Label>
                                            <div className="space-y-3">
                                                {data.workstation_assignments.map((assignment, index) => {
                                                    const ws = workstations.find(w => w.id === assignment.workstation_id);
                                                    if (!ws) return null;
                                                    
                                                    return (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: 10 }}
                                                            whileHover={{ x: 4 }}
                                                            className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary/30 p-4 rounded-lg space-y-3 transition-all hover:border-primary/50 hover:shadow-md"
                                                        >
                                                            {/* Header con nombre y botón eliminar */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <motion.div 
                                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                                        transition={{ type: "spring", stiffness: 400 }}
                                                                        className="bg-gradient-to-br from-primary/30 to-primary/20 p-2.5 rounded-full border border-primary/30 shadow-sm"
                                                                    >
                                                                        <Briefcase className="h-4 w-4 text-primary" />
                                                                    </motion.div>
                                                                    <div>
                                                                        <p className="font-semibold text-base">
                                                                            {ws.name}
                                                                            {ws.number && <span className="text-muted-foreground ml-1 text-sm">(#{ws.number})</span>}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeWorkstationAssignment(index)}
                                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                    >
                                                                        Quitar
                                                                    </Button>
                                                                </motion.div>
                                                            </div>

                                                            {/* Campos de horario */}
                                                            <div className="grid grid-cols-2 gap-3 bg-muted/30 p-3 rounded-lg border border-border/50">
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs font-semibold flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        Hora Inicio
                                                                    </Label>
                                                                    <Input
                                                                        type="time"
                                                                        value={assignment.start_time}
                                                                        onChange={(e) => updateWorkstationAssignment(index, 'start_time', e.target.value)}
                                                                        className="text-sm transition-all focus:scale-[1.02]"
                                                                    />
                                                                    {errors[`workstation_assignments.${index}.start_time`] && (
                                                                        <p className="text-xs text-destructive">
                                                                            {errors[`workstation_assignments.${index}.start_time`]}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs font-semibold flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        Hora Fin
                                                                    </Label>
                                                                    <Input
                                                                        type="time"
                                                                        value={assignment.end_time}
                                                                        onChange={(e) => updateWorkstationAssignment(index, 'end_time', e.target.value)}
                                                                        className="text-sm transition-all focus:scale-[1.02]"
                                                                    />
                                                                    {errors[`workstation_assignments.${index}.end_time`] && (
                                                                        <p className="text-xs text-destructive">
                                                                            {errors[`workstation_assignments.${index}.end_time`]}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Campo de notas */}
                                                            <div className="space-y-1">
                                                                <Label className="text-xs font-semibold">Notas</Label>
                                                                <Input
                                                                    type="text"
                                                                    value={assignment.notes}
                                                                    onChange={(e) => updateWorkstationAssignment(index, 'notes', e.target.value)}
                                                                    placeholder="Ej: Solo lunes y miércoles"
                                                                    className="text-sm transition-all focus:scale-[1.02]"
                                                                />
                                                                {errors[`workstation_assignments.${index}.notes`] && (
                                                                    <p className="text-xs text-destructive">
                                                                        {errors[`workstation_assignments.${index}.notes`]}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Mostrar error de conflicto si existe */}
                                                            {errors[`workstation_assignments.${index}.workstation_id`] && (
                                                                <motion.div 
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="bg-gradient-to-r from-destructive/10 to-transparent border-l-4 border-destructive rounded p-3"
                                                                >
                                                                    <p className="text-xs text-destructive font-medium flex items-start gap-2">
                                                                        <span className="text-base">⚠️</span>
                                                                        {errors[`workstation_assignments.${index}.workstation_id`]}
                                                                    </p>
                                                                </motion.div>
                                                            )}
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                            <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Sin estaciones asignadas</p>
                                            <p className="text-xs mt-1">Selecciona una estación del menú superior</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Botones */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4"
                    >
                        <Link href={`/business/staff/${staff.id}`} className="flex-1">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                                <Button type="button" variant="outline" className="w-full shadow-sm hover:shadow-md transition-all">
                                    Cancelar
                                </Button>
                            </motion.div>
                        </Link>
                        <motion.div 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }}
                            className="flex-1"
                        >
                            <Button 
                                type="submit" 
                                disabled={processing}
                                className="w-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90"
                            >
                                {processing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="mr-2 inline-block"
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
                    </motion.div>
                </form>
            </div>
        </AppLayout>
    );
}
