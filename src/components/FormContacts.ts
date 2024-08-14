import {Form} from "./common/Form";
import {IOrderModel} from "../types/index";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class FormContacts extends Form<Partial<IOrderModel>> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;

   constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    
    this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
    this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;  
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {  
    this._phoneInput.value = value;
  }

  changeBtnText(text: string) {
    ensureElement(this._submit).textContent = text;
  }
}