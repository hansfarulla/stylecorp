<?php

namespace App\Enums;

enum ExpenseType: string
{
    // Para profesionales
    case BOOTH_RENTAL = 'booth_rental';
    case PRODUCT_SUPPLIES = 'product_supplies';
    case TOOLS = 'tools';
    case TRANSPORTATION = 'transportation';
    case MARKETING = 'marketing';
    case INSURANCE = 'insurance';
    case EDUCATION = 'education';
    
    // Para establecimientos
    case RENT = 'rent';
    case UTILITIES = 'utilities';
    case SALARIES = 'salaries';
    case COMMISSIONS = 'commissions';
    case PRODUCT_INVENTORY = 'product_inventory';
    case EQUIPMENT = 'equipment';
    case MAINTENANCE = 'maintenance';
    case CLEANING = 'cleaning';
    case TAXES = 'taxes';
    case PERMITS = 'permits';
    case SOFTWARE = 'software';
    
    case OTHER = 'other';

    public function label(): string
    {
        return match($this) {
            self::BOOTH_RENTAL => 'Alquiler de Silla',
            self::PRODUCT_SUPPLIES => 'Productos y Suministros',
            self::TOOLS => 'Herramientas',
            self::TRANSPORTATION => 'Transporte',
            self::MARKETING => 'Marketing y Publicidad',
            self::INSURANCE => 'Seguros',
            self::EDUCATION => 'Educación y Capacitación',
            self::RENT => 'Alquiler del Local',
            self::UTILITIES => 'Servicios (Luz, Agua, Internet)',
            self::SALARIES => 'Salarios',
            self::COMMISSIONS => 'Comisiones',
            self::PRODUCT_INVENTORY => 'Inventario de Productos',
            self::EQUIPMENT => 'Equipamiento',
            self::MAINTENANCE => 'Mantenimiento',
            self::CLEANING => 'Limpieza',
            self::TAXES => 'Impuestos',
            self::PERMITS => 'Permisos y Licencias',
            self::SOFTWARE => 'Software',
            self::OTHER => 'Otros',
        };
    }

    public function isProfessionalExpense(): bool
    {
        return in_array($this, [
            self::BOOTH_RENTAL,
            self::PRODUCT_SUPPLIES,
            self::TOOLS,
            self::TRANSPORTATION,
            self::MARKETING,
            self::INSURANCE,
            self::EDUCATION,
            self::OTHER,
        ]);
    }

    public function isEstablishmentExpense(): bool
    {
        return in_array($this, [
            self::RENT,
            self::UTILITIES,
            self::SALARIES,
            self::COMMISSIONS,
            self::PRODUCT_INVENTORY,
            self::EQUIPMENT,
            self::MAINTENANCE,
            self::CLEANING,
            self::MARKETING,
            self::INSURANCE,
            self::TAXES,
            self::PERMITS,
            self::SOFTWARE,
            self::OTHER,
        ]);
    }
}
