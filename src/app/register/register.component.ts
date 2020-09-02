import { user } from './../models/user';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl , Validators, Form} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  constructor(public authService:AuthenticationService,private router:Router) { }
  registerForm:FormGroup;
  userId:FormControl; 
  emailId:FormControl;
  password:FormControl;
  errorMsg:string;
  successMsg:string;
  user:user = {userId:"",password:"",emailId:""}
  ngOnInit(): void {
    this.userId=new FormControl("",[Validators.required,Validators.pattern('[a-zA-Z].*')]);
    this.emailId=new FormControl("",Validators.required);
    this.password=new FormControl("",Validators.required);
    this.registerForm=new FormGroup({
      userId:this.userId,
      password:this.password,
      emailId:this.emailId
    })
  }

  saveProfile(values)
  {
    if(this.registerForm.valid)
    {
      this.errorMsg="";
      this.successMsg="";
      console.log(this.userId)
      this.user.userId=this.userId.value;
      this.user.emailId=this.emailId.value;
      this.user.password=this.password.value;
      this.authService.registerUser( this.user ).subscribe(
        data => {
          console.log(data,data['msg'],"logged in");
          this.successMsg=data['msg'].toString();
          this.router.navigate(['login']);
        },
        error => {
          this.errorMsg=error.error.msg;
          console.log("Errorr",error);
        }
      )
      
    }
    else{
         this.errorMsg="Please check for validations";
    }
  }
 
}
