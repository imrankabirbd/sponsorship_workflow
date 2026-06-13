export class User {
  id: number = 0;
  username: string = '';
  fullName: string = '';
  email: string = '';
  department: string = '';
  role: string = '';
  isActive: boolean = true;
  createdAt: Date = new Date();
  lastLoginAt?: Date;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  getRoleBadgeClass(): string {
    switch(this.role) {
      case 'Requestor': return 'badge-info';
      case 'Manager': return 'badge-warning';
      case 'FinanceAdmin': return 'badge-success';
      case 'SystemAdmin': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}

export class LoginDto {
  username: string = '';
  password: string = '';

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class LoginResponseDto {
  id: number = 0;
  username: string = '';
  fullName: string = '';
  email: string = '';
  role: string = '';
  department: string = '';
  message: string = '';
  expiresAt: Date = new Date();

  constructor(data?: Partial<LoginResponseDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
