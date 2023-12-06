import { Container, FormControl, Grid, Typography } from "@mui/material";
import FileUploadComponent from "./FileUploadComponent";

export default function Project() {
    return(
        <>
            <Container>
                <Grid container>
                    <Grid item md={12}>
                        <Typography variant="h5">Submeter projeto base</Typography>
                    </Grid>
                    <Grid item md={12}>
                        <FileUploadComponent />
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}