import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import { Observable, of as observableOf} from 'rxjs';
import { Shop } from '../../models/shop';
import { ShopService } from '../../services/shop.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.page.html',
  styleUrls: ['./shop-list.page.scss'],
})
export class ShopListPage implements OnInit {
  shopList: Observable<Shop[]>;
  shopType: string;
  searchTerm = '';
      searchControl: FormControl;
      searchForm: FormGroup;
      items: any;
      searching: any = false;
      teamid: string;
      businesstype: string;
      data: any;
    constructor(public alertCtrl: AlertController, public navCtrl: NavController,
                public shopProvider: ShopService, private route: ActivatedRoute, private router: Router) {
                  this.teamid = this.route.snapshot.paramMap.get('teamid');
                  this.businesstype = this.route.snapshot.paramMap.get('businesstype');
                  this.shopList = this.shopProvider.getshopList(true, this.teamid).valueChanges();
                  this.searchForm = new FormGroup({searchControl: new FormControl('')
          });
                  this.searchControl = new FormControl();

        }

        ionViewWillEnter() {
          setTimeout(() => {
            this.data = {
              heading: 'Normal text',
              para1: 'Lorem ipsum dolor sit amet, consectetur',
              para2: 'adipiscing elit.'
            };
          }, 5000);
        }

      ngOnInit() {
        this.searchControl.valueChanges.debounceTime(2000).subscribe(search => {
          this.searching = false;
          if (search.length > 3) {
          this.shopList = this.shopList.map(docs => docs.map(doc => doc)
          .filter(item => {
            return item.shopname.toLowerCase()
            .indexOf(search.toLowerCase()) > -1;
        })
     );
      }
          if (search.length === 0) {
            this.shopList = this.shopProvider.getshopList(true, this.teamid).valueChanges();
      }
      });
      }
openShop(shopid: string, teamid: string) {
  this.router.navigateByUrl(`shop/${shopid}/${teamid}/${this.businesstype}`);
}
  triggerSearch(searchTerm: string, teamid: string) {
   if (searchTerm.length > 3) {
  this.shopList = this.shopProvider.searchshopList(searchTerm, this.shopType).valueChanges();
  }
   if (searchTerm.length === 0) {
    this.shopList = this.shopProvider
    .getshopList(true, teamid)
    .valueChanges();
  }
  }
  onSearchInput() {
    this.searching = true;
}

  } // EOF

