<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case PROVEEDOR = 'proveedor';
    case CLIENTE = 'cliente';
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function fromName(string $name): self
    {
        return match(strtolower($name)) {
            'admin' => self::ADMIN,
            'proveedor' => self::PROVEEDOR,
            'cliente' => self::CLIENTE,
            default => throw new \ValueError("$name no es un valor válido")
        };
    }
}