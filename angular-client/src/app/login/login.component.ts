import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LoginData } from '../_classes/login-data';
import { AuthService } from '../_services/auth.service';
import { FingerprintService } from '../_services/fingerprint.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = new LoginData("","","","");

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private fingerprintService : FingerprintService

  ) { }

  ngOnInit() {

  }

  async onLoginSubmit() {
    const fpPromise = this.fingerprintService.getFpPromise();

    //Visitor ID ==== DeviceId
    const { requestId, visitorId } = await (await fpPromise).get();
    
    const loginData = new LoginData(this.loginData.username, this.loginData.password, requestId, visitorId);
    
    this.authService.authenticateUser(loginData).subscribe(res => {
      if(res.succes) {
        this.authService.storeUserData(res.token, res.user);
        this.flashMessagesService.show('You are now logged in.', { cssClass: 'alert-success', timeout: 2500});
        this.router.navigate(['dashboard']);
      }
      else {
        if(res.maxLoginAttempts == true){
          document.getElementById("loginForm").style.display = "none";
          document.getElementById("maxLoginWarning").style.display = "block";
        }
        this.flashMessagesService.show(res.msg, { cssClass: 'alert-danger', timeout: 2500});
        this.router.navigate(['login']);
      }
    });
  }

}
