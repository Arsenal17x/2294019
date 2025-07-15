import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, CircularProgress, Link as MuiLink } from '@mui/material';
import { Log } from '../logging-middleware/logger'; // Import your Log function
import axios from 'axios';
const URLShortenerPage = () => {
    const [inputs, setInputs] = useState([{ longUrl: '', customCode: '', validity: '' }]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        Log("frontend", "info", "page", "User landed on the URL Shortener page.");
    }, []);
    const handleInputChange = (index, field, value) => {
        const newInputs = [...inputs];
        newInputs[index][field] = value;
        setInputs(newInputs);
    };
    const addUrlInput = () => {
        if (inputs.length < 5) {
            setInputs([...inputs, { longUrl: '', customCode: '', validity: '' }]);
            Log("frontend", "info", "component", "User clicked 'Add another URL' button.");
        }
    };
    const validateUrl = (url) => {
        try {
            new URL(url);
            // A simple regex to ensure it has a domain.
            return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(url);
        } catch (_) {
            return false;
        }
    };
    const handleSubmit = async () => {
        setError('');
        setResults([]);
        Log("frontend", "info", "component", "User clicked 'Shorten URLs' button.");
        for (const input of inputs) {
            if (!input.longUrl || !validateUrl(input.longUrl)) {
                const msg = `Validation failed for URL: ${input.longUrl || 'empty'}`;
                Log("frontend", "warn", "validation", msg);
                setError("One or more URLs are invalid. Please check your inputs.");
                return;
            }
        }

        setLoading(true);
        try {
            // NOTE: Replace with your actual backend URL shortener endpoint
            const API_URL = 'http://your-backend-api.com/api/shorten';

            const promises = inputs.map(input => {
                const payload = {
                    longUrl: input.longUrl,
                    // Only include optional fields if they have a value
                    ...(input.customCode && { shortCode: input.customCode }),
                    ...(input.validity && { validity: parseInt(input.validity, 10) }),
                };
                Log("frontend", "info", "api", `Sending request for ${input.longUrl}`);
                return axios.post(API_URL, payload);
            });

            const responses = await Promise.all(promises);
            const newResults = responses.map(res => res.data);
            setResults(newResults);
            Log("frontend", "info", "api", "Successfully created all short links.");

        } catch (err) {
            const errorMsg = err.response?.data?.message || "An unexpected error occurred.";
            Log("frontend", "error", "api", `API Error: ${errorMsg}`);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>URL Shortener</Typography>
            <Paper elevation={3} sx={{ p: 3 }}>
                {inputs.map((input, index) => (
                    <Box key={index} sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <TextField fullWidth sx={{ flex: '2 1 300px' }} label="Original Long URL *" variant="outlined" value={input.longUrl} onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)} />
                        <TextField sx={{ flex: '1 1 150px' }} label="Custom Code" variant="outlined" value={input.customCode} onChange={(e) => handleInputChange(index, 'customCode', e.target.value)} />
                        <TextField sx={{ flex: '1 1 150px' }} label="Validity (mins)" type="number" variant="outlined" value={input.validity} onChange={(e) => handleInputChange(index, 'validity', e.target.value)} />
                    </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading || !inputs[0].longUrl}>
                        {loading ? <CircularProgress size={24} /> : 'Shorten URLs'}
                    </Button>
                    {inputs.length < 5 && <Button variant="text" onClick={addUrlInput}>Add another URL</Button>}
                </Box>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            </Paper>
            {results.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h5" component="h2" gutterBottom>Your Links</Typography>
                    {results.map((result, index) => (
                        <Paper key={index} elevation={2} sx={{ p: 2, mt: 1 }}>
                            <Typography sx={{ wordBreak: 'break-all' }}><b>Original:</b> {result.originalUrl}</Typography>
                            <Typography><b>Short Link:</b> <MuiLink href={result.shortUrl} target="_blank" rel="noopener noreferrer">{result.shortUrl}</MuiLink></Typography>
                            <Typography><b>Expires At:</b> {new Date(result.expiresAt).toLocaleString()}</Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default URLShortenerPage;