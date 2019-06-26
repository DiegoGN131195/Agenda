import { FileUpload } from "./file-upload";
import { FileAgendaService } from "../services/file-agenda.service";
import { AgendaService } from "../services/agenda.service";

export class FileAgenda {
    progress: { percentage: number } = { percentage: 0 };
    uploadFile: boolean;
    fileUpload: FileUpload;
    source: string;
    auxFileName: string;
    fileName: string;
    baseUrl: string;
    constructor(private fileAgendaService: FileAgendaService, source: string, private agendaService: AgendaService, baseUrl: string){
        this.source = source;
        this.uploadFile = this.source ? false : true;
        this.baseUrl = baseUrl
        this.fileName = this.fileAgendaService.getNameMedia(this.source, this.baseUrl);
        this.auxFileName = this.fileName;
    }

    set(file: any){
        var newFile = this.fileAgendaService.getNewFile(file);
        this.auxFileName = this.fileName;
        this.fileName = newFile.name;
        
        var reader = new FileReader();
        reader.readAsDataURL(file); // read file as data url

        reader.onload = (event: any) => { // called once readAsDataURL is completed
            this.uploadFile = true;
            this.source = event.target.result;
            this.fileUpload = new FileUpload(newFile);
        }
    }

    save(){
        // if(this.auxFileName && this.fileName != this.auxFileName && this.fileUpload){
        //     this.agendaService.deleteFileStorage(this.auxFileName);
        // }

        var files = new Array<File>();
        files.push(this.fileUpload.file);
        if(this.uploadFile && this.fileUpload){
            this.agendaService.uploadFile(files).subscribe((response) => {
            });
        }
        this.uploadFile = false;

    }
}
