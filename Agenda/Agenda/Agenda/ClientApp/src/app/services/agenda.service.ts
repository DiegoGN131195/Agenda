import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agenda } from '../models/agenda';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/message-response';
import { HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
  }

  getAll(){
    return this.http.get<Agenda[]>(this.baseUrl + 'api/Agenda/GetAll');
  }

  update(agenda:Agenda): Observable<MessageResponse<Agenda>>{
    return this.http.put<MessageResponse<Agenda>>(`${this.baseUrl}api/Agenda/Update`, agenda);
  }

  create(agenda: Agenda): Observable<MessageResponse<Agenda>>{
    return this.http.post<MessageResponse<Agenda>>(`${this.baseUrl}api/Agenda/Create`,agenda);
  }

  delete(agenda: Agenda): Observable<MessageResponse<Agenda>>{
    return this.http.delete<MessageResponse<Agenda>>(`${this.baseUrl}api/Agenda/Delete?idAgenda=${agenda.id}`);
  }

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
 
    return this.http.post(`${this.baseUrl}api/Agenda/Upload`, formData, {reportProgress: true, observe: 'events'});
  }

}
