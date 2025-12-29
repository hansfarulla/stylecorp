<?php

namespace App\Enums;

enum UserType: string
{
    case PLATFORM = 'platform';
    case ESTABLISHMENT = 'establishment';
    case PROFESSIONAL = 'professional';
    case CLIENT = 'client';

    public function label(): string
    {
        return match($this) {
            self::PLATFORM => 'Plataforma',
            self::ESTABLISHMENT => 'Establecimiento',
            self::PROFESSIONAL => 'Profesional',
            self::CLIENT => 'Cliente',
        };
    }
}
