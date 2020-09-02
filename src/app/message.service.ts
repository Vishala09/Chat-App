import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http';

import { AuthenticationService } from './authentication.service';
import { Observable,Subject } from 'rxjs';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http:HttpClient,public authService:AuthenticationService) {

   }
   public baseUri="http://localhost:3000";
   public headers=new HttpHeaders().set('Content-Type','application/json');

   storeMessages(message)
   {
      console.log("message",message)
      return this.http.post(this.baseUri+'/storeMessages',message,{headers:this.headers}).pipe(
      map((response: Response) => {
        console.log("response",response);
        return response;
      }));
   }
   getContacts()
   {
      return this.http.get(this.baseUri+'/getContacts',{headers:{Authorization:localStorage.getItem('token')}}).pipe(
      map((response: Response) => {
        console.log("response allcontacts",response);
        return response;
      }));
   }
   getContactsData()
   {
    let params = new HttpParams();
    console.log("useremail", localStorage.getItem('emailId'))
    params = params.append('toEmailId', localStorage.getItem('emailId'));
    return this.http.get(this.baseUri+'/getContactsData',{headers:this.headers,params:params});
   }
   getMessages(toEmailId){
    let params = new HttpParams();
    params = params.append('sender', localStorage.getItem('emailId'));
    params = params.append('receiver', toEmailId);
      return this.http.get(this.baseUri+'/getMessages',{headers:this.headers,params:params}).pipe(
      map((response: Response) => {
        return response;
      }));
   }
}
