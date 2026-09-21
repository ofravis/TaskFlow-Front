import api from ".../api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    setErro("");
    try {
      const resposta = await api.post("/auth/login", {
        usuario,
        senha,
      });
      const { token, usuario } = resposta.data;
      login(usuario, token); // guarda no AuthContext e localStorage
      navigate("/"); // redireciona para o kanban
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao fazer login");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <div className={`login-card ${shake ? "shake" : ""}`}>
          <h1 className="login-logo">TaskFlow </h1>
          <p className="login-subtitulo">Faça login para continuar</p>

          <input
            className="login-input"
            type="text"
            placeholder="Ex: Usuário123"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <div className="login-senha-wrapper">
            <input
              className="login-input login-senha-input"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              className="login-senha-toggle"
              type="button"
              onClick={() => setMostrarSenha((visivel) => !visivel)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={mostrarSenha}
            >
              {mostrarSenha ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {erro && <p className="login-erro">{erro}</p>}

          <button className="login-btn" onClick={handleLogin}>
            Entrar
          </button>

          <p className="login-aviso">
            Insira as credenciais para acessar o Dashboard :) <br />
          </p>
        </div>
      </div>

      {/* Conteúdo direito — vazio ou decorativo */}
      <div className="login-content"></div>
    </div>
  );
}

export default Login;
