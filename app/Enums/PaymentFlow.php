<?php

namespace App\Enums;

enum PaymentFlow: string
{
    case PAY_ONLINE = 'pay_online';
    case PAY_IN_STORE = 'pay_in_store';
    case BOTH = 'both';

    public function label(): string
    {
        return match($this) {
            self::PAY_ONLINE => 'Pago en Línea',
            self::PAY_IN_STORE => 'Pago en Local',
            self::BOTH => 'Ambos',
        };
    }
}
