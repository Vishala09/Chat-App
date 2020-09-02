import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http';
import { user } from './models/user';
import { Observable,Subject } from 'rxjs';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http:HttpClient) { }
  public baseUri="http://localhost:3000";
  public headers=new HttpHeaders().set('Content-Type','application/json');
  
  user:user;
  isLoggedIn:boolean = false;
 
  registerUser(user)
  {
    return this.http.post(this.baseUri+'/register',user,{headers:this.headers,withCredentials:true}).pipe(
      map((response: Response) => {
        console.log("response",response);
        return response;
      }));;
  }
  loginUser(user):Observable<Object>
  {
    
    return this.http.post(this.baseUri+'/login',user,{headers:this.headers,withCredentials:true}).pipe(
    map((response: Response) => {
      console.log(response['token'],response['emailId'],response['user']);
      localStorage.setItem('token',response['token']);
      localStorage.setItem('emailId',response['emailId']);
       this.user=user;
       this.isLoggedIn=true;
       console.log(this.isLoggedIn);
       //alert(this.isLoggedIn);
      return response;
    }));
  }
  getCurrentUser()
  {
    return this.http.get(this.baseUri+'/getCurrentUser',{headers:{Authorization:localStorage.getItem('token')}});
  }
  getUser(userEmail)
  {
    let params = new HttpParams();
    params = params.append('emailId', userEmail);
    return this.http.get(this.baseUri+'/getUser',{headers:this.headers,params:params});
  }
  getAllUsers()
  {
    return this.http.get(this.baseUri+'/getAllUsers',{headers:{Authorization:localStorage.getItem('token')}});
  }
  logout()
  {
    this.user = null;
    this.isLoggedIn=false;
    window.localStorage.removeItem('token');
  }
}
