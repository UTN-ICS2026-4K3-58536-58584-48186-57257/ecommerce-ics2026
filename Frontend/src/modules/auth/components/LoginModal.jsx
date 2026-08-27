import { useForm } from 'react-hook-form';
import Modal from '../../shared/components/Modal';
import useAuth from '../hook/useAuth';
import { useState } from 'react';

const ORANGE = '#F3C9A7';

export default function LoginModal({ onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin } = useAuth();
  const [msg, setMsg] = useState('');

  const onValid = async (data) => {
    const res = await signin(data.username, data.password);

    if (res?.error) {
      setMsg(res.error.frontendErrorMessage || 'Nombre de usuario o contraseña incorrectos');

      return;
    }

    if (onSuccess) {
      onSuccess();
    } else {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shadow"
          style={{ backgroundColor: ORANGE }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 4 7l8 4 8-4-8-4Z" />
            <path d="M4 7v6l8 4 8-4V7" />
            <path d="M12 3v8" />
          </svg>
        </div>

        <h2 className="text-xl font-semibold mt-2">Iniciar Sesión</h2>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onValid)}>
        <div>
          <input
            className="w-full border px-3 py-2 rounded-md"
            placeholder='Usuario'
            {...register('username', { required: 'El usuario es necesario para iniciar sesión' })}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

        </div>

        <div>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded-md"
            placeholder='Contraseña'
            {...register('password', { required: 'Debes ingresar tu contraseña para continuar' })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {msg && <p className="text-red-500 text-sm">{msg}</p>}

        <button
          className="w-full py-2 rounded-md mt-2 text-black font-medium"
          style={{ backgroundColor: ORANGE }}
        >
          Iniciar Sesión
        </button>
      </form>
    </Modal>
  );
}