import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.page.html',
  styleUrls: ['./suscripcion.page.scss'],
})
export class SuscripcionPage implements OnInit {
  cursoId: string='';
  NameCurso:string='';
  nombreUsuario: string=''
  idUsuario: string = '';
  pago = {
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: ''
  };
  NameAutor: string=''  

  constructor(private route: ActivatedRoute, private authService:AuthService, private dbservice:DatabaseService) { }

  ngOnInit() {
    this.verificarUsuarioAutenticado(); 

    this.route.params.subscribe((params) => {
      this.cursoId = params['id'];
      this.NameCurso = params['name'];
      this.NameAutor = params['autor'];
    });
  }
  

  verificarUsuarioAutenticado() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).then(data => {
          this.nombreUsuario = data?.nombre || ''; 
          this.idUsuario = user.uid; 
        });
      } else {
        this.nombreUsuario = ''; 
        this.idUsuario = ''; 
      }
    });
 }

 crearSub() {
  const subscription = {
    nameAutor: this.NameAutor,
    UsuarioSub: this.nombreUsuario,
    idUsuarioSub: this.idUsuario,
    cursoIdSub: this.cursoId,
    nombreCursoSub: this.NameCurso,
    metododepago: this.pago
  };

  this.dbservice.addsubscription(subscription).then(() => {
    alert('¡Suscripción realizada con éxito!');
  }).catch((error) => {
    console.error('Error al suscribirse:', error);
    alert('Hubo un error al realizar la suscripción.');
  });
}



}
