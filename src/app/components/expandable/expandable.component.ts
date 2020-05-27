// added from  https://masteringionic.com/blog/2019-01-27-creating-a-simple-accordion-widget-in-ionic-4/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss']
})
export class ExpandableComponent implements OnInit {
  @Input() name: string;
  @Input() contactname: string;
  @Output() change: EventEmitter<any[]> = new EventEmitter<any[]>();
  public Cartitem = [];
  public isMenuOpen = false;
  qty = 0;
  constructor() { }
  @Output()


  ngOnInit() {
  }
  public toggleAccordion(): void {
      this.isMenuOpen = !this.isMenuOpen;
  }

AddToCart(name: string, qty: number) {

    if (this.Cartitem && this.Cartitem.length > 0) {
      this.Cartitem[0] = {sku: name, skuqty: qty};
    } else {
    this.Cartitem.push({sku: name, skuqty: qty});

  }
    console.log('emitting ', this.Cartitem);
    this.change.emit(this.Cartitem);

}
RemovefromCart(name: string, qty: number) {
  this.qty = 0;
  if (this.Cartitem && this.Cartitem.length > 0) {
    this.Cartitem[0] = {sku: name, skuqty: 0};
  } else {
  this.Cartitem.push({sku: name, skuqty: 0});

}
  console.log('remove emitting ', this.Cartitem);
  this.change.emit(this.Cartitem);

}

} // EOF
