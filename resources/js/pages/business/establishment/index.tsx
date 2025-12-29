import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Mail, Edit, User, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlowingBadge } from '@/components/ui/glowing-badge';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Establishment {
    id: number;
    name: string;
    business_name?: string;
    type: string;
    address: string;
    province: string;
    canton: string;
    district: string;
    phone: string;
    email?: string;
    whatsapp?: string;
    website?: string;
    status: string;
    owner?: User;
    manager?: User;
}

export default function EstablishmentIndex({ establishment }: { establishment: Establishment }) {
    const typeLabels: Record<string, string> = {
        salon: 'Salón de Belleza',
        barbershop: 'Barbería',
        spa: 'Spa',
        mixed: 'Mixto'
    };

    return (
        <AppLayout>
            <Head title="Mi Establecimiento" />
            
            <div className="space-y-6 max-w-5xl mx-auto p-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-start"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Establecimiento Actual
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Información del establecimiento activo
                        </p>
                    </div>
                    <Link href={`/business/establishment/${establishment.id}/edit`}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="shadow-lg">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-gradient-to-br from-card to-card/50 border-primary/20">
                        <CardHeader className="border-b pb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="bg-gradient-to-br from-primary/20 to-primary/10 p-3 rounded-full border border-primary/20 shadow-sm"
                                    >
                                        <Store className="h-8 w-8 text-primary" />
                                    </motion.div>
                                    <div>
                                        <CardTitle className="text-2xl">{establishment.name}</CardTitle>
                                        {establishment.business_name && (
                                            <CardDescription className="text-base mt-1.5">
                                                {establishment.business_name}
                                            </CardDescription>
                                        )}
                                    </div>
                                </div>
                                <GlowingBadge variant="info" className="text-sm px-3 py-1.5">
                                    {typeLabels[establishment.type] || establishment.type}
                                </GlowingBadge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Columna izquierda */}
                                <div className="space-y-5">
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="font-semibold text-sm text-muted-foreground mb-4 tracking-wider">UBICACIÓN</h3>
                                        <motion.div 
                                            whileHover={{ x: 4 }}
                                            className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5"
                                        >
                                            <MapPin className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">{establishment.address}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {establishment.district}, {establishment.canton}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {establishment.province}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <h3 className="font-semibold text-sm text-muted-foreground mb-4 tracking-wider">CONTACTO</h3>
                                        <div className="space-y-3">
                                            <motion.div 
                                                whileHover={{ x: 4 }}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5"
                                            >
                                                <Phone className="h-5 w-5 text-green-500 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium">Teléfono</p>
                                                    <p className="text-sm text-muted-foreground">{establishment.phone}</p>
                                                </div>
                                            </motion.div>

                                            {establishment.email && (
                                                <motion.div 
                                                    whileHover={{ x: 4 }}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5"
                                                >
                                                    <Mail className="h-5 w-5 text-purple-500 shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium">Email</p>
                                                        <p className="text-sm text-muted-foreground">{establishment.email}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {establishment.whatsapp && (
                                                <motion.div 
                                                    whileHover={{ x: 4 }}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5"
                                                >
                                                    <Phone className="h-5 w-5 text-emerald-600 shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-medium">WhatsApp</p>
                                                        <p className="text-sm text-muted-foreground">{establishment.whatsapp}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Columna derecha */}
                                <div className="space-y-5">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="font-semibold text-sm text-muted-foreground mb-4 tracking-wider">ADMINISTRACIÓN</h3>
                                        <div className="space-y-3">
                                            {establishment.owner && (
                                                <motion.div 
                                                    whileHover={{ x: 4 }}
                                                    className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5"
                                                >
                                                    <div className="bg-gradient-to-br from-amber-500/30 to-amber-500/20 p-2 rounded-full border border-amber-500/30 shrink-0">
                                                        <User className="h-4 w-4 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Propietario</p>
                                                        <p className="text-sm text-muted-foreground">{establishment.owner.name}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{establishment.owner.email}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {establishment.manager ? (
                                                <motion.div 
                                                    whileHover={{ x: 4 }}
                                                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5"
                                                >
                                                    <div className="bg-gradient-to-br from-primary/30 to-primary/20 p-2 rounded-full border border-primary/30 shrink-0">
                                                        <User className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Manager Asignado</p>
                                                        <p className="text-sm text-muted-foreground">{establishment.manager.name}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{establishment.manager.email}</p>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    whileHover={{ x: 4 }}
                                                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border-2 border-dashed border-muted"
                                                >
                                                    <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium mb-1">Sin Manager Asignado</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            El propietario administra directamente este establecimiento.
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {establishment.website && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <h3 className="font-semibold text-sm text-muted-foreground mb-4 tracking-wider">SITIO WEB</h3>
                                            <motion.a 
                                                whileHover={{ x: 4 }}
                                                href={establishment.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 rounded-lg bg-indigo-500/5 text-sm text-primary hover:text-primary/80 transition-colors"
                                            >
                                                <Building2 className="h-4 w-4" />
                                                {establishment.website}
                                            </motion.a>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </AppLayout>
    );
}
