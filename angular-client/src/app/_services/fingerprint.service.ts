import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';


@Injectable({
  providedIn: 'root'
})
export class FingerprintService {
    getFpPromise(){
        const fpPromise = FingerprintJS.load({
        apiKey: "RXtGTtOT5mEqX2zHx1hU",
        endpoint: [
          "https://metrics.buyhomedesigns.com",
          FingerprintJS.defaultEndpoint
        ],
        scriptUrlPattern: [
          "https://metrics.buyhomedesigns.com/web/v<version>/<apiKey>/loader_v<loaderVersion>.js",
          FingerprintJS.defaultScriptUrlPattern
        ]
        });

        return fpPromise
    }
}
