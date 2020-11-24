import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  // returnUrl: string;
  // private keepAfterRouteChange = false;
  isNormal = 0;
  isAdmin = 0;
  isNominate = 0;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.authenticationService.currentUserValue.roles.forEach(
        value => {
          if (value.role === 'Normal') {
            this.isNormal = 1;
          }
          if (value.role === 'Admin') {
            this.isAdmin = 1;
          }
          if (value.role === 'Nominate') {
            this.isNominate = 1;
          }
        }
      );
      // for (let i = 0; i < this.authenticationService.currentUserValue.roles.length; i++ ) {
      //   if (this.authenticationService.currentUserValue.roles[i].role === 'Normal') {
      //     this.isNormal = 1;
      //   }
      //   if (this.authenticationService.currentUserValue.roles[i].role === 'Admin') {
      //     this.isAdmin = 1;
      //   }
      //   if (this.authenticationService.currentUserValue.roles[i].role === 'Nominate') {
      //     this.isNominate = 1;
      //   }
      // }
      if ( this.isAdmin === 1) {
        this.router.navigate(['/faculty']);
      } else if ( this.isNominate) {
        this.router.navigate(['/committees']);
      } else {
        this.router.navigate(['/survey']);
      }
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
          if (user != null) {
            user.roles.forEach(
              value => {
                if (value.role === 'Normal') {
                  this.isNormal = 1;
                }
                if (value.role === 'Admin') {
                  this.isAdmin = 1;
                }
                if (value.role === 'Nominate') {
                  this.isNominate = 1;
                }
              }
            );
            // for (let i = 0; i < user.roles.length; i++ ) {
            //   if (user.roles[i].role === 'Normal') {
            //     this.isNormal = 1;
            //   }
            //   if (user.roles[i].role === 'Admin') {
            //     this.isAdmin = 1;
            //   }
            //   if (user.roles[i].role === 'Nominate') {
            //     this.isNominate = 1;
            //   }
            // }
            if ( this.isAdmin === 1) {
              this.router.navigate(['/faculty']);
            } else if ( this.isNominate) {
              this.router.navigate(['/committees']);
            } else {
              this.router.navigate(['/survey']);
            }
          }
        },
        error => {
          this.loading = false;
        });
  }
}
