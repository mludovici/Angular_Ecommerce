import { Component, OnInit } from '@angular/core';

import { OktaAuthStateService } from '@okta/okta-angular';

import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string;
  storage: Storage = sessionStorage;

  constructor(
    private oktaAuthStateService: OktaAuthStateService,
    private oktaAuth: OktaAuth,
    ) { }

  ngOnInit(): void {
    //oktaAuth.authStateManager.updateAuthState();

    // Subscribe to authentication state changes
    this.oktaAuthStateService.authState$.subscribe(

      (result) => {

        this.isAuthenticated = result.isAuthenticated

        this.getUserDetails();

      }

    );
  }

  getUserDetails() {
    if (this.isAuthenticated) {
      // fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        res=> {
          this.userFullName = res.name;

          const theEmail = res.email;

          this.storage.setItem("userEmail", JSON.stringify(theEmail));
        }
      )
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();
  }
}
