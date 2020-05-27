import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {OrderService} from '../../services/order.service';
import {Order} from '../../models/order';
import addDays from 'date-fns/addDays';
import endofDay from 'date-fns/endOfDay';
import addMonths from 'date-fns/addMonths';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.page.html',
  styleUrls: ['./metrics.page.scss'],
})
export class MetricsPage implements OnInit {
  orderList: Observable<Order[]>;
  orderMonthList: Observable<Order[]>;
  teamid: string;
  ordervalue = 0;
  MonthTotal = 0;
  todayTotal = 0;
  reportType = 10; // default tab
  reportSource: string;
  searchid: string;
  searchforid: string;
  selectedDate: Date = new Date();
  // avgDuration: any ;
    constructor(private route: ActivatedRoute, public authProvider: AuthService,
                public orderProvider: OrderService) {
        this.teamid = this.route.snapshot.paramMap.get('teamId');
        this.reportSource = this.route.snapshot.paramMap.get('reportSource');
        this.searchid = this.route.snapshot.paramMap.get('searchid');
        this.orderList = this.orderProvider.getOrderListByDate(this.selectedDate, this.teamid, null)
    .valueChanges();
        this.orderMonthList = this.orderProvider.getOrdersByMonth(this.selectedDate, this.teamid, null)
    .valueChanges();
      }

    ngOnInit() {
    // choose the is that will be used for searching docs
    switch (this.reportSource) {
      case 'A':
      this.searchforid = null; // null implies Admin
      break;
      case 'O' :
      this.searchforid = this.searchid;
      break;
      case 'I':
      this.searchforid = this.authProvider.getuserId();
      break;
      default:
      this.searchforid = this.authProvider.getuserId();
      break;
    }
    }
    ionViewWillEnter()  {
      this.getDailyOrders();
      this.getMonthlyOrders();
    }
    nextDate(dtdirection: number) {
      this.selectedDate = addDays(endofDay(this.selectedDate), dtdirection) ;
      this.getDailyOrders();

      }
      nextMonth(dtdirection: number) {
     this.selectedDate = addMonths(this.selectedDate, dtdirection);
     this.getMonthlyOrders();

        }
    getMonthlyOrders() {
      this.orderMonthList = this.orderProvider.getOrdersByMonth(this.selectedDate, this.teamid, null)
    .valueChanges();
      this.orderMonthList.subscribe(orderdocs => {
      this.MonthTotal = orderdocs.map(res => res).reduce((acc, val) => acc + val.orderTotal, 0);

    });

  }
  getDailyOrders() {
    this.orderList = this.orderProvider.getOrderListByDate(this.selectedDate, this.teamid, null)
    .valueChanges();
    this.orderList.subscribe(orderdocs => {
    console.log('found', orderdocs.length);
    this.todayTotal = orderdocs.map(res => res).reduce((acc, val) => acc + val.orderTotal, 0);
    console.log('todauttoal=', this.todayTotal);
  });

  }
  segmentChanged(ev: any) {
    console.log('ev=', ev);
    switch (ev) {
      case 10: {
        this.getDailyOrders();
        break;
      }
      case 20: {
      this.getMonthlyOrders();
      break;
      }
    }
  }

  } // EOF

