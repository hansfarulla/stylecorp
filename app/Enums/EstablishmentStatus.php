<?php

namespace App\Enums;

enum EstablishmentStatus: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';
    case INACTIVE = 'inactive';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pendiente',
            self::ACTIVE => 'Activo',
            self::SUSPENDED => 'Suspendido',
            self::INACTIVE => 'Inactivo',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'yellow',
            self::ACTIVE => 'green',
            self::SUSPENDED => 'red',
            self::INACTIVE => 'gray',
        };
    }
}
