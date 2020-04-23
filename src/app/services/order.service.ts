import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import { Order } from '../models/Order';
import {Items} from '../models/Order';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
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
  getorderList(teamid): AngularFirestoreCollection<Order> {

    return this.fireStore.collection<Order>(
    `teamProfile/${teamid}/orderList`,
     ref => ref
     // .where('orderStatus', '==', orderStatus)
     .orderBy('orderdt', 'desc'));

  }
  getorderListbyDate(selectdt: Date, teamid: string, userid: string): AngularFirestoreCollection<Order> {
    const fieldname = userid ? 'docAuthor' : 'teamId';
    const fieldvalue = userid ? userid : teamid;
    // const dt = new Date(selectdt.getUTCFullYear(), selectdt.getUTCMonth(), selectdt.getUTCDate(), 23, 59);
    // const daystart = firebase.firestore.Timestamp.fromDate(new Date(startOfDay(selectdt)));
    const daystart = startOfDay(selectdt);
    const dayend = endOfDay(selectdt);
    console.log('orderlist=', `teamProfile/${teamid}/orderList`, daystart, dayend, fieldname, fieldvalue);
    return this.fireStore.collection<Order>(
     `teamProfile/${this.teamid}/orderList`,
      ref => ref.where(fieldname, '==', fieldvalue)
      .where('orderdt' , '>=', new Date(daystart))
      .where('orderdt', '<=', new Date(dayend))
      .orderBy('orderdt')
    );

  }
  getOrdersByDate(selectdt: Date, teamid: string, userid: string): AngularFirestoreCollection<Order> {
    const fieldname = userid ? 'docAuthor' : 'teamId';
    const fieldvalue = userid ? userid : teamid;
    const daystart = startOfDay(selectdt);
    const dayend = endOfDay(selectdt);

    return this.fireStore.collection<Order>(
      `teamProfile/${teamid}/orderList`,
       ref => ref
       .where(fieldname, '==', fieldvalue)
       .where('orderdt' , '>=', new Date(daystart))
      .where('orderdt', '<=', new Date(dayend))
       .orderBy('orderdt', 'desc'));
  }

searchorderList(searchTerm: string , orderStatus: string): AngularFirestoreCollection<Order> {
const start = searchTerm ;
const end = start + '\uf8ff';
return this.fireStore.collection<Order>
(`teamProfile/${this.teamid}/orderList`, ref => ref
.where('docAuthor', '==', this.userId)
.where('orderStatus', '==', true)
      .orderBy('contactname')
      // .limit(5)
      .startAt(start)
      .endAt(end)
  );
}

  async createorder(
    shopname: string, shopemail: string, shopphone: string, contactname: string, shopaddr: string,
    shoplocality: string, shopType: string, items: Array<Items>, odt: any,
    orderCount: number, orderTotal: number, ddt: any): Promise<void> {
    const Orderid: string = this.fireStore.createId();
    const lastupdton: Date = new Date();
    const orderNo = '';
    const orderStatus = 'active';
    const orderdt = new Date(odt);
    const dispatchdt = new Date (ddt);
    return this.fireStore
    .doc<Order>(`teamProfile/${this.teamid}/orderList/${Orderid}`)
      .set({
        Orderid,
        orderNo,
        shopname,
        shopemail,
        shopphone,
        contactname,
        shopaddr,
        shoplocality,
        shopType,
        items,
        orderStatus,
        orderdt,
        dispatchdt,
        orderCount,
        orderTotal,
        docAuthor: this.userId,
        teamId: this.teamid,
        lastupdton,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
  updateorder(Orderid: string, shopname: string, shopemail: string, shopphone: string, contactname: string, shopaddr: string,
              shoplocality: string, shopType: string, items: Array<Items>, orderStatus: string,
              orderNo: string, orderdt: any, orderCount: number, orderTotal: number, dispatchdt: any): Promise<void> {
    const lastupdton: Date = new Date();

    return this.fireStore
      .doc<Order>(`teamProfile/${this.teamid}/orderList/${Orderid}`)
      .update({
        Orderid,
        orderNo,
        shopname,
        shopemail,
        shopphone,
        contactname,
        shopaddr,
        shoplocality,
        shopType,
        items,
        orderdt,
        dispatchdt,
        orderStatus,
        orderCount,
        orderTotal,
        lastupdton,
        // timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
  getorderbyId(id: string): Promise<Order> {
  let orderinfo: any;
  const orderRef: firebase.firestore.DocumentReference = this.fireStore.doc(`teamProfile/${this.teamid}/orderList/${id}`).ref;
  orderinfo = orderRef.get()
   .then(querySnapshot => {
    return querySnapshot.data();
   })
   .catch(error => {
    console.log('Error getting order info document: ', error);
   });
  return orderinfo;
 }

filterItems(searchTerm: string, orderStatus: boolean) {

  return this.getorderList(orderStatus).valueChanges().subscribe(docs => {
    docs.map(doc => doc.Orderid).filter(item => {
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

}
// EOF
