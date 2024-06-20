import { Component, OnInit } from '@angular/core';
import { FingerprintService } from '../_services/fingerprint.service';
import { DeviceService } from '../_services/device.service';
import { Device } from '../_classes/device';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private deviceService: DeviceService,
    private fingerprintService : FingerprintService
   ){ }

  ngOnInit() {
    var deviceID = "";
    // Initialize the agent on application start.
    const fpPromise = this.fingerprintService.getFpPromise();

    // Get the visitorId when you need it.
    fpPromise
    .then(fp => fp.get())
    .then(result => {
      deviceID = result.visitorId; 
      console.log("Device ID: " + deviceID)
      localStorage.setItem("deviceID", deviceID);

      //If deviceID does not exist add to database
      var model =  model = new Device(deviceID, 0, false);
      
      this.deviceService
      .registerDevice(model)
      .subscribe(res => {
        if(res.success) {
          console.log("Success");
          console.log(res);
        }
        else {
          console.log("error: ");
          console.log(res);
        }
      });
    });

    //Check if deviceID (visitorID) exists and grab data
    /*
      const deviceData = new LoginData(this.loginData.username, this.loginData.password);
      
      this.authService.authenticateUser(loginData).subscribe(res => {
        if(res.succes) {
          this.authService.storeUserData(res.token, res.user);
          this.flashMessagesService.show('You are now logged in.', { cssClass: 'alert-success', timeout: 2500});
          this.router.navigate(['dashboard']);
        }
        else {
          this.flashMessagesService.show(res.msg, { cssClass: 'alert-danger', timeout: 2500});
          this.router.navigate(['login']);
        }
      });
    }
    */
  }
}
