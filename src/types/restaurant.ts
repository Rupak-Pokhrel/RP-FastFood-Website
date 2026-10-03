export type Category = 'Tea & Snacks' | 'Momo' | 'Chowmein' | 'Chicken Specials';
export type MenuItem = { id:string; name:string; price:number; category:Category; description:string; image:string };
export type CartItem = MenuItem & { quantity:number };
export type Review = { id:number; name:string; rating:number; text:string };
