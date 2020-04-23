import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Observable, of as observableOf} from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;
email: string;
password: string;
fullname: string;
companyname: string;
BusinessType: string;
businessTypeList: Observable<any[]>;
compareWith: any ;
  constructor(
    public router: Router,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public authService: AuthService
  ) {
     this.businessTypeList = this.authService.getBusinessTypes().valueChanges();
     this.signupForm = formBuilder.group({
      email: [this.email, Validators.compose([Validators.required, Validators.email]), ] ,
      password: [this.password, Validators.compose([Validators.minLength(6), Validators.required])],
      fullname: [this.fullname, Validators.compose([Validators.minLength(3), Validators.required])],
      companyname: [this.companyname, Validators.compose([Validators.minLength(3), Validators.required])],
      BusinessType: [this.BusinessType, Validators.required]
    });
  }

  ngOnInit() {

    this.compareWith = this.compareWithFn;
  }

  async userSignup(signupForm: FormGroup): Promise<void> {
    if (!signupForm.valid) {
      console.log(signupForm.value);
    } else {
      const loading = await this.loadingCtrl.create();
      loading.present();

      this.authService
        // .userSignup(
          .createAdminUser(
          signupForm.value.email,
          signupForm.value.password,
         signupForm.value.fullname,
         signupForm.value.companyname,
         signupForm.value.BusinessType
        )
        .then(
          () => {
            loading.dismiss().then(() => {
              this.router.navigateByUrl('/home');
            });
          },
          error => {
            loading.dismiss().then(async () => {
              const alert = await this.alertCtrl.create({
                message: error.message,
                buttons: [{ text: 'Ok', role: 'cancel' }],
              });
              alert.present();
            });
          }
        );
    }
  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  }
} // EOF
