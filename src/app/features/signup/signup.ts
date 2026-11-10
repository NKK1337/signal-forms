import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  email, form, FormField, FieldTree, minLength, required, validate,
} from '@angular/forms/signals';
import { AuthService } from '../../shared/services/auth-service';
import { apiErrorMessage } from '../../shared/utils/api-error';

@Component({
  selector: 'app-signup',
  imports: [FormField, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  private auth = inject(AuthService);
  private router = inject(Router);

  submitted = signal(false);
  loading = signal(false);
  serverError = signal('');

  model = signal({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  signupForm = form(this.model, (p) => {
    required(p.firstName, { message: 'First name is required' });
    minLength(p.firstName, 2, { message: 'At least 2 characters' });

    required(p.lastName, { message: 'Last name is required' });
    minLength(p.lastName, 2, { message: 'At least 2 characters' });

    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });

    required(p.password, { message: 'Password is required' });
    minLength(p.password, 6, { message: 'At least 6 characters' });

    required(p.confirmPassword, { message: 'Confirm your password' });
    validate(p.confirmPassword, ({ value, valueOf }) =>
      value() === valueOf(p.password)
        ? null
        : { kind: 'mismatch', message: 'Passwords do not match' },
    );
  });

  errorsOf(field: FieldTree<string>) {
    return field().touched() || this.submitted() ? field().errors() : [];
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);
    this.serverError.set('');
    if (this.signupForm().invalid()) return;

    const { confirmPassword, ...body } = this.model();
    this.loading.set(true);
    this.auth.signUp(body).subscribe({
      // Sign in page is at '/'
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.loading.set(false);
        this.serverError.set(apiErrorMessage(err, 'Registration failed'));
      },
    });
  }
}
