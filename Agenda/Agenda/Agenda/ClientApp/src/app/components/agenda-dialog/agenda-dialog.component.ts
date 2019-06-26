import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FileAgenda } from '../../models/file-agenda';
import { Constants } from '../../models/constants';
import { FileAgendaService } from '../../services/file-agenda.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AgendaDialog } from '../../models/agenda-dialog';
import { Inject } from '@angular/core';
import { PermissionType } from '../../enums/permission-type.enum';
import { Validators } from '@angular/forms';
import { Regex } from '../../class/regex';
import { AgendaService } from '../../services/agenda.service';
import { Agenda } from '../../models/agenda';
import { MessageResponse } from '../../models/message-response';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-agenda-dialog',
  templateUrl: './agenda-dialog.component.html',
  styleUrls: ['./agenda-dialog.component.css']
})
export class AgendaDialogComponent implements OnInit {

  onLoadDataTable = new EventEmitter();
  @ViewChild("firstName", null) firstNameField: ElementRef;
  messageError: string = "";
  isError: boolean = false;
  nameButton: string;
  isVisibleButton: boolean = true;
  form: FormGroup;
  photoFile: FileAgenda;
  DefaultImage = Constants.DefaultImage;

  constructor(private fileAgendaService: FileAgendaService,
    private agendaService: AgendaService,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    @Inject('BASE_URL') private baseUrl: string,
    public dialogRef: MatDialogRef<AgendaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AgendaDialog) { }

  ngOnInit() {
    this.data.title = "Agenda"
    this.photoFile = new FileAgenda(this.fileAgendaService,this.data.agenda && this.data.agenda.photo ? this.data.agenda.photo : null, this.agendaService, this.baseUrl)
    this.changeButton();
    this.generateFormGroup();
   }

   changeButton(){
    if (this.data.permissionType == PermissionType.Create){
      this.nameButton = "Crear";
    }else if(this.data.permissionType == PermissionType.Update){
      this.nameButton = "Actualizar";
    }else{
      this.isVisibleButton = false;
    }
  }

  generateFormGroup(): any {
    this.form = this.fb.group({
      FirstName: [this.getValue("FirstName") , Validators.compose([Validators.maxLength(100), Validators.required])],
      LastName: [this.getValue("LastName"), Validators.compose([Validators.maxLength(50), Validators.required])],
      Phone: [this.getValue("Phone") , Validators.compose([Validators.maxLength(20), Validators.required])],
      SecondLastName: [this.getValue("SecondLastName"), Validators.compose([Validators.maxLength(50), Validators.required])],
      Photo:[this.data.permissionType == PermissionType.Create ? null : this.photoFile.fileName , Validators.compose([Validators.pattern(Regex.imagesExtension),Validators.required])],
    });

    if (this.data.permissionType == PermissionType.Read){
      this.form.disable();
    }
  }

  getValueField<T>(field: string): T{
    return <T> this.form.get(field).value;
  }

  getValue(key: string){
    if(!key || !this.data.agenda) return null;

    var keyUser = key.charAt(0).toLowerCase() + key.slice(1);
    return this.data.agenda[keyUser] || null;
  }

  onSubmit() {
    if (this.form.invalid) {
        return;
    }
    this.setValues();

    this.loaderService.show();
    this.photoFile.save();
    if(this.data.permissionType == PermissionType.Create){
      this.agendaService.create(this.data.agenda).subscribe((messageResponse) => { this.manageResponse(messageResponse) });
    }else if(this.data.permissionType == PermissionType.Update){
        this.agendaService.update(this.data.agenda).subscribe((messageResponse) => { this.manageResponse(messageResponse) });
    }
  }

  selectFile(event)
  {
    this.photoFile.set(event.target.files[0]);
    this.form.controls["Photo"].setValue(this.photoFile.fileName ? this.photoFile.fileName : '');
  }

  setValues(){
    if(!this.data.agenda)
      this.data.agenda = new Agenda();

    this.data.agenda.firstName = this.getValueField<string>("FirstName");
    this.data.agenda.lastName = this.getValueField<string>("LastName");
    this.data.agenda.secondLastName = this.getValueField<string>("SecondLastName");
    this.data.agenda.phone = this.getValueField<string>("Phone");
    this.data.agenda.photo = this.getValueField<string>("Photo");

  }

  manageResponse(messageResponse: MessageResponse<Agenda>){

    this.isError = false;
    this.messageError = "";

    if(messageResponse.error.isError){
      this.messageError = "Ocurrio un error inesperado";
      this.firstNameField.nativeElement.focus();
      this.isError = true;
    }else
      this.onLoadDataTable.emit();
      var message = this.data.permissionType == PermissionType.Update ? 
      "Se actualizo correctamente el contacto." :
      "Se creo correctamente el contacto.";

    this.snackBar.open(message, "Cerrar", {
      horizontalPosition: 'end',
      duration: 6000,
      panelClass: ['success-snackbar']
    });

    if(this.data.permissionType == PermissionType.Create){
      this.dialogRef.close();
    }
    
    
    this.loaderService.hide();
  }


}
