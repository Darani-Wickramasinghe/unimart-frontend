import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

export function NavBar() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar className="gap-2">
        <Typography component={Link} to="/" variant="h6" className="flex-grow no-underline text-inherit">
          UniMart
        </Typography>
        {currentUser ? (
          <Box className="flex items-center gap-2">
            <Button component={Link} to="/listings/new">
              Sell an item
            </Button>
            <Button component={Link} to="/my/listings">
              My Listings
            </Button>
            <Typography variant="body2" className="mx-2">
              {currentUser.fullName}
            </Typography>
            <Button onClick={handleLogout} variant="outlined">
              Log out
            </Button>
          </Box>
        ) : (
          <Button component={Link} to="/login">
            Log in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}