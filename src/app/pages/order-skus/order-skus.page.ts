import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AlertController, NavController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import { Observable, of as observableOf} from 'rxjs';
import { SKU } from '../../models/SKU';
import {SKUServiceService} from '../../services/skuservice.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-order-skus',
  templateUrl: './order-skus.page.html',
  styleUrls: ['./order-skus.page.scss'],
  animations: [
    trigger('cartBadge', [
        state('idle', style({
            opacity: '0.3',
            transform: 'scale(1)'
        })),
        state('adding', style({
            opacity: '1',
            transform: 'scale(1.3)'
        })),
        transition('idle <=> adding', animate('300ms linear')),
        transition('void => *', [
            style({transform: 'translateX(200%)'}),
            animate('300ms ease-in-out')
        ])
    ]),
    trigger('addButton', [
        state('idle', style({
            opacity: '0.3'
        })),
        state('adding', style({
            opacity: '1',
            fontWeight: 'bold'
        })),
        transition('idle <=> adding', animate('300ms linear')),
        transition('void => *', [
            style({transform: 'translateX(200%)'}),
            animate('300ms ease-in-out')
        ])
    ])
]
})
export class OrderSKUsPage implements OnInit {
  SKUList: Observable<SKU[]>;
  SKUType: string;
  searchTerm = '';
      searchControl: FormControl;
      searchForm: FormGroup;
      items: any;
      searching: any = false;
      itemsInCart = [];
      cartBadgeState = 'idle';
      orderdt = new Date().toISOString().substring(0, 10);
      shopname: string;
      shopemail: string;
      shopphone: string;
      contactname: string;
      shopaddr: string;
      shoplocality: string;
      shopType: string;
      shopId: string;
      teamid: string;
      dispatchdt: string;
      cartTotal = 0;
    constructor(public alertCtrl: AlertController, public navCtrl: NavController,
                public SKUProvider: SKUServiceService, private route: ActivatedRoute,
                private router: Router, private changeDetector: ChangeDetectorRef,
                public storage: StorageService) {
         this.shopemail = this.route.snapshot.paramMap.get('shopemail');
         this.shopphone = this.route.snapshot.paramMap.get('shopphone');
         this.contactname = this.route.snapshot.paramMap.get('contactname');
         this.shopaddr = this.route.snapshot.paramMap.get('shopaddr');
         this.shoplocality = this.route.snapshot.paramMap.get('shoplocality');
         this.shopname = this.route.snapshot.paramMap.get('shopname');
         this.shopId = this.route.snapshot.paramMap.get('shopId');
         this.teamid = this.route.snapshot.paramMap.get('teamid'),
         this.dispatchdt = new Date(this.route.snapshot.paramMap.get('dispatchdt')).toISOString().substring(0, 10);
         this.SKUList = this.SKUProvider.getSKUList(true, this.teamid).valueChanges();
         this.shopType = this.route.snapshot.paramMap.get('shopType');
         this.searchForm = new FormGroup({
          searchControl: new FormControl('')
          });

      }
    ngOnInit() {
        // this.clearStorage();
        // this.getStorage();
    }

    getitemsInCart(item: any, rate: number, units: string, skuid: string) {
      if (item[0] && item[0] !== null) {
      item[0].skurate = rate;
      item[0].skuunits = units;
      item[0].skustatus = 'active';
      item[0].skuid = skuid;
      let push = true;
      for (let i = 0; i < this.itemsInCart.length; i++) {
        if (this.itemsInCart[i].sku === item[0].sku) { // modify whatever property you need
          if (item[0].skuqty > 0) {
            this.itemsInCart[i] = item[0];
          } else {
              this.itemsInCart = this.itemsInCart.filter(s => s.sku !== item[0].sku);
          }
          push = false;
        }
      }
      if (push && item[0].skuqty > 0) {
          this.itemsInCart.push(item[0]);
          item.addButtonState = 'adding';
          this.cartBadgeState = 'adding';
          this.changeDetector.detectChanges();
      }
      this.cartTotal = 0;
      this.itemsInCart.forEach(itm => {
        this.cartTotal = this.cartTotal + parseFloat(itm.skuqty) * parseFloat(itm.skurate);
      });
       }
    }


    clearStorage() {
        this.storage.clear();
    }


    getStorage() {
        this.storage.getObject(this.shopId).then((data: any) => {
            if (data && data.length > 0) {
      data.forEach(item => {
        console.log('adding, ', item);
        this.getitemsInCart(item, item.skurate, item.skuunits, item.skuid);
      });
    }
        });
    }

gotoCart(itemsInCart: any) {
  if (itemsInCart && itemsInCart.length > 0) {
  const shopname = this.shopname ? this.shopname : '';
  const shopemail = this.shopemail ? this.shopemail : ' ';
  const shopphone = this.shopphone ? this.shopphone : ' ';
  const contactname = this.contactname ? this.contactname : '';
  const shopaddr = this.shopaddr ? this.shopaddr : '';
  const shoplocality = this.shoplocality ? this.shoplocality : ' ';
  const shopType = this.shopType ? this.shopType : ' ';
  const shopId = this.shopId;
  const cart = [];
  this.itemsInCart.forEach(item => {
   cart.push(item);
  });
  this.storage.setObject(shopId, cart);
  this.router.navigateByUrl(`shopping-cart/${shopname}/${shopemail}/${shopphone}/${contactname}
  /${shopaddr}/${shoplocality}/${shopType}/${shopId}/${this.teamid}/${this.orderdt}/${this.dispatchdt}`);
    }
}


    addToCartFinished(item) {
      this.cartBadgeState = 'idle';
      item.addButtonState = 'idle';
  }
  triggerSearch(searchTerm: string) {
   if (searchTerm.length > 3) {
  this.SKUList = this.SKUProvider.searchSKUList(searchTerm, this.SKUType).valueChanges();
  }
   if (searchTerm.length === 0) {
    this.SKUList = this.SKUProvider
    .getSKUList(true, this.teamid)
    .valueChanges();
  }
  }

  } // EOF
