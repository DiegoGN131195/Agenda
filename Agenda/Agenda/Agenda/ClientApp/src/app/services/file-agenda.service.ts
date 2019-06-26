import { Injectable } from '@angular/core';
import { Guid } from '../class/guid';

@Injectable({
  providedIn: 'root'
})
export class FileAgendaService {

  constructor() { }

  getNewFile(fileUpload: any): File{
    let extension = fileUpload.name.split(".");
    var type = ".jpg,.png";
    var e = new Guid();
    e = Guid.newGuid();
    var blob = fileUpload.slice(0, fileUpload.size, type); 
    return new File([blob], `${e.toString()}.${extension[extension.length-1]}`, {type: type});
  }

    getNameMedia(value: string, baseUrl: string): string{
      if (!value) return null;
      return value.replace(`${baseUrl}Resources/Images/`, '');
  }
}
