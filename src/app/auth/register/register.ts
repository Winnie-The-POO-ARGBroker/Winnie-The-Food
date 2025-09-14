import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value ?? '';
  const rep  = group.get('repetirPassword')?.value ?? '';
  return pass && rep && pass !== rep ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMsg = signal('');

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repetirPassword: ['', [Validators.required]],
    terminos: [false, [Validators.requiredTrue]]
  }, { validators: passwordsMatch });

  onSubmit() {
    this.errorMsg.set('');
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { nombre, apellido, email, password } = this.registerForm.value as any;

    // ⬇️ Autologin + recordar (si más adelante agregás un "recordarme", ponelo en true)
    this.auth.register({ nombre, apellido, email, password }, { autoLogin: true, remember: false })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']); // home
        },
        error: (e) => {
          this.loading.set(false);
          this.errorMsg.set(e?.message ?? 'No se pudo completar el registro.');
        }
      });
  }
}