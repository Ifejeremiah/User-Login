import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private authService: AuthService,
    private msgService: MessageService,
    private router: Router
  ) {
    title.setTitle('Demo - Register')
    this.subscription = this.msgService.onMessage().subscribe(msg => this.message = msg.text)
  }

  message = ''

  subscription!: Subscription

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    password: ['', Validators.required],
    password2: ['', Validators.required],
  })

  onSubmit() {
    this.authService.register(this.registerForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['login'], { queryParams: { returnUrl: 'log' } })
        },
        error: err => this.msgService.sendMsg(err)
      })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
