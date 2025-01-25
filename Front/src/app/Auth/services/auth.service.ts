import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponseData {
  status: string;
  data: {
    data: User;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  //use behavior subjet instead of subject if you need to take the previous value;
  // user = new BehaviorSubject<User>(null);
  // private tokenExprationTimer: any;
  private isLoggedInStatus = false;
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('https://back-duos.onrender.com/api/users/login', {
        email,
        password,
      },
      { withCredentials: true}
    )
      .pipe(catchError(this.handleError));
  }

  register(
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) {
    return this.http
      .post<AuthResponseData>('https://back-duos.onrender.com/api/users/signup', {
        name,
        email,
        password,
        passwordConfirm,
      })
      .pipe(catchError(this.handleError));
  }



checkAuth(): Observable<boolean> {
    return this.http.get<{ status: string }>('https://back-duos.onrender.com/api/users/auth-check', {
      withCredentials: true, // Ensures the cookie is sent with the request
    }).pipe(
      map(response => {
        this.isLoggedInStatus = response.status === 'success';
        return this.isLoggedInStatus;
      }),
      catchError(() => {
        this.isLoggedInStatus = false;
        return [false]; // Return false in case of error
      })
    );
  }

  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }
  checkAdmin(): Observable<boolean> {
    return this.http
      .get<{ status: string }>('https://back-duos.onrender.com/api/users/admin-check', {
        withCredentials: true, // Ensures the cookie is sent with the request
      })
      .pipe(
        map((response) => response.status === 'success'),
        catchError(() => {
          return [false]; // Return false in case of error
        })
      );
  }

  logout() {
    return this.http.get('https://back-duos.onrender.com/api/users/logout', {
      withCredentials: true, // Ensures the cookie is cleared
    });
  }

  private handleError(errorRes: HttpErrorResponse) {
    // console.log('testEroor', errorRes);
    let errorMessage = 'An unknown error ocurred';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exist already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = ' password or user  are not correct';
        break;
    }

    return throwError(errorMessage);
  }
}
