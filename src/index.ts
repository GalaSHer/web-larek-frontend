import './scss/styles.scss';

import { ApiAddition } from './components/ApiAddition';
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState} from "./components/AppState";
import {Page} from "./components/Page";
import {CardMainPage, CardPreview, BasketCard} from "./components/Cards";
import {cloneTemplate,  ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/Basket";
import { FormOrder } from './components/FormOrder';
import { FormContacts } from './components/FormContacts';
import {CatalogChangeEvent, IOrderModel, IProductItem} from "./types/index";
import {PopupSuccess} from "./components/PopupSuccess";

const events = new EventEmitter();
const api = new ApiAddition(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// // Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new FormOrder(cloneTemplate(orderFormTemplate), events);
const contactsForm = new FormContacts(cloneTemplate(contactsFormTemplate), events);

// Дальше идет бизнес-логика

// Получаем каталог с сервера
api
  .getCatalog()
  .then((res) => {
    appData.setCatalog(res as IProductItem[]);
  })
  .catch((err) => {
    console.log(err);
  });

// Изменились элементы каталога
events.on<CatalogChangeEvent>('catalog:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CardMainPage('card', cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price     
        });
    });
    page.counter = appData.countProducts();
});

// Открыть карточку
events.on('card:select', (item: IProductItem) => {
  const isInBasket = appData.isInBasket(item.id);
  const product = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (isInBasket) {
         events.emit('card:deletefromPreview', item);
      } else {
          events.emit('card:toBasket', item);
      }
    }
  });
 
  modal.render({
    content: product.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
      buttonText: isInBasket ? 'Удалить из корзины' : 'В корзину',
    })
  });
});

// добавить товар в корзину
events.on('card:toBasket', (item: IProductItem) => {
    appData.addToBasket(item);
    item.selected = true;
    page.counter = appData.countProducts();
    modal.close();
  })

// удалить из товар из корзины по кнопке в карточке товара
events.on('card:deletefromPreview', (item: IProductItem) => {
    appData.removeFromBasket(item);
    item.selected = false;
    page.counter = appData.countProducts();
    modal.close();
  })

// открыть корзину
events.on('basket:open', () => {
  basket.total = appData.getTotalPrice();
  appData.basket.items.length === 0 ? basket.disableBasketBtn(true) : basket.disableBasketBtn(false);

  let i = 0;
  basket.list = appData.basket.items.map(item => {
    const basketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
      onClick: () => {events.emit('card:delete', item)}
    });
    i++;
    basketCard.productIndex = i
      return basketCard.render({
        title: item.title,
        price: item.price   
    });
  });  
  modal.render({
    content: basket.render(),
  });
});

// удалить товар из корзины по кнопке в корзине
events.on('card:delete', (item: IProductItem) => {
  appData.removeFromBasket(item);
  item.selected = false;
  page.counter = appData.countProducts();
  events.emit('basket:open'); 
})

// открыть окно оформления заказа
events.on('basket:makeOrder', () => {
  appData.getTotalPrice();
  modal.render({
    content: orderForm.render({
      valid: false,
      errors: []
    })
  })
})

// Изменилось состояние валидации формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderModel>) => {
    const { payment, address } = errors;
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IOrderModel>) => {
  const { email, phone } = errors;
  contactsForm.valid = !email && !phone;
  contactsForm.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Изменилось поле ввода в форме заказа или в форме контактов
events.on('orderInput:change', (data: { field: keyof IOrderModel, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

// Подтверждена форма заказа
events.on('order:submit', () => {
  modal.render({
    content: contactsForm.render({
      valid: false,
      errors: []
    })
  })
})

// Подтверждены контактные данные, отправляем заказ
events.on('contacts:submit', () => {
    contactsForm.changeBtnText('Оформляем заказ...');
    const id = appData.getProductIDs();
    const price = appData.getTotalPrice();
    api.orderProducts(appData.orderInfo, price, id)
        .then((result) => {
            const success = new PopupSuccess(cloneTemplate(successTemplate), {
              onClick: () => {
                modal.close();
                }
            });
            appData.clearBasket();
            page.counter = appData.countProducts();
            orderForm.clearForm();
            contactsForm.clearForm();
            contactsForm.changeBtnText('Оплатить');

            modal.render({
                content: success.render({
                  total: result.total
                })
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
   page.setLocked(true);
});

 // ... и разблокируем
 events.on('modal:close', () => {
    page.setLocked(false);
 });