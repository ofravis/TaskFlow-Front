import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [logado, setLogado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");

    if (token) {
      setLogado(true);
      if (usuarioSalvo) {
        try {
          setUser(JSON.parse(usuarioSalvo));
        } catch (e) {
          console.error("Erro ao ler dados do utilizador:", e);
        }
      }
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);

      const dadosUtilizador = data.usuario ||
        data.user || { email: data.email };
      localStorage.setItem("usuario", JSON.stringify(dadosUtilizador));

      setUser(dadosUtilizador);
      setLogado(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setLogado(false);
  };

  return (
    <AuthContext.Provider value={{ user, logado, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
