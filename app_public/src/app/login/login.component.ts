import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {

  constructor(
    private title: Title,
    private fb: FormBuilder,
    private authService: AuthService,
    private msgService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    title.setTitle('Demo - Login')
    this.subscription = msgService.onMessage().subscribe(msg => this.message = msg.text)

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (['log'].includes(this.returnUrl)) {
      this.msgService.sendMsg('You are registered, and can now login ')
      setTimeout(() => this.router.navigate(['/login']), 5000)
    }
  }

  message = ''

  returnUrl = ''

  subscription!: Subscription

  loginForm = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  })

  onSubmit() {
    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => this.router.navigate([this.returnUrl]),
        error: err => this.msgService.sendMsg(err)
      })
  }

  ngOnDestroy() { this.subscription.unsubscribe() }
}
