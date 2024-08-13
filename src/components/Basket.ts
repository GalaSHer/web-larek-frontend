import {Component} from "./base/Component";
import {IBasket, IBasketCard, ICardActions} from "../types/index";
import {createElement, ensureElement} from "../utils/utils";
import {EventEmitter} from "./base/events";

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = this.container.querySelector('.basket__list');
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.button');
        this.list = [];
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('basket:makeOrder');
            });
        }        
    }

    set list(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    disableBasketBtn(disabled: boolean) {
        this.setDisabled(this._button, disabled);
    }
}

export class BasketCard extends Component<IBasketCard> {
    protected _productIndex: HTMLElement;
    protected _title: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _price: HTMLElement;
  
    constructor(container: HTMLElement,  actions?: ICardActions) {
        super(container);
  
        this._productIndex = ensureElement<HTMLElement>(`.basket__item-index`, container);
        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._price = ensureElement<HTMLElement>(`.card__price`, container);
        this._button = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);
  
        if (actions?.onClick) {
          this._button.addEventListener('click', actions.onClick);
    }
  }
  
    set productIndex(value: number) {
       this.setText(this._productIndex, value);
    }
  
    set title(value: string) {
      this.setText(this._title, value);
    }
  
    set price(value: number | null) {
      if (value === null) {
        this.setText(this._price, `0 синапсов`)
      } else {
        this.setText(this._price, `${value} синапсов`)
      }; 
    }
  }