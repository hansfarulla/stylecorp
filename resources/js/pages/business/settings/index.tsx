import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, User, Shield, Users, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsIndex() {
    const { auth } = usePage().props as any;
    const isOwner = auth.user?.role === 'owner' || auth.user?.role === 'super_admin';
    
    return (
        <AppLayout>
            <Head title="Configuración" />
            
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Configuración de Usuario</h1>
                <p className="text-muted-foreground">
                    Gestiona tus preferencias personales y de cuenta
                </p>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <CardTitle>Perfil</CardTitle>
                        </div>
                        <CardDescription>
                            Actualiza tu información personal desde tu perfil
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Ve a tu <a href="/settings/profile" className="text-primary hover:underline">perfil de usuario</a> para actualizar tu información personal.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            <CardTitle>Notificaciones</CardTitle>
                        </div>
                        <CardDescription>
                            Configura cómo y cuándo recibir notificaciones
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Configuración de notificaciones próximamente disponible
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <CardTitle>Seguridad</CardTitle>
                        </div>
                        <CardDescription>
                            Gestiona la seguridad de tu cuenta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Ve a <a href="/settings/password" className="text-primary hover:underline">cambiar contraseña</a> o configura la <a href="/settings/two-factor-authentication" className="text-primary hover:underline">autenticación de dos factores</a>.
                        </p>
                    </CardContent>
                </Card>

                {/* Permisos de Equipo - Solo para Owners */}
                {isOwner && (
                    <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-primary" />
                                    <CardTitle>Permisos de Equipo</CardTitle>
                                </div>
                                <Link href="/business/staff/permissions">
                                    <Button variant="outline" size="sm">
                                        Gestionar Permisos
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                            <CardDescription>
                                Asigna permisos granulares a administradores y empleados
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Control de Acceso Flexible
                                </h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Define exactamente qué puede hacer cada miembro de tu equipo:
                                </p>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>
                                            <strong className="text-foreground">Múltiples Administradores:</strong> Asigna diferentes permisos a cada uno
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>
                                            <strong className="text-foreground">Acceso Específico:</strong> Otorga acceso solo a las secciones necesarias
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>
                                            <strong className="text-foreground">29 Permisos:</strong> Desde gestión de citas hasta reportes financieros
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Shield className="h-4 w-4" />
                                <span>Los permisos se aplican por establecimiento y se verifican en tiempo real</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">💡 Configuración de Establecimientos</h3>
                    <p className="text-sm text-muted-foreground">
                        Para configurar horarios, políticas de reservas y otras opciones específicas de cada establecimiento, 
                        ve a <a href="/business/establishment" className="text-primary hover:underline font-medium">Mis Establecimientos</a> y edita cada uno individualmente.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
