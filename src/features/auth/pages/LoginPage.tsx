import { authApi, useLoginMutation, useRegisterMutation } from '../authApi';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../authSlice';

const loginSchema = z.object({
  universityEmail: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  universityEmail: z.string().trim().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().trim().min(1, 'Full name is required'),
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function Component() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();
  const [register, { isLoading: isRegistering, error: registerError }] = useRegisterMutation();

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { universityEmail: '', password: '' },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { universityEmail: '', password: '', fullName: '' },
  });

    const onLogin = async (values: LoginValues) => {
      try {
        const result = await login(values).unwrap();
        // Temporarily store the token so the next request can use it
        dispatch(setCredentials({ accessToken: result.accessToken, user: null }));
        const me = await dispatch(authApi.endpoints.getMe.initiate()).unwrap();
        dispatch(setCredentials({ accessToken: result.accessToken, user: me }));
        navigate('/');
      } catch {
        // error shown via loginError below
      }
    };

  const onRegister = async (values: RegisterValues) => {
    try {
      await register({ ...values, role: 'BUYER' }).unwrap();
      setTab('login');
      loginForm.reset({ universityEmail: values.universityEmail, password: '' });
    } catch {
      // error shown via registerError below
    }
  };

  return (
    <Container className="py-8" maxWidth="sm">
      <Typography variant="h4" component="h1" className="mb-6">
        Welcome to UniMart
      </Typography>

      <Tabs value={tab} onChange={(_e, value) => setTab(value)} className="mb-6">
        <Tab label="Log in" value="login" />
        <Tab label="Register" value="register" />
      </Tabs>

      {tab === 'login' && (
        <Box component="form" onSubmit={loginForm.handleSubmit(onLogin)} className="grid gap-4">
          {loginError && (
            <Alert severity="error">Invalid email or password. Please try again.</Alert>
          )}
          <TextField
            label="University Email"
            error={!!loginForm.formState.errors.universityEmail}
            helperText={loginForm.formState.errors.universityEmail?.message}
            {...loginForm.register('universityEmail')}
          />
          <TextField
            label="Password"
            type="password"
            error={!!loginForm.formState.errors.password}
            helperText={loginForm.formState.errors.password?.message}
            {...loginForm.register('password')}
          />
          <Button type="submit" variant="contained" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Log in'}
          </Button>
        </Box>
      )}

      {tab === 'register' && (
        <Box component="form" onSubmit={registerForm.handleSubmit(onRegister)} className="grid gap-4">
          {registerError && (
            <Alert severity="error">
              Registration failed. This email may already be in use.
            </Alert>
          )}
          <TextField
            label="Full Name"
            error={!!registerForm.formState.errors.fullName}
            helperText={registerForm.formState.errors.fullName?.message}
            {...registerForm.register('fullName')}
          />
          <TextField
            label="University Email"
            error={!!registerForm.formState.errors.universityEmail}
            helperText={registerForm.formState.errors.universityEmail?.message}
            {...registerForm.register('universityEmail')}
          />
          <TextField
            label="Password"
            type="password"
            error={!!registerForm.formState.errors.password}
            helperText={registerForm.formState.errors.password?.message}
            {...registerForm.register('password')}
          />
          <Button type="submit" variant="contained" disabled={isRegistering}>
            {isRegistering ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      )}
    </Container>
  );
}