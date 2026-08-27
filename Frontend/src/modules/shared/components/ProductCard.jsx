import { useState } from 'react';

const ORANGE = '#F3C9A7';

const ProductImagePlaceholder = () => (
  <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-300 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  </div>
);

export default function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  const maxStock = product.stockQuantity || 0;
  const isOutOfStock = maxStock === 0;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAdd = () => {
    if (isOutOfStock) return;

    onAdd(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between h-full">
      <div>
        <ProductImagePlaceholder />
        <h3 className="font-semibold text-lg text-gray-800 truncate" title={product.name}>
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 h-10 mt-1">
          {product.description || 'Sin descripción'}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-gray-900">
            ${product.currentUnitPrice?.toFixed(2)}
          </span>
          <span className={`text-xs font-medium ${isOutOfStock ? 'text-red-500' : 'text-gray-400'}`}>
            {isOutOfStock ? 'Sin Stock' : `Stock: ${product.stockQuantity}`}
          </span>
        </div>

        <div className="flex gap-2">
          <div className={`flex items-center border border-gray-200 rounded-lg bg-gray-50 h-10 ${isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="px-3 h-full text-gray-500 hover:text-orange-600 hover:bg-gray-100 rounded-l-lg transition-colors font-bold text-lg leading-none disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= maxStock}
              className="px-3 h-full text-gray-500 hover:text-orange-600 hover:bg-gray-100 rounded-r-lg transition-colors font-bold text-lg leading-none disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all text-black shadow-sm flex justify-center items-center gap-2 
              ${isOutOfStock
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
      : 'hover:opacity-90 active:scale-95'
    }`}
            style={!isOutOfStock ? { backgroundColor: ORANGE } : {}}
          >
            {isOutOfStock ? 'Agotado' : 'Agregar'}
            {!isOutOfStock }
          </button>
        </div>
      </div>
    </div>
  );
}