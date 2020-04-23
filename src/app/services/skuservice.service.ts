import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { SKU } from '../models/SKU';
import { map } from 'rxjs/internal/operators/map';
// import { startOfDay, endOfDay } from 'date-fns';
@Injectable({
  providedIn: 'root'
})
export class SKUServiceService {
  userId: string;
  teamAdmin: boolean;
  userName: string;
  teamid: string;
  constructor(private afAuth: AngularFireAuth, private fireStore: AngularFirestore,
     ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.setuserDetails(user.uid);
      }
    });
  }
  getSKUList(SKUStatus: boolean, teamid: string): AngularFirestoreCollection<SKU> {

    console.log(`teamProfile/${teamid}/SKUList`);
    return this.fireStore.collection<SKU>(
    `teamProfile/${teamid}/SKUList`,
     ref => ref
     .where('SKUStatus', '==', SKUStatus)
     .orderBy('SKUname', 'asc'));

  }

searchSKUList(searchTerm: string , SKUStatus: string): AngularFirestoreCollection<SKU> {
const start = searchTerm ;
const end = start + '\uf8ff';
return this.fireStore.collection<SKU>
(`teamProfile/${this.teamid}/SKUList`, ref => ref
.where('docAuthor', '==', this.userId)
.where('SKUStatus', '==', true)
      .orderBy('contactname')
      // .limit(5)
      .startAt(start)
      .endAt(end)
  );
}

  async createSKU(
    SKUname: string,
    SKUunit: string,
    SKUCategory: string,
    SKUrate: number
  ): Promise<void> {
    const SKUId: string = this.fireStore.createId();
    const lastupdton: Date = new Date();
    return this.fireStore
    .doc<SKU>(`teamProfile/${this.teamid}/SKUList/${SKUId}`)
      .set({
        SKUId,
        SKUname,
        SKUunit,
        SKUCategory,
        SKUrate,
        SKUStatus: true,
        docAuthor: this.userId,
        teamId: this.teamid,
        lastupdton,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
  updateSKU(
    SKUId: string,
    SKUname: string,
    SKUunit: string,
    SKUCategory: string,
    SKUrate: number,
    SKUStatus: boolean
  ): Promise<void> {
    const lastupdton: Date = new Date();

    return this.fireStore
      .doc<SKU>(`teamProfile/${this.teamid}/SKUList/${SKUId}`)
      .update({
        SKUId,
        SKUname,
        SKUunit,
        SKUCategory,
        SKUrate,
        SKUStatus: true,
        lastupdton,
        // timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
  getSKUbyId(id: string): Promise<SKU> {
  let SKUinfo: any;
  const SKURef: firebase.firestore.DocumentReference = this.fireStore.doc(`teamProfile/${this.teamid}/SKUList/${id}`).ref;
  SKUinfo = SKURef.get()
   .then(querySnapshot => {
    return querySnapshot.data();
   })
   .catch(error => {
    console.log('Error getting SKU info document: ', error);
   });
  return SKUinfo;
 }

filterItems(searchTerm: string, SKUStatus: boolean) {

  return this.getSKUList(SKUStatus, this.teamid).valueChanges().subscribe(docs => {
    docs.map(doc => doc.SKUname).filter(item => {
      return item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });

});
}

 setuserDetails(uid: string) {
  firebase.firestore().doc(`userProfile/${uid}`)
  .get().then(userdoc => {
    this.userName = userdoc.data().fullname ;
    this.teamAdmin = userdoc.data().teamAdmin;
    this.teamid = userdoc.data().teamId;
  });
}

getSKUCategory(businesstype: string): AngularFirestoreCollection<any> {
  console.log(`Settings/SettingDoc/BusinessType/${businesstype}/Category`);
  return this.fireStore.collection<any>(
    `Settings/SettingDoc/BusinessType/${businesstype}/Category`,
ref => ref.orderBy('id')
  );
}

} // EOF
