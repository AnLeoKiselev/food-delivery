const photo = f => 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(f) + '?width=800';
const PHOTOS = {
  margherita: { file: 'Pizza Margherita (14703152728).jpg', author: 'jeffreyw', license: 'CC BY 2.0' },
  pepperoni: { file: 'Pepperoni pizza.jpg', author: 'Jon Sullivan', license: 'Public domain' },
  cheese: { file: 'Pizza quattro formaggi at restaurant, Chalk Farm Road, London.jpg', author: 'Ewan Munro', license: 'CC BY-SA 2.0' },
  poke: { file: 'Salmon Poke.jpg', author: 'Pokebros', license: 'CC BY-SA 4.0' },
  hawaii: { file: 'Hawaiian Poke Bowl, Tilburg (2022) 01.jpg', author: 'Donald Trung Quoc Don', license: 'CC BY-SA 4.0' },
  teriyaki: { file: "B-Dama's Salmon Teriyaki Bowl. a.k.a. The anti-sisig. -) (14954283259).jpg", author: 'arnold | inuyaki', license: 'CC BY 2.0' },
  udon: { file: 'Kasu udon.jpg', author: 'Wiki0001', license: 'CC BY 3.0' },
  katsudon: { file: 'Katsudon 001.jpg', author: 'Wikimedia Commons', license: 'CC0' }
};
const RESTAURANTS = [
  { id: 'pech', name: 'Печь на углу', kitchen: 'Итальянская кухня', category: 'Италия', time: '25–35 мин', photo: 'margherita', dishes: [
    { id: 'margherita', name: 'Маргарита', desc: 'томаты, моцарелла, базилик', price: 8, photo: 'margherita' },
    { id: 'pepperoni', name: 'Пепперони', desc: 'томаты, моцарелла, салями', price: 10, photo: 'pepperoni' },
    { id: 'cheese', name: 'Четыре сыра', desc: 'пицца с четырьмя видами сыра', price: 11, photo: 'cheese' } ] },
  { id: 'bowl', name: 'Зелёная миска', kitchen: 'Боулы', category: 'Боулы', time: '20–30 мин', photo: 'poke', dishes: [
    { id: 'poke', name: 'Поке с лососем', desc: 'рис, лосось, авокадо, огурец', price: 12, photo: 'poke' },
    { id: 'hawaii', name: 'Гавайский боул', desc: 'боул в гавайском стиле', price: 11, photo: 'hawaii' },
    { id: 'teriyaki', name: 'Лосось терияки', desc: 'лосось в соусе терияки', price: 12, photo: 'teriyaki' } ] },
  { id: 'udon', name: 'Дом Удон', kitchen: 'Японская кухня', category: 'Япония', time: '30–40 мин', photo: 'udon', dishes: [
    { id: 'udon', name: 'Касу-удон', desc: 'пшеничная лапша в бульоне', price: 10, photo: 'udon' },
    { id: 'katsudon', name: 'Кацудон', desc: 'рис со свиной или куриной котлетой и яйцом', price: 11, photo: 'katsudon' } ] }
];
const DELIVERY = 2;
