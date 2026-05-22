import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { ArrowLeft, Ghost, Home, AlertCircle } from 'lucide-react';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundImage: 'url("/Login.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Dark Overlay */}
            <Box 
                sx={{ 
                    position: 'absolute', 
                    inset: 0, 
                    bgcolor: 'rgba(15, 23, 42, 0.6)', 
                    backdropFilter: 'blur(8px)',
                    zIndex: 1
                }} 
            />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
                <Paper
                    elevation={24}
                    sx={{
                        p: { xs: 4, md: 8 },
                        borderRadius: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        textAlign: 'center',
                        color: 'white',
                        animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    {/* Animated Icon */}
                    <Box sx={{ mb: 4, position: 'relative', display: 'inline-block' }}>
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: '50%',
                                bgcolor: 'rgba(59, 130, 246, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                animation: 'pulse 2s infinite'
                            }}
                        >
                            <Ghost size={64} className="text-blue-400" />
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -10,
                                right: -10,
                                bgcolor: 'error.main',
                                color: 'white',
                                p: 1,
                                borderRadius: '50%',
                                animation: 'bounce 2s infinite'
                            }}
                        >
                            <AlertCircle size={24} />
                        </Box>
                    </Box>

                    <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '80px', md: '120px' }, lineHeight: 1, mb: 2, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        404
                    </Typography>
                    
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, letterSpacing: '-0.02em' }}>
                        Oops! Page Not Found
                    </Typography>
                    
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 6, fontSize: '1.1rem', maxWidth: '500px', mx: 'auto', fontWeight: 500 }}>
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ArrowLeft />}
                            onClick={() => navigate('/')}
                            sx={{
                                px: 4,
                                py: 2,
                                borderRadius: 4,
                                fontWeight: 900,
                                textTransform: 'none',
                                fontSize: '1rem',
                                bgcolor: 'white',
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'translateY(-2px)' },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Go Back to Login
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<Home />}
                            onClick={() => navigate('/dashboard')}
                            sx={{
                                px: 4,
                                py: 2,
                                borderRadius: 4,
                                fontWeight: 900,
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: 'white',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)', transform: 'translateY(-2px)' },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            Home Dashboard
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}} />
        </Box>
    );
};

export default NotFoundPage;
