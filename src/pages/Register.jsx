// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useRegisterMutation } from '../features/auth/authApiSlice';
// import { setCredentials } from '../features/auth/authSlice';
// import { selectCurrentUser } from '../features/auth/authSlice';
// import { Eye, EyeOff } from 'lucide-react';

// export default function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [errMsg, setErrMsg] = useState('');

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [register, { isLoading }] = useRegisterMutation();
//   const user = useSelector(selectCurrentUser);

//   useEffect(() => {
//     if (user) {
//       navigate('/dashboard');
//     }
//   }, [user, navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userData = await register({ name, email, password }).unwrap();
//       console.log("user data :",userData)
//       dispatch(setCredentials({ userInfo: userData, token: userData.token }));
//       navigate('/dashboard');
//     } catch (err) {
//       if (!err.status) {
//         setErrMsg('No Server Response');
//       } else if (err.status === 400) {
//         setErrMsg('User with this email already exists');
//       } else {
//         setErrMsg('Registration Failed');
//       }
//     }
//   };

//   return (
//     <div className="flex-1  flex items-center justify-center bg-gray-100">
//       <Card className="mx-auto max-w-sm w-full shadow-lg">
//         <CardHeader>
//           <CardTitle className="text-xl text-center pb-2">Sign Up</CardTitle>
//           <CardDescription className="text-gray-400">Enter your information to create an account</CardDescription>
//           {errMsg && <p className="mt-2 text-sm font-medium text-red-600">{errMsg}</p>}
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="grid gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
//               </div>
//               <div className="grid gap-2 relative">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700"
//                   aria-label="Toggle password visibility"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-violet-500 hover:to-blue-500 transition-all duration-300 ease-in-out"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Creating Account...' : 'Create an account'}
//               </Button>
//             </div>
//           </form>
//           <div className="mt-4 text-center text-sm">
//             Already have an account?{' '}
//             <Link to="/login" className="underline font-semibold text-blue-700">
//               Sign in
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "../features/auth/authApiSlice";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This now just calls the register endpoint
      await register({ name, email, password }).unwrap();

      // On success, show a toast and redirect to the verification page
      toast.success(
        "Registration successful! Please check your email for a verification code."
      );
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      const message = err?.data?.message || "Registration Failed";
      setErrMsg(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="mx-auto max-w-sm w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center pb-2">Sign Up</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your information to create an account
          </CardDescription>
          {errMsg && (
            <p className="mt-2 text-sm font-medium text-red-600">{errMsg}</p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-violet-500 hover:to-blue-500 transition-all duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create an account"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline font-semibold text-blue-700">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
