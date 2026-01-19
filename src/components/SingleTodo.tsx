import React, { useState, useRef, useEffect } from "react";
import { Todo } from "../model";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdDone } from "react-icons/md";

type Props = {
  todo: Todo;
  onDelete: (id: string) => void;
  onDone: (id: string) => void;
  onEdit: (id: string, todo: string) => void;
};

const SingleTodo: React.FC<Props> = ({ todo, onDelete, onDone, onEdit }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);

  const handleEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    onEdit(id, editTodo);
    setEdit(false);
  };

  const EditIcon = AiFillEdit as any;
  const DeleteIcon = AiFillDelete as any;
  const DoneIcon = MdDone as any;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [edit]);

  return (
    <form
      className="todos__single"
      onSubmit={(e) => {
        handleEdit(e, todo.id);
      }}
    >
      {edit ? (
        <input
          ref={inputRef}
          value={editTodo}
          onChange={(e) => setEditTodo(e.target.value)}
          className="todos__single--text"
        />
      ) : todo.isDone ? (
        <s className="todos__single--text">{todo.todo}</s>
      ) : (
        <span className="todos__single--text">{todo.todo}</span>
      )}

      <div>
        <span className="icon">
          <EditIcon
            onClick={() => {
              if (!edit && !todo.isDone) {
                setEdit(!edit);
              }
            }}
          />
        </span>
        <span className="icon" onClick={() => onDelete(todo.id)}>
          <DeleteIcon />
        </span>
        <span className="icon" onClick={() => onDone(todo.id)}>
          <DoneIcon />
        </span>
      </div>
    </form>
  );
};

export default SingleTodo;
