<?php

namespace App\Enums;

enum EstablishmentType: string
{
    case BARBERSHOP = 'barbershop';
    case SALON = 'salon';
    case SPA = 'spa';
    case MIXED = 'mixed';

    public function label(): string
    {
        return match($this) {
            self::BARBERSHOP => 'Barbería',
            self::SALON => 'Salón de Belleza',
            self::SPA => 'Spa',
            self::MIXED => 'Mixto',
        };
    }
}
