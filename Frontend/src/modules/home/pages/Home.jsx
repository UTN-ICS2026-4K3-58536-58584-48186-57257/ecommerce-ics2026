import Card from '../../shared/components/Card';
import { useAdminProducts } from '../../products/hook/useAdminProducts';
import { useOrders } from '../../orders/hook/useOrders';

function Home() {
  const { totalItems: totalProducts, loading: loadingProducts } = useAdminProducts();
  const { totalItems: totalOrders, loading: loadingOrders } = useOrders();

  return (
    <div className="flex flex-col gap-6 w-full">

      <Card className="p-6 border border-(--color-brand-primary) shadow-sm rounded-xl bg-white">
        <h2 className="text-2xl font-semibold text-(--color-text-main) mb-3">
          Productos
        </h2>
        <div className="flex items-center gap-2 text-base">
          <span>Cantidad total:</span>

          {loadingProducts ? (
            <span className="bg-gray-200 h-6 w-10 rounded"></span>
          ) : (
            <span className="font-bold text-(--color-text-main)">
              {totalProducts}
            </span>
          )}
        </div>
      </Card>

      <Card className="p-6 border border-(--color-brand-primary) shadow-sm rounded-xl bg-white">
        <h2 className="text-2xl font-semibold text-(--color-text-main) mb-3">
          Órdenes
        </h2>
        <div className="flex items-center gap-2 text-base">
          <span>Cantidad total:</span>

          {loadingOrders ? (
            <span className="bg-gray-200 h-6 w-10 rounded"></span>
          ) : (
            <span className="font-bold text-(--color-text-main)">
              {totalOrders}
            </span>
          )}
        </div>
      </Card>

    </div>
  );
}

export default Home;
