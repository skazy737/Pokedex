import React, { useState } from 'react';
import { z } from 'zod'; 
import '../App.css'; 

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    try {
      schema.parse({ email, password });
      setIsValid(true);
      setValidationErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
        setIsValid(false);
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateForm();
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validateForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
    if (isValid) {
      onLogin();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={handleEmailChange} placeholder="Email" />
      {validationErrors['email'] && <span className="error">{validationErrors['email']}</span>}
      <input type="password" value={password} onChange={handlePasswordChange} placeholder="Senha" />
      {validationErrors['password'] && <span className="error">{validationErrors['password']}</span>}
      <button type="submit" disabled={!isValid}>Acessar</button>
    </form>
  );
};

export default Login;
