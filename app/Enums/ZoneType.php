<?php

namespace App\Enums;

enum ZoneType: string
{
    case FIXED_LOCATION = 'fixed_location';
    case SERVICE_AREA = 'service_area';
    case HOME_SERVICE_ONLY = 'home_service_only';

    public function label(): string
    {
        return match($this) {
            self::FIXED_LOCATION => 'Ubicación Fija',
            self::SERVICE_AREA => 'Área de Cobertura',
            self::HOME_SERVICE_ONLY => 'Solo a Domicilio',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::FIXED_LOCATION => 'Estudio o local con dirección exacta',
            self::SERVICE_AREA => 'Cubre múltiples zonas geográficas',
            self::HOME_SERVICE_ONLY => 'Sin ubicación fija, solo va a casa del cliente',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::FIXED_LOCATION => '📍',
            self::SERVICE_AREA => '🗺️',
            self::HOME_SERVICE_ONLY => '🚗',
        };
    }
}
