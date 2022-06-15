import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  private subject = new Subject<any>()

  sendMsg(message: string) {
    this.subject.next({ text: message })
    setTimeout(() => { this.subject.next('') }, 4000)
  }

  onMessage(): Observable<any> {
    return this.subject.asObservable()
  }
}
