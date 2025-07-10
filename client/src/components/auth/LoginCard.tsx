import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useLogin } from '@/hooks/auth/useLogin';

interface LoginCardInterface {
  userName: string;
  setUserName: (userName: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isAuthenticated: boolean;
  submitLogin: (e: React.FormEvent<HTMLButtonElement>) => Promise<void>;
}
function LoginCard({
  userName,
  setUserName,
  password,
  setPassword,
  isAuthenticated,
  submitLogin,
}: LoginCardInterface) {
  const navigate = useNavigate();
  const { handleGoogleAuth } = useLogin();

  const onSuccess = async (response: any) => {
    if (response.credential) {
      await handleGoogleAuth(response.credential);
    } else {
      console.log('No credential returned from Google');
    }
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>
            <div className="text-2xl font-bold text-center">Login</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="username" className="font-medium">
              User Name
            </Label>
            <Input
              type="username"
              id="username"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="font-medium">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              placeholder="*********"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Button className="w-full" onClick={submitLogin}>
              Log in
            </Button>
          </div>

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
          <div className="text-center text-gray-400 ">
            Don't have an account?{' '}
            <span
              className="text-brand-coral-300 hover:text-brand-coral-100"
              onClick={() => navigate('/signup', { replace: true })}
            >
              Sign up
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default LoginCard;
