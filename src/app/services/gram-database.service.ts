import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CustomGram } from './custom-gram';
import { UserProfile } from './user-profile';

@Injectable({
  providedIn: 'root'
})
export class GramDatabaseService {
  private gramsCollection: AngularFirestoreCollection<CustomGram>;
  private userGramsCollection!: AngularFirestoreCollection<CustomGram>;
  private userProfilesCollection: AngularFirestoreCollection<UserProfile>;

  userProfileDoc!: AngularFirestoreDocument<UserProfile>;

  grams: Observable<CustomGram[]>;
  userGrams!: Observable<CustomGram[]>;
  userProfile!: Observable<UserProfile[]>;

  //Max number of custom grams user can upload
  maxUserGrams: number = 5;
  numUserGrams: number = 0;

  constructor(private firestore: AngularFirestore, private auth: Auth) {
    this.gramsCollection = firestore.collection<CustomGram>('custom_nonograms');
    this.userProfilesCollection = firestore.collection<UserProfile>('profiles');
    this.grams = this.gramsCollection.valueChanges();

    auth.onAuthStateChanged(
      (user) => {
        if (user) {
          const profileCollection = firestore.collection<UserProfile>('profiles', ref => ref.where('id', '==', auth.currentUser?.uid));
          this.userProfileDoc = firestore.doc('profiles/' + user.uid);
          this.userGramsCollection = firestore.collection<CustomGram>('custom_nonograms', ref => ref.where('author', '==', auth.currentUser?.uid));

          this.userGrams = this.userGramsCollection.valueChanges();
          this.userGrams.subscribe(
            (res) => {
              res.forEach(() => {
                this.numUserGrams++;
              });
            }
          );

          this.userProfile = profileCollection.valueChanges();
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
    await itemToDelete.delete()
      .then(() => {
        return Promise.resolve();
      })
      .catch((err) => {
        return Promise.reject(err);
      }
    );
  }

  async addUserProfile(user: UserProfile) {
    this.userProfilesCollection.doc(user.id).get().subscribe(
      (snapshot) => {
        if (snapshot.exists) {
          return Promise.resolve();
        } else {
          this.userProfilesCollection.doc(user.id).set(user)
            .then(() => {
              return Promise.resolve();
            }).catch((err) => {
              return Promise.reject(err);
            }
          );
        }
      }
    );
  }

  async updateUsername(id: string, name: string) {
    console.log()
    await this.userProfileDoc.update({username: name})
      .then(() => {
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      }
    );
  }

  async updateUserAvatar(id: string, url: string) {
    await this.userProfileDoc.update({avatar_url: url})
      .then(() => {
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      }
    );
  }
}
