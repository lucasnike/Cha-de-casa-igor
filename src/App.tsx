import { ChangeEvent, useEffect, useState, InputHTMLAttributes } from 'react'
import { ref, onValue, remove, onChildRemoved, push, set, get, child } from 'firebase/database'
import { db } from './db'
import Swal from 'sweetalert2'
import './App.css'
import arrowIcon from './assets/icons/arrow-right.svg'

function App() {

  const [brinde, setBrinde] = useState('')
  const [brindes, setBrindes] = useState([]);
  const [selecionados, setSelecionados] = useState({});
  const [nome, setNome] = useState('');


  // Faz a leitura do banco de dados
  useEffect(() => {

    const brindesRef = ref(db, 'brindes');
    onValue(brindesRef, (snapshot) => {
      const data = snapshot.val()

      if (snapshot.exists()) {
        setBrindes(data);
      }
    })

    const selecionadosRef = ref(db, 'selecionados');
    onValue(selecionadosRef, (snapshot) => {
      const data = snapshot.val()

      if (snapshot.exists()) {
        setSelecionados(data);
      }
    })
  }, []);

  useEffect(() => {
    setBrinde('')
  }, [brindes, selecionados])


  function Selecionado(e: ChangeEvent<HTMLSelectElement>) {
    setBrinde(e.target.value)
  }

  function onInputNameChange(e: ChangeEvent<HTMLInputElement>) {
    setNome(e.target.value);
  }

  // Função do botão selecionar
  async function buttonSelecionar() {
    // Termina a função se houver algum campo não preenchido
    if (brinde == '' || nome == '' || brinde == 'select') {
      await Swal.fire({
        title: 'Preencher campo',
        text: `Alguns campos não foram preenchidos`,
        icon: 'error',
        confirmButtonText: 'Vou corrigir',
      })
      return
    }
    // ----------------------------------------------------

    // Mostra um modal para confirmar o brinde selecionado
    const result = await Swal.fire({
      title: 'Tem certeza ?',
      text: `Tem certeza que deseja selecionar: ${brinde}`,
      icon: 'question',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'red'
    })
    // ------------------------------------------------------

    // Termina a função se o usuário selecionar clicar em 'Não' no modal
    if (!result.isConfirmed) return;

    // Remove o brinde selecionado das opções do 'Select'
    let itemId = 1;
    brindes.forEach(async (item, index) => {
      if (item == brinde) {
        itemId += index;
        const itemRef = ref(db, `brindes/${index}`)

        await remove(itemRef)
      }
    })

    // Salva as informações de quem salvou o brinde
    // Adiciona a pessoa e o item selecionado no banco de dados
    const postListRef = ref(db, 'selecionados');
    const newPostRef = push(postListRef);
    await set(newPostRef, {
      nome,
      brinde,
      id: itemId
    });

    // Mostra para o usuário qual é seu número no sorteio
    await Swal.fire({
      title: 'Sorteio',
      icon: 'info',
      text: `Seu número do sorteio é ${itemId}`,
      confirmButtonText: 'Ok'
    })


    setNome('')
    setBrinde('')
  }


  return (
    <div className="App">
      <h1>CHÁ RIFA COZINHA</h1>
    
      <select onChange={Selecionado} value={brinde} name="brindes da chá" id="brindes">
        <option value="select">Selecione um brinde</option>

        {brindes.map((item, i) => {
          let myTextNumber;

          if ((i+1) >= 1 && (i+1) <= 9) {
            myTextNumber = `0${i+1}`
          } else {
            myTextNumber = `${i+1}`
          }

          return (
            <option value={item} key={i}>{myTextNumber} {'→'} {item}</option>
          );
        })}

      </select>

      <div id="input-space">
        <label htmlFor="nome">Nome:</label>
        <input onChange={onInputNameChange} value={nome} type="text" name="" id="nome" />
      </div>

      <button onClick={buttonSelecionar} id='selecionar'>Selecionar</button>
    </div>
  )
}

export default App
