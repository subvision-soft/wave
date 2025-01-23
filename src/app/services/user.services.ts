import {Injectable} from '@angular/core';
import {User} from '../models/user';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {ToastService, ToastTypes} from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private users: User[] = [];

  private path = '/users';

  constructor(private readonly toastService: ToastService) {
    Filesystem.readFile({
      path: this.path,
      directory: Directory.Data,
    }).then(file => {
      if (typeof file.data === "string") {
        this.users = JSON.parse(atob(file.data));

        return;
      }

      file.data.text().then(text => {
        this.users = JSON.parse(text);
      })
    })
  }

  create(user: User): void {
    if(this.exists(user.id)) {
      this.toastService.initiate({
        title: 'Impossible de creer la fiche',
        type: ToastTypes.ERROR,
        content: 'Une personne est déjà enregistrer avec ce numéro',
        duration: 2000,
        show: true,
      });
      throw new Error('User already exists');
    }

    user = this.setLabel(user);

    this.users.push(user);
    this.save();
  }

  get(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  exists(id: number): boolean {
    return this.users.findIndex(user => user.id === id) !== -1;
  }

  update(user: User): void {
    if(!this.exists(user.id)) {
      this.toastService.initiate({
        title: 'Impossible de mettre à jour',
        type: ToastTypes.ERROR,
        content: 'Personne non trouvée',
        duration: 2000,
        show: true,
      });
    }

    user = this.setLabel(user);

    const idx =this.users.findIndex(user => user.id === user.id);
    this.users[idx] = user;

    this.save();
  }

  delete(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
    this.save();
  }

  all(): User[] {
    return this.users;
  }

  private save(): void {
    Filesystem.writeFile({
      path: this.path,
      data: btoa(JSON.stringify(this.users)),
      directory: Directory.Data,
    })
      .then(() => {
        this.toastService.initiate({
          title: 'Sauvegarde réussie',
          type: ToastTypes.SUCCESS,
          content: 'Les utilisateurs ont été sauvegardés avec succès',
          duration: 1500,
          show: true,
        });
      })
      .catch((e) => {
        console.error(e)
        this.toastService.initiate({
          title: 'Erreur de sauvegarde',
          type: ToastTypes.ERROR,
          content: 'Une erreur est survenue lors de la sauvegarde des utilisateurs',
          duration: 1500,
          show: true,
        });
      });
  }

  private setLabel(user: User) {
    user.label= `${user.id} - ${user.firstname} ${user.lastname}`;
    return user;
  }
}
