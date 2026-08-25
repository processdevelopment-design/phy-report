import { LoginForm } from '../components/auth/LoginForm';

interface LoginProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  errorMessage: string | null;
}

export function Login({ onSignIn, errorMessage }: LoginProps) {
  return <LoginForm onSubmit={onSignIn} errorMessage={errorMessage} />;
}
