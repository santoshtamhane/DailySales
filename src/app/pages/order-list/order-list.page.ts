import { Component, OnInit } from '@angular/core';
import { NavController, AlertController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import { Order } from '../../models/order';
import { OrderService } from '../../services/order.service';
import addDays from 'date-fns/addDays';
import endofDay from 'date-fns/endOfDay';
import isToday from 'date-fns/isToday';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {
  selectedDate: Date;
  orderList: Observable<Order[]>;
  teamid: string;
  ordervalue = 0;
  constructor(private route: ActivatedRoute, private orderService: OrderService,
              private router: Router) {
       this.selectedDate = new Date();
       this.teamid = this.route.snapshot.paramMap.get('teamid');
       this.orderList = this.orderService.getOrdersByDate(this.selectedDate, this.teamid, null).valueChanges();
       this.orderList.subscribe(orderdocs => {
              this.ordervalue = orderdocs.map(res => res).reduce((acc, val) => acc + val.orderTotal, 0);
            });
      }

  ngOnInit() {

  }

  nextDate(dtdirection: number) {
    this.selectedDate = addDays((this.selectedDate), dtdirection) ;
    this.orderList = this.orderService.getOrdersByDate(this.selectedDate, this.teamid, null).valueChanges();
    this.orderList.subscribe(orderdocs => {
      this.ordervalue = orderdocs.map(res => res).reduce((acc, val) => acc + val.orderTotal, 0);
    });
}

openOrder(orderid: string, teamid: string) {
  this.router.navigateByUrl(`order-display/${orderid}/${teamid}`);
}
triggerSearch(searchTerm: string, teamid: string) {
console.log('trigger search');
 }
} // EOF

