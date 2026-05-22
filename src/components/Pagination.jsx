import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Box, Typography, IconButton, Stack, Button } from '@mui/material';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      px: 3, 
      py: 2, 
      bgcolor: 'background.paper', 
      borderTop: '1px solid', 
      borderColor: 'divider',
      borderRadius: '0 0 16px 16px'
    }}>
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
        Showing <Box component="span" sx={{ color: 'text.primary', fontWeight: 900 }}>{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</Box> to{' '}
        <Box component="span" sx={{ color: 'text.primary', fontWeight: 900 }}>{Math.min(totalItems, currentPage * itemsPerPage)}</Box> of{' '}
        <Box component="span" sx={{ color: 'text.primary', fontWeight: 900 }}>{totalItems}</Box>
      </Typography>
      
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          size="small"
          sx={{ 
            borderRadius: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ChevronLeft size={16} />
        </IconButton>
        
        <Stack direction="row" spacing={0.5}>
          {getPageNumbers().map((number) => (
            <Button
              key={number}
              onClick={() => onPageChange(number)}
              variant={currentPage === number ? 'contained' : 'text'}
              sx={{ 
                minWidth: 32, 
                height: 32, 
                p: 0,
                borderRadius: 2,
                fontSize: 12,
                fontWeight: 800,
                boxShadow: currentPage === number ? '0 4px 12px -2px rgba(67, 24, 255, 0.3)' : 'none',
                bgcolor: currentPage === number ? '#1b2559' : 'transparent',
                color: currentPage === number ? 'white' : 'text.secondary',
                '&:hover': {
                  bgcolor: currentPage === number ? '#1b2559' : 'action.hover'
                }
              }}
            >
              {number}
            </Button>
          ))}
        </Stack>

        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          size="small"
          sx={{ 
            borderRadius: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <ChevronRight size={16} />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Pagination;
