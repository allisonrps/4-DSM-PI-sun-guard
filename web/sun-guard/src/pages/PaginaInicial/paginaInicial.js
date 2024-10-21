import React, {useState} from "react";
import styles from "./PaginaInicial.module.css";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.png';


const PaginaInicial = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      
   
  // Aqui você pode adicionar a lógica de autenticação, como enviar dados para uma API
      console.log('Email:', email);
      
   
  console.log('Password:', password);
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