import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div
      className="
        flex flex-col justify-center items-center
        min-h-screen
        bg-(--color-bg-dashboard)
        relative
        overflow-hidden
        px-4
      "
    >

      <div className="z-10 w-full max-w-[380px]">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;