interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface ICatalogModel {
  items: IProductItem[];
  setCatalog(items: IProductItem[]): void;
  setPreview(id: string): IProductItem;
}

interface IBasketModel {
  items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
  getTotalPrice(): number;
  countProducts(): number;
}

interface IOrderModel {
  payment: boolean;
  adress: string;
  email: string;
  phone: string;
  items: string[];
  setOrderAddress (field: string, value: string): void;
  validateOrder(): void;
  setOrderContacts(field: string, value: string): void;
  validateContacts(): void;
  getOrderLot(): object;
}

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  setCatalog(items: HTMLElement[]): void;
  countBasketItems(value: number): void;
}

interface ICard {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category: string;
  price: number | null;
}

interface IBasket {
  items: HTMLElement[];
  price: number;
}

interface IOrderForm {
  payment: string;
  adress: string;
}

interface IContactsForm {
  email: string;
  phone: string;
}

type EventName = string | RegExp;

interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}



