import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../_services/auth.service';
import { FingerprintService } from '../_services/fingerprint.service';
import { DeviceService } from '../_services/device.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private fingerprintService: FingerprintService,
    private deviceService: DeviceService

  ) { }

  ngOnInit() {

  }

  async onCheckoutSubmit() {
    document.getElementById("checkoutForm").style.display = "none";
    document.getElementById("stolenCardWarning").style.display = "block";

    const fpPromise = this.fingerprintService.getFpPromise();
    let deviceID = "";

    //Get Device Information
    fpPromise
      .then(fp => fp.get())
      .then(result => {
        deviceID = result.visitorId;
        console.log("Device ID: " + deviceID)

        // Block Device
        this.deviceService
          .blockDevice(deviceID)
          .subscribe(res => {
            if (res.success) {
              console.log("Success");
              console.log(res);
            }
            else {
              console.log("error: ");
              console.log(res);
            }
          });
      });
  }
}
