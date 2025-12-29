<?php

namespace App\Enums;

enum EmploymentType: string
{
    case EMPLOYEE = 'employee';
    case FREELANCER = 'freelancer';

    public function label(): string
    {
        return match($this) {
            self::EMPLOYEE => 'Empleado',
            self::FREELANCER => 'Colaborador Independiente',
        };
    }

    public function description(): string
    {
        return match($this) {
            self::EMPLOYEE => 'Empleado directo del establecimiento',
            self::FREELANCER => 'Profesional independiente colaborando temporalmente',
        };
    }
}
