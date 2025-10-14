import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, switchMap, throwError, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = 'user' | 'admin';
export interface AuthUser { id: string | number; nombre: string; apellido: string; email: string; role: Role; }
export interface RegisterPayload { nombre: string; apellido: string; email: string; password: string; }
type ApiUser = AuthUser & { password: string; creado_en: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private baseUrl = environment.apiBase;
  private USERS_COLLECTION = 'usuarios';

  private USER_KEY  = 'auth.user';
  private PERSIST   = 'auth.persist';

  currentUser = signal<AuthUser | null>(this.restoreUser());
  isAuthenticated = computed(() => this.currentUser() !== null);
  role = computed<Role>(() => this.currentUser()?.role ?? 'user');

  private usersUrl() { return `${this.baseUrl}/${this.USERS_COLLECTION}`; }
  private toAuthUser(u: any): AuthUser {
    return { id: u.id, nombre: u.nombre, apellido: u.apellido, email: (u.email ?? '').toLowerCase(), role: (u.role ?? 'user') as Role };
  }
  private friendlyHttpError(err: unknown, fallback = 'Ocurrió un error. Intenta nuevamente.') {
    if (err instanceof Error && err.message) return err.message;
    if (err && typeof err === 'object' && 'status' in err) {
      const http = err as HttpErrorResponse;
      if (http.status === 0) return 'No hay conexión con el servidor.';
      if (http.status >= 500) return 'Servidor no disponible. Intentá más tarde.';
    }
    return fallback;
  }
  private persistUser(user: AuthUser, persist: 'local' | 'session') {
    const store = persist === 'local' ? localStorage : sessionStorage;
    store.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.PERSIST, persist);
  }
  private restoreUser(): AuthUser | null {
    const persist = localStorage.getItem(this.PERSIST) as 'local' | 'session' | null;
    const store = persist === 'session' ? sessionStorage : localStorage;
    const raw = store.getItem(this.USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as AuthUser; } catch { return null; }
  }

  login(email: string, password: string, remember = false) {
    const body = {
      email: email.trim().toLowerCase(),
      password
    };

    return this.http.post<ApiUser>(`${this.usersUrl()}/login/`, body).pipe(
      map(user => {
        const authUser = this.toAuthUser(user);
        this.persistUser(authUser, remember ? 'local' : 'session');
        this.currentUser.set(authUser);
        return authUser;
      }),
      catchError((err: HttpErrorResponse) => {
        const code = err?.error?.code as string | undefined;
        const detail = err?.error?.detail as string | undefined;

        let msg = 'No se pudo iniciar sesión.';
        if (code === 'EMAIL_NOT_FOUND')  msg = 'No existe una cuenta con ese email.';
        else if (code === 'WRONG_PASSWORD') msg = 'La contraseña es incorrecta.';
        else if (code === 'BAD_INPUT')   msg = 'Email y contraseña son requeridos.';
        else if (err.status === 0)       msg = 'No hay conexión con el servidor.';
        else if (err.status >= 500)      msg = 'Servidor no disponible. Intentá más tarde.';
        else if (detail)                 msg = detail;

        return throwError(() => new Error(msg));
      })
    );
  }

  checkEmailExists(email: string) {
    const params = new HttpParams().set('email', email.trim().toLowerCase());
    return this.http.get<ApiUser[]>(this.usersUrl(), { params }).pipe(
      map(list => list.length > 0),
      catchError(() => of(false))
    );
  }

  register(payload: RegisterPayload, opts?: { autoLogin?: boolean; remember?: boolean }) {
    const autoLogin = opts?.autoLogin ?? true;
    const remember  = opts?.remember ?? false;

    const ahoraISO = new Date().toISOString();

    const body: Omit<ApiUser, 'id'> = {
      nombre: payload.nombre.trim(),
      apellido: payload.apellido.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      role: 'user',
      creado_en: ahoraISO,
    };

    return this.checkEmailExists(body.email).pipe(
      switchMap(exists => {
        if (exists) return throwError(() => new Error('El email ya está registrado'));
        return this.http.post<ApiUser>(this.usersUrl(), body);
      }),
      map(created => {
        const authUser = this.toAuthUser(created);
        if (autoLogin) {
          this.persistUser(authUser, remember ? 'local' : 'session');
          this.currentUser.set(authUser);
        }
        return authUser;
      }),
      catchError(err => throwError(() => new Error(this.friendlyHttpError(err, 'No se pudo completar el registro.'))))
    );
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.PERSIST);
    sessionStorage.removeItem(this.PERSIST);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }
}
