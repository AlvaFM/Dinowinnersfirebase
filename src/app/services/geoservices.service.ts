import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeoservicesService {

  constructor(private http: HttpClient) { }

  getGeocode(query: string): Observable<any> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
    return this.http.get(url);
  }

  getReverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    return this.http.get<any>(url);
  }
  

  getGeolocation(): Observable<any> {
    return new Observable(observer => {
    
      if ('geolocation' in navigator) {
   
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              status: 'success',
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            };
            observer.next(locationData);  
            observer.complete();  
          },
          (error) => {
            observer.error('Error al obtener la ubicación: ' + error.message);  
          },
          {
            enableHighAccuracy: true,  
            timeout: 100000,
            maximumAge: 0   
          }
        );
      } else {
        observer.error('Geolocalización no soportada en este navegador');  
      }
    });
  }
}
