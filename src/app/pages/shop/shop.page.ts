import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController, NavController, ToastController } from '@ionic/angular';
import { ShopService } from '../../services/shop.service';
import { AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { Shop } from 'src/app/models/shop';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
shopForm: FormGroup;
        shopname: string;
        shopemail: string;
        shopphone: string;
        contactname: string;
        shopaddr: string;
        shoplocality: string;
        shopType: string;
        lastupdton: Date;
        timestamp;
        docAuthor: string;
        shopId: string;
        teamId: string;
        shopStatus: boolean;
        businesstype: string;
        shoptypes: Observable<any[]>;
        compareWith: any ;
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public shopProvider: ShopService,
    public authservice: AuthService,
    public router: Router,
    public route: ActivatedRoute,
    formBuilder: FormBuilder) {
      this.shopId = this.route.snapshot.paramMap.get('shopid');
     // console.log(this.route.snapshot.paramMap.get('shopId'));
      this.shopForm = formBuilder.group({
      contactname: [this.contactname, Validators.required],
      shopemail: [this.shopemail, Validators.email],
      shopphone: [this.shopphone, Validators.compose([Validators.maxLength(10), Validators.required])],
      shopname: [this.shopname, Validators.compose([Validators.maxLength(40), Validators.pattern('^[^.$#&/]*$'), Validators.required])],
      shoplocality: [this.shoplocality, Validators.compose([Validators.maxLength(20),
        Validators.pattern('^[^.$#&/]*$'), Validators.required])],
      shopaddr: [this.shopaddr, Validators.compose([Validators.maxLength(20), Validators.pattern('^[^.$#&/]*$')])],
      shopType: [this.shopType, Validators.compose([Validators.maxLength(20), Validators.pattern('^[^.$#&/]*$')])],
      shopStatus: [true]
    });
      this.compareWith = this.compareWithFn;
  }


  async ngOnInit() {
    this.businesstype = await this.authservice.getBusinessType();
    this.teamId = await this.authservice.getTeamId();
    this.shoptypes = this.shopProvider.getshopTypes(this.businesstype).valueChanges();
    if (this.shopId && this.shopId !== 'void') {
    this.shopProvider.getshopbyId(this.shopId).then(doc => {
      console.log('shop=', doc);
      this.contactname = doc.contactname;
      this.shopemail = doc.shopemail;
      this.shopphone = doc.shopphone;
      this.shopname = doc.shopname;
      this.shoplocality = doc.shoplocality;
      this.shopaddr = doc.shopaddr;
      this.shopType = doc.shopType;
      this.shopStatus = doc.shopStatus;
            });
          }

  }

  async addshop(shopForm: FormGroup): Promise<any> {
    const loading = await this.loadingCtrl.create();
    try {
      loading.present();

      const contactname: string = shopForm.value.contactname;
      // const quantity: number = parseFloat(this.shopForm.value.quantity);
      const shopemail: string = shopForm.value.shopemail;
      const shopphone: string = shopForm.value.shopphone;
      const shopname: string = shopForm.value.shopname;
      const shoplocality: string = shopForm.value.shoplocality;
      const shopType: string = shopForm.value.shopType ;
      const shopaddr: string = shopForm.value.shopaddr ;
      const shopStatus: boolean = shopForm.value.shopStatus ;
      if (this.shopId) {
  await this.shopProvider.updateshop(
    this.shopId,
    shopname,
    shopemail,
    shopphone,
    contactname,
    shopaddr,
    shoplocality,
    shopType,
    shopStatus,
  );
} else {
      await this.shopProvider.createshop(
        shopname,
        shopemail,
        shopphone,
        contactname,
        shopaddr,
        shoplocality,
        shopType,
      );
    }
      await loading.dismiss().then(async () => {
      const toast = await this.toastCtrl.create({
        message: 'Information saved successfully!',
        duration: 2000, position: 'bottom'
      });
      toast.onDidDismiss().then(() => {
       // this.navCtrl.navigateBack(`/shop-list/`) ;
       this.router.navigateByUrl(`/shop-list/${this.teamId}`);
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
  compareWithFn(o1, o2) {
    return o1 === o2;
  }

  onSelectChange(selectedValue: any) {
    this.shopType = selectedValue.detail.value ;
  }

} // EOF
