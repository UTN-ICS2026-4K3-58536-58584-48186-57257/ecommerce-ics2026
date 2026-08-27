import { useForm } from 'react-hook-form';
import Modal from '../../shared/components/Modal';
import { useState } from 'react';
import { registerUser } from '../services/register';

export default function RegisterModal({ onClose }) {
  const [msg, setMsg] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onValid = async (data) => {
    if (data.password !== data.confirm) {
      setMsg('Las contraseñas no coinciden');

      return;
    }

    const res = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      role: 'customer',
    });

    if (res?.error) {
      setMsg(res.error.frontendErrorMessage);

      return;
    }

    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center mb-4">
        <div
          className="
            w-14 h-14 rounded-xl flex items-center justify-center shadow
            bg-(--color-brand-primary)
          "
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

        <h2 className="text-xl font-semibold mt-2 text-(--color-text-main)">
          Unete a Blow
        </h2>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onValid)}>
        <div>
          <input
            className="
              w-full border px-3 py-2 rounded-md
              text-(--color-text-main)
              border-gray-300
            "
            placeholder="Usuario"
            {...register('username', { required: 'Este campo no puede quedar vacío' })}
          />
          {errors.username && (
            <p className="text-(--color-status-error) text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <input
            className="
              w-full border px-3 py-2 rounded-md
              text-(--color-text-main)
              border-gray-300
            "
            placeholder="Email"
            {...register('email', { required: 'Este campo no puede quedar vacío' })}
          />
          {errors.email && (
            <p className="text-(--color-status-error) text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            className="
              w-full border px-3 py-2 rounded-md
              text-(--color-text-main)
              border-gray-300
            "
            placeholder="Contraseña"
            {...register('password', { required: 'Este campo no puede quedar vacío' })}
          />
          {errors.password && (
            <p className="text-(--color-status-error) text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            className="
              w-full border px-3 py-2 rounded-md
              text-(--color-text-main)
              border-gray-300
            "
            placeholder="Confirmar contraseña"
            {...register('confirm', { required: true })}
          />
          {errors.confirm && (
            <p className="text-(--color-status-error) text-sm">
              Este campo no puede quedar vacío
            </p>
          )}
        </div>

        {msg && <p className="text-(--color-status-error) text-sm">{msg}</p>}

        <button
          className="
            w-full py-2 rounded-md mt-2
            font-medium text-white
            bg-(--color-brand-primary)
            hover:bg-(--color-brand-secondary)
            transition-all
          "
        >
          Registrarse
        </button>
      </form>
    </Modal>
  );
}
