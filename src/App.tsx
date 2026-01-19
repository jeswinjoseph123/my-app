import { useState, useEffect } from "react";
import "./App.css";
import InputField from "./components/InputField";
import { Todo } from "./model";
import TodoList from "./components/TodoList";
import Login from "./components/Login";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/todos`));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todosArr: Todo[] = [];
        querySnapshot.forEach((doc) => {
          todosArr.push({ ...doc.data(), id: doc.id } as Todo);
        });
        setTodos(todosArr);
      }, (err) => {
        console.error("Firestore error:", err);
        setError("Failed to sync todos. Please check your connection.");
      });
      return () => unsubscribe();
    } else {
      setTodos([]);
    }
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (todo && user) {
      const tempTodo = todo;
      setTodo(""); // Optimistic clear
      try {
        await addDoc(collection(db, `users/${user.uid}/todos`), {
          todo: tempTodo,
          isDone: false,
        });
        setError(null);
      } catch (err) {
        console.error("Error adding doc:", err);
        setError("Failed to add todo. Please try again.");
        setTodo(tempTodo); // Restore if failed
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/todos`, id));
        setError(null);
      } catch (err) {
        console.error("Error deleting doc:", err);
        setError("Failed to delete todo.");
      }
    }
  };

  const handleDone = async (id: string) => {
    if (user) {
      const todoToUpdate = todos.find((t) => t.id === id);
      if (todoToUpdate) {
        try {
          await updateDoc(doc(db, `users/${user.uid}/todos`, id), {
            isDone: !todoToUpdate.isDone,
          });
          setError(null);
        } catch (err) {
          console.error("Error updating doc:", err);
          setError("Failed to update status.");
        }
      }
    }
  };

  const handleEdit = async (id: string, updatedTodo: string) => {
    if (user) {
      try {
        await updateDoc(doc(db, `users/${user.uid}/todos`, id), {
          todo: updatedTodo,
        });
        setError(null);
      } catch (err) {
        console.error("Error editing doc:", err);
        setError("Failed to edit todo.");
      }
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="App">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "90%", maxWidth: "1000px" }}>
        <span className="heading">Taskify</span>
        <button onClick={handleSignOut} style={{ padding: "10px 20px", borderRadius: "5px", border: "none", backgroundColor: "#f44336", color: "white", cursor: "pointer" }}>Logout</button>
      </div>

      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList
        todos={todos}
        onDelete={handleDelete}
        onDone={handleDone}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default App;
