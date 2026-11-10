import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { email, form, FormField, FieldTree, minLength, required } from '@angular/forms/signals';
import { AuthService } from '../../shared/services/auth-service';
import { apiErrorMessage } from '../../shared/utils/api-error';

@Component({
  selector: 'app-signin',
  imports: [FormField, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  private auth = inject(AuthService);

  submitted = signal(false);
  loading = signal(false);
  serverError = signal('');

  model = signal({ email: '', password: '' });

  signinForm = form(this.model, (p) => {
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
    required(p.password, { message: 'Password is required' });
    minLength(p.password, 6, { message: 'At least 6 characters' });
  });

  errorsOf(field: FieldTree<string>) {
    return field().touched() || this.submitted() ? field().errors() : [];
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted.set(true);
    this.serverError.set('');
    if (this.signinForm().invalid()) return;

    this.loading.set(true);
    this.auth.signIn(this.model()).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.loading.set(false);
        // TODO: navigate to your home page route here once it exists
      },
      error: (err) => {
        this.loading.set(false);
        this.serverError.set(apiErrorMessage(err, 'Invalid email or password'));
      },
    });
  }
}
