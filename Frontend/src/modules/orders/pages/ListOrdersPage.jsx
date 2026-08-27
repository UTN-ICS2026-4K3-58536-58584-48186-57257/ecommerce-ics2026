import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hook/useOrders';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Pagination from '../../shared/components/Pagination';
import StatusBadge from '../../shared/components/StatusBadge';

export default function ListOrdersPage() {
  const navigate = useNavigate();
  const { orders, loading, filters, setPage, setStatus, setSearch, totalPages } = useOrders();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchTerm);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-(--color-text-main)">Órdenes</h1>
      </div>

      <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">

          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por cliente o ID..."
                className="w-full border border-gray-300 rounded-lg pl-4 pr-4 py-2.5 focus:outline-none focus:border-[#F3C9A7] focus:ring-1 focus:ring-[#F3C9A7] transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F3C9A7] hover:bg-[#E8B18F] text-white rounded-lg transition-colors flex items-center justify-center shadow-sm"
              title="Buscar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          <select
            className="border border-gray-300 rounded-lg px-4 py-2.5 bg-white text-sm text-gray-700 focus:outline-none focus:border-[#F3C9A7] w-full md:w-48 cursor-pointer"
            value={filters.status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="Pending">Pendiente</option>
            <option value="Processing">En Proceso</option>
            <option value="Shipped">Enviado</option>
            <option value="Delivered">Entregado</option>
            <option value="Cancelled">Cancelado</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Cargando órdenes...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No se encontraron órdenes.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3 relative">

                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                    Pedido #{order.id}
                  </span>

                  <StatusBadge status={order.status} />
                </div>

                <h3 className="font-bold text-gray-800 text-lg leading-tight mt-1">
                  {order.customerName}
                </h3>

                <hr className="border-gray-100 my-1" />

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-gray-900 font-bold text-base">
                      Total: ${order.totalAmount?.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`${order.id}`)}
                    className="px-4 py-2 rounded-lg bg-gray-50 text-gray-700 font-medium text-sm hover:bg-gray-100 border border-gray-200 transition-colors flex items-center gap-2"
                  >
                    Ver Detalles
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID Orden</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-mono text-xs">{order.id}</td>
                    <td className="p-4 font-medium text-gray-800">{order.customerName}</td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        onClick={() => navigate(`${order.id}`)}
                        className="px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}