import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';
import { response } from 'express';
import { error } from 'console';
import { HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { FormsModule, NgForm } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { TRANSLATION_EN, TRANSLATION_FR, TRANSLATION_NL } from './translation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, RouterOutlet, RouterModule, MenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  title = 'frontend';
  public users! : User[];
  public editUser!: User | null;
  public deleteUser!: User | null;

  //user status
  public isAuthenticated: boolean = false;
  public userInfo: any;
  public role: string = 'VISITOR';

  //translations
  public preferredLanguage: string = 'EN'; 
  public translations : { [key: string]: string } = TRANSLATION_EN;

  //constructor
  constructor(private userService: UserService){}




  //METHODS
  ngOnInit(): void {
    this.getUsers();

    // if user is connected
    this.userService.getUserInfo().subscribe({
      next: (data) => {
        this.userInfo = data;
        this.isAuthenticated = true;
        this.preferredLanguage = this.userInfo.preferredLanguage;        
        this.role = this.userInfo.role;
        if(this.preferredLanguage === 'EN'){
          this.translations = TRANSLATION_EN;
        }
        else if(this.preferredLanguage === 'FR'){
          this.translations = TRANSLATION_FR;
        }
        else {
          this.translations = TRANSLATION_NL;
        }
        console.log('Utilisateur connecté :', this.userInfo);
      },
      error: (err) => {
        console.log('Aucun utilisateur connecté', err);
        this.isAuthenticated = false;
      }
    });
  }




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
  }

}
