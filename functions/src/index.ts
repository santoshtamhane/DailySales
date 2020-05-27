import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as differenceinDays from 'date-fns/difference_in_days';
import * as format from 'date-fns/format';

admin.initializeApp();
const firestore = admin.firestore();
  const settings = {timestampsInSnapshots: true};
  firestore.settings(settings);

exports.updateShop = functions.firestore
  .document(`teamProfile/{teamId}/orderList/{Orderid}`)
  .onCreate(async (snapshot, context) => {
    const Orderid: string = snapshot.data()!.Orderid;
    const dispatchdt: string = snapshot.data()!.dispatchdt;
    const orderTotal: number = snapshot.data()!.orderTotal;
    const orderdt: Date = snapshot.data()!.orderdt;
    const shopId: string = snapshot.data()!.shopId;
    const orderItems: any = snapshot.data()!.items;
    const orderskuid: string = firestore.createId();
      return admin
      .firestore()
      .doc(`teamProfile/{teamId}/orderList/${orderskuid}`)
      .set({
        Orderid: Orderid,
        dispatchdt: id,
        orderTotal: teamId,
        teamId: teamId,
      
  })
})
