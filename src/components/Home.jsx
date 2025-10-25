import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Hero from './Hero';
import DiscountBanner from './DiscountBanner';
import About from './About';
import Testimonials from './Testimonials';
import Categories from './Categories';
import Products from './Products';
import FAQ from './FAQ';
import Cart from './Cart';
import Toast from './Toast';

function Home() {
  const { 
    cart, 
    cartOpen, 
    setCartOpen, 
    addToCart, 
    updateQuantity, 
    checkout 
  } = useCart();
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast('Producto agregado al carrito', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleCheckout = () => {
    const result = checkout();
    showToast(result.message, result.success ? 'success' : 'error');
  };

  return (
    <>
      <Hero />
      <DiscountBanner />
      <About />
      <Testimonials />
      <Categories />
      <Products onAddToCart={handleAddToCart} />
      <FAQ />
      <Cart 
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default Home;
