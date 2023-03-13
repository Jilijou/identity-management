import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLdap } from '../model/user-ldap';
import { UsersService } from '../service/users.service';
import {
  ConfirmVaidParentMatcher,
  passwordValidator,
} from './passwords-validator.directive';

@Component({
  selector: 'app-ldap-detail',
  templateUrl: './ldap-detail.component.html',
  styleUrls: ['./ldap-detail.component.css'],
})
export abstract class LdapDetailComponent {
  user: UserLdap;
  processLoadRunning = false;
  processValidateRunning = false;
  displayedColumns: any;
  passwordPlaceHolder: string;
  errorMessage = '';

  confirmValidParentMatcher = new ConfirmVaidParentMatcher();

  userForm = this.fb.group({
    login: [''],
    nom: [''],
    prenom: [''],
    passwordGroup: this.fb.group(
      {
        password: [''],
        confirmPassword: [''],
      },
      { validators: passwordValidator }
    ),
    mail: { value: '', disabled: true },
  });

  protected constructor(
    public addForm: boolean,
    //protected route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.passwordPlaceHolder =
      'Mot de passe' + (this.addForm ? '' : ' (vide si inchangé)');
  }

  protected onInit(): void {}

  isFormValid(): boolean {
    return (
      this.userForm.valid &&
      (!this.addForm || this.formGetValue('passwordGroup.password') !== '')
    );
  }

  /*private getUser(): void {
    const login = this.route.snapshot.paramMap.get('id');
    this.usersService.getUser(login).subscribe((user) => {
      console.log('LdapDetail getUser = ' + user);
    });
  }*/

  abstract validateForm(): void;

  edit(login: string) {
    this.router.navigate(['/user', login]).then((e) => {
      if (!e) {
        console.log('Navigation has failed!');
      }
    });
  }

  private formGetValue(name: string): any {
    return this.userForm.get(name).value;
  }

  goToLdap(): void {
    this.router.navigate(['/users/list']);
  }

  onSubmitForm(): void {
    this.validateForm();
  }

  updateLogin(): void {
    if (this.addForm) {
      this.userForm
        .get('login')
        .setValue(
          (
            this.formGetValue('prenom') +
            '.' +
            this.formGetValue('nom')
          ).toLowerCase()
        );
      this.updateMail();
    }
  }
  updateMail(): void {
    if (this.addForm) {
      this.userForm
        .get('mail')
        .setValue(this.formGetValue('login').toLowerCase() + '@epsi.lan');
    }
  }

  protected copyUserToFormControl(): void {
    this.userForm.get('login').setValue(this.user.login);
    this.userForm.get('nom').setValue(this.user.nom);
    this.userForm.get('prenom').setValue(this.user.prenom);
    this.userForm.get('mail').setValue(this.user.mail);
  }

  protected getUsersFromFormControl(): UserLdap {
    return {
      login: this.userForm.get('login').value,
      nom: this.userForm.get('nom').value,
      prenom: this.userForm.get('prenom').value,
      nomComplet:
        this.userForm.get('nom').value +
        ' ' +
        this.userForm.get('prenom').value,
      mail: this.userForm.get('mail').value,
      employeNumero: 1,
      employeNiveau: 1,
      dateEmbauche: '2020-04-24',
      publisherId: 1,
      active: true,
      motDePasse: '',
      role: 'ROLE_USER',
    };
  }
}
