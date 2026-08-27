import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import LoginModal from '../../auth/components/LoginModal';
import { createOrderService } from '../../orders/services/createServices';

const ORANGE = '#F3C9A7';

function CartPage() {
  const [cart, setCart] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pendingOrder, setPendingOrder] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart')) || [];

    setCart(saved);
  }, []);

  const handleCreateOrder = useCallback(async () => {
    if (!user || !user.customerId) {
      alert('Error: No se pudo identificar al usuario.');

      return;
    }

    const orderPayload = {
      customerId: user.customerId,
      shippingAddress: 'Dirección de prueba 123',
      billingAddress: 'Dirección de prueba 123',
      orderItems: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    setIsSubmitting(true);

    const { error } = await createOrderService(orderPayload);

    setIsSubmitting(false);

    if (error) {
      alert(error);
    } else {
      alert('¡Orden creada exitosamente!');

      setCart([]);
      localStorage.removeItem('cart');

      navigate('/');
    }
  }, [cart, user, navigate]);

  useEffect(() => {

    if (pendingOrder && isAuthenticated && user?.id) {
      handleCreateOrder();
      setPendingOrder(false);
    }
  }, [isAuthenticated, user, pendingOrder, handleCreateOrder]);
  const updateQuantity = (sku, delta) => {
    const updated = cart.map((item) => {
      if (item.sku === sku) {
        const newQuantity = item.quantity + delta;

        if (delta > 0 && newQuantity > item.stockQuantity) return item;

        return { ...item, quantity: Math.max(1, newQuantity) };
      }

      return item;
    });

    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (sku) => {
    const updated = cart.filter((item) => item.sku !== sku);

    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return alert('El carrito está vacío');

    if (!isAuthenticated) {
      setShowLogin(true);
    } else {

      handleCreateOrder();
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setPendingOrder(true);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 max-w-7xl mx-auto">

        <div className="lg:col-span-2 flex flex-col gap-4">
          {cart.length === 0 ? (
            <p className="text-gray-600 text-center py-10">El carrito está vacío</p>
          ) : (
            cart.map((item) => (
              <div key={item.sku} className="bg-white/70 backdrop-blur-xl border border-[#F3C9A7] rounded-xl shadow p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">

                <div className="w-full sm:w-auto">
                  <h2 className="font-semibold text-lg text-gray-800 leading-tight">
                    {item.name}
                  </h2>
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded inline-block mt-1 mb-2">
                    Stock: {item.stockQuantity} u.
                  </span>
                  <div className="flex justify-between sm:block w-full">
                    <p className="text-gray-500 text-sm">Unitario: ${item.price?.toFixed(2)}</p>
                    <p className="text-gray-800 font-bold text-sm mt-0.5">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 flex items-center justify-center border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-600 transition-colors"
                      onClick={() => updateQuantity(item.sku, -1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="font-semibold w-6 text-center text-lg text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 transition-colors"
                      onClick={() => updateQuantity(item.sku, 1)}
                      disabled={item.quantity >= item.stockQuantity}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="px-4 py-1.5 rounded-lg border text-sm hover:bg-red-50 text-red-600 border-red-200 ml-2 font-medium transition-colors"
                    onClick={() => removeItem(item.sku)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-[#F3C9A7] rounded-xl shadow p-6 h-fit sticky top-20">
          <h2 className="font-semibold text-xl mb-4 text-gray-800">Resumen</h2>

          <div className="flex justify-between items-center mb-2 text-gray-600">
            <span>Items:</span>
            <strong>{cart.reduce((a, c) => a + c.quantity, 0)}</strong>
          </div>

          <div className="flex justify-between items-center text-lg text-gray-900 border-t border-gray-200 pt-4 mt-2">
            <span>Total:</span>
            <strong className="text-2xl">${total.toFixed(2)}</strong>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isSubmitting || cart.length === 0}
            className="mt-6 w-full py-3 rounded-xl text-black font-bold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            style={{ backgroundColor: ORANGE }}
          >
            {isSubmitting ? 'Procesando...' : 'Finalizar Compra'}
          </button>
        </div>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default CartPage;