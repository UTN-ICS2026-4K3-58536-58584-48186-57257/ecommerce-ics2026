import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance as api } from '../../shared/api/axiosInstance';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/orders/${id}`);

        setOrder(response.data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la orden.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-gray-500 animate-pulse">Cargando orden...</div>;

  if (error || !order) return <div className="text-center mt-20 text-red-500 font-medium">{error || 'Orden no encontrada'}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      <div className="mb-6">
        <Button
          onClick={() => navigate('/admin/orders')}
          className="text-gray-500 hover:text-(--color-brand-secondary) transition-colors flex items-center gap-2 font-medium"
        >
          Volver al listado
        </Button>
      </div>

      <Card className="p-8 border border-gray-200 rounded-xl shadow-sm bg-white">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-6 mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text-main) tracking-tight">
              Orden #{order.id}
            </h1>
          </div>

          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
            order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
              order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
          }`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cliente</h3>
            <p className="text-lg font-semibold text-gray-800">{order.customerName}</p>
            <p className="text-gray-600 text-sm mt-1">
              <span className="font-medium">Envío:</span> {order.shippingAddress}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Facturación:</span> {order.billingAddress}
            </p>
          </div>
          <div className="md:text-right flex flex-col justify-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total a Pagar</h3>
            <p className="text-4xl font-bold text-black">
              ${order.totalAmount?.toFixed(2)}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-4">Detalles del pedido</h3>
        <div className="flex flex-col gap-4 sm:hidden">
          {order.items?.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-semibold text-gray-800">{item.productName ?? item.name}</p>

              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Cantidad:</span>
                <span className="font-medium">{item.quantity}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Unitario:</span>
                <span className="font-medium">${item.unitPrice?.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mt-2 text-base font-bold text-gray-900">
                <span>Subtotal:</span>
                <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-4 text-xs font-bold uppercase">Producto</th>
                <th className="p-4 text-xs font-bold uppercase text-right">Cant.</th>
                <th className="p-4 text-xs font-bold uppercase text-right">Precio Unit.</th>
                <th className="p-4 text-xs font-bold uppercase text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800 font-medium">
                    {item.productName ?? item.name}
                  </td>
                  <td className="p-4 text-gray-600 text-right">{item.quantity}</td>
                  <td className="p-4 text-gray-600 text-right">${item.unitPrice?.toFixed(2)}</td>
                  <td className="p-4 text-gray-900 font-bold text-right">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}