import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminProducts } from '../hook/useAdminProducts';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Pagination from '../../shared/components/Pagination';
import StatusBadge from '../../shared/components/StatusBadge';

export default function ListProductsPage() {
  const navigate = useNavigate();
  const { products, loading, filters, setPage, setStatus, setSearch, totalPages } = useAdminProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchTerm);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-main)]">Productos</h1>
        <Button
          onClick={() => navigate('create')}
          className="bg-[#F3C9A7] hover:bg-[#E8B18F] text-white border-none shadow-sm px-4 py-2 text-sm font-bold"
        >
          Crear producto
        </Button>
      </div>

      <Card className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">

          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
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
            <option value="all">Todos</option>
            <option value="enabled">Activos</option>
            <option value="disabled">Inactivos</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Cargando inventario...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">No se encontraron productos.</p>
        </div>
      ) : (
        <>

          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3 relative">

                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg truncate">{p.name}</h3>
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {p.sku}
                    </span>
                  </div>
                  <StatusBadge status={p.isActive} />
                </div>

                <hr className="border-gray-100" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs block uppercase font-bold">Precio</span>
                    <span className="text-gray-900 font-bold text-base">${p.currentUnitPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 text-xs block uppercase font-bold">Stock</span>
                    <span className={`font-medium ${p.stockQuantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                      {p.stockQuantity} u.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`${p.id}`)}
                  className="w-full mt-2 py-2.5 rounded-lg bg-gray-50 text-gray-700 font-medium text-sm hover:bg-gray-100 border border-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Ver Detalle
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 font-mono">{p.sku}</td>
                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                    <td className="p-4 text-sm font-bold text-gray-700">${p.currentUnitPrice}</td>
                    <td className={`p-4 text-sm font-medium ${p.stockQuantity === 0 ? 'text-red-500' : 'text-gray-600'}`}>
                      {p.stockQuantity}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={p.isActive} />
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        onClick={() => navigate(`${p.id}`)}
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
