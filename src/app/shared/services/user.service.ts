import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, map, throwError } from 'rxjs';
import { User } from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://jsonplaceholder.typicode.com';

 private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  // Local data array
  private usersData: User[] = [];


  constructor(private http: HttpClient) { }

   getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
    .pipe(
       map((users: User[]) => {
        return users.map(user => ({
          ...user,
          role: "Admin" // api does not return role so mannually adding it here
        }));
      }),
      tap((users: User[]) => {
        this.usersData = users; // Store the users locally
        this.usersSubject.next(this.usersData); // assigning data from api to behaviour subject
      })
    );
  }

  // The code that communicates with the API for create, update, and delete operations has been
  // commented out due to limitations with the provided API.
  // Instead, we're using local data manipulation with Subjects to simulate these operations.

  // getUserById(userId: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/users/${userId}`);
  // }

  // updateUser(id: number, user: Partial<User>): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/users/${id}`, user);
  // }

  // addUser(user: Partial<User>): User {
  //   return this.http.post(`${this.apiUrl}/users`, user);
  // }

  // Implement create, update, and delete methods

  addUser(user: User): Observable<User> {
    // generate a unique ID for a new user being added to the list.
    const newId = this.usersData.length > 0 ? Math.max(...this.usersData.map(u => u.id!)) + 1 : 1;

    user = {
      ...user,
      id: newId
    }
    this.usersData.unshift(user); // add to front of local array
    this.usersSubject.next(this.usersData); // assign new array with newly created user to subject
    return of(user) // mimic observable return
  }

  updateUser(userId: number, updatedUser: User): Observable<User> {
    const index = this.usersData.findIndex(user => user.id === userId);
    if (index !== -1) {
      this.usersData[index] = updatedUser;
      this.usersSubject.next(this.usersData);
      return of(updatedUser)
    }else {
      return throwError(() => 'User not found');
    }
  }

 getUserById(userId: number): Observable<User> {
  const user = this.usersData.find(user => user.id === userId);
  if (user) {
    return of(user);
  } else {
    return throwError(() => 'User not found');
  }
}

  deleteUser(userId: number): Observable<string> {
    const index = this.usersData.findIndex(user => user.id === userId);
    console.log("this.usersData", this.usersData)
    console.log("index", index)
    console.log("userId", userId)
  if (index !== -1) {``
    this.usersData.splice(index, 1);
    this.usersSubject.next(this.usersData);
    return of('User deleted successfully');
  } else {
    return throwError(() => 'User not found');
  }
}
}
