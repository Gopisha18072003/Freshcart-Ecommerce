import { QueryClient } from "@tanstack/react-query";

export const querClient = new QueryClient();

export async function fetchProducts({signal, type, filters, sortBy}) {
    let url = 'http://127.0.0.1:8000/api/v1/freshcart/';
    if(type === 'featured') {
        url += '?isFeatured=true';
    }else if(type === 'bestSeller') {
        url += '?sort=-ordersQuantity&limit=10';
    } else if(type == 'popular') {
        url += '?discount[gte]=50'
    }
    if(filters) {
        url += '?'
        for (const filter in filters) {
            if(filter == 'category'){
                const filterVals = filters[filter].join(',')
                url += `${filter}=${filterVals}&`
            } else if(filter == 'price') {
                url += `${filter}[lt]=${filters[filter]}&`
            }else if(filter == 'averageRating') {
                url += `${filter}[gt]=${filters[filter]}&`
            }else if(filter == 'quantity') {
                url += `${filter}[gt]=0&`
            }else if(filter == 'isOrganic') {
                url += `${filter}=true`
            }
        }
    if(sortBy) {
        url += `sort=${sortBy}`
    }
        
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

export async function loginUser(userData) {
    const response = await fetch('http://127.0.0.1:8000/api/v1/freshcart/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData),
    });

    if(!response.ok) {
        console.log('login failed')
        throw new Error('Invalid Email or Password')
    } 
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data;
}
export async function logoutUser() {
    const response = await fetch('http://127.0.0.1:8000/api/v1/freshcart/user/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    });

    if(!response.ok) {
        console.log('logout failed')
        throw new Error('Something went wrong')
    } 
    
    const data = await response.json();
    localStorage.removeItem('accessToken');
    return data;
}


export const fetchCategoryCounts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/freshcart/category');
      if (!response.ok) {
        throw new Error('Failed to fetch category counts');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching category counts:', error);
      throw error; // Re-throw the error after logging it
    }
  };
  
