import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GitHub } from '@mui/icons-material';
import { useLogin } from '../../context/auth/useLogin';
import { useAuth } from '../../context/auth';
import { useLogout } from '../../context/auth/useLogout';
import { Backdrop, CircularProgress, Divider } from '@mui/material';

import './style.css';
import Appbar from '../components/Appbar';

export default function Login({children}: any) {
    const { state } = useAuth();
    const { login, isPending } = useLogin();
    const { logout } = useLogout();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    return (
        <React.Fragment>
            {/* <CssBaseline /> */}
            <React.Fragment>
                {
                    state.authIsReady
                        ? state.user
                            ? <ProfileCard user={state.user} />
                            : <React.Fragment>
                                <Container maxWidth="lg">
                                    <Grid container>
                                        <Grid item md={3}></Grid>
                                        <Grid item md={6}
                                            sx={{
                                                border: "solid thin #ddd",
                                                borderRadius: "12px",
                                            }}>
                                            <Box p={2} sx={{
                                                minHeight: "30vh",
                                                textAlign: "center",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexDirection: "column"
                                            }}>
                                                <Typography variant="h5">Faça login em PLETES com o Github</Typography>
                                                <Typography variant="body1">Plataforma de Ensino de Testes</Typography>
                                            </Box>
                                            <Divider />
                                            <Box p={2}>
                                                <Button
                                                    fullWidth
                                                    disableElevation
                                                    size="large"
                                                    variant="contained"
                                                    sx={{ mt: 3, mb: 2, bgcolor: "black" }}
                                                    startIcon={<GitHub />}
                                                    onClick={login}
                                                >
                                                    Continuar com Github
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Container>
                            </React.Fragment>
                        : (<React.Fragment>
                            <Backdrop open={isPending}>
                                <CircularProgress />
                            </Backdrop>
                        </React.Fragment>)
                }
                {/* <pre>
                    {JSON.stringify(state, null, 4)}
                </pre> */}

                {/* <Button onClick={logout}>
                    Sair do app
                </Button> */}
            </React.Fragment>
        </React.Fragment>
    );
}

const ProfileCard = ({ user }: any) => {
    const { logout } = useLogout();
    return (
        <>
            <div className="profile-card">
                <img className="profile-img" src={user.photoURL} alt="" />
                <p>
                    Name: <span>{user.displayName}</span>
                </p>
                <p>
                    Username: <span>{user.reloadUserInfo.screenName}</span>
                </p>
                <p>
                    Email: <span>{user.email}</span>
                </p>
                <p>
                    User ID: <span>{user.uid}</span>
                </p>
            </div>
            <button className="btn" onClick={logout}>
                Log Out
            </button>
        </>
    );
};
