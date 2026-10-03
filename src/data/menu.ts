import type { MenuItem } from '../types/restaurant';

const food = (name:string) => `/food/${name}.svg`;
export const menuItems: MenuItem[] = [
 {id:'chiya',name:'Chiya',price:25,category:'Tea & Snacks',description:'Comforting hot tea prepared fresh for a quick break.',image:'/food/chiya.webp'},
 {id:'samosa',name:'Samosa',price:25,category:'Tea & Snacks',description:'Crispy golden snack with a savory, flavorful filling.',image:'/food/Samosa.jpg'},
 {id:'momo',name:'Chicken MoMo',price:120,category:'Momo',description:'Delicious steamed dumplings filled with flavorful ingredients.',image:'/food/momo.jpg'},
 {id:'fry-momo',name:'Fry MoMo',price:150,category:'Momo',description:'Crispy pan-fried dumplings with a rich, savory finish.',image:'/food/frymomo.jpg'},
 {id:'sea-momo',name:'Sea MoMo',price:200,category:'Momo',description:'A seafood-inspired momo selection prepared fresh to order.',image:'/food/chilly momo.jpg'},
 {id:'veg-chowmin',name:'Veg Chowmin',price:100,category:'Chowmein',description:'Stir-fried noodles tossed with fresh vegetables and seasoning.',image:'/food/chowmine.jpg'},
 {id:'chicken-chowmin',name:'Chicken Chowmin',price:200,category:'Chowmein',description:'Flavorful stir-fried noodles with tender chicken and vegetables.',image:'/food/chicken Chowmine.jpg'},
 {id:'chicken-lolipop',name:'Chicken Lolipop',price:300,category:'Chicken Specials',description:'Crispy, seasoned chicken pieces prepared for a satisfying bite.',image:'/food/lolipop.jpg'},
 {id:'chicken-roast',name:'Chicken Roast',price:250,category:'Chicken Specials',description:'Tender roasted chicken with a savory, comforting flavor.',image:'/food/chicken roast.jpg'},
 {id:'chicken-chilly',name:'Chicken Chilly',price:300,category:'Chicken Specials',description:'Chicken tossed with vegetables and a bold, savory chili sauce.',image:'/food/chicken chilly.jpg'}
];
