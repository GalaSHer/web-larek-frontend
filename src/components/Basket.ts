import {Component} from "./base/Component";
import {IBasket} from "../types/index";
import {createElement} from "../utils/utils";
import {EventEmitter} from "./base/Events";

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

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }

    disableBasketBtn(disabled: boolean) {
        this.setDisabled(this._button, disabled);
    }
}