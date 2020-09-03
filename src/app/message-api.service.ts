import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Observable,Subject } from 'rxjs';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MessageApiService {

  constructor(private http:HttpClient,public authService:AuthenticationService) {
      
   }
   public baseUri="http://localhost:3000";
   public headers=new HttpHeaders().set('Content-Type','application/json');
   storeMessagesinCloud(sender,receiver)
   {
     
    let params = new HttpParams();
    params = params.append('sender', sender);
    params = params.append('receiver', receiver);
      return this.http.get(this.baseUri+'/getBackup',{headers:this.headers,params:params}).pipe(
      map((response: Response) => {
        console.log("response",response);
        return response;
      }));
   }

   resetData(sender,receiver)
   {
    let params = new HttpParams();
    params = params.append('sender', sender);
    params = params.append('receiver', receiver);
      return this.http.get(this.baseUri+'/resetData',{headers:this.headers,params:params}).pipe(
      map((response: Response) => {
        console.log("response",response);
        return response;
      }));
   }
}
