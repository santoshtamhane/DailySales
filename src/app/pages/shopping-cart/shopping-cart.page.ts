import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AlertController, NavController, LoadingController, ToastController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import { Observable, of as observableOf} from 'rxjs';
import { Order } from '../../models/Order';
import {OrderService} from '../../services/order.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit {
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
  dispatchdt: Date;
  cart = [];
  total = 0;
  public isAdmin: boolean;
  public usrName: string;
  public company: string;
  public userid: string;
  public teamid: string;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController,
              private loadingCtrl: LoadingController, private toastCtrl: ToastController,
              public orderProvider: OrderService, private route: ActivatedRoute,
              private authService: AuthService, private router: Router,
              public storage: StorageService, private formBuilder: FormBuilder) {
         this.shopemail = this.route.snapshot.paramMap.get('shopemail');
         this.shopphone = this.route.snapshot.paramMap.get('shopphone');
         this.contactname = this.route.snapshot.paramMap.get('contactname');
         this.shopaddr = this.route.snapshot.paramMap.get('shopaddr');
         this.shoplocality = this.route.snapshot.paramMap.get('shoplocality');
         this.shopname = this.route.snapshot.paramMap.get('shopname');
         this.shopId = this.route.snapshot.paramMap.get('shopId');
         this.shopType = this.route.snapshot.paramMap.get('shopType');
         this.orderdt = new Date(this.route.snapshot.paramMap.get('orderdt'));
         this.dispatchdt = new Date(this.route.snapshot.paramMap.get('dispatchdt'));


               }

  ngOnInit() {
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
    this.getStorage();
  }
  async ionViewWillEnter() {
    this.isAdmin = await this.authService.isAdmin();
    this.usrName = await this.authService.getuserName();
    this.company = await this.authService.getCompanyName();
    this.userid = await this.authService.getuserId();
    this.teamid = await this.authService.getTeamId();
   }
  createItem(item): FormGroup {
      return this.formBuilder.group({
      sku: item ? item.sku : '',
      skuid: item ? item.skuid : '',
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
  getStorage() {
    this.storage.getObject(this.shopId).then((data: any) => {
  data.forEach(item => {
    this.cart.push(item);
    this.addItem(item);
    this.total = this.total + (item.skurate * item.skuqty);
  });

    });

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
async submit(): Promise<any> {
  const loading = await this.loadingCtrl.create();
  try {
    loading.present();
    const orderitems = [];
    // const quantity: number = parseFloat(this.this.orderForm.value.quantity);
    const orderStatus: string = this.orderForm.value.orderStatus ;
    const Orderid: string = this.orderForm.value.Orderid;
    const orderNo: string = this.orderForm.value.orderNo;
    const orderdt: string = this.orderForm.value.orderdt;
    const dispatchdt: Date = this.orderForm.value.dispatchdt;
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
    if (Orderid) {
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
    this.storage.removeItem(this.shopId);
    const toast = await this.toastCtrl.create({
      message: 'Order saved successfully!',
      duration: 2000, position: 'bottom'
    });
    toast.onDidDismiss().then(() => {
     // this.navCtrl.navigateBack(`/shop-list/`) ;
     this.navCtrl.setDirection('root');
     this.router.navigateByUrl(`/order-shops/${this.teamid}`);
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
} // EOF
