import { STORAGE_KEY } from '../constants/app.constants';
export const loadState=<T,>(fallback:T):T=>{try{const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}};
export const saveState=<T,>(value:T)=>localStorage.setItem(STORAGE_KEY,JSON.stringify(value));