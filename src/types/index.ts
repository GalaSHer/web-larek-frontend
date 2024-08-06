interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

interface IAppState {
  basket: IProductItem[];
  catalog: IProductItem[];
  order: IOrderModel;
  formErrors: IFormState;
  addToBasket(id: string): void;
  removeFromBasket(id: string): void;
  clearBasket(): void;
  getTotalPrice(): number;
  countProducts(): number;
  setOrderField(field: keyof IOrderModel, value: string): void;
  validateAdress(): void;
  validateContacts(): void;
}

interface IOrderModel {
  payment: string;
  adress: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

interface IModalData {
  content: HTMLElement;
}

interface IFormState {
  valid: boolean;
  errors: string[];
}

interface IPage {
  counter: number;
  catalog: HTMLElement[];
  basket: HTMLElement;
}

interface ICard {
  id: string;
  description?: string;
  image?: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

interface IBasket {
  items: HTMLElement[];
  price: number;
}

interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

type EventName = string | RegExp;

interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}