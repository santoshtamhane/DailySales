import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import { Observable, of as observableOf} from 'rxjs';
import { Shop } from '../../models/shop';
import { ShopService } from '../../services/shop.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-order-shops',
  templateUrl: './order-shops.page.html',
  styleUrls: ['./order-shops.page.scss'],
})
export class OrderShopsPage implements OnInit {
  shopList: Observable<Shop[]>;
  shopType: string;
  searchTerm = '';
      searchControl: FormControl;
      searchForm: FormGroup;
      items: any;
      searching: any = false;
      teamid: string;

    constructor(public alertCtrl: AlertController, public navCtrl: NavController,
                public shopProvider: ShopService, private route: ActivatedRoute, private router: Router) {
                  this.teamid = this.route.snapshot.paramMap.get('teamid');
                  this.shopList = this.shopProvider.getshopList(true, this.teamid).valueChanges();

                  this.searchForm = new FormGroup({
          searchControl: new FormControl('')
          });

      }
    ngOnInit() {}

gotoSKUList(shop: any) {
const shopname = shop.shopname ? shop.shopname : '';
const shopemail = shop.shopemail ? shop.shopemail : ' ';
const shopphone = shop.shopphone ? shop.shopphone : ' ';
const contactname = shop.contactname ? shop.contactname : '';
const shopaddr = shop.shopaddr ? shop.shopaddr : '';
const shoplocality = shop.shoplocality ? shop.shoplocality : ' ';
const shopId = shop.shopId;
const shopType = shop.shopType ? shop.shopType : ' ';

this.router.navigateByUrl(`order-skus/${shopId}/${shopname}/${shopemail}/${shopphone}/
  ${contactname}/${shopaddr}/${shoplocality}/${shopType}/${shopId}/${this.teamid}`);
  }

triggerSearch(searchTerm: string) {
   if (searchTerm.length > 3) {
  this.shopList = this.shopProvider.searchshopList(searchTerm, this.shopType).valueChanges();
  }
   if (searchTerm.length === 0) {
    this.shopList = this.shopProvider
    .getshopList(true, this.teamid)
    .valueChanges();
  }
  }

  } // EOF

