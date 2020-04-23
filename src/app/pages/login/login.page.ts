import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController , ToastController} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  constructor(private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.email]), ] ,
        password: ['', Validators.compose([Validators.minLength(6),
        Validators.required])],
        });

     }

  ngOnInit() {
  }

  async userLogin(loginForm: FormGroup): Promise<void> {
    if (!loginForm.valid) {
    console.log(loginForm.value);
    } else {
    const loading = await this.loadingCtrl.create();
    loading.present();
    this.authService.userLogin(loginForm.value.email,
    loginForm.value.password).then(
    authService => {
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
}
