import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/register';
import useAuth from '../hook/useAuth';

export default function SignupForm({ onSuccess, role = 'customer', enableRoleSelection = false }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { signin } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onValid = async (data) => {
    setLoading(true);
    setErrorMsg('');

    const roleToSend = enableRoleSelection ? data.role : role;

    const { error } = await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
      role: roleToSend,
    });

    if (error) {
      setLoading(false);
      const msg = error.response?.data?.message || 'Error al registrarse';

      setErrorMsg(msg);

      return;
    }

    await signin(data.username, data.password);
    setLoading(false);

    if (onSuccess) onSuccess();
  };

  const password = watch('password');
  const formTitle = enableRoleSelection || role === 'admin' ? 'Crear cuenta' : 'Crear Cuenta';

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="
        w-full max-w-md mx-auto
        bg-white/90 backdrop-blur-md
        border border-(--color-brand-primary)
        rounded-2xl shadow-xl
        px-6 py-8 sm:px-10 sm:py-10
        flex flex-col gap-5
      "
    >

      <div className="flex flex-col items-center mb-2">
        <div
          className="
            w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-md mb-3
            transition-transform hover:scale-105
            bg-(--color-brand-primary)
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
            viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" className="sm:w-9 sm:h-9"
          >
            <path d="M12 3 4 7l8 4 8-4-8-4Z" />
            <path d="M4 7v6l8 4 8-4V7" />
            <path d="M12 3v8" />
          </svg>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">{formTitle}</h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">Únete a Blow</p>
      </div>

      <div className="flex flex-col gap-4">

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wide">Usuario</label>
          <input
            className="
              w-full border border-gray-300 px-4 py-2.5 rounded-lg
              focus:outline-none focus:border-(--color-brand-primary)
              focus:ring-(--color-brand-primary)/20
              transition-all bg-white/60 text-sm sm:text-base
            "
            {...register('username', { required: 'Requerido', minLength: { value: 3, message: 'Mínimo 3 caracteres' } })}
          />
          {errors.username && <span className="text-red-500 text-xs mt-1 font-medium block">{errors.username.message}</span>}
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wide">Email</label>
          <input
            type="email"
            className="
              w-full border border-gray-300 px-4 py-2.5 rounded-lg
              focus:outline-none focus:border-(--color-brand-primary)
              focus:ring-(--color-brand-primary)/20
              transition-all bg-white/60 text-sm sm:text-base
            "
            {...register('email', {
              required: 'Requerido',
              pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' },
            })}
          />
          {errors.email && <span className="text-red-500 text-xs mt-1 font-medium block">{errors.email.message}</span>}
        </div>

        {enableRoleSelection && (
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wide">Rol</label>
            <select
              className="
                w-full border border-gray-300 px-4 py-2.5 rounded-lg
                focus:outline-none focus:border-(--color-brand-primary)
                focus:ring-(--color-brand-primary)/20
                transition-all bg-white/60 text-sm sm:text-base cursor-pointer
              "
              {...register('role', { required: 'Rol es requerido' })}
              defaultValue="admin"
            >
              <option value="admin">Administrador</option>
              <option value="customer">Cliente</option>
            </select>
          </div>
        )}

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wide">Contraseña</label>
          <input
            type="password"
            className="
              w-full border border-gray-300 px-4 py-2.5 rounded-lg
              focus:outline-none focus:border-(--color-brand-primary)
              focus:ring-(--color-brand-primary)/20
              transition-all bg-white/60 text-sm sm:text-base
            "
            {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
          />
          {errors.password && <span className="text-red-500 text-xs mt-1 font-medium block">{errors.password.message}</span>}
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block tracking-wide">Confirmar</label>
          <input
            type="password"
            className="
              w-full border border-gray-300 px-4 py-2.5 rounded-lg
              focus:outline-none focus:border-(--color-brand-primary)
              focus:ring-(--color-brand-primary)/20
              transition-all bg-white/60 text-sm sm:text-base
            "
            {...register('confirmPassword', {
              required: 'Requerido',
              validate: (val) => val === password || 'Las contraseñas no coinciden',
            })}
          />
          {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 font-medium block">{errors.confirmPassword.message}</span>}
        </div>

      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-xs sm:text-sm p-3 rounded-lg text-center font-medium">
          {errorMsg}
        </div>
      )}

      {/* Botón */}
      <button
        disabled={loading}
        className="
          w-full py-3 rounded-lg text-white text-sm sm:text-base font-bold
          shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-2
          bg-(--color-brand-primary) hover:bg-(--color-brand-secondary)
        "
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
}
