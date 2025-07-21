import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Toast from '@radix-ui/react-toast'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();
  const { refresh } = useAuth();

  const [open, setOpen]               = useState(false)
    const [toastTitle, setToastTitle]   = useState('')
    const [toastDesc, setToastDesc]     = useState('')
    const [toastVariant, setVariant]    = useState<'success'|'error'>('success')
  
    const showToast = (
      title: string,
      description: string,
      variant: 'success'|'error' = 'success'
    ) => {
      setToastTitle(title)
      setToastDesc(description)
      setVariant(variant)
      setOpen(true)
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      await refresh()  
      showToast('Success', 'Log In successfull!', 'success')
      setTimeout(() => {
         navigate('/dashboard')
      }, 1000)
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Card className="w-full max-w-xs">
          <CardHeader>
            <CardTitle className='text-xl'>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-600">{error}</p>}
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toast.Root
        className={`${
          toastVariant === 'success'
            ? 'border-green-500 bg-green-50'
            : 'border-red-500 bg-red-50'
        } border-l-4 p-4 rounded shadow-lg`}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="font-semibold">{toastTitle}</Toast.Title>
        <Toast.Description className="mt-1 text-sm">
          {toastDesc}
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 outline-none z-50" />
    </Toast.Provider>
  );
};

export default LoginForm;
