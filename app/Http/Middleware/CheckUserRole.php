<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\UserRole;

class CheckUserRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->hasAnyRole($roles)) {
            abort(403, 'Acceso no autorizado');
        }
        
        return $next($request);
    }
}