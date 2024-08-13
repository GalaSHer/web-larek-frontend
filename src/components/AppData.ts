import {Model} from "./base/Model";
import {FormErrors, IAppState, IBasket, IProductItem, IOrderModel } from "../types/index";

export class AppState extends Model<IAppState> {
    basket: IBasket = {
      items: [],
      price: 0,
      selected: []
    };
    catalog: IProductItem[];
    orderInfo: IOrderModel = {
      payment: '',
      address: '',
      email: '',
      phone: ''
    };
    preview: string | null;
    formErrors: FormErrors = {};

    setCatalog(items: IProductItem[]) {
      this.catalog = items;
      this.emitChanges('catalog:changed', { catalog: this.catalog });
    }

    addToBasket(data: IProductItem) {
        this.basket.items.push(data);
    }

    removeFromBasket(data: IProductItem) {
        this.basket.items = this.basket.items.filter(item => item.id !== data.id);
    }

    clearBasket() {
        this.basket = {
            items: [],
            price: 0,
            selected: []
        }
    }

    isInBasket(productId: string): boolean {
      return this.basket.items.some(item => item.id === productId);
    }

    getTotalPrice() {
      return this.basket.items.reduce((sum, item) => {return sum + item.price}, 0)
    }

    countProducts() {
      return this.basket.items.length
    }

   setPreview(item:  IProductItem) {
     this.preview = item.id;
        this.emitChanges('card:select', item);
    }

    setOrderField(field: keyof IOrderModel, value: string) {
      this.orderInfo[field] = value;

      if (this.validateAddress()) {
        this.events.emit('order:ready', this.orderInfo);
      }
      if (this.validateContacts()) {
        this.events.emit('contacts:ready', this.orderInfo);
      }
    }

    validateAddress() {
        const errors: typeof this.formErrors = {};
        if (!this.orderInfo.payment) {
          errors.payment = 'Выберите способ оплаты';
        }
        if (!this.orderInfo.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('orderFormErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    validateContacts() {
      const errors: typeof this.formErrors = {};
      if (!this.orderInfo.email) {
          errors.email = 'Необходимо указать email';
      }
      if (!this.orderInfo.phone) {
          errors.phone = 'Необходимо указать телефон';
      }
      this.formErrors = errors;
      this.events.emit('contactsFormErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
    }

    getProductIDs() { 
        return this.basket.items.map(item => item.id);
    }
}