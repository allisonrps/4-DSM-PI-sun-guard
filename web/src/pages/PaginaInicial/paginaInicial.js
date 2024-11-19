import React, {useState} from "react";
import styles from "./PaginaInicial.module.css";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.png';
import { useNavigate } from "react-router-dom"; // Para redirecionar após login
import axios from 'axios';


const PaginaInicial = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para redirecionar

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          // Busca todos os usuários da API
          const response = await axios.get('https://sunguard-backend.vercel.app/usuarios');
          const usuarios = response.data;
          
          const usuarioAutenticado = usuarios.find(
            (usuario) => usuario.email === email && usuario.senha === password
          );
    
          if (usuarioAutenticado) {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email); // Salva o email do usuário logado
    
            // Redireciona para a página inicial
            navigate('/Perfil');
            console.log('Login bem-sucedido!');
          } else {
            console.log('Email ou senha incorretos.');
            alert('Email ou senha incorretos.');
          }
        } catch (error) {
          console.error('Erro ao autenticar:', error.message);
          alert('Erro ao autenticar. Tente novamente.');
        }
      };
    
    return (
        
    
  


        <div className={styles.loginContainer}>
            <img className={styles.logo} src={logo} alt="Logo"/>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    />

                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password"
                    />
         
                <button className={styles.button} type="submit">Login</button>
                <Link to="/cadastro" className={styles.link}>
                    Cadastre-se
                </Link>
                </div>
            </form>
        </div>
      
  );
}

export default PaginaInicial;