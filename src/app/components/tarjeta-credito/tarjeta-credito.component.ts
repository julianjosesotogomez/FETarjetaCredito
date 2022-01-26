import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {

  listarTarjetas: any[]=[];
  accion='Agregar';
  form: FormGroup;
  id: number | undefined;
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private _tarjetaServices : TarjetaService){
    this.form=this.fb.group({
      titular:['',Validators.required],
      numeroTrajeta:['',[Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaDeExpiracion:['',[Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv:['',[Validators.required,Validators.maxLength(3), Validators.minLength(3)]]
    })
  }



  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaServices.getListTrjetas().subscribe(data => {
      console.log(data);
      this.listarTarjetas = data;
    }, error => {
      console.log(error);
    });
  }

  guardarTarjeta(){
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTrajeta: this.form.get('numeroTrajeta')?.value,
      fechaDeExpiracion: this.form.get('fechaDeExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    }
    if (this.id == undefined) {
      //Agregamos una nueva tarjeta
      this._tarjetaServices.saveTarjeta(tarjeta).subscribe(data=>{
        this.toastr.success('La tarjeta fue registrada con exito', 'Tarjeta registrada');
        this.obtenerTarjetas();
        this.form.reset();
      }, error =>{
        this.toastr.error('Opss ocurrio un error...','Error')
        console.error(error);
      })
    }else{
      //Agregamos una nueva tarjeta
      tarjeta.id = this.id; //Seteando el id de la tarjeta para que la API la reconozca
      this._tarjetaServices.updateTarjeta(this.id, tarjeta).subscribe(data =>{
        this.form.reset();
        this.accion='Agregar',
        this.id=undefined;
        this.toastr.info('La tarjeta fue actualizada con exito', 'Tarjeta actualizada');
        this.obtenerTarjetas();
      }, error=>{
        this.toastr.error('Opss ocurrio un error...','Error')
        console.error(error);
      })
    }

  }

  eliminarTarjeta(id:number){
    this._tarjetaServices.deleteTarjeta(id).subscribe(data =>{
      this.toastr.error('La tarjeta fue eliminada con extio', 'Tarjeta eliminada');
      this.obtenerTarjetas();
    }, error =>{
      this.toastr.error('Opss ocurrio un error...','Error')
      console.log(error);
    })

  }

 editarTarjeta(tarjeta: any){
  this.accion ='Editar';
  this.id=tarjeta.id;
  this.form.patchValue({
    titular:tarjeta.titular,
    numeroTrajeta: tarjeta.numeroTrajeta,
    fechaDeExpiracion: tarjeta.fechaDeExpiracion,
    cvv:tarjeta.cvv
  })
 }

}
