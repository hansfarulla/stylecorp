import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Store, AlertCircle } from 'lucide-react';

export default function NoEstablishment() {
    return (
        <AppLayout>
            <Head title="Sin Establecimiento" />
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4">
                            <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No tienes establecimiento asignado
                        </h1>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Necesitas crear o ser asignado a un establecimiento para acceder al dashboard empresarial.
                        </p>
                        
                        <div className="space-y-3">
                            <Link
                                href="/business/establishment/create"
                                className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Store className="w-5 h-5" />
                                Crear establecimiento
                            </Link>
                            
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                            >
                                Volver al inicio
                            </Link>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ¿Necesitas ayuda? <a href="/support" className="text-blue-600 dark:text-blue-400 hover:underline">Contacta soporte</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
