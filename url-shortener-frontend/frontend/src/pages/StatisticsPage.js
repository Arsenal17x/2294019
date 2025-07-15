import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const StatisticsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // NOTE: Replace with your actual backend statistics endpoint
        const API_URL = 'http://your-backend-api.com/api/stats';
        const response = await axios.get(API_URL);
        setStats(response.data);
      } catch (err) {
        const errorMsg = "Could not load statistics.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
  if (error) return <Typography color="error" align="center" sx={{ mt: 5 }}>{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>URL Statistics</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="statistics table">
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Original URL</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Created</TableCell>
              <TableCell align="right">Clicks</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.shortUrl}>
                <TableCell component="th" scope="row">
                  <a href={`http://localhost:3000/${stat.shortUrl.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
                    {stat.shortUrl}
                  </a>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, wordBreak: 'break-all' }}>{stat.originalUrl}</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{new Date(stat.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">{stat.clickCount}</TableCell>
                <TableCell>
                  <Accordion elevation={0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0 }}>
                      <Typography variant="body2">View Clicks</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {stat.clickDetails.length > 0 ? (
                        stat.clickDetails.map((click, index) => (
                          <Box key={index} sx={{ borderBottom: 1, borderColor: 'divider', pb: 1, mb: 1 }}>
                            <Typography variant="caption">
                              <b>Time:</b> {new Date(click.timestamp).toLocaleString()}<br />
                              <b>Location:</b> {click.location}<br />
                              <b>Source:</b> {click.source}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="caption">No click data available.</Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StatisticsPage;