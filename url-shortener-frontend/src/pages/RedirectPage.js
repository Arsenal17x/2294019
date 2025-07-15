// src/pages/RedirectPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Log } from '../logging-middleware/logger';
import { Typography, CircularProgress, Container, Box } from '@mui/material';

const RedirectPage = () => {
    const { shortCode } = useParams();
    const [message, setMessage] = useState('Redirecting...');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (shortCode) {
            const performRedirect = async () => {
                Log("frontend", "info", "page", `Redirect attempt for code: ${shortCode}`);
                try {
                    // NOTE: Replace with your actual backend redirect endpoint
                    const API_URL = `http://your-backend-api.com/api/${shortCode}`;
                    const response = await axios.get(API_URL);
                    const { longUrl } = response.data;

                    if (longUrl) {
                        Log("frontend", "info", "page", `Success. Redirecting to: ${longUrl}`);
                        window.location.href = longUrl;
                    } else {
                        throw new Error("API did not return a longUrl.");
                    }
                } catch (err) {
                    const errorMsg = "This short link is invalid or has expired.";
                    Log("frontend", "error", "api", `Redirect failed for ${shortCode}: ${err.message}`);
                    setMessage(errorMsg);
                    setIsError(true);
                }
            };
            performRedirect();
        }
    }, [shortCode]);

    return (
        <Container>
            <Box sx={{ textAlign: 'center', mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {!isError && <CircularProgress />}
                <Typography variant="h5" color={isError ? "error" : "textPrimary"}>
                    {message}
                </Typography>
            </Box>
        </Container>
    );
};

export default RedirectPage;