<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case LIDER = 'lider';
    case COLABORADOR = 'colaborador';
    case USER = 'usuario';
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function fromName(string $name): self
    {
        return match(strtolower($name)) {
            'admin' => self::ADMIN,
            'lider' => self::LIDER,
            'usuario' => self::USER,
            'colaborador' => self::COLABORADOR,
            default => throw new \ValueError("$name no es un valor válido")
        };
    }
}