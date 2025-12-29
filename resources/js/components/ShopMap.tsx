import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, MapPin } from 'lucide-react';

// Fix para iconos de Leaflet en webpack/vite
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

interface Shop {
    id: number;
    name: string;
    lat: number;
    lng: number;
    rating: number;
    address: string;
    type: 'barberia' | 'salon';
    openNow: boolean;
    image?: string;
}

interface ShopMapProps {
    shops?: Shop[];
    center?: [number, number];
    zoom?: number;
    className?: string;
}

const defaultShops: Shop[] = [
    {
        id: 1,
        name: 'Urban Style Barbería',
        lat: 9.9334,
        lng: -84.0789,
        rating: 4.9,
        address: 'Av. Central, San José',
        type: 'barberia',
        openNow: true
    },
    {
        id: 2,
        name: 'Classic Cuts',
        lat: 9.9280,
        lng: -84.0820,
        rating: 4.8,
        address: 'Barrio Escalante',
        type: 'barberia',
        openNow: true
    },
    {
        id: 3,
        name: 'Elite Salon',
        lat: 9.9370,
        lng: -84.0750,
        rating: 4.7,
        address: 'Los Yoses, San José',
        type: 'salon',
        openNow: false
    },
    {
        id: 4,
        name: 'The Barber Shop',
        lat: 9.9310,
        lng: -84.0800,
        rating: 4.6,
        address: 'Paseo Colón',
        type: 'barberia',
        openNow: true
    },
    {
        id: 5,
        name: 'Estilo Latino',
        lat: 9.9290,
        lng: -84.0765,
        rating: 4.8,
        address: 'Sabana Norte',
        type: 'salon',
        openNow: true
    }
];

export default function ShopMap({ 
    shops = defaultShops, 
    center = [9.9334, -84.0789], 
    zoom = 14,
    className = '' 
}: ShopMapProps) {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.log('No se pudo obtener la ubicación:', error);
                }
            );
        }
    }, []);

    const mapCenter = userLocation || center;

    return (
        <div className={`relative ${className}`}>
            <MapContainer 
                center={mapCenter} 
                zoom={zoom} 
                className="h-full w-full rounded-xl"
                style={{ minHeight: '400px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {shops.map((shop) => (
                    <Marker key={shop.id} position={[shop.lat, shop.lng]}>
                        <Popup>
                            <div className="min-w-[200px]">
                                <div className="font-semibold text-gray-900 mb-1">
                                    {shop.name}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    {shop.address}
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-sm font-medium">{shop.rating}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                        shop.openNow 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                    }`}>
                                        {shop.openNow ? 'Abierto' : 'Cerrado'}
                                    </span>
                                </div>
                                <button className="w-full py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800">
                                    Ver detalles
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {userLocation && (
                    <Marker 
                        position={userLocation}
                        icon={new Icon({
                            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzM4NzJGMiIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0iIzM4NzJGMiIvPgo8L3N2Zz4=',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12],
                        })}
                    >
                        <Popup>
                            <div className="text-sm font-medium">Tu ubicación</div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Barbería</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">Salón</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
