export interface Order {
    Orderid: string;
    shopname: string;
        shopemail: string;
        shopphone: string;
        contactname: string;
        shopaddr: string;
        shoplocality: string;
        shopType: string;
        items: Array<Items>;
        orderNo: string;
        orderStatus: string;
        orderdt: any;
        dispatchdt: any;
        orderCount: number;
        orderTotal: number;
        docAuthor: string;
        teamId: string;
        lastupdton: any;
        timestamp;
}
export interface Items {
        id: string;
        SKUname: string;
        SKUunit: string;
        SKUCategory: string;
        SKUrate: number;
        SKUstatus: string;
}
