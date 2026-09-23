import styles from "./tarefaitem.module.css";

function TarefaItem({
  texto,
  concluida = false,
  prioridade = "media",
  cidade = "",
  cep = "",
  onDeletar,
  onConcluir,

  onMover = null,
  onEditar = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  const classeItem =
    (concluida ? styles.tarefa + " " + styles.concluida : styles.tarefa) +
    " " +
    styles[prioridade];

  const classeTexto = concluida
    ? styles.textoTarefa + " " + styles["texto-tarefa"]
    : styles.textoTarefa;

  const classePrioridade =
    styles["badge-prioridade"] + " " + styles["badge-" + prioridade];

  const localizacaoExibida = cidade || cep || "";
  const modoKanban = onMover !== null;

  return (
    <li className={classeItem}>
      <div className={styles.conteudo}>
        <span
          className={classeTexto}
          onDoubleClick={onEditar || onConcluir}
          title="Duplo clique para editar"
        >
          {texto}
        </span>
        {localizacaoExibida && (
          <span className={styles.cidade}>{localizacaoExibida}</span>
        )}
      </div>

      <span className={classePrioridade}>{prioridade}</span>

      <div className={styles.acoes}>
        {modoKanban && colunaAnterior && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaAnterior)}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}

        {modoKanban && colunaProxima && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaProxima)}
            title="Mover para próxima coluna"
          >
            →
          </button>
        )}

        {onEditar && (
          <button
            className={styles.btnEditar}
            onClick={onEditar}
            title="Editar tarefa"
          >
            ✎
          </button>
        )}

        <button className={styles.btnDeletar} onClick={onDeletar}>
          X
        </button>
      </div>
    </li>
  );
}

export default TarefaItem;
