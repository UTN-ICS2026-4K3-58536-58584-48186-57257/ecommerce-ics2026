import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm';

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-(--color-bg-dashboard) flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border-white">

        <SignupForm onSuccess={handleSuccess} enableRoleSelection={true} />

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-(--color-text-main) hover:text-(--color-brand-primary) transition-colors"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}
