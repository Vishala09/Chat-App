import { user } from './../models/user';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl , Validators, Form} from '@angular/forms';
import { Router } from '@angular/router';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

   constructor(public authService:AuthenticationService,private router:Router) { }
  loginForm:FormGroup;
  //userId:FormControl; 
  emailId:FormControl;
  password:FormControl;
  errorMsg:string;
  successMsg:string;
  submitclicked:boolean;
  user:user = {userId:"",password:"",emailId:""}
  ngOnInit(): void {
   // this.userId=new FormControl("",[Validators.required,Validators.pattern('[a-zA-Z].*')]);
    this.emailId=new FormControl("",Validators.required);
    this.password=new FormControl("",Validators.required);
    this.loginForm=new FormGroup({
     // userId:this.userId,
      password:this.password,
      emailId:this.emailId
    })
  }

  saveProfile(values)
  {
    this.errorMsg="";
    this.successMsg="";
    if(this.loginForm.valid)
    {
      console.log(this.emailId);
      this.user.emailId=this.emailId.value;
      this.user.password=this.password.value;
      this.authService.loginUser( this.user )
      .subscribe(
        user => {
          console.log(user,"logged in");
          this.successMsg=user['msg'];
          this.router.navigate(['messages','all'])
        },
        error => {
          this.errorMsg=error.error.msg;
          console.log("Errorr",error,error.error.msg);
        }
      )
      
    }
    else{
        this.errorMsg="Please check for form validations";
    }
  }
 

}
