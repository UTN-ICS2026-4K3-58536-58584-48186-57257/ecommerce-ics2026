const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Processing: 'bg-orange-100 text-orange-800 border-orange-200',
  Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
  Delivered: 'bg-green-100 text-green-800 border-green-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',

  Active: 'bg-green-100 text-green-700 border-green-200',
  Inactive: 'bg-red-100 text-red-700 border-red-200',
  true: 'bg-green-100 text-green-700 border-green-200',
  false: 'bg-red-100 text-red-700 border-red-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusLabels = {
  true: 'Activo',
  false: 'Inactivo',
  Pending: 'Pendiente',
  Processing: 'En Proceso',
  Shipped: 'Enviado',
  Delivered: 'Entregado',
  Cancelled: 'Cancelado',
};

function StatusBadge({ status }) {
  const key = String(status);

  const style = statusStyles[key] || statusStyles[status] || statusStyles.default;
  const label = statusLabels[key] || status;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {label}
    </span>
  );
}

export default StatusBadge;