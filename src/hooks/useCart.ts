import { useMemo, useState } from 'react';
import type { CartItem, MenuItem } from '../types/restaurant';
export function useCart(){
 const [items,setItems]=useState<CartItem[]>([]);
 const add=(item:MenuItem, quantity=1)=>setItems(prev=>{const found=prev.find(x=>x.id===item.id); return found?prev.map(x=>x.id===item.id?{...x,quantity:x.quantity+quantity}:x):[...prev,{...item,quantity}];});
 const change=(id:string,delta:number)=>setItems(prev=>prev.map(x=>x.id===id?{...x,quantity:Math.max(0,x.quantity+delta)}:x).filter(x=>x.quantity>0));
 const remove=(id:string)=>setItems(prev=>prev.filter(x=>x.id!==id));
 const subtotal=useMemo(()=>items.reduce((s,x)=>s+x.price*x.quantity,0),[items]);
 const count=useMemo(()=>items.reduce((s,x)=>s+x.quantity,0),[items]);
 return {items,add,change,remove,subtotal,count,clear:()=>setItems([])};
}
