import Header from "../componentes/header";
import ListaTarefas from "../componentes/listatarefas";
import ModalTarefa from "../componentes/modaltarefa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://taskflow-back-seven.vercel.app";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const URL_API = "/tarefas";

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await api.get(URL_API);
        setTarefas(resposta.data);
      } catch (e) {
        if (e.response?.status === 401) {
          navigate("/login");
          return;
        }
        setErro("Erro ao carregar tarefas. Verifique a conexão.");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []);

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setTarefaEditando(null);
  }

  async function salvarTarefa(dados) {
    try {
      setErro("");

      if (dados.id) {
        const { data: tarefaEditada } = await api.put(
          `${URL_API}/${dados.id}`,
          {
            texto: dados.texto,
            prioridade: dados.prioridade,
            cidade: dados.cidade || dados.localidade || "",
            localidade: dados.cidade || dados.localidade || "",
            cep: dados.cep || dados.CEP || "",
            CEP: dados.cep || dados.CEP || "",
            coluna: dados.coluna || colunaAtiva,
          },
        );

        setTarefas((prev) =>
          prev.map((t) => (t.id === dados.id ? tarefaEditada : t)),
        );
      } else {
        const { data: novaTarefa } = await api.post(URL_API, {
          texto: dados.texto,
          prioridade: dados.prioridade || "media",
          cidade: dados.cidade || dados.localidade || "",
          localidade: dados.cidade || dados.localidade || "",
          cep: dados.cep || dados.CEP || "",
          CEP: dados.cep || dados.CEP || "",
          coluna: dados.coluna || colunaAtiva,
        });

        setTarefas((prev) => [...prev, novaTarefa]);
      }

      fecharModal();
    } catch (e) {
      if (e.response?.status === 401) {
        navigate("/login");
        return;
      }
      const mensagem =
        e.response?.data?.erro ||
        e.response?.data?.erros?.join(", ") ||
        "Erro ao salvar tarefa. Verifique se os campos obrigatórios estão preenchidos.";
      setErro(mensagem);
      console.error(e);
    }
  }

  const alternarConcluida = (id) => {
    setTarefas((prev) =>
      prev.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  };

  async function moverTarefa(id, novaColuna) {
    try {
      setErro("");
      const tarefaAtual = tarefas.find((t) => t.id === id);
      if (!tarefaAtual) return;

      const { data: tarefaMovida } = await api.put(`${URL_API}/${id}`, {
        texto: tarefaAtual.texto,
        prioridade: tarefaAtual.prioridade,
        cidade: tarefaAtual.cidade || tarefaAtual.localidade || "",
        localidade: tarefaAtual.cidade || tarefaAtual.localidade || "",
        cep: tarefaAtual.cep || tarefaAtual.CEP || "",
        CEP: tarefaAtual.cep || tarefaAtual.CEP || "",
        coluna: novaColuna,
      });

      setTarefas((prev) => prev.map((t) => (t.id === id ? tarefaMovida : t)));
    } catch (e) {
      if (e.response?.status === 401) {
        navigate("/login");
        return;
      }
      setErro("Erro ao mover tarefa. Verifique se o servidor está rodando.");
      console.error(e);
    }
  }

  async function deletarTarefa(id) {
    const confirmado = window.confirm(
      "Deletar esta tarefa? Esta ação não pode ser desfeita.",
    );
    if (!confirmado) return;

    try {
      await api.delete(`${URL_API}/${id}`);
      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      if (e.response?.status === 401) {
        navigate("/login");
        return;
      }
      setErro("Erro ao deletar tarefa.");
      console.error(e);
    }
  }

  const tarefasFiltradas =
    filtroPrioridade === "todas"
      ? tarefas
      : tarefas.filter((t) => t.prioridade === filtroPrioridade);

  return (
    <>
      <Header
        titulo="TaskFlow Blud.. 🥀 "
        subtitulo="Seu Gerenciador de Tarefas 🫵"
        tarefas={tarefas}
      />

      <main className="container">
        {carregando && (
          <p style={{ textAlign: "center", color: "#4a94fd" }}>
            Carregando tarefas...
          </p>
        )}

        {erro && (
          <p
            style={{
              textAlign: "center",
              color: "#EF4444",
              fontWeight: "bold",
            }}
          >
            {erro}
          </p>
        )}

        <section id="formulario">
          <div className="campo-linha">
            <select
              id="sel-prioridade"
              value={filtroPrioridade}
              onChange={(e) => setFiltroPrioridade(e.target.value)}
            >
              <option value="todas"> — Todas as Prioridades — </option>
              <option value="alta">🔴 Alta</option>
              <option value="media">🟡 Média</option>
              <option value="baixa">🟢 Baixa</option>
            </select>
          </div>
        </section>

        <div className="kanban-quadro">
          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              <div className="kanban-coluna-acoes">
                <span className="kanban-contador">
                  {tarefasFiltradas.filter((t) => t.coluna === "afazer").length}
                </span>
                <button
                  className="kanban-btn-add"
                  type="button"
                  title="Nova tarefa A Fazer"
                  onClick={() => abrirModalCriar("afazer")}
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "afazer")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior={null}
              colunaProxima="andamento"
            />
          </div>

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Em Andamento</h3>
              <div className="kanban-coluna-acoes">
                <span className="kanban-contador">
                  {
                    tarefasFiltradas.filter((t) => t.coluna === "andamento")
                      .length
                  }
                </span>
                <button
                  className="kanban-btn-add"
                  type="button"
                  title="Nova tarefa Em Andamento"
                  onClick={() => abrirModalCriar("andamento")}
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

          <div className="kanban-coluna">
            <div className="kanban-coluna-header">
              <h3>Concluído</h3>
              <div className="kanban-coluna-acoes">
                <span className="kanban-contador">
                  {
                    tarefasFiltradas.filter((t) => t.coluna === "concluido")
                      .length
                  }
                </span>
                <button
                  className="kanban-btn-add"
                  type="button"
                  title="Nova tarefa Concluído"
                  onClick={() => abrirModalCriar("concluido")}
                >
                  +
                </button>
              </div>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onEditar={abrirModalEditar}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>
        </div>
      </main>

      <ModalTarefa
        aberto={modalAberto}
        onFechar={fecharModal}
        onSalvar={salvarTarefa}
        tarefa={tarefaEditando}
        coluna={colunaAtiva}
      />

      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Dev Flávio Azevedo &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default Kanban;
