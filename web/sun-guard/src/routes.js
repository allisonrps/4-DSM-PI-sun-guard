import { BrowserRouter, Routes, Route } from 'react-router-dom';



import Cadastro from './pages/Cadastro/cadastro';
import PaginaInicial from './pages/PaginaInicial/paginaInicial';
import Perfil from './pages/Perfil/perfil';
import Painel from './pages/Painel/painel';


function AppRoutes (){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/cadastro" element={<Cadastro/>} />
                <Route path="/PaginaInicial" element={<PaginaInicial/>} />
                <Route path="/Painel" element={<Painel/>} />
                <Route path="/Perfil" element={<Perfil/>} />
            </Routes>
        </BrowserRouter>

    )
}; 
export default AppRoutes;