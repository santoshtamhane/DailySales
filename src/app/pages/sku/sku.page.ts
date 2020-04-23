import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, NavController, ToastController } from '@ionic/angular';
import { SKUServiceService } from '../../services/skuservice.service';
import { AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sku',
  templateUrl: './sku.page.html',
  styleUrls: ['./sku.page.scss'],
})
export class SKUPage implements OnInit {
  SKUForm: FormGroup;
  SKUname: string;
  SKUunit: string;
  SKUCategory: string;
  SKUrate: number;
  lastupdton: Date;
  timestamp;
  docAuthor: string;
  teamId: string;
  SKUStatus: boolean;
  SKUId: string;
  Categories: Observable<any[]>;
  businesstype: string;
  compareWith: any ;
constructor(
private alertCtrl: AlertController,
private navCtrl: NavController,
private authservice: AuthService,
private loadingCtrl: LoadingController,
private toastCtrl: ToastController,
public SKUProvider: SKUServiceService,
public router: Router,
public route: ActivatedRoute,
formBuilder: FormBuilder) {
this.SKUId = this.route.snapshot.paramMap.get('skuId');
this.SKUForm = formBuilder.group({
SKUname: [this.SKUname, Validators.required],
SKUCategory: [this.SKUCategory, Validators.required],
SKUrate: [this.SKUrate, Validators.required],
SKUunit: [this.SKUunit, Validators.required],
});
this.compareWith = this.compareWithFn;
}

async ngOnInit() {
this.businesstype = await this.authservice.getBusinessType();
this.teamId = await this.authservice.getTeamId();
this.Categories = this.SKUProvider.getSKUCategory(this.businesstype).valueChanges();
if (this.SKUId && this.SKUId !== 'void') {
this.SKUProvider.getSKUbyId(this.SKUId).then(doc => {
this.SKUname = doc.SKUname;
this.SKUCategory = doc.SKUCategory;
this.SKUrate = doc.SKUrate;
this.SKUunit = doc.SKUunit;
this.SKUStatus = doc.SKUStatus;
      });
    }

}

async addSKU(SKUForm: FormGroup): Promise<any> {
const loading = await this.loadingCtrl.create();
try {
loading.present();

const SKUrate: number = parseFloat(this.SKUForm.value.SKUrate);
const SKUCategory: string = SKUForm.value.SKUCategory;
const SKUunit: string = SKUForm.value.SKUunit;
const SKUname: string = SKUForm.value.SKUname;
const SKUStatus: boolean = SKUForm.value.SKUStatus ? true : SKUForm.value.SKUStatus ;
if (this.SKUId) {
await this.SKUProvider.updateSKU(
this.SKUId,
SKUname,
SKUunit,
SKUCategory,
SKUrate,
SKUStatus,
);
} else {
await this.SKUProvider.createSKU(
  SKUname,
SKUunit,
SKUCategory,
SKUrate,
);
}
await loading.dismiss().then(async () => {
const toast = await this.toastCtrl.create({
  message: 'Information saved successfully!',
  duration: 2000, position: 'bottom'
});
toast.onDidDismiss().then(() => {
 // this.navCtrl.navigateBack('sku-list') ;
 this.router.navigateByUrl(`/sku-list/${this.teamId}/${this.businesstype}`);
  });
toast.present();
});
//  this.navCtrl.navigateBack(`/SKU-list/P`); // go back to prospects list
} catch (error) {
await loading.dismiss();
const alert = await this.alertCtrl.create({
  message: error.message,
  buttons: [{ text: 'Ok', role: 'cancel' }],
});
alert.present();
}
}
compareWithFn(o1, o2) {
  return o1 === o2;
}

onSelectChange(selectedValue: any) {
  this.SKUCategory = selectedValue.detail.value ;
}

} // EOF
