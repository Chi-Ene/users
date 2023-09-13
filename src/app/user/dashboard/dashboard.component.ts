import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { User } from 'src/app/shared/interfaces/users';
import { UserService } from 'src/app/shared/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  pageTitle = 'User Management Dashboard';

  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  pageSize = 5; // Number of users per page
  currentPage = 1;
  totalPages!: number;
  searchControl = new FormControl();
  isLoading = true;
  hasError = false;
  errorMessage = '';


  id: number | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'] ? parseInt(this.route.snapshot.params['id']) : null;

    this.loadUsers();

    this.searchControl.valueChanges.pipe(
        startWith(''), // Start with an empty string to make sure initial load is correct
        debounceTime(300),  // debounce for 300ms
        distinctUntilChanged()  // only emit if value has really changed
    ).subscribe(searchTerm => {
        this.filteredUsers = this.users.filter(user =>
            (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
        this.updatePaginatedUsers();
    });
}

loadUsers(): void {
  this.isLoading = true;
    this.userService.users$.pipe(
        // If users$ is empty or null, fetch from the backend; otherwise, use users$ directly
        switchMap(users => {
            if (users && users.length > 0) {
                this.filteredUsers = users; // copy users array to filteredUsers initially
                return of(users);  // return the users as an observable
            } else {
                return this.userService.getUsers();  // Fetch from backend
            }
        })
    ).subscribe({
    next: data => {
        this.users = data;
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.updatePaginatedUsers();
        this.isLoading = false;
        this.hasError = false;
    },
    error: err => {
        this.isLoading = false; // Turn off loading since an error occurred
        this.hasError = true;   // Set error flag
        this.errorMessage = err.message || 'An error occurred while fetching data.'; // Display the error message
        Swal.fire(this.errorMessage, 'Error'); // Display the toast
    }
});
}

updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
}

  delete(id: number): void {
    this.userService.deleteUser(id).subscribe({
    next: () => {
      Swal.fire('User deleted successfully!');
       if (this.currentPage > 1 && (this.currentPage - 1) * this.pageSize >= this.filteredUsers.length) {
        this.currentPage--;
      }

      this.updatePaginatedUsers();
    },
    error: error => {
      Swal.fire(this.errorMessage, 'Error'); // Display the toast
      console.error('Error deleting user:', error);
    }
  });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }

}
