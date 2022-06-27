import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";

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
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) {
    title.setTitle('Demo - Login')
    this.subscription = msgService.onMessage().subscribe(msg => this.message = msg.text)

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (['log'].includes(this.returnUrl)) {
      this.msgService.sendMsg('You are registered, and can now login ')
      setTimeout(() => this.router.navigate(['/login']), 5000)
    }

    // View the auth state of a user
    socialAuthService.authState.subscribe((user: SocialUser) => this.user = user)
  }

  message: string = ''

  returnUrl: string = ''

  subscription!: Subscription

  loginForm: FormGroup = this.fb.group({ email: ['', Validators.email], password: ['', Validators.required] })

  user!: SocialUser

  onSubmit(): void {
    this.authService.login(this.loginForm.value)
      .subscribe({
        next: () => this.router.navigate([this.returnUrl]),
        error: err => this.msgService.sendMsg(err)
      })
  }

  async loginWithGoogle(): Promise<void> {
    await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    this.authService.googleAuth(this.user)
      .subscribe({
        next: () => this.router.navigate([this.returnUrl]),
        error: err => this.msgService.sendMsg(err)
      })
  }

  ngOnDestroy(): void { this.subscription.unsubscribe() }
}
