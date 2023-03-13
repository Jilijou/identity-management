import { Injectable } from '@angular/core';
import { LDAP_USERS } from '../model/ldap-mock-data';
import { UserLdap } from '../model/user-ldap';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // Liste des utilisateurs
  users: UserLdap[] = LDAP_USERS;
  static users: any;

  getUsers(): Observable<UserLdap[]> {
    return of(this.users);
  }

  getUser(login: string): Observable<UserLdap> {
    return of(this.users.find(user => user.login === login));
  }

  addUser(user: UserLdap): Observable<UserLdap> {
    //Ajout d'une liste
    UsersService.users.push(user);
    return of(user);
  }

  updateUser(userToUpdate: UserLdap): Observable<UserLdap> {
    //Modification de l'utilisateur
    const user = UsersService.users.find( u => u.login === userToUpdate.login);
    if (user) {
      user.nom = userToUpdate.nom;
      user.prenom = userToUpdate.prenom;
      user.nomComplet = user.nom + ' ' + user.prenom;
      user.motDePasse = userToUpdate.motDePasse;

      return of(userToUpdate);
    }

    return throwError('Utilisateur nom trouvé');
  }
  constructor() { }
}
