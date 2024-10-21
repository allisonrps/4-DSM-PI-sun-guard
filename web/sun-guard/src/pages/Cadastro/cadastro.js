import React, {useState, useEffect} from "react";
import styles from "./Cadastro.module.css";
import logo from "../../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Cadastro = () => {

    const navigate = useNavigate();
   
    const [nome, setNome] = useState('');
    const [fototipo, setFototipo] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [data_nascimento, setData_nascimento] = useState('');
  
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          const response = await axios.post('https://sunguard-backend.vercel.app/usuarios', {
            nome,
            fototipo,
            password,
            email,
            data_nascimento
          });
      
          const token = response.data.token;
          localStorage.setItem('token', token);
          console.log('Usuário criado com sucesso!');
          navigate('/paginaInicial');
        } catch (error) {
          console.error('Erro ao criar usuário:', error.response ? error.response.data : error.message);
        }
      };
      
      

      const handleChangeFototipo= (e) => {
        // Atualiza o estado com a nova opção selecionada
        setFototipo(e.target.value);
      };

    return (

        <div className={styles.loginContainer}>
            
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                     <h2 className={styles.title}>Cadastro </h2> 
                      
                    <div className={styles.formGroup}>
                        
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            placeholder="Nome"
                            />

                        <input
                            type="date"
                            value={data_nascimento}
                            onChange={(e) => setData_nascimento(e.target.value)}
                            required
                            placeholder="Data de Nascimento"
                        />

                       
                
                        <select 
                        
                    
                        id="options"  placeholder="Fototipo" value={fototipo} onChange={handleChangeFototipo}>
                            <option value="option1">selecione um fototipo</option>
                            <option value="option2">Opção 2</option>
                            <option value="option3">Opção 3</option>
                            <option value="option4">Opção 4</option>
                        </select>

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
                            placeholder="Senha"
                        />
            
                        
                        <button className={styles.button} type="submit">
                            Cadastrar
                        </button>
                    </div>
            </form>
        </div>
      
  );


};
export default Cadastro;