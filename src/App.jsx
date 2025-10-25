import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DiscountBanner from './components/DiscountBanner';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Categories from './components/Categories';
import Products from './components/Products';
import FAQ from './components/FAQ';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Toast from './components/Toast';

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast('Producto agregado al carrito', 'success');
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    showToast('Producto eliminado del carrito', 'success');
  };

  const updateQuantity = (productId, change) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        setCart(cart.map(item => 
          item.id === productId ? { ...item, quantity: newQuantity } : item
        ));
      }
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const checkout = () => {
    if (cart.length === 0) {
      showToast('Tu carrito está vacío', 'error');
      return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showToast(`Pedido procesado por $${total.toLocaleString()} CLP. ¡Gracias por tu compra!`, 'success');
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div>
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(!cartOpen)}
      />
      <Hero />
      <DiscountBanner />
      <About />
      <Testimonials />
      <Categories />
      <Products onAddToCart={addToCart} />
      <FAQ />
      <Cart 
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onCheckout={checkout}
      />
      <Footer />
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
