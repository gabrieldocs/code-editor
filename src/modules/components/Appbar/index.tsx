import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { green } from '@mui/material/colors';
import { useAuth } from '../../../context/auth';
import { Avatar } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useLogout } from '../../../context/auth/useLogout';

export default function Appbar() {

  const { state } = useAuth();
  const { logout } = useLogout();


  return (
    <Box sx={{ flexGrow: 1 }} >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: 'black'
        }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Box>
              PLETest
            </Box>
          </Typography>
          {
            state.authIsReady
              ? state.user
                ? <React.Fragment>
                  <Box sx={{
                    display: "flex",
                    gap: "12px"
                  }}>
                    <Avatar src={state.user.photoURL} alt="" />
                    <Button variant="contained" onClick={logout} disableElevation startIcon={<ExitToApp />}>Sair</Button>
                  </Box>
                </React.Fragment>
                : <></>
              : <Button color="inherit">Login</Button>
          }

        </Toolbar>
      </AppBar>
    </Box>
  );
}