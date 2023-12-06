// FileUploadComponent.jsx
import React, { useState } from 'react';
import { Button, LinearProgress, Typography, Box } from '@mui/material';
import axios from 'axios';
import { FileUpload } from '@mui/icons-material';

const FileUploadComponent = () => {
    const [file, setFile] = useState<any>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('YOUR_UPLOAD_ENDPOINT', formData, {
                onUploadProgress: (progressEvent: any) => {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    setUploadProgress(progress);
                },
            });

            console.log('File uploaded successfully', response.data);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            m={3}
            p={2}
            sx={{
                border: "dashed thin blue"
            }}>
            <FileUpload />
            <Typography variant="h5" mb={2}>
                Envio do projeto
            </Typography>
            <Typography variant="body1">Enviei o projeto Mavem comprimido em formato RAR</Typography>
            <input
                type="file"
                accept=".rar"
                style={{ display: 'none' }}
                id="file-upload"
                onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
                <Button variant="outlined" component="span"
                    sx={{
                        mt: 3
                    }}>
                    Selecionar arquivo
                </Button>
            </label>
            {file && (
                <Typography variant="body1" mt={1}>
                    Selected file: {file.name}
                </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!file}
                style={{ marginTop: '16px' }}  // Adjust the margin as needed
            >
                Submeter projeto
            </Button>
            {uploadProgress > 0 && (
                <Box width="100%" mt={2}>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
            )}
        </Box>
    );
};

export default FileUploadComponent;
