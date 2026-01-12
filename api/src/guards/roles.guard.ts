import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export interface Role {
  role: string;
  resource: string;
  action: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // Check if user has the required role
    return requiredRoles.some(role => {
      // Admin can do everything
      if (user.role === 'admin') {
        return true;
      }
      
      // Check specific role permissions
      if (user.role === role.role) {
        // For this implementation, we'll allow based on role hierarchy:
        // - admin: full access
        // - editor: can manage content (create, edit, delete)
        // - viewer: read-only access
        if (role.action === 'read') {
          return true;
        }
        
        if (user.role === 'editor' && ['create', 'update', 'delete', 'publish'].includes(role.action)) {
          return true;
        }
      }
      
      return false;
    });
  }
}