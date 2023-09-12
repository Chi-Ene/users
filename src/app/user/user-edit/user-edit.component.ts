import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/interfaces/users';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {

  pageTitle = 'User Edit';
  user: any = {};  // The user object for both adding and editing
  id: number | null = null;
  buttonTitle!: string;

  // userForm = new FormGroup({
  //   name: new FormControl('Phoebe', {nonNullable: true}),
  //   email: new FormControl('phoebebrown@gmail.com', {nonNullable: true}),
  //   role: new FormControl('', {nonNullable: true}),
  // });

  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : null;
    this.buttonTitle = this.id ? 'Edit User' : 'Save User'

    if (this.id) {
      this.userService.getUserById(this.id).subscribe((user: User) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role
        });
      });
    }
  }

 saveUser(): void {
  if (this.userForm.valid) {
    let formData: Partial<User> = this.userForm.value;


    if (this.id) {
      formData.id = this.id;
    }

    // Handle potential undefined or null values
    if (!formData.name) formData.name = '';
    if (!formData.email) formData.email = '';
    if (!formData.role) formData.role = '';

    if (this.id) {
      this.buttonTitle = 'Edit User';
      this.userService.updateUser(this.id, formData as User).subscribe(() => {
        console.log('User updated successfully!');
        this.router.navigate(['/users']);  // Redirect back to user list after update
      });
    } else {
      this.userService.addUser(formData as User).subscribe(() => {
        console.log('User added successfully!');
        this.router.navigate(['/users']);  // Redirect back to user list after adding
      });
    }
  } else {
    console.warn('Form is not valid');
  }
}


}
