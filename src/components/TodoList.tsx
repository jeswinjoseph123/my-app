import React from "react";
import { Todo } from "../model";
import "./style.css";
import SingleTodo from "./SingleTodo";

interface Props {
  todos: Todo[];
  onDelete: (id: string) => void;
  onDone: (id: string) => void;
  onEdit: (id: string, todo: string) => void;
}

const TodoList: React.FC<Props> = ({ todos, onDelete, onDone, onEdit }) => {
  return (
    <div className="todos">
      {todos.map((todo) => (
        <SingleTodo
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          onDone={onDone}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TodoList;
