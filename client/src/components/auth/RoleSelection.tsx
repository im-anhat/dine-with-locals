import { useStep } from '../../hooks/auth/useStep';
import { Button } from '../ui/button';
import { GoogleLogin } from '@react-oauth/google';
import { useLogin } from '@/hooks/auth/useLogin';

interface RoleSelectionProps {
  setRole: (role: 'Host' | 'Guest') => void;
}

function RoleSelection({ setRole }: RoleSelectionProps) {
  const { goNext } = useStep();
  const { handleGoogleAuth } = useLogin();
  const onSuccess = async (response: any) => {
    if (response.credential) {
      await handleGoogleAuth(response.credential);
    } else {
      console.log('No credential returned from Google');
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-10 text-center">
          Choose Your Role
        </h1>
        <div className="flex gap-6 justify-start">
          <button
            onClick={() => {
              setRole('Host');
              goNext();
            }}
            className="w-36 py-4 bg-brand-coral-300 text-white text-xl rounded-full shadow-md hover:bg-brand-coral-400 transition"
          >
            Host
          </button>
          <button
            onClick={() => {
              setRole('Guest');
              goNext();
            }}
            className="w-36 py-4 bg-brand-coral-300 text-white text-xl rounded-full shadow-md hover:bg-brand-coral-400 transition"
          >
            Guest
          </button>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <div className="my-2 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <div>
            <GoogleLogin
              onSuccess={onSuccess}
              onError={() => {
                console.log('failed');
              }}
            ></GoogleLogin>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
