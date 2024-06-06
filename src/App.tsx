import { ChangeEvent, useEffect, useState, InputHTMLAttributes } from "react";
import { ref, onValue, push, set, remove } from "firebase/database";
import { db } from "./db";
import Swal from "sweetalert2";
import "./App.css";
import { FaChartArea, FaTrash } from "react-icons/fa";

function App() {
  const [itemId, setItemId] = useState("");
  const [selecionados, setSelecionados] = useState<any>({});
  const [nome, setNome] = useState("");
  const [availuableIds, setAvailuableIds] = useState([0]);

  // Faz a leitura do banco de dados
  useEffect(() => {
    const selecionadosRef = ref(db, "selecionados");

    onValue(selecionadosRef, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        setSelecionados(data);
      }
    });
  }, []);

  useEffect(() => {
    let array: number[] = [];

    for (let i = 1; i <= 150; i++) {
      let is = isInSelecionados(i);
      if (is == false) {
        array.push(i);
      }
    }

    setAvailuableIds(array);
    setItemId("");

    console.log(selecionados);
  }, [selecionados]);

  function Selecionado(e: ChangeEvent<HTMLSelectElement>) {
    setItemId(e.target.value);
  }

  function onInputNameChange(e: ChangeEvent<HTMLInputElement>) {
    setNome(e.target.value);
  }

  async function deleteSelected(number: number, key: string){
    const result = await Swal.fire({
      title: "Tem certeza ?",
      text: `Tem certeza que deseja deletar o número ${number} ?`,
      icon: "question",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
    });

    if (!result.isConfirmed) return;

    const itemRef = ref(db, `selecionados/${key}`);
    remove(itemRef);
  }

  // Função do botão selecionar
  async function buttonSelecionar() {
    // Termina a função se houver algum campo não preenchido
    if (itemId == "" || nome == "" || itemId == "select") {
      await Swal.fire({
        title: "Preencher campo",
        text: `Alguns campos não foram preenchidos`,
        icon: "error",
        confirmButtonText: "Vou corrigir",
      });
      return;
    }
    // ----------------------------------------------------

    // Mostra um modal para confirmar o brinde selecionado
    const result = await Swal.fire({
      title: "Tem certeza ?",
      text: `Tem certeza que deseja selecionar: ${itemId}`,
      icon: "info",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
    });
    // ------------------------------------------------------

    // Termina a função se o usuário selecionar clicar em 'Não' no modal
    if (!result.isConfirmed) return;

    // Salva as informações de quem salvou o brinde
    // Adiciona a pessoa e o item selecionado no banco de dados
    const postListRef = ref(db, "selecionados");
    const newPostRef = push(postListRef);

    let item = {
      Id: itemId,
      Name: nome,
    };

    await set(newPostRef, item);

    // Mostra para o usuário qual é seu número no sorteio
    await Swal.fire({
      title: "Sorteio",
      icon: "success",
      text: `Seu número do sorteio é ${itemId}`,
      confirmButtonText: "Ok",
    });

    setNome("");
    setItemId("");
  }

  function isInSelecionados(id: number) {
    return Object.keys(selecionados).some((key) => {
      if (selecionados[key].Id == id.toString()) {
        return true;
      }
    });
  }

  return (
    <div className="App" style={{width: '100vw', height: '100vh'}}>
      <div className="container-fluid d-flex justify-content-center mt-5" style={{width: '100vw', height: '100vh'}}>
        <div className="d-flex flex-column col col-xl-5 " >
          <h1 className="text-center">SORTEIO</h1>

          <select
            onChange={Selecionado}
            value={itemId}
            name="brindes da chá"
            id="brindes"
            className="mb-4"
          >
            <option value="select">Selecione um número</option>
            {availuableIds.map((i) => {
              let myTextNumber = `${i}`;

              if (i >= 1 && i <= 9) {
                myTextNumber = `00${i}`;
              } else if (i >= 10 && i <= 99) {
                myTextNumber = `0${i}`;
              } else {
                myTextNumber = `${i}`;
              }
              return (
                <option value={i} key={i}>
                  {myTextNumber}
                </option>
              );
            })}

            {/* {brindes.map((item, i) => {
          let myTextNumber;

          if ((i+1) >= 1 && (i+1) <= 9) {
            myTextNumber = `0${i+1}`
          } else {
            myTextNumber = `${i+1}`
          }

          return (
            <option value={item} key={i}>{myTextNumber} {'→'} {item}</option>
          );
        })} */}
          </select>

          <div id="input-space">
            <label htmlFor="nome">Nome:</label>
            <input
              onChange={onInputNameChange}
              value={nome}
              type="text"
              name=""
              id="nome"
            />
          </div>

          <button onClick={buttonSelecionar} id="selecionar">
            Selecionar
          </button>

          <div>
            <button
              id="selecionados"
              data-bs-toggle="modal"
              data-bs-target="#detail-modal"
            >
              <FaChartArea></FaChartArea>
            </button>
          </div>

          <div
            className="modal fade"
            id="detail-modal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div
                  className="modal-header"
                  style={{ backgroundColor: "#0f9b6a" }}
                >
                  <h2 className="modal-title fs-5" id="staticBackdropLabel">
                    Detalhes do sorteio
                  </h2>

                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body bg-dark text-light">
                  <table className="table table-striped table-dark table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Nome</th>
                        <th>Deletar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(selecionados).map((key) => {
                        let item = selecionados[key];

                        if (item.Id == "-1"){
                          return;

                        }
                        return (
                          <tr key={item.Id}>
                            <td className="col-1 text-center">{item.Id}</td>
                            <td>{item.Name}</td>
                            <td className="col-1">
                              <button
                                className="btn btn-secondary w-100"
                                onClick={async () => {
                                  await deleteSelected(item.Id, key);
                                }}
                              >
                                <FaTrash></FaTrash>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer bg-dark">
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-dismiss="modal"
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
