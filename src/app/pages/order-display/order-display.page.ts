import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, LoadingController, ToastController, ActionSheetController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import { Observable, of as observableOf} from 'rxjs';
import { Order } from '../../models/order';
import {Items} from '../../models/order';
import { OrderService } from '../../services/order.service';
import { AuthService} from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-order-display',
  templateUrl: './order-display.page.html',
  styleUrls: ['./order-display.page.scss'],
})
export class OrderDisplayPage implements OnInit {
  orderForm: FormGroup;
  items: FormArray;
  shopname: string;
  shopemail: string;
  shopphone: string;
  contactname: string;
  shopaddr: string;
  shoplocality: string;
  shopType: string;
  shopId: string;
  orderdt: Date;
  odt: number;
  ddt: number;
  orderid: string;
  dispatchdt: Date;
  cart = [];
  total = 0;
  orderitems = [];
  orderStatus: string;
  public isAdmin: boolean;
  public usrName: string;
  public company: string;
  public userid: string;
  public teamid: string;
  public businesstype: string;
  pageupdateStatus = false; // order is not updated

  constructor(public alertCtrl: AlertController, public navCtrl: NavController,
              private loadingCtrl: LoadingController, private toastCtrl: ToastController,
              public orderProvider: OrderService, private route: ActivatedRoute,
              private authService: AuthService, private router: Router,
              private formBuilder: FormBuilder, public actionsheetCtrl: ActionSheetController) {
         this.shopemail = this.route.snapshot.paramMap.get('shopemail');
         this.shopphone = this.route.snapshot.paramMap.get('shopphone');
         this.contactname = this.route.snapshot.paramMap.get('contactname');
         this.shopaddr = this.route.snapshot.paramMap.get('shopaddr');
         this.shoplocality = this.route.snapshot.paramMap.get('shoplocality');
         this.shopname = this.route.snapshot.paramMap.get('shopname');
         this.shopId = this.route.snapshot.paramMap.get('shopId');
         this.orderid = this.route.snapshot.paramMap.get('orderid');
         this.shopType = this.route.snapshot.paramMap.get('shopType');
         this.orderdt = new Date(this.route.snapshot.paramMap.get('orderdt'));
         this.dispatchdt = new Date(this.route.snapshot.paramMap.get('dispatchdt'));
         this.orderForm = this.formBuilder.group({
                shopname: this.shopname,
                shopphone: this.shopphone,
                shopemail: this.shopemail,
                contactname: this.contactname,
                shopaddr: this.shopaddr,
                shoplocality: this.shoplocality,
                shopId: this.shopId,
                orderdt: this.orderdt,
                dispatchdt: this.dispatchdt,
                items: this.formBuilder.array([ this.createItem(null) ])
              });

               }

  ngOnInit() {
    if (this.orderid && this.orderid !== 'void') {
      this.orderProvider.getorderbyId(this.orderid).then(doc => {
                console.log('doc=', doc);
                this.shopname = doc.shopname;
                this.shopphone = doc.shopphone;
                this.shopemail = doc.shopemail;
                this.contactname = doc.contactname;
                this.shopaddr = doc.shopaddr;
                this.shoplocality = doc.shoplocality;
                this.orderdt = doc.orderdt;
                this.odt = doc.orderdt.seconds * 1000;
                this.dispatchdt = doc.dispatchdt;
                this.ddt = doc.dispatchdt.seconds * 1000;
                this.orderStatus = doc.orderStatus;
                doc.items.forEach(i => {
                    this.addItem(i);
                });
  });
}
  }
    async ionViewWillEnter() {
    this.isAdmin = await this.authService.isAdmin();
    this.usrName = await this.authService.getuserName();
    this.company = await this.authService.getCompanyName();
    this.userid = await this.authService.getuserId();
    this.teamid = await this.authService.getTeamId();
    this.businesstype = await this.authService.getBusinessType();
   }
    createItem(item): FormGroup {
      return this.formBuilder.group({
      sku: item ? item.sku : '',
      skuqty: item ? item.skuqty : 0,
      skuunits: item ? item.skuunits : '',
      skurate: item ? item.skurate : 0,
      skuamt: item ? item.skurate * item.skuqty : 0
      });
  }

    addItem(iteminfo): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem(iteminfo));
  }

    getsubTotal(n: number) {
  const group = this.orderForm as FormGroup;
  const itemarray = group.get('items') as FormArray;
  const qty = itemarray.at(n).get('skuqty').value;
  const rate = itemarray.at(n).get('skurate').value;
  // itemarray.at(n).get('skuamt').patchValue(qty * rate);

  return rate * qty;
}

    getTotal() {
  const group1 = this.orderForm as FormGroup;
  const itemarray1 = group1.get('items') as FormArray;
  let total = 0;
  for (let n = 0; n < itemarray1.length; n++) {
       const qty = itemarray1.at(n).get('skuqty').value;
       const rate = itemarray1.at(n).get('skurate').value;
       total += (rate *  qty);
    }
  return total;
}
    async submit(status: string): Promise<any > {
  const loading = await this.loadingCtrl.create();
  try {
    loading.present();
    const orderitems = [];
    // const quantity: number = parseFloat(this.this.orderForm.value.quantity);
    const orderStatus: string = status ;
    const Orderid: string = this.orderid;
    const orderNo: string = this.orderForm.value.orderNo ? this.orderForm.value.orderNo : null;
    const orderdt: Date = this.orderdt;
    const dispatchdt: Date = this.dispatchdt;
    let orderCount = 0;
    let orderTotal = 0;
    this.orderForm.get('items').value.forEach(val => {
      if (val.sku.length > 0) {
        val.skuamt = val.skuqty * val.skurate;
        orderCount = orderCount + 1;
        orderTotal = val.skuamt + orderTotal;
        orderitems.push(val);
        }
    });
    if (this.orderid) {
await this.orderProvider.updateorder(
  Orderid,
  this.shopId,
  this.shopname,
  this.shopemail,
  this.shopphone,
  this.contactname,
  this.shopaddr,
  this.shoplocality,
  this.shopType,
  orderitems,
  orderStatus,
  orderNo,
  orderdt,
  orderCount,
  orderTotal,
  dispatchdt
);
} else {
    await this.orderProvider.createorder(
      this.shopname,
      this.shopId,
      this.shopemail,
      this.shopphone,
      this.contactname,
      this.shopaddr,
      this.shoplocality,
      this.shopType,
      orderitems,
      orderdt,
      orderCount,
      orderTotal,
      dispatchdt
    );
  }
    await loading.dismiss().then(async () => {
    const toast = await this.toastCtrl.create({
      message: 'Order saved successfully!',
      duration: 2000, position: 'bottom'
    });
    toast.onDidDismiss().then(() => {
     // this.navCtrl.navigateBack(`/shop-list/`) ;
     this.navCtrl.setDirection('root');
     this.router.navigateByUrl(`/order-list/${this.teamid}`);
      });
    toast.present();
    });
  //  this.navCtrl.navigateBack(`/shop-list/P`); // go back to prospects list
  } catch (error) {
    await loading.dismiss();
    const alert = await this.alertCtrl.create({
      message: error.message,
      buttons: [{ text: 'Ok', role: 'cancel' }],
    });
    alert.present();
  }
}
removeItem(i: number) {
  this.items = this.orderForm.get('items') as FormArray;
  this.items.removeAt(i);
}

async updateQty(i: number) {
  const alert = await this.alertCtrl.create({
    header: 'Quantity',
    inputs: [
      {
        name: 'qty',
        type: 'number',

      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Ok',
        handler: (data) => {
          console.log('updating', data.qty);
          this.items = this.orderForm.get('items') as FormArray;
          this.items.at(i).get('skuqty').patchValue(data.qty);
        }
      }
    ]
  });
  await alert.present();
}


async presentActionSheet(i: number) {
  const actionSheet = await this.actionsheetCtrl.create({

    header: 'Actions',
    buttons: [{
      text: `Remove Item from Cart`,
      role: 'destructive',
      icon: 'trash',
      handler: () => {
        this.removeItem(i);
      }
    }, {
      text: 'Update Quantity',
      icon: 'refresh',
      handler: () => {
        this.updateQty(i);
      }
    }, {
      text: 'Put item on hold',
      icon: 'warning',
      handler: () => {
        console.log('Play clicked');
      }
    }, {
      text: 'Favorite',
      icon: 'heart',
      handler: () => {
        console.log('Favorite clicked');
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }]
  });
  await actionSheet.present();
}

} // EOF
