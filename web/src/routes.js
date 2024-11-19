import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protectedRoute';



import Cadastro from './pages/Cadastro/cadastro';
import PaginaInicial from './pages/PaginaInicial/paginaInicial';
import Perfil from './pages/Perfil/perfil';
import Painel from './pages/Painel/painel';



function AppRoutes (){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/cadastro" element={<Cadastro/>} />
                <Route path="/" element={<PaginaInicial/>} />
                <Route path="/Painel" element={<Painel/>} />
                <Route path="/Painel" element={
          <ProtectedRoute>
            <Painel />
          </ProtectedRoute>
        } />
        <Route path="/Perfil" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
            </Routes>
        </BrowserRouter>

    )
}; 
export default AppRoutes;