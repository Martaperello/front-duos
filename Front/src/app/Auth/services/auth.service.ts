import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('http://localhost:8000/api/users/login', {
        email,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  register(
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) {
    return this.http
      .post<AuthResponseData>('http://localhost:8000/api/users/signup', {
        name,
        email,
        password,
        passwordConfirm,
      })
      .pipe(catchError(this.handleError));
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
