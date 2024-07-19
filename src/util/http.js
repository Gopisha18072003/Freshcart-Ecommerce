import { QueryClient } from "@tanstack/react-query";

export const querClient = new QueryClient();

export async function fetchProducts({signal, type}) {
    let url = 'http://127.0.0.1:8000/api/v1/freshcart/';
    if(type === 'featured') {
        url += '?isFeatured=true';
    }else if(type === 'bestseller') {
        url += '?sort=-ordersQuantity&limit=10';
    } else if(type == 'discounted') {
        url += '?discount[gte]=50'
    }
    const response = await fetch(url, {signal: signal});
    if(!response.ok) {
        const error = new Error('An error has occured!');
        error.code = response.status;
        error.info = await response.json()
        throw error;
    }
    const {data} = await response.json();
    return data.groceries;
}