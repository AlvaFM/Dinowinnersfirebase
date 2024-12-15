import { Component, OnInit } from '@angular/core';
import { GeoservicesService } from '../services/geoservices.service';
import * as L from 'leaflet';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  mapa: any;
  datosUbicacion: any;
  consultaBusqueda: string = ''; 
  ubicacionSeleccionada: { 
    lat: number, 
    lon: number, 
    direccion?: any 
  } | null = null;
  

  marcador: L.Marker | null = null; 


  nombreUsuario: string = '';

  uid: string = '';

  constructor(private geoService: GeoservicesService, private authService: AuthService,
    private databaseService : DatabaseService
  ) {}

  ngOnInit() {
    this.verificarUsuarioAutenticado()
    this.geoService.getGeolocation().subscribe((data) => {
      this.datosUbicacion = data;
      this.cargarMapa(data.lat, data.lon); 
    });
  }



  verificarUsuarioAutenticado() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).then(data => {
          this.uid = data?.uid || '';
          this.nombreUsuario = data?.nombre || '';  
        });
      } else {
        this.nombreUsuario = ''; 
      }
    });
  }

  guardarUbicacion() {
    const ubicacion = {
      usuario: this.nombreUsuario,
      uid: this.uid,
      ubicacion: this.ubicacionSeleccionada?.direccion
    };
  
    this.databaseService.addLocation(ubicacion)
      .then(() => {
       
        console.log('Ubicación guardada correctamente');
      })
      .catch((error) => {
      
        console.error('Error al guardar la ubicación:', error);
      });
  }
  

  cargarMapa(lat: number, lon: number) {
    this.mapa = L.map('map').setView([lat, lon], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.mapa);
  
    this.mapa.on('click', (evento: any) => {
      const latLng = evento.latlng;
      this.ubicacionSeleccionada = {
        lat: latLng.lat,
        lon: latLng.lng
      };
      this.geoService.getReverseGeocode(latLng.lat, latLng.lng).subscribe((direccion) => {
        console.log(direccion);

        if (direccion && direccion.address) {
          if (this.ubicacionSeleccionada) {
            this.ubicacionSeleccionada.direccion = direccion.address;
            console.log('Dirección completa:', this.ubicacionSeleccionada.direccion);
          }
        } else {
         console.log('No se pudo obtener la ubicacion del lugar')
        }
      });
  
      if (this.marcador) {
        this.mapa.removeLayer(this.marcador);
      }
  
      const iconoPersonalizado = L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });
  
      this.marcador = L.marker([latLng.lat, latLng.lng], { icon: iconoPersonalizado })
        .addTo(this.mapa)
        .bindPopup('Ubicación seleccionada')
        .openPopup();
    });
  }
  
  buscarDireccion() {
    if (this.consultaBusqueda) {
      this.geoService.getGeocode(this.consultaBusqueda).subscribe((resultado) => {
        if (resultado && resultado.length > 0) {
          const lat = parseFloat(resultado[0].lat);
          const lon = parseFloat(resultado[0].lon);
          this.mapa.setView([lat, lon], 13); 
          
          this.geoService.getReverseGeocode(lat, lon).subscribe((direccion) => {
            console.log(direccion);  
            if (this.ubicacionSeleccionada) {
              this.ubicacionSeleccionada.direccion = direccion.address;  
              console.log('Dirección completa:', this.ubicacionSeleccionada.direccion);
            }
          });
        } else {
          alert('No se encontraron resultados');
        }
      });
    } else {
      alert('Por favor ingrese una dirección');
    }
  }
}
