# food-delivery

Учебный проект по продуктовой аналитике: мобильное веб-приложение доставки еды. Рестораны, цены и заказы вымышленные.

Сайт: https://anleokiselev.github.io/food-delivery/ (после включения GitHub Pages)

## Воронка
`app_opened` → `restaurant_list_viewed` → `restaurant_opened` → `item_added` → `cart_viewed` → `checkout_started` → `order_completed`

Дополнительно: `item_removed`, `category_selected`, `search_used`.

## Аналитика
Идентификаторы Amplitude и GA4 задаются в `config.js`. Аналитика включается только после согласия посетителя. Имя, адрес и комментарий в события не передаются. С параметром `?debug` события выводятся в консоль.

## Фото
Wikimedia Commons; авторы и лицензии — на странице «О проекте» и в `data.js`.
