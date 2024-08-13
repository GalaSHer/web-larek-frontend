import { IOrderModel, IOrderResult, IProductItem } from "../types/index";
import {Api, ApiListResponse} from "./base/api";

export class ApiAddition extends Api {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }
  
  getCatalog(): Promise<IProductItem[]> {
      return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
          data.items.map((item) => ({
              ...item,
              image: this.cdn + item.image
          }))
      );
  }

  orderProducts(order: IOrderModel, total: number, items: string[]): Promise<IOrderResult> {
      const data = {...order, total, items}
      return this.post('/order', data).then(
          (data: IOrderResult) => data
      );
  }

}