import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { signin } = useAuth();

  const onValid = async (formData) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const { error, userInfo } = await signin(formData.username, formData.password);

      setLoading(false);

      if (error) {
        const backendMsg = error.message;

        setErrorMessage(frontendErrorMessage[backendMsg] || 'Usuario o contraseña incorrectos');

        return;
      }

      if (!userInfo || userInfo.role !== 'admin') {
        setErrorMessage('No tienes permisos para ingresar al panel de administración.');

        return;
      }

      if (onSuccess) onSuccess();
      else navigate('/admin');

    } catch (error) {
      setLoading(false);

      const backendMsg = error?.response?.data?.message;

      if (backendMsg && frontendErrorMessage[backendMsg]) {
        setErrorMessage(frontendErrorMessage[backendMsg]);
      } else {
        setErrorMessage('Error de conexión. Intente más tarde.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="
        flex flex-col gap-5
        bg-white/80 backdrop-blur-xl
        border border-(--color-brand-primary)
        px-6 py-8 sm:px-10 sm:py-10
        w-full
        rounded-2xl shadow-xl
        transition-all
      "
    >

      <div className="flex flex-col justify-center items-center mb-2">
        <div
          className="
            w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center
            shadow-md mb-2 transition-transform hover:scale-105
            bg-(--color-brand-primary)
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:w-9 sm:h-9"
          >
            <path d="M12 3 4 7l8 4 8-4-8-4Z" />
            <path d="M4 7v6l8 4 8-4V7" />
            <path d="M12 3v8" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Blow</h1>
        <p className="text-gray-500 text-xs sm:text-sm font-medium">Panel de administración</p>
      </div>

      <div className="flex flex-col gap-4">

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wide">
            Usuario
          </label>
          <input
            className="
              w-full border border-gray-300 px-4 py-2.5 rounded-lg
              focus:outline-none
              focus:border-(--color-brand-primary)
              focus:ring-(--color-brand-primary)/20
              transition-all
              bg-white/60 text-sm sm:text-base
            "
            {...register('username', { required: 'Usuario es obligatorio' })}
          />
          {errors.username && (
            <span className="text-red-500 text-xs mt-1 font-medium block">
              {errors.username.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wide">
            Contraseña
          </label>
          <input
            type="password"
            className="
              w-full border border-gray-300 px-4 py-2.5 rounded-lg
              focus:outline-none
              focus:border-(--color-brand-primary)
              focus:ring-(--color-brand-primary)/20
              transition-all
              bg-white/60 text-sm sm:text-base
            "
            {...register('password', { required: 'Contraseña es obligatoria' })}
          />
          {errors.password && (
            <span className="text-red-500 text-xs mt-1 font-medium block">
              {errors.password.message}
            </span>
          )}
        </div>

      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-xs sm:text-sm p-3 rounded-lg text-center font-medium">
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-1">
        <Button
          type="submit"
          className="
            w-full py-3 text-sm sm:text-base font-bold shadow-md hover:shadow-lg
            transition-all active:scale-[0.98]
            bg-[--color-brand-primary]
            hover:bg-[--color-brand-secondary]
            text-[--color-text-main]
          "
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>

        <div className="relative flex py-2 items-center">
          <div className="grow border-t border-gray-200"></div>
          <span className="shrink-0 mx-4 text-gray-400 text-xs font-medium">O</span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/signup')}
          type="button"
          className="
            w-full py-2.5
            border-2 border-(--color-brand-primary)
            text-gray-700 bg-transparent
            hover:bg-(--color-brand-primary)/10
            font-semibold text-sm sm:text-base transition-colors
          "
        >
          Registrar Usuario
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
