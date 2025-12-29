<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Stancl\Tenancy\Tenancy;
use Stancl\Tenancy\Resolvers\PathTenantResolver;
use Symfony\Component\HttpFoundation\Response;

class InitializeTenancyByPath
{
    protected Tenancy $tenancy;
    protected PathTenantResolver $resolver;

    public function __construct(Tenancy $tenancy, PathTenantResolver $resolver)
    {
        $this->tenancy = $tenancy;
        $this->resolver = $resolver;
    }

    public function handle(Request $request, Closure $next): Response
    {
        // Extraer tenant_id del path: /tenant/{tenant_id}/...
        $segments = $request->segments();
        
        if (count($segments) >= 2 && $segments[0] === 'tenant') {
            $tenantId = $segments[1];
            
            if ($tenant = \Stancl\Tenancy\Database\Models\Tenant::find($tenantId)) {
                $this->tenancy->initialize($tenant);
            }
        }

        return $next($request);
    }
}
