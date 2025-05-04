export const getCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('eCartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  };
  
  export const saveCartToLocalStorage = (cartItems) => {
    localStorage.setItem('eCartItems', JSON.stringify(cartItems));
  };
  