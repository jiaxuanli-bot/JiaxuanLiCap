import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../service/authentication.service';
import {ApiService} from '../service/api.service';
import {YearService} from '../service/year.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private yearService: YearService
  ) {
    // redirect to home if already logged in
    this.authenticationService.getUser().subscribe( user => {
      if (user !== null) {
        this.navigateToDefaultPage();
      }
    });
  }

  navigateToDefaultPage( ) {
    if (this.authenticationService.hasRole( 'Admin' ) ) {
      this.router.navigate(['/uwl/faculty']);
    } else if (this.authenticationService.hasRole('Nominate') ) {
      this.router.navigate(['/uwl/committees']);
    } else {
      this.router.navigate(['/uwl/survey']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.authenticationService.login(this.f.email.value)
      .pipe(first())
      .subscribe(
        user => {
          console.log( 'LOGIN RETURNED: ' + user);
          this.navigateToDefaultPage();
        },
        error => {
          this.loading = false;
        });
  }
}
