import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Fix para iconos de Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface LocationPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

function LocationMarker({ position, setPosition }: { position: LatLng | null; setPosition: (pos: LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({ 
    isOpen, 
    onClose, 
    onLocationSelect,
    initialLat = 9.9281,
    initialLng = -84.0907
}: LocationPickerProps) {
    const [position, setPosition] = useState<LatLng | null>(new LatLng(initialLat, initialLng));
    const [searchAddress, setSearchAddress] = useState('');

    const handleConfirm = () => {
        if (position) {
            onLocationSelect(position.lat, position.lng);
            onClose();
        }
    };

    const handleSearch = async () => {
        if (!searchAddress.trim()) return;

        try {
            // Usar Nominatim para geocodificación (servicio gratuito de OpenStreetMap)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`
            );
            const data = await response.json();
            
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setPosition(new LatLng(parseFloat(lat), parseFloat(lon)));
            } else {
                alert('No se encontró la dirección. Intenta con otra búsqueda.');
            }
        } catch (error) {
            console.error('Error buscando dirección:', error);
            alert('Error al buscar la dirección. Intenta nuevamente.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Seleccionar Ubicación en el Mapa</DialogTitle>
                    <DialogDescription>
                        Haz clic en el mapa para seleccionar la ubicación exacta de tu establecimiento
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Buscador de dirección */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar dirección (ej: Avenida Central, San José)"
                                value={searchAddress}
                                onChange={(e) => setSearchAddress(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button onClick={handleSearch} variant="secondary">
                            Buscar
                        </Button>
                    </div>

                    {/* Coordenadas actuales */}
                    {position && (
                        <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm">
                                📍 Coordenadas seleccionadas: <strong>{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</strong>
                            </p>
                        </div>
                    )}

                    {/* Mapa */}
                    <div className="h-[400px] rounded-lg overflow-hidden border">
                        <MapContainer
                            center={position || new LatLng(initialLat, initialLng)}
                            zoom={15}
                            style={{ height: '100%', width: '100%' }}
                            key={position ? `${position.lat}-${position.lng}` : 'default'}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker position={position} setPosition={setPosition} />
                        </MapContainer>
                    </div>

                    {/* Instrucciones */}
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                            💡 <strong>Tip:</strong> Puedes buscar una dirección o hacer clic directamente en el mapa para marcar la ubicación exacta.
                        </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm} disabled={!position}>
                            Confirmar Ubicación
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
