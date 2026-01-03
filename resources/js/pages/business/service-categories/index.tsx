import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ServiceCategory {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    description: string | null;
    order: number;
    is_active: boolean;
    services_count: number;
}

interface Establishment {
    id: number;
    name: string;
}

export default function ServiceCategoriesIndex({ categories, establishment }: { categories: ServiceCategory[], establishment: Establishment }) {
    
    const handleDelete = (categoryId: number) => {
        router.delete(`/business/service-categories/${categoryId}`);
    };

    return (
        <AppLayout>
            <Head title="Categorías de Servicios" />
            
            <div className="p-4 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Categorías de Servicios
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Gestiona las categorías para organizar tus servicios
                        </p>
                    </div>
                    <Button asChild className="shadow-lg hover:shadow-xl transition-all">
                        <Link href="/business/service-categories/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Categoría
                        </Link>
                    </Button>
                </div>

                {categories.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-6xl mb-4">📂</div>
                            <h3 className="text-xl font-semibold mb-2">No hay categorías</h3>
                            <p className="text-muted-foreground text-center mb-6 max-w-md">
                                Crea categorías para organizar mejor tus servicios y facilitar la búsqueda para tus clientes
                            </p>
                            <Button asChild>
                                <Link href="/business/service-categories/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Primera Categoría
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {categories.map((category) => (
                            <Card key={category.id} className="hover:shadow-lg transition-all">
                                <CardContent className="p-4 md:p-6">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        {/* Drag handle (futuro) */}
                                        <div className="hidden md:flex items-center text-muted-foreground cursor-grab">
                                            <GripVertical className="h-5 w-5" />
                                        </div>

                                        {/* Icono y Color */}
                                        <div 
                                            className="flex items-center justify-center w-12 h-12 rounded-lg text-2xl"
                                            style={{ backgroundColor: category.color ? `${category.color}20` : '#f1f5f9' }}
                                        >
                                            {category.icon || '📁'}
                                        </div>

                                        {/* Información */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold truncate">
                                                    {category.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {category.services_count} servicio{category.services_count !== 1 ? 's' : ''}
                                                    </Badge>
                                                    {!category.is_active && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Inactiva
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            {category.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {category.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Slug: <code className="bg-muted px-1 py-0.5 rounded">{category.slug}</code>
                                            </p>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/business/service-categories/${category.id}/edit`}>
                                                    <Edit className="h-4 w-4 md:mr-2" />
                                                    <span className="hidden md:inline">Editar</span>
                                                </Link>
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                                                        disabled={category.services_count > 0}
                                                    >
                                                        <Trash2 className="h-4 w-4 md:mr-2" />
                                                        <span className="hidden md:inline">Eliminar</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Se eliminará la categoría "{category.name}" permanentemente.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(category.id)}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {categories.length > 0 && (
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle className="text-lg">💡 Consejos</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <p>• Las categorías te ayudan a organizar tus servicios y facilitan la navegación para tus clientes</p>
                            <p>• No puedes eliminar una categoría que tiene servicios asociados</p>
                            <p>• Puedes desactivar temporalmente una categoría editándola</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
