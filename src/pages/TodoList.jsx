import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  Input,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Checkbox,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useLocalStorage } from '@mantine/hooks';

const TodoList = () => {
  const [todos, setTodos] = useLocalStorage({
    key: 'todos',
    defaultValue: [],
  });
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const availableTodos = todos.filter(
    (todo) => !todo.archived && !todo.checked
  );
  const archivedTodos = todos.filter((todo) => todo.archived); // filter archived todos
  const checkedTodos = todos.filter((todo) => todo.checked); // filter checked todos

  const handleCreateTodo = () => {
    const todo = {
      id: Date.now(),
      title: newTodoTitle,
      description: newTodoDescription,
      checked: false,
      createdAt: new Date().toISOString(),
      finishedAt: '',
      archivedAt: '',
      archived: false,
    };
    setTodos([...todos, todo]);
    setNewTodoTitle('');
    setNewTodoDescription('');
  };

  const handleDeleteTodo = (todoId) => {
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);
    setTodos(updatedTodos);
  };

  const handleEditTodo = (todoId, title, description, checked) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          title,
          description,
          checked,
          finishedAt: checked ? new Date().toISOString() : '', // Update finishedAt
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setSelectedTodo(null);
  };

  const handleArchiveTodo = (todoId) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          archived: true,
          archivedAt: new Date().toISOString(),
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
    setSelectedTodo(null);
    setDialogOpen(false);
  };

  const InlineTodoComponent = ({ todo }) => {
    // Reusable component for inline todo actions
    return (
      <>
        <IconButton
          onClick={() => {
            setSelectedTodo(todo);
            setDialogOpen(true);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteTodo(todo.id)}>
          <DeleteIcon />
        </IconButton>
        <Checkbox
          checked={todo.checked}
          onChange={() =>
            handleEditTodo(todo.id, todo.title, todo.description, !todo.checked)
          }
        />
      </>
    );
  };

  return (
    <div>
      <List>
        <h3>Available Todos</h3>
        {availableTodos?.map((todo) => (
          <ListItem key={todo.id}>
            <ListItemText primary={todo.title} secondary={todo.description} />
            <InlineTodoComponent todo={todo} />
          </ListItem>
        ))}
      </List>

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        {selectedTodo && (
          <Card>
            <CardContent>
              <h3>{selectedTodo.title}</h3>
              <div>
                <Input
                  type="text"
                  defaultValue={selectedTodo.title}
                  onChange={(e) => (selectedTodo.title = e.target.value)}
                  placeholder="Enter a new todo title..."
                />
                <Input
                  type="text"
                  defaultValue={selectedTodo.description}
                  onChange={(e) => (selectedTodo.description = e.target.value)}
                  placeholder="Enter a new todo description..."
                />
              </div>

              <Button onClick={() => handleArchiveTodo(selectedTodo.id)}>
                Archive
              </Button>
              <Button
                onClick={() => {
                  handleEditTodo(
                    selectedTodo.id,
                    selectedTodo.title,
                    selectedTodo.description,
                    selectedTodo.checked
                  );
                  setDialogOpen(false);
                }}
                variant="contained"
              >
                Confirm Edit
              </Button>
              <Checkbox
                checked={selectedTodo.checked}
                onChange={() =>
                  handleEditTodo(
                    selectedTodo.id,
                    selectedTodo.title,
                    selectedTodo.description,
                    !selectedTodo.checked
                  )
                }
              />
            </CardContent>
          </Card>
        )}
      </Dialog>
      <Card
        sx={{ maxWidth: 400 }}
        style={{ margin: 'auto', marginTop: '20px' }}
      >
        <h3>Create Todos</h3>
        <CardContent>
          <Input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Title"
          />
          <Input
            type="text"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            placeholder="Description"
          />
          <div style={{ padding: '10px' }}>
            <Button variant="contained" onClick={handleCreateTodo}>
              Add Todo
            </Button>
          </div>
        </CardContent>
      </Card>

      <hr />
      {checkedTodos.length > 0 && (
        <List>
          <h3>Checked Todos</h3>
          {checkedTodos?.map((todo) => (
            <ListItem key={todo.id}>
              <ListItemText
                primary={todo.title}
                secondary={
                  <>
                    <div>{todo.description}</div>
                    <div>
                      Finished At: {new Date(todo.finishedAt).toLocaleString()}
                    </div>
                  </>
                }
                primaryTypographyProps={{
                  style: {
                    textDecoration: todo.checked ? 'line-through' : 'none', // Add line-through style for checked items
                  },
                }}
              />
              <InlineTodoComponent todo={todo} />
            </ListItem>
          ))}
        </List>
      )}

      {archivedTodos.length > 0 && (
        <Accordion variant="elevation">
          <AccordionSummary>Archived Todos </AccordionSummary>
          <AccordionDetails>
            <List>
              {archivedTodos?.map((todo) => (
                <ListItem key={todo.id}>
                  <ListItemText
                    primary={todo.title}
                    secondary={
                      <>
                        <div>{todo.description}</div>
                        <div>
                          Archived At:{' '}
                          {new Date(todo.archivedAt).toLocaleString()}
                        </div>
                      </>
                    }
                    primaryTypographyProps={{
                      style: {
                        textDecoration: todo.checked ? 'line-through' : 'none', // Add line-through style for checked items
                      },
                    }}
                  />

                  <IconButton
                    onClick={() => {
                      setSelectedTodo(todo);
                      setDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTodo(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <Checkbox
                    checked={todo.checked}
                    onChange={() =>
                      handleEditTodo(
                        todo.id,
                        todo.title,
                        todo.description,
                        !todo.checked
                      )
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};

export default TodoList;
