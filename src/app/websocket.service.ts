import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket : SocketIOClient.Socket;
  constructor() {
     this.socket = io.connect('http://localhost:3000');
   }

  listen(eventName:string) : Observable<any>
  {
    return new Observable((subscribe) => {
        this.socket.on(eventName,(data) => {
            subscribe.next(data);
        })
    })
  }
  emit(eventName:string,data:any)
  {
        this.socket.emit(eventName,data);
  }
}
