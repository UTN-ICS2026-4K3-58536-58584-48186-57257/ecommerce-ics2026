import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instance as api } from '../../shared/api/axiosInstance';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${id}`);

        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el producto. Tal vez no existe.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <span className="animate-pulse text-xl text-gray-500">Cargando...</span>
      </div>
    );

  if (error || !product)
    return (
      <div className="text-center mt-20">
        <p className="text-red-500 text-xl mb-4">{error || 'Producto no encontrado'}</p>
        <Button onClick={() => navigate('/admin/products')}>Volver al listado</Button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-8">

      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-gray-500 hover:text-(--color-brand-secondary) transition-colors flex items-center gap-2"
        >
          Volver al listado
        </button>
      </div>

      <Card className="p-8 border border-gray-200 rounded-xl shadow-sm bg-white">

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-(--color-text-main) tracking-tight">
              {product.name}
            </h1>
            <span className="text-sm text-gray-400">ID: {product.id}</span>
          </div>

          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
            product.isActive
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {product.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>

        <hr className="border-gray-100 mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">

          <div>
            <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider">SKU</span>
            <p className="text-(--color-text-main) font-mono">{product.sku}</p>
          </div>

          <div>
            <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider">Código Interno</span>
            <p className="text-(--color-text-main) font-mono">{product.internalCode || '-'}</p>
          </div>

          <div className="sm:col-span-2">
            <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider">Descripción</span>
            <p className="text-gray-700 mt-1 leading-relaxed">
              {product.description || 'Sin descripción disponible.'}
            </p>
          </div>

          <div>
            <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider">Precio Unitario</span>
            <p className="text-2xl font-bold text-black">
              ${product.currentUnitPrice?.toFixed(2)}
            </p>
          </div>

          <div>
            <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider">Stock Disponible</span>
            <p className="text-2xl font-bold text-gray-800">
              {product.stockQuantity} <span className="text-sm font-normal text-gray-500">unidades</span>
            </p>
          </div>

        </div>
      </Card>
    </div>
  );
}

export default ProductDetailPage;