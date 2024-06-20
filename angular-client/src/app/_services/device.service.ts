import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Device } from '../_classes/device';
import { FingerprintService } from '../_services/fingerprint.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private fingerprintService: FingerprintService) { }

  registerDevice(device: Device): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post("http://localhost:3000/devices/register", device, { headers: headers });
  }


  blockDevice(deviceID): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });

      return this.http.post("http://localhost:3000/devices/suspend-device", {"deviceID" : deviceID}, { headers: headers });
  }
}