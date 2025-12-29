<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case OWNER = 'owner';
    case MANAGER = 'manager';
    case STAFF = 'staff';
    case FREELANCER = 'freelancer';
    case CUSTOMER = 'customer';
    case GUEST = 'guest';

    public function label(): string
    {
        return match($this) {
            self::SUPER_ADMIN => 'Super Administrador',
            self::OWNER => 'Dueño',
            self::MANAGER => 'Administrador',
            self::STAFF => 'Empleado',
            self::FREELANCER => 'Independiente',
            self::CUSTOMER => 'Cliente',
            self::GUEST => 'Invitado',
        };
    }

    public function permissions(): array
    {
        return match($this) {
            self::SUPER_ADMIN => ['*'],
            self::OWNER => [
                'establishment.manage',
                'staff.manage',
                'services.manage',
                'bookings.manage',
                'payments.view',
                'reports.view',
                'settings.manage',
            ],
            self::MANAGER => [
                'staff.view',
                'services.manage',
                'bookings.manage',
                'inventory.manage',
                'reports.view',
            ],
            self::STAFF => [
                'bookings.view',
                'bookings.manage_own',
                'schedule.manage_own',
                'commissions.view_own',
            ],
            self::FREELANCER => [
                'bookings.view',
                'bookings.manage_own',
                'schedule.manage_own',
                'portfolio.manage',
                'profile.public',
            ],
            self::CUSTOMER => [
                'bookings.create',
                'bookings.view_own',
                'reviews.create',
                'favorites.manage',
            ],
            self::GUEST => [
                'bookings.create',
            ],
        };
    }

    public static function professional(): array
    {
        return [self::STAFF->value, self::FREELANCER->value];
    }

    public static function establishment(): array
    {
        return [self::OWNER->value, self::MANAGER->value, self::STAFF->value];
    }
}
