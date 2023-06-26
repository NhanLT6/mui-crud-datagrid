import TestDataGrid from '@/features/TestDataGrid';
import { Container } from '@mui/material';
import React from 'react';

const Home = () => {
  return (
    <Container sx={{ py: 2, position: 'relative' }}>
      <TestDataGrid />
    </Container>
  );
};

export default Home;
