import {Component} from "./base/Component";
import {ICardActions, ICard, IBasketCard} from "../types/index";
import {ensureElement} from "../utils/utils";

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _button?: HTMLButtonElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _selected?: boolean;
    protected _categoryClass = <Record<string, string>>{
      "дополнительное": "additional",
      "софт-скил": "soft",
      "кнопка": "button",
      "хард-скил": "hard",
      "другое": "other",
    }

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._category = container.querySelector(`.${blockName}__category`);
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

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set category(value: string) {
        this._category.textContent = value
        this._category.className = `card__category card__category_${this._categoryClass[value]}`
    }

    set price(value: number | null) {
      if (value === null) {
        this.setText(this._price, `0 синапсов`)
      } else {
        this.setText(this._price, `${value} синапсов`)
      };
      if (this._button && value === null) {
        this._button.disabled = true;
      }
    }
}

export class CardPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super('card', container, actions);
    this._description = ensureElement<HTMLElement>(`.card__text`, container);
  }

  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description.replaceWith(...value.map(str => {
        const descTemplate = this._description.cloneNode() as HTMLElement;
        this.setText(descTemplate, str);
        return descTemplate;
    }));
    } else {
        this.setText(this._description, value);
    }
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

// export type AuctionStatus = {
//     status: string,
//     time: string,
//     label: string,
//     nextBid: number,
//     history: number[]
// };

// export class AuctionItem extends Card<HTMLElement> {
//     protected _status: HTMLElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('lot', container, actions);
//         this._status = ensureElement<HTMLElement>(`.lot__status`, container);
//     }

//     set status(content: HTMLElement) {
//         this._status.replaceWith(content);
//     }
// }

// interface IAuctionActions {
//     onSubmit: (price: number) => void;
// }



// export interface BidStatus {
//     amount: number;
//     status: boolean;
// }
