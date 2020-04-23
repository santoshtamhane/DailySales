import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import { Observable} from 'rxjs';
import { SKU } from '../../models/SKU';
import { SKUServiceService } from '../../services/skuservice.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
@Component({
  selector: 'app-sku-list',
  templateUrl: './sku-list.page.html',
  styleUrls: ['./sku-list.page.scss'],
})
export class SKUListPage implements OnInit {
  SKUList: Observable<SKU[]>;
  skul: Observable<any>;
  SKUType: string;
  searchTerm = '';
  searchControl: FormControl;
  searchForm: FormGroup;
      items: any;
      searching: any = false;
      teamid: string;
      businesstype: string;
    constructor(public alertCtrl: AlertController, public navCtrl: NavController,
                public SKUProvider: SKUServiceService, private route: ActivatedRoute, private router: Router) {
         this.teamid = this.route.snapshot.paramMap.get('teamid');
         this.businesstype = this.route.snapshot.paramMap.get('businesstype');
         this.SKUList = this.SKUProvider.getSKUList(true, this.teamid).valueChanges();
         this.searchControl = new FormControl();

      }
    ngOnInit() {
      this.searchControl.valueChanges.debounceTime(400).subscribe(search => {
        this.searching = false;
        if (search.length > 3) {
        this.SKUList = this.SKUList.map(docs => docs.map(doc => doc)
        .filter(item => {
          return item.SKUname.toLowerCase()
          .indexOf(search.toLowerCase()) > -1;
      })
   );
    }
        if (search.length === 0) {
          this.SKUList = this.SKUProvider.getSKUList(true, this.teamid).valueChanges();
    }
    });
    }

    openSKU(skuid: string) {
      this.router.navigateByUrl(`sku/${skuid}/${this.teamid}/${this.businesstype}`);
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
  onSearchInput() {
    this.searching = true;
}

  } // EOF


