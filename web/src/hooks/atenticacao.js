export const isAuthenticated = () => {
    const user = localStorage.getItem('usuarioLogado');
    return user !== null;
  };