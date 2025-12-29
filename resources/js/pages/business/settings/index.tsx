import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, User, Shield } from 'lucide-react';

export default function SettingsIndex() {
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
