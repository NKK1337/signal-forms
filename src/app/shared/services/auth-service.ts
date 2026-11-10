import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from '../models/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'https://restaurantapi.stepacademy.ge/api/auth';

  signUp(body: SignUpRequest) {
    return this.http.post<SignUpResponse>(`${this.baseUrl}/register`, body);
  }

  signIn(body: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.baseUrl}/login`, body);
  }
}
