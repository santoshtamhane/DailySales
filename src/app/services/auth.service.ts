import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import 'firebase/firestore';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { UserProfile } from '../models/user-profile';
import { TeamProfile } from '../models/team-profile';
import { first } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userId: string = null;
  constructor(private afAuth: AngularFireAuth, public fireStore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }
  getuserId() {
    return this.userId;
  }

  getUser(): Promise<firebase.User> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  isLoggedIn() {
    return this.afAuth.authState !== null;
  }

  userLogin(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  userSignup(email: string, password: string, fullName: string): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        this.fireStore.doc(`/userProfile/ ${userCredential.user.uid} /`).set({
          admin: true,
          email,
          fullName,
        });
      });
  }

  userLogout(): Promise<void> {
    return this.afAuth.signOut();
  }

  passwordReset(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
  isAdmin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase
        .firestore()
        .doc(`userProfile/${this.userId}`)
        .get()
        .then(adminSnapshot => {
          resolve(adminSnapshot.data().teamAdmin);
        });
    });
  }
  async createAdminUser(email: string, password: string, name: string, companyname: string, BusinessType: string): Promise<firebase.User> {
    try {
      const adminUserCredential: firebase.auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      const userProfileDocument: AngularFirestoreDocument<UserProfile> = this.fireStore.doc(`userProfile/${adminUserCredential.user.uid}`);
      const teamId: string = this.fireStore.createId();
      await userProfileDocument.set({
        id: adminUserCredential.user.uid,
        email,
        teamId,
        teamAdmin: true,
        fullname: name,
        companyname,
        BusinessType
      });
      const teamProfile: AngularFirestoreDocument<TeamProfile> = this.fireStore.doc(`teamProfile/${teamId}`);
      await teamProfile.set({
        id: teamId,
        teamAdmin: adminUserCredential.user.uid,
        BusinessType
      });
      return adminUserCredential.user;
    } catch (error) {
      console.error(error);
    }
  }
  async createRegularUser(email: string , name: string, designation: string, employedsince: string, territory: string): Promise<any> {
    const teamId: string = await this.getTeamId();
    const id: string = this.fireStore.createId();
    const company: string = await this.getCompanyName();
    const userDoc: AngularFirestoreDocument<any> =
      this.fireStore.doc(`teamProfile/${teamId}/teamMemberList/${id}`);
    const regularUser = {
      id,
      email,
      teamId,
      fullname: name,
      companyname: company,
      designation,
      employedsince,
      territory,
    };
    return userDoc.set(regularUser);
  }
  async updateRegularUser(id: string , teamid: string, email: string , name: string,
                          designation: string, employedsince: string, territory: string): Promise<any> {
     const userDoc: AngularFirestoreDocument<any> =
      this.fireStore.doc(`teamProfile/${teamid}/teamMemberList/${id}`);
     const regularUser = {
       email,
      fullname: name,
      designation,
      employedsince,
      territory,
    };
     return userDoc.update(regularUser);
  }
  getUserListbyTeamId(teamId: string): AngularFirestoreCollection<UserProfile> {

    return teamId ? this.fireStore.collection(`teamProfile/${teamId}/teamMemberList`) : null;
  }
  async getTeamId(): Promise<string> {
    const userProfile: firebase.firestore.DocumentSnapshot = await firebase
    .firestore()
    .doc(`userProfile/${this.userId}`)
    .get();
    return userProfile.data().teamId;
    }
    async getTeamIdbyUserId(uid: string): Promise<string> {
      const userProfile: firebase.firestore.DocumentSnapshot = await firebase
      .firestore()
      .doc(`userProfile/${uid}`)
      .get();
      return userProfile.data().teamId;
      }

    async getCompanyNamebyId(uid: string): Promise<string> {
      const userProfile: firebase.firestore.DocumentSnapshot = await firebase
      .firestore()
      .doc(`userProfile/${uid}`)
      .get();
      return userProfile.data().companyname;
      }
      async getCompanyName(): Promise<string> {
        const userProfile: firebase.firestore.DocumentSnapshot = await firebase
        .firestore()
        .doc(`userProfile/${this.userId}`)
        .get();
        return userProfile.data().companyname;
        }

        getBusinessTypes(): AngularFirestoreCollection<any> {
          return this.fireStore.collection<any>(
            `Settings/SettingDoc/BusinessType/`,
        ref => ref.orderBy('id')
          );
        }

          async getBusinessType(): Promise<string> {
            const userProfile: firebase.firestore.DocumentSnapshot = await firebase
            .firestore()
            .doc(`userProfile/${this.userId}`)
            .get();
            return userProfile.data().BusinessType;
            }
    async getuserNamebyId(uid: string): Promise<string> {
      const userProfile: firebase.firestore.DocumentSnapshot = await firebase
      .firestore()
      .doc(`userProfile/${uid}`)
      .get();
      return userProfile.data().fullname;
      }
      async getuserName(): Promise<string> {
        const userProfile: firebase.firestore.DocumentSnapshot = await firebase
        .firestore()
        .doc(`userProfile/${this.userId}`)
        .get();
        return userProfile.data().fullname;
        }
        async getuserprofilebyId(teamid: string, userid: string): Promise<any> {
          const userProfile: firebase.firestore.DocumentSnapshot = await firebase
          .firestore()
          .doc(`teamProfile/${teamid}/teamMemberList/${userid}`)
          .get();
          return userProfile.data();
         }


} // EOF
