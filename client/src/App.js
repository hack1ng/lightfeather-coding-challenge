import React from 'react';
import './App.css';
import { Container, Box } from '@material-ui/core';
import { RegisterForm } from './register-form'

function App() {

  return (
    <Container className="main-container">
      <Box className="App-header"><h1>LightFeather Web Component - Register</h1></Box>
      <Box className="form-container"><RegisterForm ></RegisterForm></Box>
    </Container>
  );
}

export default App;
