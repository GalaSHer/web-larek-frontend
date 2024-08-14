import {Component} from "../base/Component";
import {ICardActions, ICard} from "../../types/index";
import {ensureElement} from "../../utils/utils";

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set buttonText(value: string) {
      this._button.textContent = value;
    }

    set price(value: number | null) {
      if (value === null) {
        this.setText(this._price, `Бесценно`)
      } else {
        this.setText(this._price, `${value} синапсов`)
      };
      if (this._button && value === null) {
        this._button.disabled = true;
      }
    }
}
