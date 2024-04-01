import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessstellenStam } from 'src/app/interfaces/messstellen-stam';

@Injectable({
  providedIn: 'root'
})
export class StammCrudService {

  persons$: BehaviorSubject<MessstellenStam[]>;
  persons: Array<MessstellenStam> = [];

  constructor() {
    this.persons$ = new BehaviorSubject([]);
    // this.persons = personsData;
  }

  // edit(person: MessstellenStam) {
  //   let findElem = this.persons.find(p => p..id == person.id);
  //   findElem.firstName = person.firstName;
  //   findElem.age = person.age;
  //   findElem.job = person.job;
  //   this.persons$.next(this.persons);
  // }
}
