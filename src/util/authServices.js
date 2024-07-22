export async function refreshToken() {
    const response = await fetch('http://127.0.0.1:8000/api/v1/freshcart/user/refresh', {
      method: 'POST',
      credentials: 'include', // Include cookies
    });
    console.log(response)
    if (response.status == 'success') {
      throw new Error('Failed to refresh token');
    }
  
    const data = await response.json();
    return data;
  }