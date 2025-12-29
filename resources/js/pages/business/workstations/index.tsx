import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, User, AlertCircle, Clock, Trash2, Briefcase, Eye, Save } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlowingBadge } from '@/components/ui/glowing-badge';

interface UserAssignment {
    user_id: number;
    start_time?: string;
    end_time?: string;
    days?: string[];
    notes?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    pivot?: {
        start_time?: string;
        end_time?: string;
        days?: string;
        notes?: string;
    };
}

interface Workstation {
    id: number;
    name: string;
    number?: string;
    description?: string;
    status: 'available' | 'occupied' | 'maintenance' | 'disabled';
    assigned_user_id?: number;
    assigned_user?: User;
    assigned_users?: User[];
}

interface Establishment {
    id: number;
    name: string;
}

interface StaffUser {
    id: number;
    name: string;
    email: string;
}

const statusLabels: Record<string, string> = {
    available: 'Disponible',
    occupied: 'Ocupada',
    maintenance: 'Mantenimiento',
    disabled: 'Deshabilitada',
};

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    available: 'default',
    occupied: 'secondary',
    maintenance: 'outline',
    disabled: 'destructive',
};

export default function WorkstationsIndex({ 
    workstations, 
    establishment,
    staff = []
}: { 
    workstations: Workstation[]; 
    establishment: Establishment;
    staff?: StaffUser[];
}) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingWorkstation, setEditingWorkstation] = useState<Workstation | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [workstationToDelete, setWorkstationToDelete] = useState<Workstation | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        number: '',
        description: '',
        assigned_users: [] as UserAssignment[],
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm<{
        name: string;
        number: string;
        description: string;
        status: 'available' | 'occupied' | 'maintenance' | 'disabled';
        assigned_user_id: string;
        assigned_users: UserAssignment[];
    }>({
        name: '',
        number: '',
        description: '',
        status: 'available',
        assigned_user_id: '',
        assigned_users: [],
    });

    const addUserAssignmentToCreate = () => {
        setData('assigned_users', [
            ...data.assigned_users,
            { user_id: 0, start_time: '', end_time: '', days: [], notes: '' }
        ]);
    };

    const removeUserAssignmentFromCreate = (index: number) => {
        const newAssignments = data.assigned_users.filter((_, i) => i !== index);
        setData('assigned_users', newAssignments);
    };

    const updateUserAssignmentInCreate = (index: number, field: keyof UserAssignment, value: any) => {
        const newAssignments = [...data.assigned_users];
        newAssignments[index] = { ...newAssignments[index], [field]: value };
        setData('assigned_users', newAssignments);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/business/workstations', {
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
            },
        });
    };

    const openEditDialog = (workstation: Workstation) => {
        setEditingWorkstation(workstation);
        
        // Convertir asignaciones existentes al formato del formulario
        const existingAssignments: UserAssignment[] = workstation.assigned_users?.map(user => ({
            user_id: user.id,
            start_time: user.pivot?.start_time || '',
            end_time: user.pivot?.end_time || '',
            days: user.pivot?.days ? JSON.parse(user.pivot.days) : [],
            notes: user.pivot?.notes || '',
        })) || [];

        setEditData({
            name: workstation.name,
            number: workstation.number || '',
            description: workstation.description || '',
            status: workstation.status,
            assigned_user_id: workstation.assigned_user_id ? workstation.assigned_user_id.toString() : '',
            assigned_users: existingAssignments,
        });
        setIsEditOpen(true);
    };

    const openDeleteDialog = (workstation: Workstation) => {
        setWorkstationToDelete(workstation);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (workstationToDelete) {
            router.delete(`/business/workstations/${workstationToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setWorkstationToDelete(null);
                }
            });
        }
    };

    const addUserAssignment = () => {
        setEditData('assigned_users', [
            ...editData.assigned_users,
            { user_id: 0, start_time: '', end_time: '', days: [], notes: '' }
        ]);
    };

    const removeUserAssignment = (index: number) => {
        const newAssignments = editData.assigned_users.filter((_, i) => i !== index);
        setEditData('assigned_users', newAssignments);
    };

    const updateUserAssignment = (index: number, field: keyof UserAssignment, value: any) => {
        const newAssignments = [...editData.assigned_users];
        newAssignments[index] = { ...newAssignments[index], [field]: value };
        setEditData('assigned_users', newAssignments);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingWorkstation) return;
        
        put(`/business/workstations/${editingWorkstation.id}`, {
            onSuccess: () => {
                resetEdit();
                setIsEditOpen(false);
                setEditingWorkstation(null);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Estaciones de Trabajo" />
            
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Estaciones de Trabajo</h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona las sillas y espacios de trabajo de {establishment.name}
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Estación
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Nueva Estación de Trabajo</DialogTitle>
                                <DialogDescription>
                                    Crea una nueva silla o espacio de trabajo y asigna personal
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Silla 1, Estación Principal"
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="number">Número</Label>
                                        <Input
                                            id="number"
                                            value={data.number}
                                            onChange={(e) => setData('number', e.target.value)}
                                            placeholder="1"
                                        />
                                        {errors.number && <p className="text-sm text-destructive">{errors.number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Input
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Detalles adicionales..."
                                        />
                                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                    </div>
                                </div>

                                {/* Sección de asignaciones */}
                                {staff.length > 0 && (
                                    <div className="space-y-4 border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <Label className="text-base">Asignaciones de Personal (Opcional)</Label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Asigna empleados con horarios específicos
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addUserAssignmentToCreate}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Agregar
                                            </Button>
                                        </div>

                                        {data.assigned_users.length > 0 && (
                                            <div className="space-y-3">
                                                {data.assigned_users.map((assignment, index) => (
                                                    <Card key={index}>
                                                        <CardContent className="pt-4 space-y-3">
                                                            <div className="flex justify-between items-start">
                                                                <Label>Empleado #{index + 1}</Label>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeUserAssignmentFromCreate(index)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>

                                                            <div>
                                                                <Label>Personal *</Label>
                                                                <Select
                                                                    value={assignment.user_id.toString()}
                                                                    onValueChange={(value) => updateUserAssignmentInCreate(index, 'user_id', parseInt(value))}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccionar empleado" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {staff.map((user) => (
                                                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                                                {user.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div>
                                                                    <Label>Hora Inicio</Label>
                                                                    <Input
                                                                        type="time"
                                                                        value={assignment.start_time || ''}
                                                                        onChange={(e) => updateUserAssignmentInCreate(index, 'start_time', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label>Hora Fin</Label>
                                                                    <Input
                                                                        type="time"
                                                                        value={assignment.end_time || ''}
                                                                        onChange={(e) => updateUserAssignmentInCreate(index, 'end_time', e.target.value)}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <Label>Notas</Label>
                                                                <Input
                                                                    value={assignment.notes || ''}
                                                                    onChange={(e) => updateUserAssignmentInCreate(index, 'notes', e.target.value)}
                                                                    placeholder="Ej: Turno matutino"
                                                                />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setIsCreateOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={processing}
                                    >
                                        Crear Estación
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background to-background/95">
                            <DialogHeader className="border-b pb-4">
                                <DialogTitle className="text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="bg-gradient-to-br from-primary/20 to-primary/10 p-2 rounded-full border border-primary/20"
                                    >
                                        <Edit className="h-5 w-5 text-primary" />
                                    </motion.div>
                                    Editar Estación de Trabajo
                                </DialogTitle>
                                <DialogDescription className="text-base text-muted-foreground">
                                    Modifica la información y asigna personal con horarios opcionales
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit} className="space-y-6">
                                {/* Información General */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 border-primary/20">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 p-2 rounded-full border border-blue-500/20">
                                                    <Briefcase className="h-4 w-4 text-blue-500" />
                                                </div>
                                                Información General
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <motion.div whileHover={{ x: 2 }} className="space-y-2">
                                                    <Label htmlFor="edit-name" className="flex items-center gap-2">
                                                        <span className="text-primary">•</span>
                                                        Nombre *
                                                    </Label>
                                                    <Input
                                                        id="edit-name"
                                                        value={editData.name}
                                                        onChange={(e) => setEditData('name', e.target.value)}
                                                        placeholder="Ej: Silla Principal"
                                                        className={editErrors.name ? 'border-red-500' : 'focus-visible:ring-primary/30'}
                                                    />
                                                    {editErrors.name && <p className="text-sm text-red-500 mt-1">{editErrors.name}</p>}
                                                </motion.div>

                                                <motion.div whileHover={{ x: 2 }} className="space-y-2">
                                                    <Label htmlFor="edit-number">Número</Label>
                                                    <Input
                                                        id="edit-number"
                                                        value={editData.number}
                                                        onChange={(e) => setEditData('number', e.target.value)}
                                                        placeholder="Ej: 1, A1, etc."
                                                        className="focus-visible:ring-primary/30"
                                                    />
                                                </motion.div>
                                            </div>

                                            <motion.div whileHover={{ x: 2 }} className="space-y-2">
                                                <Label htmlFor="edit-description">Descripción</Label>
                                                <Textarea
                                                    id="edit-description"
                                                    value={editData.description}
                                                    onChange={(e) => setEditData('description', e.target.value)}
                                                    placeholder="Información adicional sobre esta estación"
                                                    rows={2}
                                                    className="focus-visible:ring-primary/30"
                                                />
                                            </motion.div>

                                            <motion.div whileHover={{ x: 2 }} className="space-y-2">
                                                <Label htmlFor="edit-status" className="flex items-center gap-2">
                                                    <span className="text-primary">•</span>
                                                    Estado *
                                                </Label>
                                                <Select
                                                    value={editData.status}
                                                    onValueChange={(value) => setEditData('status', value as any)}
                                                >
                                                    <SelectTrigger id="edit-status" className="focus:ring-primary/30">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="available">✓ Disponible</SelectItem>
                                                        <SelectItem value="occupied">👤 Ocupada</SelectItem>
                                                        <SelectItem value="maintenance">🔧 Mantenimiento</SelectItem>
                                                        <SelectItem value="disabled">❌ Deshabilitada</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {editErrors.status && <p className="text-sm text-red-500 mt-1">{editErrors.status}</p>}
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                </motion.div>

                                {staff.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Card className="transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 border-purple-500/20">
                                            <CardHeader>
                                                <div className="flex justify-between items-center">
                                                    <CardTitle className="flex items-center gap-2 text-lg">
                                                        <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 p-2 rounded-full border border-purple-500/20">
                                                            <User className="h-4 w-4 text-purple-500" />
                                                        </div>
                                                        Asignaciones de Personal
                                                    </CardTitle>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={addUserAssignment}
                                                            className="shadow-sm hover:shadow-md transition-shadow"
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Agregar
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                                <CardDescription>
                                                    Asigna múltiples empleados con horarios específicos (opcional)
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">

                                                {editData.assigned_users.length === 0 ? (
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-center py-8 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-muted"
                                                    >
                                                        <motion.div
                                                            animate={{ y: [0, -5, 0] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                        >
                                                            <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                                        </motion.div>
                                                        <p className="text-sm text-muted-foreground mb-3">
                                                            Sin asignaciones. Esta estación puede ser usada por cualquiera.
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={addUserAssignment}
                                                        >
                                                            Asignar Primer Empleado
                                                        </Button>
                                                    </motion.div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {editData.assigned_users.map((assignment, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                whileHover={{ x: 4 }}
                                                                className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-primary/30 p-4 rounded-lg space-y-3"
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-center gap-2">
                                                                        <motion.div 
                                                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                                                            className="bg-gradient-to-br from-primary/30 to-primary/20 p-1.5 rounded-full border border-primary/30"
                                                                        >
                                                                            <User className="h-3.5 w-3.5 text-primary" />
                                                                        </motion.div>
                                                                        <Label className="text-sm">Empleado #{index + 1}</Label>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeUserAssignment(index)}
                                                                        className="h-7 text-xs"
                                                                    >
                                                                        Eliminar
                                                                    </Button>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-sm flex items-center gap-1">
                                                                        <span className="text-primary">•</span>
                                                                        Personal *
                                                                    </Label>
                                                                    <Select
                                                                        value={assignment.user_id.toString()}
                                                                        onValueChange={(value) => updateUserAssignment(index, 'user_id', parseInt(value))}
                                                                    >
                                                                        <SelectTrigger className="focus:ring-primary/30">
                                                                            <SelectValue placeholder="Seleccionar empleado" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {staff.map((user) => (
                                                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                                                    {user.name}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50 space-y-3">
                                                                    <div className="flex items-center gap-2 text-sm font-medium">
                                                                        <Clock className="h-4 w-4 text-primary" />
                                                                        <span>Horario (Opcional)</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-xs">Hora Inicio</Label>
                                                                            <Input
                                                                                type="time"
                                                                                value={assignment.start_time || ''}
                                                                                onChange={(e) => updateUserAssignment(index, 'start_time', e.target.value)}
                                                                                placeholder="06:00"
                                                                                className="h-9 focus-visible:ring-primary/30"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-xs">Hora Fin</Label>
                                                                            <Input
                                                                                type="time"
                                                                                value={assignment.end_time || ''}
                                                                                onChange={(e) => updateUserAssignment(index, 'end_time', e.target.value)}
                                                                                placeholder="17:00"
                                                                                className="h-9 focus-visible:ring-primary/30"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-1.5">
                                                                    <Label className="text-sm">Notas (Opcional)</Label>
                                                                    <Input
                                                                        value={assignment.notes || ''}
                                                                        onChange={(e) => updateUserAssignment(index, 'notes', e.target.value)}
                                                                        placeholder="Ej: Turno matutino, Solo lunes y miércoles"
                                                                        className="focus-visible:ring-primary/30"
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}

                                <motion.div 
                                    className="flex justify-end gap-3 pt-6 border-t"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditOpen(false)}
                                            disabled={editProcessing}
                                            className="min-w-[100px]"
                                        >
                                            Cancelar
                                        </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            type="submit" 
                                            disabled={editProcessing}
                                            className="min-w-[140px] shadow-lg hover:shadow-xl transition-shadow"
                                        >
                                            {editProcessing ? (
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
                                </motion.div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {workstations.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">No hay estaciones registradas</p>
                            <p className="text-sm text-muted-foreground mb-6">
                                Crea tus primeras estaciones de trabajo para poder publicar ofertas
                            </p>
                            <Button onClick={() => setIsCreateOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Primera Estación
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workstations.map((workstation, idx) => (
                            <motion.div
                                key={workstation.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="h-full"
                            >
                            <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 overflow-hidden relative">
                                {/* Efecto de brillo en hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                
                                <CardHeader className="relative">
                                    <CardTitle className="flex justify-between items-start gap-2">
                                        <div className="flex items-center gap-3">
                                            <motion.div 
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.5 }}
                                                className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full border border-primary/20"
                                            >
                                                <Briefcase className="h-5 w-5 text-primary" />
                                            </motion.div>
                                            <span className="text-lg font-bold">{workstation.name}</span>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDeleteDialog(workstation)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 relative">
                                    {workstation.number && (
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-gradient-to-r from-blue-500/10 to-transparent border-l-4 border-blue-500/50 rounded-lg p-3"
                                        >
                                            <p className="text-xs text-muted-foreground mb-1">Número de Estación</p>
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">#{workstation.number}</p>
                                        </motion.div>
                                    )}

                                    {/* Estado */}
                                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1">Estado</p>
                                        <GlowingBadge
                                            variant={
                                                workstation.status === 'available' ? 'success' :
                                                workstation.status === 'occupied' ? 'info' :
                                                workstation.status === 'maintenance' ? 'warning' :
                                                'error'
                                            }
                                        >
                                            {statusLabels[workstation.status]}
                                        </GlowingBadge>
                                    </div>

                                    {workstation.description && (
                                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                                            <p className="text-xs text-muted-foreground mb-1">Descripción</p>
                                            <p className="text-sm">{workstation.description}</p>
                                        </div>
                                    )}

                                    {workstation.assigned_user && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Asignado a</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <User className="h-4 w-4" />
                                                <p className="text-sm font-medium">{workstation.assigned_user.name}</p>
                                            </div>
                                        </div>
                                    )}

                                    {workstation.assigned_users && workstation.assigned_users.length > 0 && (
                                        <div>
                                            <p className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Personal Asignado ({workstation.assigned_users.length})
                                            </p>
                                            <div className="space-y-2">
                                                {workstation.assigned_users.map((user, userIdx) => (
                                                    <motion.div
                                                        key={user.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: userIdx * 0.1 }}
                                                        whileHover={{ scale: 1.02, x: 4 }}
                                                        className="flex items-start gap-3 bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 p-3 rounded-lg text-xs transition-all"
                                                    >
                                                        <div className="bg-primary/20 p-2 rounded-full">
                                                            <User className="h-3 w-3 text-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold truncate text-foreground">{user.name}</p>
                                                            {user.pivot?.start_time && user.pivot?.end_time && (
                                                                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>{user.pivot.start_time} - {user.pivot.end_time}</span>
                                                                </div>
                                                            )}
                                                            {user.pivot?.notes && (
                                                                <p className="text-muted-foreground truncate mt-1 italic">{user.pivot.notes}</p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-4 border-t border-border/50">
                                        <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full transition-all hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400"
                                                onClick={() => window.location.href = `/business/workstations/${workstation.id}`}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Ver
                                            </Button>
                                        </motion.div>
                                        <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full transition-all hover:bg-green-500/10 hover:border-green-500/50 hover:text-green-600"
                                                onClick={() => openEditDialog(workstation)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Editar
                                            </Button>
                                        </motion.div>
                                    </div>
                                </CardContent>
                            </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Diálogo de confirmación de eliminación */}
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar estación?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente la estación
                                {workstationToDelete?.name && ` "${workstationToDelete.name}"`}
                                {workstationToDelete?.assigned_users && workstationToDelete.assigned_users.length > 0 && (
                                    <span className="block mt-2 text-orange-600 dark:text-orange-400 font-medium">
                                        Esta estación tiene {workstationToDelete.assigned_users.length} empleado(s) asignado(s).
                                    </span>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
