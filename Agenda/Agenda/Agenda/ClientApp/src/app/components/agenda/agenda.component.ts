import { Component, OnInit } from '@angular/core';
import { Agenda } from '../../models/agenda';
import { MatTableDataSource, MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { PermissionType } from '../../enums/permission-type.enum';
import { AgendaService } from '../../services/agenda.service';
import { MessageResponse } from '../../models/message-response';
import { AgendaDialog } from '../../models/agenda-dialog';
import { AgendaDialogComponent } from '../agenda-dialog/agenda-dialog.component';
import { EventEmitter } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Inject } from '@angular/core';
import { Constants } from '../../models/constants';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

  example = "dasfsfrwrf";
  messageError: string = "";
  isError: boolean = false;
  public permissionType : any = PermissionType;
  displayedColumns : string[];
  dataSource : MatTableDataSource<Agenda> =  new MatTableDataSource<Agenda>();
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  showSendMail: boolean = false;
  users : Agenda[] = [];
  @Input() title: string;
  agendas: Agenda[] = [];
  DefaultImage = Constants.DefaultImage;

  constructor(private agendaService: AgendaService,      
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    public dialog: MatDialog,
    @Inject('BASE_URL') private baseUrl: string 
  ) { }

  ngOnInit() {
    this.loadDataTable();
  }

  private loadDataTable(){

    this.agendaService.getAll()
    .subscribe((agendas) => {
      this.agendas = agendas;
      for (let agenda of agendas) {
        agenda.photo = `${this.baseUrl}Resources/Images/${agenda.photo}`;
      }
      this.generateTable(agendas);
    });
   }

   private generateTable(agendas :Agenda[]){
    this.displayedColumns  = [];
    this.displayedColumns.push('photo', 'phone', 'name', 'options');
    this.dataSource = new MatTableDataSource<Agenda>(agendas);
    this.dataSource.paginator = this.paginator;
  }

  onSelectAgenda(agenda: Agenda, permissionType: PermissionType){
    if(permissionType == PermissionType.Delete){
      this.deleteAgenda(agenda);
      return;
    }
    this.openModal(agenda, permissionType);

  }

  private deleteAgenda(deleteAgenda: Agenda){
    if(!deleteAgenda || deleteAgenda.id == 0) return;

    this.isError = false;
    this.messageError = "";
    this.loaderService.show();
    this.agendaService.delete(deleteAgenda)
      .subscribe((messageResponse) => {
        this.manageResponse(messageResponse, PermissionType.Delete);
    });
   }

   private manageResponse( messageResponse: MessageResponse<Agenda>, permissionType: PermissionType){
    
    this.messageError = messageResponse.error.isError ? 
      "Ocurrio un error al elminar el contacto" :
      "Se elimino correctamente el contacto";

    var classSnackBar = messageResponse.error.isError ? 
      "danger-snackbar":
      "success-snackbar";

    this.loadDataTable();
    this.snackBar.open(this.messageError, "Cerrar", {
      horizontalPosition: 'end',
      duration: 6000,
      panelClass: [classSnackBar],
    });

    this.loaderService.hide();
   }

   private openModal(agenda: Agenda, permissiontype: PermissionType){
    var agendaDialog = new AgendaDialog();
    agendaDialog.agenda = agenda;
    agendaDialog.permissionType = permissiontype;
    agendaDialog.title = this.title;

    const dialogRef = this.dialog.open(AgendaDialogComponent, {
      data: agendaDialog,
      autoFocus: false 
    });

    const sub = dialogRef.componentInstance.onLoadDataTable.subscribe(() => {
      this.loadDataTable();
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe()
    });
   }
}
