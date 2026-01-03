import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Edit, Eye, Mail, Phone, Briefcase, DollarSign, Users, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowingBadge } from '@/components/ui/glowing-badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface Staff {
    id: number;
    name: string;
    email: string;
    phone?: string;
    roles?: Array<{
        id: number;
        name: string;
    }>;
    pivot: {
        employment_type: string;
        commission_model: string;
        commission_percentage?: number;
        base_salary?: number;
        booth_rental_fee?: number;
        status: string;
    };
}

const employmentLabels: Record<string, string> = {
    employee: 'Empleado',
    freelancer: 'Freelancer',
};

const commissionLabels: Record<string, string> = {
    percentage: 'Comisión %',
    salary_plus: 'Salario + %',
    booth_rental: 'Alquiler silla',
    fixed_per_service: 'Fijo por servicio',
    salary_only: 'Solo salario',
};

export default function StaffIndex({ staff }: { staff: Staff[] }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

    const openDeleteDialog = (member: Staff) => {
        setStaffToDelete(member);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (staffToDelete) {
            router.delete(`/business/staff/${staffToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setStaffToDelete(null);
                }
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: 'CRC',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AppLayout>
            <Head title="Personal" />
            
            <div className="space-y-6 p-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Personal</h1>
                        <p className="text-sm text-muted-foreground mt-1">Gestiona tu equipo de trabajo</p>
                    </div>
                    <Link href="/business/staff/create">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="shadow-lg hover:shadow-xl transition-all">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Agregar Empleado
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((member, idx) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
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
                                                <Users className="h-5 w-5 text-primary" />
                                            </motion.div>
                                            <div>
                                                <span className="text-lg font-bold block">{member.name}</span>
                                                {member.roles && member.roles.length > 0 && (
                                                    <Badge variant="secondary" className="text-[10px] h-5 px-2 mt-1">
                                                        {member.roles[0].name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDeleteDialog(member)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    </CardTitle>
                                </CardHeader>
                            <CardContent className="space-y-4 relative">
                                {/* Información de contacto */}
                                <div className="space-y-2 bg-muted/30 rounded-lg p-3 border border-border/50">
                                    <motion.div 
                                        whileHover={{ x: 4 }}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Mail className="h-4 w-4 text-primary" />
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-medium truncate">{member.email}</span>
                                    </motion.div>
                                    
                                    {member.phone && (
                                        <motion.div 
                                            whileHover={{ x: 4 }}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span className="text-muted-foreground">Teléfono:</span>
                                            <span className="font-medium">{member.phone}</span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Tipo de empleo */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <p className="text-xs font-semibold text-muted-foreground">Tipo de Empleo</p>
                                    </div>
                                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 font-semibold">
                                        {employmentLabels[member.pivot.employment_type]}
                                    </Badge>
                                </motion.div>

                                {/* Modelo de comisión */}
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        <p className="text-xs font-semibold text-muted-foreground">Modelo de Comisión</p>
                                    </div>
                                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300 font-semibold">
                                        {commissionLabels[member.pivot.commission_model]}
                                    </Badge>
                                </motion.div>

                                {/* Datos financieros */}
                                {(member.pivot.commission_percentage || member.pivot.base_salary || member.pivot.booth_rental_fee) && (
                                    <div className="grid grid-cols-1 gap-2">
                                        {member.pivot.commission_percentage && (
                                            <motion.div 
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 text-center"
                                            >
                                                <p className="text-xs text-muted-foreground mb-1">Comisión</p>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{member.pivot.commission_percentage}%</p>
                                            </motion.div>
                                        )}

                                        {member.pivot.base_salary && (
                                            <motion.div 
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-3 text-center"
                                            >
                                                <p className="text-xs text-muted-foreground mb-1">Salario Base</p>
                                                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatCurrency(member.pivot.base_salary)}</p>
                                            </motion.div>
                                        )}

                                        {member.pivot.booth_rental_fee && (
                                            <motion.div 
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-3 text-center"
                                            >
                                                <p className="text-xs text-muted-foreground mb-1">Alquiler Silla</p>
                                                <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{formatCurrency(member.pivot.booth_rental_fee)}</p>
                                            </motion.div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4 border-t border-border/50">
                                    <Link href={`/business/staff/${member.id}`} className="flex-1">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                                            <Button variant="outline" size="sm" className="w-full transition-all hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Ver
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <Link href={`/business/staff/${member.id}/edit`} className="flex-1">
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

                {staff.length === 0 && (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground mb-4">No hay personal registrado</p>
                            <Link href="/business/staff/create">
                                <Button>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Agregar Primer Empleado
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Dialog de confirmación de eliminación */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar a <strong>{staffToDelete?.name}</strong>?
                            <br />
                            Esta acción no se puede deshacer. El empleado será removido del establecimiento.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
