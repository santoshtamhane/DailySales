import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public isAdmin: boolean;
  public usrName: string;
  public company: string;
  public userid: string;
  public teamid: string;
  public businesstype: string;
    constructor(
      private toastCtrl: ToastController,
      private authService: AuthService,
      private router: Router
      ) {
      }
      async ionViewWillEnter() {
        this.isAdmin = await this.authService.isAdmin();
        this.usrName = await this.authService.getuserName();
        this.company = await this.authService.getCompanyName();
        this.userid = await this.authService.getuserId();
        this.teamid = await this.authService.getTeamId();
        this.businesstype = await this.authService.getBusinessType();
       }
      bookOrder() {
        this.router.navigateByUrl(`/order-shops/${this.teamid}`);
      }
    logOut(): void {
      this.authService.userLogout().then( () => {
      this.router.navigateByUrl('login');
      });
      }
      listOrders() {
        this.router.navigateByUrl(`order-list/${this.teamid}`);
      }
      listCustomers() {
        this.router.navigateByUrl(`/shop-list/${this.teamid}/${this.businesstype}`);
      }
      listSKUs() {
        this.router.navigateByUrl(`/sku-list/${this.teamid}/${this.businesstype}`);
      }
      showReports() {
        this.router.navigateByUrl(`metrics/${this.teamid}`);
      }
      manageTeam() {
        this.router.navigateByUrl('team');
      }
    } // EOF
