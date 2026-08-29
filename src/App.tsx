import { useEffect } from 'react';
import AppRouter from './routes/AppRouter';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { authApi } from './features/auth/authApi';
import { setCredentials, logout } from './features/auth/authSlice';

function App() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(authApi.endpoints.getMe.initiate())
        .unwrap()
        .then((me) => {
          dispatch(setCredentials({ accessToken, user: me }));
        })
        .catch(() => {
          dispatch(logout());
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AppRouter />;
}

export default App;