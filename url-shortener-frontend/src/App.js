// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import URLShortenerPage from './pages/URLShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shorty
          </Typography>
          <Box>
            <Button color="inherit" component={NavLink} to="/">Shortener</Button>
            <Button color="inherit" component={NavLink} to="/statistics">Statistics</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<URLShortenerPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/:shortCode" element={<RedirectPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;