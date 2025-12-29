<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case CASH = 'cash';
    case CARD = 'card';
    case SINPE = 'sinpe';
    case TRANSFER = 'transfer';
    case APPLE_PAY = 'apple_pay';
    case GOOGLE_PAY = 'google_pay';
    case LOYALTY_POINTS = 'loyalty_points';
    case MIXED = 'mixed';

    public function label(): string
    {
        return match($this) {
            self::CASH => 'Efectivo',
            self::CARD => 'Tarjeta',
            self::SINPE => 'SINPE Móvil',
            self::TRANSFER => 'Transferencia',
            self::APPLE_PAY => 'Apple Pay',
            self::GOOGLE_PAY => 'Google Pay',
            self::LOYALTY_POINTS => 'Puntos de Fidelidad',
            self::MIXED => 'Pago Mixto',
        };
    }

    public function icon(): string
    {
        return match($this) {
            self::CASH => '💵',
            self::CARD => '💳',
            self::SINPE => '📱',
            self::TRANSFER => '🏦',
            self::APPLE_PAY => '🍎',
            self::GOOGLE_PAY => '🔵',
            self::LOYALTY_POINTS => '⭐',
            self::MIXED => '🔀',
        };
    }
}
