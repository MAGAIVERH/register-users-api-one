import './style.css';
import api from '../../services/api.js';
import { useEffect, useState, useRef } from 'react';

function Home() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Estado para o usuário sendo editado
  const inputName = useRef();
  const inputAge = useRef();
  const inputEmail = useRef();

  const getUser = async () => {
    try {
      const usersFromApi = await api.get('/');
      setUsers(usersFromApi.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const createUsers = async () => {
    try {
      await api.post('/', {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      });
      getUser(); // Atualiza a lista de usuários após criar um novo
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  const saveUser = async () => {
    if (editingUser) {
      try {
        await api.put(`/${editingUser.id}`, {
          name: inputName.current.value,
          age: inputAge.current.value,
          email: inputEmail.current.value
        });
        setEditingUser(null); // Reseta o estado de edição após salvar
        getUser(); // Atualiza a lista de usuários
        inputName.current.value = '';
        inputAge.current.value = '';
        inputEmail.current.value = '';
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
      }
    } else {
      createUsers(); // Chama a função que já existe para criar um novo usuário
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user); // Define o usuário que será editado
    inputName.current.value = user.name;
    inputAge.current.value = user.age;
    inputEmail.current.value = user.email;
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/${id}`);
      getUser(); // Atualiza a lista de usuários após a deleção
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className='container'>
      <form>
        <h1>Cadastros de Usuários</h1>

        <input placeholder='Nome' name='nome' type='text' ref={inputName} />
        <input placeholder='Idade' name='idade' type='text' ref={inputAge} />
        <input placeholder='Email' name='email' type='email' ref={inputEmail} />

        <button type='button' onClick={saveUser}>
          {editingUser ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome:<span> {user.name}</span></p>
            <p>Idade:<span> {user.age}</span></p>
            <p>Email:<span> {user.email}</span></p>
          </div>
          <button onClick={() => handleEditClick(user)}>
            <img src='https://svgshare.com/i/19Rj.svg' alt='Atualizando' title='update' />
          </button>
          <button onClick={() => deleteUser(user.id)}>
            <img src='https://svgshare.com/i/16qg.svg' alt='Lixeira' title='trash' />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
