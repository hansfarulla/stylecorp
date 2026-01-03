import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

interface Establishment {
    id: number;
    name: string;
}

const DEFAULT_COLORS = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', 
    '#06b6d4', '#84cc16', '#a855f7', '#f43f5e', '#d946ef', '#64748b'
];

const COMMON_ICONS = [
    '✂️', '🧔', '🎨', '💇', '💆', '🪒', '🧖', '💆‍♀️', '💅', '💄', 
    '✨', '🌟', '💫', '⭐', '🔥', '💎', '👑', '🎭', '🎪', '📂'
];

export default function CreateServiceCategory({ establishment }: { establishment: Establishment }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        icon: '📁',
        color: '#3b82f6',
        description: '',
        order: 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/business/service-categories');
    };

    return (
        <AppLayout>
            <Head title="Nueva Categoría" />
            
            <div className="p-4 max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/business/service-categories">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Nueva Categoría
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Crea una nueva categoría para organizar tus servicios
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Básica</CardTitle>
                            <CardDescription>
                                Define el nombre y características de la categoría
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej: Corte de Cabello"
                                    required
                                    className="h-11"
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (opcional)</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="Se genera automáticamente si se deja vacío"
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    El slug se usa en URLs y debe ser único. Si lo dejas vacío, se generará automáticamente.
                                </p>
                                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Breve descripción de la categoría"
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Orden de visualización</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    className="h-11"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Las categorías se ordenan de menor a mayor número
                                </p>
                                {errors.order && <p className="text-sm text-destructive">{errors.order}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Apariencia</CardTitle>
                            <CardDescription>
                                Personaliza el ícono y color de la categoría
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Icono */}
                            <div className="space-y-3">
                                <Label>Ícono</Label>
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="flex items-center justify-center w-16 h-16 rounded-lg text-3xl border-2"
                                        style={{ backgroundColor: `${data.color}20`, borderColor: data.color }}
                                    >
                                        {data.icon}
                                    </div>
                                    <Input
                                        value={data.icon}
                                        onChange={(e) => setData('icon', e.target.value)}
                                        placeholder="Emoji o ícono"
                                        className="flex-1 h-11"
                                    />
                                </div>
                                <div className="grid grid-cols-10 gap-2">
                                    {COMMON_ICONS.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setData('icon', icon)}
                                            className="flex items-center justify-center w-full aspect-square text-2xl rounded-md hover:bg-muted border border-transparent hover:border-primary transition-all"
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                                {errors.icon && <p className="text-sm text-destructive">{errors.icon}</p>}
                            </div>

                            {/* Color */}
                            <div className="space-y-3">
                                <Label>Color</Label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="w-16 h-11 rounded border border-input cursor-pointer"
                                    />
                                    <Input
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        placeholder="#3b82f6"
                                        className="flex-1 h-11"
                                    />
                                </div>
                                <div className="grid grid-cols-11 gap-2">
                                    {DEFAULT_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setData('color', color)}
                                            className="w-full aspect-square rounded-md border-2 hover:scale-110 transition-transform"
                                            style={{ 
                                                backgroundColor: color,
                                                borderColor: data.color === color ? 'white' : 'transparent',
                                                boxShadow: data.color === color ? '0 0 0 2px currentColor' : 'none'
                                            }}
                                        />
                                    ))}
                                </div>
                                {errors.color && <p className="text-sm text-destructive">{errors.color}</p>}
                            </div>

                            {/* Preview */}
                            <div className="pt-4 border-t">
                                <Label className="mb-3 block">Vista Previa</Label>
                                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                                    <div 
                                        className="flex items-center justify-center w-12 h-12 rounded-lg text-2xl"
                                        style={{ backgroundColor: `${data.color}20` }}
                                    >
                                        {data.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{data.name || 'Nombre de la categoría'}</h3>
                                        <p className="text-sm text-muted-foreground">{data.description || 'Descripción...'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 sticky bottom-0 md:static bg-background/95 backdrop-blur-sm md:bg-transparent p-4 md:p-0 -mx-4 md:mx-0 border-t md:border-0">
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="h-11 shadow-lg hover:shadow-xl transition-all"
                        >
                            {processing ? 'Guardando...' : 'Crear Categoría'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="h-11"
                        >
                            <Link href="/business/service-categories">
                                Cancelar
                            </Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
