import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import { createProduct } from '../services/create';
import { useState } from 'react';

function CreateProductForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      sku: '',
      internalCode: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
    },
  });

  const [errorBackendMessage, setErrorBackendMessage] = useState('');
  const navigate = useNavigate();

  const onValid = async (formData) => {
    setErrorBackendMessage('');

    const { error } = await createProduct(formData);

    if (error) {

      setErrorBackendMessage(error);

      return;
    }

    navigate('/admin/products');
  };

  return (
    <Card>
      <form className='flex flex-col gap-6 p-8 sm:gap-4' onSubmit={handleSubmit(onValid)}>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Nuevo Producto</h2>

        <Input
          label='SKU'
          error={errors.sku?.message}
          {...register('sku', { required: 'SKU es requerido' })}
        />

        <Input
          label='Código único'
          error={errors.internalCode?.message}
          {...register('internalCode', { required: 'Código es requerido' })}
        />

        <Input
          label='Nombre'
          error={errors.name?.message}
          {...register('name', { required: 'Nombre es requerido' })}
        />
        <Input
          label='Descripción'
          {...register('description')}
        />

        <Input
          label='Precio Unitario'
          error={errors.price?.message}
          type='number'
          {...register('price', {
            required: 'Precio es requerido',
            valueAsNumber: true,
            validate: (value) => value > 0 || 'El precio debe ser mayor a 0',
          })}
        />

        <Input
          label='Stock Inicial'
          error={errors.stock?.message}
          type='number'
          {...register('stock', {
            required: 'Stock es requerido',
            valueAsNumber: true,
            min: { value: 0, message: 'No puede ser negativo' },
          })}
        />

        <div className='sm:text-end pt-4'>
          <Button type='submit' className='w-full sm:w-fit'>
            Crear Producto
          </Button>
        </div>

        {errorBackendMessage && (
          <div className="p-3 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium text-center">
            {errorBackendMessage}
          </div>
        )}
      </form>
    </Card>
  );
};

export default CreateProductForm;