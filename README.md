# Setup Guide

## Prerequisites

Make sure the following tools are installed:

* .NET SDK 8.0
* Node.js (LTS Version)
* Angular CLI
* Postgre SQL
* Visual Studio 2022
* VS Code
* Git

# 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd <project-folder>
```

# 2. Run Backend API

Open terminal and navigate to backend project.

```bash
cd backend
```

Restore packages:

```bash
dotnet restore
```

Update database connection string inside:

```text
appsettings.json
```

Example:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=SponsorshipDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Run the API:

```bash
dotnet run
```

Backend URL:

```text
https://localhost:44368
```

Swagger:

```text
https://localhost:44368/swagger
```

# 3. Set Up Database

Open pgAdmin4.

Create database:

```sql
CREATE DATABASE SponsorshipDB;
```

Apply migration:

``` open developer powershell and execute bellow command 
cd Sponsorship.Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../Sponsorship.API
dotnet ef database update --startup-project ../Sponsorship.API
```

OR execute provided SQL script:

```text
database/database.sql
```

Verify tables are created successfully.

# 4. Run Frontend Application

Open new terminal.

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run Angular application:

```bash
ng serve
```

Frontend URL:

```text
http://localhost:4200
```

# 5. Test Login Accounts

Use the following test users:

| Role      | UserId        | Password |
| --------- | --------------| -------- |
| Requestor | imran         | 123456   |
| Requestor | arif          | 123456   |
| Requestor | mamun         | 123456   |
| Manager   | Kabir         | 123456   |
| Finance   | rubel         | 123456   |
| Admin     | Babor         | 123456   |

# 6. Application Flow

Login
→ Create Request
→ Manager Approval
→ Finance Approval
→ Final Status

# 7. Notes

* Backend must be running before starting frontend.
* Update API base URL in Angular environment configuration if required.
* Use Swagger to test APIs directly.
