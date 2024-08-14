import { Card } from "./common/Card";
import {ICardActions} from "../types/index";
import {ensureElement} from "../utils/utils";

export class CardMainPage extends Card {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _selected: boolean;
    protected _categoryClass = <Record<string, string>>{
      "дополнительное": "additional",
      "софт-скил": "soft",
      "кнопка": "button",
      "хард-скил": "hard",
      "другое": "other",
    }
    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(blockName, container, actions);

      this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
      this._category = container.querySelector(`.${blockName}__category`);
      
  }

  set image(value: string) {
      this.setImage(this._image, value, this.title)
  }

  set category(value: string) {
      this._category.textContent = value
      this._category.className = `card__category card__category_${this._categoryClass[value]}`
  }
}

export class CardPreview extends CardMainPage {
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

export class BasketCard extends Card {
  protected _productIndex: HTMLElement;

  constructor(container: HTMLElement,  actions?: ICardActions) {
      super('card', container, actions);

      this._productIndex = ensureElement<HTMLElement>(`.basket__item-index`, container);
      this._button = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);
}

  set productIndex(value: number) {
     this.setText(this._productIndex, value);
  }
}
