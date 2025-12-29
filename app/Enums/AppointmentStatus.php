<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case CANCELLED_BY_CUSTOMER = 'cancelled_by_customer';
    case CANCELLED_BY_ESTABLISHMENT = 'cancelled_by_establishment';
    case NO_SHOW = 'no_show';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pendiente',
            self::CONFIRMED => 'Confirmada',
            self::IN_PROGRESS => 'En Progreso',
            self::COMPLETED => 'Completada',
            self::CANCELLED_BY_CUSTOMER => 'Cancelada por Cliente',
            self::CANCELLED_BY_ESTABLISHMENT => 'Cancelada por Establecimiento',
            self::NO_SHOW => 'No se presentó',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'yellow',
            self::CONFIRMED => 'blue',
            self::IN_PROGRESS => 'purple',
            self::COMPLETED => 'green',
            self::CANCELLED_BY_CUSTOMER, self::CANCELLED_BY_ESTABLISHMENT => 'red',
            self::NO_SHOW => 'orange',
        };
    }

    public function isCancelled(): bool
    {
        return in_array($this, [
            self::CANCELLED_BY_CUSTOMER,
            self::CANCELLED_BY_ESTABLISHMENT,
            self::NO_SHOW,
        ]);
    }
}
