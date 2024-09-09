import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  constructor(private router: Router){  }
  
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {        
        //reload setting page for the form bug
        /*if (event.url === '/setting') {
          if (!localStorage.getItem('settingsPageReloaded')) {
            localStorage.setItem('settingsPageReloaded', 'true');
            window.location.reload();
          } else {
            localStorage.removeItem('settingsPageReloaded');
          }
        }*/
        //always top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });  

  }

  ngAfterViewInit() {
    setTimeout(() => {
      document.body.classList.add('reflow');
      document.body.offsetHeight; 
      document.body.classList.remove('reflow');
    }, 0);
  }









  
/*
  public users! : User[];
  public editUser!: User | null;
  public deleteUser!: User | null;*/

/*
  public getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response: User[]) => {
        this.users = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public searchUsers(keyword: string | null): void {
    if(keyword == null) keyword="";
    this.userService.searchUsers(keyword).subscribe({
      next: (response: User[]) => {
        this.users = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onAddUser(addForm: NgForm): void{
    document.getElementById('add-user-form')?.click();
    this.userService.addUser(addForm.value).subscribe({
      next: (response: User) => {
        console.log(response);
        this.getUsers();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    });
  }

  public onUpdateUser(employee: User): void{
    this.userService.updateUser(employee).subscribe({
      next: (response: User) => {
        console.log(response);
        this.getUsers();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
  
  public onDeleteUser(id: number): void{
    this.userService.deleteeUser(id).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getUsers();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onOpenModal(user: User | null, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display='none';
    button.setAttribute('data-toggle', 'modal');
    if(mode === 'add'){
      button.setAttribute('data-target', '#addUserModal');
    }
    if(mode === 'edit'){
      this.editUser = user;
      button.setAttribute('data-target', '#updateUserModal');
    }
    if(mode === 'delete'){
      this.deleteUser = user;
      button.setAttribute('data-target', '#deleteUserModal');
    }
    container?.appendChild(button);
    button.click();
  }*/

}
