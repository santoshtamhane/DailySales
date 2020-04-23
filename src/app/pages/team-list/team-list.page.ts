import { Component, OnInit } from '@angular/core';
import {ActionSheetController, AlertController, NavController} from '@ionic/angular';
import { UserProfile} from '../../models/user-profile';
import { AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import * as format from 'date-fns/format';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.page.html',
  styleUrls: ['./team-list.page.scss'],
})
export class TeamListPage implements OnInit {
userList: Observable<UserProfile[]>;
  constructor(private authProvider: AuthService, private navCtrl: NavController,
              public actionSheetController: ActionSheetController,
              public alertCtrl: AlertController) { }

  ngOnInit() {
this.authProvider.getTeamId().then(tid => {
  this.userList = tid ? this.authProvider.getUserListbyTeamId(tid).valueChanges() : null;

});
  }

checkMetrics(teamid: string, userid: string) {
  this.navCtrl.navigateForward(`metrics/O/${userid}`);
}
checkReports(teamid: string, userid: string) {
  this.navCtrl.navigateForward(`report-list/O/${userid}`);
}
edit(teamid: string, userid: string) {
  console.log('teamid=', teamid, 'userid=', userid);
  this.navCtrl.navigateForward(`/user-profile/${teamid}/${userid}`);
}
async presentAdminActionSheet(userid: string, teamid: string) {
  const actionSheet = await this.actionSheetController.create({
    header: 'Monthly Target',
    subHeader: 'Set / Update Monthly Sales Target',
    buttons: [ {
      text: 'View Performance Metrics',
      icon: 'list-box',
      handler: () => {
        this.navCtrl.navigateForward(`metrics/O/${userid}`);
      }
    }, {
      text: 'View Reports',
      icon: 'list',
      handler: () => {
        this.navCtrl.navigateForward(`report-list/O/${userid}`);
      }
    }, {
      text: 'Edit User Profile',
      icon: 'list',
      handler: () => {
        this.navCtrl.navigateForward(`/user-profile/${teamid}/${userid}/true`);
      }
    },          {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
       // console.log('Cancel clicked');
      }
    }],
    translucent: true,
    backdropDismiss: true,
    animated: true
  });
  await actionSheet.present();
}

} // EOF
