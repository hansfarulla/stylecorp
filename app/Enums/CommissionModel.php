<?php

namespace App\Enums;

enum CommissionModel: string
{
    case PERCENTAGE = 'percentage';
    case TIERED = 'tiered';
    case FIXED_PER_SERVICE = 'fixed_per_service';
    case SALARY_PLUS = 'salary_plus';
    case BOOTH_RENTAL = 'booth_rental';
    case SALARY_ONLY = 'salary_only';

    public function label(): string
    {
        return match($this) {
            self::PERCENTAGE => 'Porcentaje',
            self::TIERED => 'Escalonado',
            self::FIXED_PER_SERVICE => 'Monto Fijo por Servicio',
            self::SALARY_PLUS => 'Salario + Comisión',
            self::BOOTH_RENTAL => 'Alquiler de Silla',
            self::SALARY_ONLY => 'Solo Salario',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::PERCENTAGE => 'El profesional recibe un % de cada servicio',
            self::TIERED => 'Comisión variable según volumen de ventas',
            self::FIXED_PER_SERVICE => 'Monto fijo por cada servicio realizado',
            self::SALARY_PLUS => 'Salario base + comisión sobre ventas',
            self::BOOTH_RENTAL => 'Profesional alquila espacio, se queda con el 100%',
            self::SALARY_ONLY => 'Salario fijo sin comisiones',
        };
    }
}
