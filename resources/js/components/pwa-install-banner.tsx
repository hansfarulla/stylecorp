import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Verificar si ya está instalada
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        // Verificar si el usuario ya rechazó la instalación
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('[PWA] User accepted the install prompt');
        } else {
            console.log('[PWA] User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowBanner(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-install-dismissed', 'true');
        setShowBanner(false);
    };

    return (
        <AnimatePresence>
            {showBanner && deferredPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
                >
                    <div className="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl shadow-2xl p-4 backdrop-blur-xl">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                                <Download className="h-6 w-6 text-primary-foreground" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm mb-1 text-foreground">
                                    Instalar StyleCore
                                </h3>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Instala la app para acceso rápido y funcionalidad offline
                                </p>
                                
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleInstall}
                                        size="sm"
                                        className="h-8 text-xs shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90"
                                    >
                                        <Download className="h-3 w-3 mr-1.5" />
                                        Instalar
                                    </Button>
                                    <Button
                                        onClick={handleDismiss}
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 text-xs"
                                    >
                                        Ahora no
                                    </Button>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleDismiss}
                                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
