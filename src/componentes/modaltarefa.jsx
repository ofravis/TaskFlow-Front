import { useState, useEffect } from "react";
import styles from "./modaltarefa.module.css";
import axios from "axios";

function ModalTarefa({
  aberto,
  onFechar,
  onSalvar,
  tarefa = null,
  coluna = "afazer",
}) {
  const [texto, setTexto] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [prioridade, setPrioridade] = useState("media");

  useEffect(() => {
    setCep(tarefa?.cep || "");
    if (tarefa) {
      setTexto(tarefa.texto);
      setCidade(tarefa.cidade || "");
      setPrioridade(tarefa.prioridade);
    } else {
      setTexto("");
      setCep("");
      setCidade("");
      setPrioridade("media");
    }
  }, [tarefa, aberto]);

  useEffect(() => {
    if (!aberto) return;
    function handleTecla(e) {
      if (e.key === "Escape") onFechar();
    }
    document.addEventListener("keydown", handleTecla);
    return () => document.removeEventListener("keydown", handleTecla);
  }, [aberto, onFechar]);

  async function consultarCidade(cepDigitado) {
    if (cepDigitado.trim().length < 8) return;
    try {
      const { data } = await axios.get(
        `https://viacep.com.br/ws/${cepDigitado}/json/`,
      );
      if (!data.erro) setCidade(data.localidade + "/" + data.uf);
    } catch (e) {
      console.error("Erro ao consultar CEP:", e);
    }
  }

  function handleSalvar() {
    if (texto.trim() === "") return;

    onSalvar({
      id: tarefa?.id,
      texto,
      cidade,
      cep,
      prioridade,
      coluna: tarefa?.coluna || coluna,
    });
    onFechar();
  }

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h2>{tarefa ? "Editar tarefa" : "Nova tarefa"}</h2>
        <input
          placeholder="Texto da tarefa"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <input
          placeholder="CEP (opcional)"
          value={cep}
          onChange={(e) => {
            setCep(e.target.value);
            consultarCidade(e.target.value);
          }}
        />
        {cidade && <p className={styles.cidade}>{cidade}</p>}
        <select
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
        >
          <option value="alta">🔴Alta</option>
          <option value="media">🟡Média</option>
          <option value="baixa">🟢Baixa</option>
        </select>
        <div className={styles.botoes}>
          <button onClick={onFechar}>Cancelar</button>
          <button onClick={handleSalvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarefa;
