import "./User.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const SERVER = "https://todoo.5xcamp.us";
const HEADERS = {
  headers: {
    accept: "application/json",
    'Content-Type': 'application/json'
  }
}

//if the color changes => we show the message for 5 seconds
//we do so at the upper level
function FlashMessage({ message, bgColor, closeFlashMessage }) {
  return (bgColor !== "") && (    
    <div className="flash-message" style={{"backgroundColor": bgColor}}>
      <p>{message}</p>
      <p className="pointer" onClick={closeFlashMessage}>X</p>
    </div>
  )
}

function SignUp({showSignIn, alertUser}) {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[nickname, setNickname] = useState("");

  async function handleClick() {
    const params = {
      user: {
        email: email,
        nickname: nickname, 
        password: password
      }
    };
    
    try {
      await axios.post(`${SERVER}/users`,params,HEADERS);
      alertUser("success", "now sign in to enjoy the app!");
      showSignIn(true);
    } catch ({response}) {
      let errors = response.data.error;
      if (Array.isArray(errors)) {
        errors = errors.join("/");
      }
      alertUser("error", errors);
    }
  }

  return (
    <section className="signUp panel">
      <h1 className="panel-title">註冊帳號</h1>
      <div className="panel-inputs shadow">
        <div className="email-area input-area">
          <label>
            <p className="input-title">Email</p>
            <input type="text" placeholder="Email 信箱" className="input-box" onChange={e => setEmail(e.currentTarget.value)}/>
          </label>
        </div>

        <div className="nickname-area input-area">
          <label htmlFor="">
            <p className="input-title">暱稱</p>
            <input type="text" placeholder="要怎麼稱呼您呢" className="input-box" onChange={e => setNickname(e.currentTarget.value)}/>
          </label>
        </div>

        <div className="password-area input-area">
          <label htmlFor="">
            <p className="input-title">密碼</p>
            <input type="password" placeholder="密碼，至少要六個字" className="input-box" onChange={e => setPassword(e.currentTarget.value)}/>
          </label>
        </div>

        <div className="btn-area">
          <button className="btn-default btn-signUp" onClick={handleClick}>註冊</button>
        </div>

        <footer className="footer-area">
          <p>已經有帳號了？ <span className="footer-signUp pointer" onClick={() => showSignIn(true)}>登入</span></p>
        </footer>
      </div>
    </section>
  )
}

function SignIn({showSignIn, alertUser, showTodo}) {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  async function handleClick() {
    try {
      const params = {
        user: {
          email: email,
          password: password
        }
      }
      
      const res = await axios.post(`${SERVER}/users/sign_in`,params,HEADERS);
      localStorage.setItem("token",res.headers.authorization);
      showTodo(true,res.data.nickname);
    } catch (error) {
      let errors = error.response.data.error;
      if (Array.isArray(errors)) {
        errors = errors.join('/');
      }
      alertUser("error", errors);
    }
  }

  return (
    <section className="signIn panel">
      <h1 className="panel-title">登入</h1>

      <div className="panel-inputs shadow">
        <div className="email-area input-area">
          <label>
            <p className="input-title">Email</p>
            <input onChange={e => setEmail(e.currentTarget.value)} type="text" placeholder="Email 信箱" className="email-input input-box"/>
          </label>
        </div>

        <div className="password-area input-area">
          <label htmlFor="">
            <p className="input-title">密碼</p>
            <input onChange={e => setPassword(e.currentTarget.value)} type="password" placeholder="密碼，至少要六個字" className="email-input input-box"/>
          </label>
        </div>

        <div className="btn-area">
          <button className="btn-default btn-signIn" onClick={handleClick}>登入</button>
        </div>

        <footer className="footer-area">
          <p>還沒有帳號嗎？ <span className="footer-signIn pointer" onClick={() => showSignIn(false)}>註冊</span>一個吧！</p>
        </footer>
      </div>
    </section>
  )
}

function SignInAndUp({showTodo}) {
  const [atSignIn, setAtSignIn] = useState(true);
  const [message, setMessage] = useState("somthing's wrong");
  const [bgColor, setbgColor] = useState("");

  function showSignIn(show) {
    setAtSignIn(show);
  }

  function alertUser(type="error", context) {
    setbgColor(type === "error" ? "red" : "green");
    setMessage(context);

    setTimeout(() => {
      closeFlashMessage();
    }, 4000);
  }

  function closeFlashMessage() {
    setMessage("");
    setbgColor("");
  }

  return (
    <section className="user-area shadow">
      <div className="nav">
        <p className="pointer" onClick={() => showSignIn(true)}>登入</p>
        <p className="pointer" onClick={() => showSignIn(false)}>註冊</p>
      </div>

      <FlashMessage message={message} bgColor={bgColor} closeFlashMessage={closeFlashMessage}/>

      <div className="user-panel">
        { atSignIn ? 
          <SignIn showSignIn={showSignIn} alertUser={alertUser} showTodo={showTodo}/> 
          : <SignUp showSignIn={showSignIn} alertUser={alertUser}/> 
        }
      </div>
    </section>
  )
}

function TodoInput({showTodo, updateTodoList}) {
  const[newTodo, setNewTodo] = useState("");

  function recordNewTodo(val) {
    setNewTodo(val);
  }

  function addTask() {
    const trimmed = newTodo.trim();
    if (trimmed.length > 0) {
      updateTodoList(newTodo);
    }
    setNewTodo("");
  }

  function handleKeyUp(event) {
    if (event.keyCode === 13) {
      addTask();
    }
  }

  return (
    <section className="user-area shadow">
      <div className="nav">
        <p> 歡迎使用 </p>
        <p className="pointer" onClick={() => showTodo(false)}>登出</p>
      </div>

      <div className="user-panel">
        <section className="todo-input-area panel">
          <input onKeyUp={handleKeyUp} onChange={e => recordNewTodo(e.target.value)} value={newTodo} type="text" className="todo-input" placeholder="做點重要的事吧"/>
          <button onClick={addTask} className="btn-default btn-addTodo">新增</button>
        </section>
      </div>
    </section>
  )
}

function TodoItem({todo, deleteTodo, updateTodoItem}) {
  const [allowEdit, setAllowEdit] = useState(false);
  const [content, setContent] = useState(todo.content);
  const [isChecked, setIsChecked] = useState(false);

  function handleDelete(id) {
    deleteTodo(id);
  }

  function closeEdit() {
    setAllowEdit(false);
    setContent(todo.content);
  }

  function startEdit() {
    setAllowEdit(true);
  }

  function handleChange(e) {
    setContent(e.currentTarget.value);
  }

  function updateItem(id) {
    setAllowEdit(false);
    updateTodoItem({
      id: id,
      content: content
    });
  }

  function handleCheck() {
    setIsChecked(!isChecked);
  }

  return (
    <li className="todo-item item-underline" key={todo.id}>
      <label className="todo-content-area">
        <input type="checkbox" checked={isChecked} onChange={handleCheck} className="checkbox"/>
        <input onChange={handleChange} value={content}
          disabled={!allowEdit} type="text" className={"todo-content " + (isChecked && "line-through")}
        />
      </label>
      <div className="todo-icons-area ">
        <p className={`editing ${allowEdit ? "" : 'hidden'}`} onClick={() => updateItem(todo.id)}>儲存此更改</p>
        <p className={`editing ${allowEdit ? "" : 'hidden'}`} onClick={closeEdit}>放棄此更改</p>
        <FontAwesomeIcon className="icon" icon={faPenToSquare} onClick={startEdit}/>
        <FontAwesomeIcon className="icon" icon={faTrash} onClick={() => handleDelete(todo.id)}/>
      </div>
    </li>
  )
}

function TodoList({todoList, deleteTodo, updateTodoItem}) {
  return (
    <ul className="shadow todo-list">
      {todoList.map(todo => {
        return (
          <TodoItem todo={todo} key={todo.id} 
            deleteTodo={deleteTodo}
            updateTodoItem={updateTodoItem}  
          />
        ) 
      })}
    </ul>
  )
}

function Todo({showTodo, updateTodoList, todoList, deleteTodo, updateTodoItem}) {
  return (
    <>
      <TodoInput showTodo={showTodo} updateTodoList={updateTodoList}/>
      <TodoList todoList={todoList} deleteTodo={deleteTodo} updateTodoItem={updateTodoItem}/>
    </>
  )
}

function User() {
  const [hasAccount, setHasAccount] = useState(false);
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          HEADERS["headers"]["Authorization"] = token;
          const {data} = await axios.get(`${SERVER}/todos`,HEADERS);
          showTodo(true);
          setTodoList(data.todos);
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
    })();
  },[])

  async function updateTodoItem(newItem) {
    try {
      const params = {
        todo: {
          content: newItem.content
        }
      }
      HEADERS["headers"]["Authorization"] = localStorage.getItem("token");
      await axios.put(`${SERVER}/todos/${newItem.id}`,params,HEADERS);
      delete HEADERS["headers"]["Authorization"];
      const index = todoList.reduce((accu,cv,i) => {
        return cv.id === newItem.id ? i : accu;
      },-1);
      const newTodoList = todoList.toSpliced(index, 1, newItem);
      setTodoList(newTodoList);
    } catch (err) {
      console.log(err);
      //alert user
    }
  }

  async function updateTodoList(newTodo) {
    try {
      const token = localStorage.getItem("token");
      const params = {
        todo: {
          content: newTodo
        }
      }
      HEADERS["headers"]["Authorization"] = token;
      const res = await axios.post(`${SERVER}/todos`,params,HEADERS);
      delete HEADERS["headers"]["Authorization"];
      setTodoList([res.data,...todoList]);
    } catch (error) {
      console.log(error);
      //alertUser("error", "somthing went wrong");
    }
  }

  async function deleteTodo(id) {
    try {
      HEADERS["headers"]["Authorization"] = localStorage.getItem("token");
      await axios.delete(`${SERVER}/todos/${id}`,HEADERS);
      delete HEADERS["headers"]["Authorization"];
      const newTodoList = todoList.slice().filter(ele => ele.id !== id);
      setTodoList(newTodoList);
    } catch (err) {
      console.log(err);
      //alert user
    }
  }

  async function showTodo(bool) {
    if (!bool) {
      try {
        const token = localStorage.getItem("token");
        HEADERS["headers"]["Authorization"] = token;
        await axios.delete(`${SERVER}/users/sign_out`,HEADERS);
        delete HEADERS["headers"]["Authorization"];
      } catch(error) {
        console.log(error);
        // do something.....
      } 

      localStorage.removeItem("token");
    }
    setHasAccount(bool);
  }


  return (
    <div className="container">
      { hasAccount ?
        <Todo 
          showTodo={showTodo} updateTodoList={updateTodoList} 
          todoList={todoList} deleteTodo={deleteTodo} 
          updateTodoItem={updateTodoItem}
        /> : <SignInAndUp showTodo={showTodo}/> 
      }
    </div>
  )
}












export default User;