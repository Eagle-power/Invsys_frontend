import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '../features/auth/authApiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user) {
      // console.log(user);
      navigate('/dashboard');
      toast.info(`${user.name} you are successfully logged In.`)
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ userInfo: userData, token: userData.token }));
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
        toast.info("Server is not connected.")
      } else if (err.status === 400) {
        setErrMsg('Missing Email or Password');
        toast.error("Missing Email or Password.");
      } else if (err.status === 401) {
        toast.error('Invalid email or password');
        setErrMsg('Invalid email or password');
      } else {
        setErrMsg('Login Failed');
        toast.error('Login Failed ! try again');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center  bg-gray-100">
      <Card className="mx-auto max-w-sm w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center pb-2">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
          {errMsg && <p className="mt-2 text-sm font-medium text-red-600">{errMsg}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-violet-500 hover:to-blue-500 
             transition-all duration-100 ease" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="underline text-blue-700 font-semibold">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
