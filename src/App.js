import './App.css';
import { API } from 'aws-amplify';
import { listTodos } from './graphql/queries';
import { createTodo, deleteTodo } from './graphql/mutations'
import { useEffect, useState } from 'react';

function App() {

  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchToDos();
  }, [])

  async function fetchToDos() {
    let response = await API.graphql({
      query: listTodos
    });

    setItems(response.data.listTodos.items);
  }

  async function createTodoFun() {
    let myTodo = { name: name, description: description };
    setName("");
    setDescription("");

    let response = await API.graphql({
      query: createTodo,
      variables: {
        input: myTodo
      }
    });

    fetchToDos();
  }

  async function deletetoDoFun(id){
    const response = await API.graphql({
      query: deleteTodo,
      variables: {
        input: { id }
      }
    });

    setItems(prev => prev.filter(item => item.id !== id));
    console.log(response);
  }

  return (
    <div className="App">
      <input type='text' placeholder='name...' onChange={(e) => setName(e.target.value)} />
      <input type='text' placeholder='description...' onChange={e => setDescription(e.target.value)} />
      <button onClick={createTodoFun}>create todo</button>
      {items.map(item => {
        return (
          <div key={item.id}>
            <p>{item.name} : {item.description}</p>
            <button onClick={() => deletetoDoFun(item.id)}>delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default App;
