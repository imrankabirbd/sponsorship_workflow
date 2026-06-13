import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router){

  }

  onSubmit(){
    if(!this.username || !this.password){
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

     this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        //this.redirectByRole(response.role);
        this.router.navigateByUrl('deshboard');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid username or password';
      }
    });

  }

  redirectByRole(role: string) {
    switch(role) {
      case 'Requestor':
        this.router.navigate(['/requestor/my-requests']);
        break;
      case 'Manager':
        this.router.navigate(['/manager/pending']);
        break;
      case 'FinanceAdmin':
        this.router.navigate(['/finance/review']);
        break;
      case 'SystemAdmin':
        this.router.navigate(['/admin/all-requests']);
        break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
