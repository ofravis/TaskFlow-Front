import TarefaItem from "./tarefaitem";

function ListaTarefas({
  tarefas,
  onDeletar,
  onConcluir,
  onMover = null,
  onEditar = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  return (
    <section id="lista-section">
      {tarefas.length === 0 && (
        <p className="msg-vazia">Nenhuma tarefa aqui ainda.</p>
      )}

      {tarefas.length > 0 && (
        <ul id="lista-tarefas">
          {tarefas.map((tarefa) => (
            <TarefaItem
              key={tarefa.id}
              texto={tarefa.texto}
              cidade={
                tarefa.cidade || tarefa.localidade || tarefa.endereco || ""
              }
              cep={tarefa.cep || tarefa.CEP || tarefa.codigoPostal || ""}
              concluida={tarefa.concluida}
              prioridade={tarefa.prioridade}
              onDeletar={() => onDeletar(tarefa.id)}
              onConcluir={() => onConcluir(tarefa.id)}
              onMover={
                onMover ? (novaColuna) => onMover(tarefa.id, novaColuna) : null
              }
              onEditar={onEditar ? () => onEditar(tarefa) : null}
              colunaAnterior={colunaAnterior}
              colunaProxima={colunaProxima}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default ListaTarefas;
