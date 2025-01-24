import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.checkAdmin().pipe(
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/']); // Redirect to home or any other route if not an admin
        }
      })
    );
  }
}