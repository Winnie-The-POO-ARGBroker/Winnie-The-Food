import { Component } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Menu } from '../../shared/components/menu/menu';
import { Footer } from '../../shared/components/footer/footer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Menu, Footer],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarme: [false]
    }, {
      validators: this.customPasswordValidator
    });
  }

  private customPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    if (password && password.includes(' ')) {
      return { noSpaces: true };
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login correcto:', this.loginForm.value);
      // Redirección o llamada al backend aquí
    } else {
      console.log('Formulario inválido');
      this.loginForm.markAllAsTouched();
    }
  }

  // Getters para el template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get recordarme() { return this.loginForm.get('recordarme'); }
}
