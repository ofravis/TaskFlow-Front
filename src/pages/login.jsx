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
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErro("");

    if (!usuario.trim() || !senha.trim()) {
      setErro("Informe usuário e senha para continuar.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://taskflow-back-seven.vercel.app"}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: usuario,
            senha: senha,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);

        if (typeof login === "function") {
          await login(data);
        }
        navigate("/");
      } else {
        setErro(data.mensagem || "E-mail ou senha incorretos.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      setErro("Erro de conexão com o servidor. Tente novamente.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };
  return (
    <div className="login-container">
      <div className="login-sidebar">
        <div className={`login-card ${shake ? "shake" : ""}`}>
          <h1 className="login-logo">TaskFlow </h1>
          <p className="login-subtitulo">Faça login para continuar</p>

          <input
            className="login-input"
            type="text"
            placeholder="Ex: Usuario@email.com"
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

      <div className="login-content"></div>
    </div>
  );
}

export default Login;
