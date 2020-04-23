import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';

import { Shop } from '../models/shop';
import { map } from 'rxjs/internal/operators/map';
// import { startOfDay, endOfDay } from 'date-fns';
@Injectable({
  providedIn: 'root'
})
export class ShopService {
  userId: string;
  companyname: string;
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
  getshopList(shopStatus: boolean, teamid: string): AngularFirestoreCollection<Shop> {
    return this.fireStore.collection<Shop>(
    `teamProfile/${teamid}/shopList`,
     ref => ref
     .where('shopStatus', '==', shopStatus)
     .orderBy('shopname', 'asc'));
  }
  async getStoreTypes() {

  }


searchshopList(searchTerm: string , shopStatus: string): AngularFirestoreCollection<Shop> {
const start = searchTerm ;
const end = start + '\uf8ff';
return this.fireStore.collection<Shop>
(`teamProfile/${this.teamid}/shopList`, ref => ref
.where('docAuthor', '==', this.userId)
.where('shopStatus', '==', true)
      .orderBy('contactname')
      // .limit(5)
      .startAt(start)
      .endAt(end)
  );
}

  async createshop(
        shopname: string,
        shopemail: string,
        shopphone: string,
        contactname: string,
        shopaddr: string,
        shoplocality: string,
        shopType: string,
  ): Promise<void> {
    const shopId: string = this.fireStore.createId();
    const lastupdton: Date = new Date();

    this.companyname = this.companyname;
    return this.fireStore
    //  .doc<Shop>(`/shopList/${shopId}`)
    .doc<Shop>(`teamProfile/${this.teamid}/shopList/${shopId}`)
      .set({
        shopId,
        shopname,
        shopemail,
        shopphone,
        contactname,
        shopaddr,
        shoplocality,
        shopType,
        shopStatus: true,
        docAuthor: this.userId,
        teamId: this.teamid,
        lastupdton,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
  updateshop(
    shopId: string,
    shopname: string,
    shopemail: string,
    shopphone: string,
    contactname: string,
    shopaddr: string,
    shoplocality: string,
    shopType: string,
    shopStatus: boolean,
  ): Promise<void> {
    const lastupdton: Date = new Date();

    return this.fireStore
      .doc<Shop>(`teamProfile/${this.teamid}/shopList/${shopId}`)
      .update({
        shopId,
        shopname,
        shopemail,
        shopphone,
        contactname,
        shopaddr,
        shoplocality,
        shopType,
        shopStatus,
        lastupdton,
        // timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
  getshopbyId(id: string): Promise<Shop> {
  let shopinfo: any;
  const shopRef: firebase.firestore.DocumentReference = this.fireStore.doc(`teamProfile/${this.teamid}/shopList/${id}`).ref;
  shopinfo = shopRef.get()
   .then(querySnapshot => {
    return querySnapshot.data();
   })
   .catch(error => {
    console.log('Error getting shop info document: ', error);
   });
  return shopinfo;
 }

filterItems(searchTerm: string, shopStatus: boolean, teamid: string) {

  return this.getshopList(shopStatus, teamid).valueChanges().subscribe(docs => {
    docs.map(doc => doc.contactname).filter(item => {
      return item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });

});
}

 setuserDetails(uid: string) {
  firebase.firestore().doc(`userProfile/${uid}`)
  .get().then(userdoc => {
    this.userName = userdoc.data().fullname ;
    this.teamAdmin = userdoc.data().teamAdmin;
    this.companyname = userdoc.data().companyname;
    this.teamid = userdoc.data().teamId;
  });
}

getshopTypes(businesstype: string): AngularFirestoreCollection<any> {
  return this.fireStore.collection<any>(
    `Settings/SettingDoc/BusinessType/${businesstype}/ShopType`,
ref => ref.orderBy('id')
  );
}
}// EOF
