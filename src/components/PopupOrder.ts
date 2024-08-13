import { Form } from "./common/Form";
import { IOrderModel } from "../types/index";
import {IEvents} from "./base/Events";
import {ensureElement} from "../utils/utils";

export class PopupOrder extends Form<Partial<IOrderModel>> {
  protected _byCardBtn: HTMLButtonElement;
  protected _byCashBtn: HTMLButtonElement;
  protected _input: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
   
    this._byCardBtn = container.elements.namedItem('card') as HTMLButtonElement;
    this._byCashBtn = container.elements.namedItem('cash') as HTMLButtonElement;
    this._input = ensureElement<HTMLInputElement>('input', this.container);
  
    this._byCardBtn.addEventListener('click', () => {
      this._byCardBtn.classList.add('button_alt-active')
      this._byCashBtn.classList.remove('button_alt-active')
      this.onInputChange('payment', 'card')
    })
 
    this._byCashBtn.addEventListener('click', () => {
      this._byCardBtn.classList.remove('button_alt-active')
      this._byCashBtn.classList.add('button_alt-active')
      this.onInputChange('payment', 'cash')
    })
  } 

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }
}