import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CustomGram } from './custom-gram';

@Injectable({
  providedIn: 'root'
})
export class GramDatabaseService {
  private gramsCollection: AngularFirestoreCollection<CustomGram>;
  private userGramsCollection!: AngularFirestoreCollection<CustomGram>;

  grams: Observable<CustomGram[]>;
  userGrams!: Observable<CustomGram[]>;

  //Max number of custom grams user can upload
  maxUserGrams: number = 5;
  numUserGrams: number = 0;

  constructor(private firestore: AngularFirestore, private auth: Auth) {
    this.gramsCollection = firestore.collection<CustomGram>('custom_nonograms');
    this.grams = this.gramsCollection.valueChanges();

    auth.onAuthStateChanged(
      (user) => {
        if (user) {
          this.userGramsCollection = firestore.collection<CustomGram>('custom_nonograms', ref => ref.where('author', '==', auth.currentUser?.uid));
          this.userGrams = this.userGramsCollection.valueChanges();
          this.userGrams.subscribe(
            (res) => {
              res.forEach(() => {
                this.numUserGrams++;
              });
            }
          );
        }
      }
    );
  }

  async addCustomGram(gram: CustomGram) {
    gram.id = this.firestore.createId();
    if (this.numUserGrams < this.maxUserGrams) {
      await this.gramsCollection.doc(gram.id).set(gram)
        .then(() => {
          return Promise.resolve();
        })
        .catch((error) => {
          return Promise.reject(error);
        }
      );
    } else {
      //Return false reject if too many user grams
      return Promise.reject(false);
    }
  }

  async deleteCustomGram(gram: CustomGram) {
    const itemToDelete = this.firestore.doc<CustomGram>('custom_nonograms/' + gram.id);
    await itemToDelete.delete().then(() => {
      return Promise.resolve();
    }).catch((err) => {
      return Promise.reject(err);
    });
  }
}
