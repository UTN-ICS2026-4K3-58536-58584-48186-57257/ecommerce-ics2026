import { useProducts } from '../hook/useProducts';
import { useCart } from '../hook/useCart';
import ProductCard from '../../shared/components/ProductCard';
import Pagination from '../../shared/components/Pagination';

export default function CustomerProductsPage() {

  const { addToCart } = useCart();

  const {
    products,
    loading,
    totalPages,
    filters,
    setPage,
  } = useProducts();

  return (
    <div className="min-h-screen bg-neutral-100 pb-10">
      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-pulse text-xl text-gray-500">
              Cargando catálogo...
            </span>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} onAdd={addToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 text-lg">
                No se encontraron productos.
              </div>
            )}

            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
