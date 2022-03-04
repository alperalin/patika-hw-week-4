// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import LoginRegister from '../Login/LoginRegister';
import Todo from '../Todo/Todo';
import TodoList from '../TodoList/TodoList';

// MUI
import { Box, Typography, Button, Modal } from '@mui/material';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export interface TodoInterface {
	id: number;
	userId: number;
	title: string;
	categoryId: number;
	statusId: number;
	updatedAt: string;
	createdAt: string;
}

export interface TodoAddInterface {
	title: string;
	categoryId: number;
	statusId: number;
}

export interface TodoGetInterface {
	apiToken: string;
}

export interface TodoUpdateInterface {
	apiToken?: string;
	todo: TodoInterface;
}

export interface Category {
	id: number;
	userId: number;
	title: string;
	createdAt: string;
	updatedAt: string;
}

interface CategoryOprProps {
	apiToken: string;
}

interface CategoryAddProps extends CategoryOprProps {
	title: Category['title'];
}

interface StatusCommon {
	title: string;
	categoryId: number;
	color: string;
}

export interface Status extends StatusCommon {
	id: number;
}

interface StatusAddProps extends StatusCommon {
	apiToken: string;
}

export interface StatusGetProps {
	apiToken?: string;
	categoryId: number;
}

export interface StatusGetAllProps {
	apiToken?: string;
	categories: Category[];
}

export interface Login {
	username: string;
	password: string;
}

export interface Register extends Login {
	passwordConfirm: string;
}

function App() {
	// STATES
	const [token, setToken] = useState<string>(() => getCookie('token') || '');
	const [categories, setCategories] = useState<Category[]>([]);
	const [status, setStatus] = useState<Status[]>([]);
	const [todoList, setTodoList] = useState<TodoInterface[]>([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (token) {
			getCategories({ apiToken: token });
			getAllTodo({ apiToken: token });
		}
	}, [token]);

	// FUNCTIONS
	function getCookie(cname: string): string {
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}

	const handleCategorySubmit = (event: React.SyntheticEvent) => {
		event.preventDefault();
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Category Operations
	function addCategory({ apiToken, title }: CategoryAddProps): void {
		const data = JSON.stringify({ title });

		axios
			.post('http://localhost:80/category', data, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				if (response.status === 200) {
					const category: Category = response.data;
					setCategories((prev) => [...prev, category]);
					addStatus({
						apiToken,
						title: 'Backlog',
						categoryId: category.id,
						color: 'purple',
					});
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function getCategories({ apiToken }: CategoryOprProps): void {
		axios
			.get('http://localhost:80/category', {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then((response) => {
				if (response.status === 200) {
					const categories: Category[] = response.data;
					setCategories(categories);
					getAllStatus({ categories });
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Status Operations
	function addStatus({
		title,
		categoryId,
		color,
		apiToken,
	}: StatusAddProps): void {
		const data = JSON.stringify({ title, categoryId, color });

		axios
			.post('http://localhost:80/status', data, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				if (response.status === 200) {
					const status: Status = response.data;
					setStatus((prev) => [...prev, status]);
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	async function getStatus({ apiToken = token, categoryId }: StatusGetProps) {
		const status: Status[] = await axios
			.get(`http://localhost:80/status?categoryId=${categoryId}`, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then((response) => {
				if (response.status === 200) {
					return response.data;
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
		return status;
	}

	async function getAllStatus({
		apiToken = token,
		categories,
	}: StatusGetAllProps) {
		const receivedStatus = await Promise.all(
			categories.map((category) => getStatus({ categoryId: category.id }))
		);

		receivedStatus.forEach((status) =>
			setStatus((prev) => [...prev, ...status])
		);
	}

	// Handle Login
	function handleLogin(formData: Login): void {
		const data = JSON.stringify(formData);
		axios
			.post('http://localhost:80/auth/login', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				if (response.status === 200) {
					const apiToken = response.data.token;
					document.cookie = `token=${apiToken}`;
					setToken(apiToken);
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Handle Register
	function handleRegister(formData: Register): void {
		const data = JSON.stringify(formData);
		axios
			.post('http://localhost:80/auth/register', data, {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				if (response.status === 200) {
					const apiToken = response.data.token;
					document.cookie = `token=${apiToken}`;
					setToken(apiToken);
					addCategory({ apiToken, title: 'General' });
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Todo Operations
	function addTodo(todoData: TodoAddInterface): void {
		const data = JSON.stringify(todoData);
		axios
			.post('http://localhost:80/todo', data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				if (response.status === 200) {
					const todo: TodoInterface = response.data;
					setTodoList((prev) => [...prev, { ...todo }]);
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function updateTodo({ apiToken = token, todo }: TodoUpdateInterface): void {
		const data = JSON.stringify({
			title: todo.title,
			categoryId: todo.categoryId,
			statusId: todo.statusId,
		});

		axios
			.put(`http://localhost:80/todo/${todo.id}`, data, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
					'Content-Type': 'application/json',
				},
			})
			.then((response) => {
				if (response.status === 200) {
					console.log(response.data);
					getAllTodo({ apiToken: token });
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function deleteTodo({ apiToken = token, todo }: TodoUpdateInterface): void {
		axios
			.delete(`http://localhost:80/todo/${todo.id}`, {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then((response) => {
				if (response.status === 200) {
					console.log(response.data);
					getAllTodo({ apiToken: token });
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function getAllTodo({ apiToken }: TodoGetInterface): void {
		axios
			.get('http://localhost:80/todo', {
				headers: {
					Authorization: `Bearer ${apiToken}`,
				},
			})
			.then(async (response) => {
				if (response.status === 200) {
					const receivedTodoList: TodoInterface[] = response.data;
					setTodoList(receivedTodoList);
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	return (
		<Box
			sx={{
				maxWidth: '100%',
				width: '100%',
				p: 2,
				boxSizing: 'border-box',
			}}
		>
			{token ? (
				<>
					{/* // APP */}
					<Typography variant="h1" component="h1" gutterBottom>
						TodoList App
					</Typography>

					{/* Todo */}
					<Todo
						onSubmit={addTodo}
						categoryList={categories}
						onCategoryChange={getStatus}
					/>

					<TodoList
						todoList={todoList}
						categoryList={categories}
						statusList={status}
						onTodoUpdate={updateTodo}
						onTodoDelete={deleteTodo}
					/>

					<Button type="button" variant="contained" onClick={handleOpen}>
						Kategorileri duzenle
					</Button>

					{/* Kategorileri Duzenleme Modali */}
					{/* <Modal
						open={open}
						onClose={handleClose}
						aria-labelledby="modal-modal-title"
						aria-describedby="modal-modal-description"
					>
						<Box sx={style}>
							<Typography id="modal-modal-title" variant="h6" component="h2">
								Kategorileri Duzenle
							</Typography>
							<Typography id="modal-modal-description" sx={{ mt: 2 }}>
								Asagida kategorileri duzenleyebilirsiniz.
							</Typography>
							<Box
								component="form"
								sx={{
									'& .MuiTextField-root': { m: 1, width: '25ch' },
								}}
								noValidate
								autoComplete="off"
								onSubmit={handleCategorySubmit}
							>
								<TextField
									id="todoInput"
									label="Todo Metni"
									placeholder="Todo Metni"
									onChange={(event: any) => {
										setCategoryText(event.target.value);
									}}
									value={categoryText}
									required
								/>
								<br />
								<Button type="submit" variant="contained">
									Kategori Ekle
								</Button>
							</Box>

							<h5>Kategoriler</h5>
							<Box
								sx={{
									'& .MuiTextField-root': { m: 1, width: '25ch' },
								}}
							>
								<List
									sx={{
										width: '100%',
										maxWidth: 360,
										bgcolor: 'background.paper',
									}}
								>
									{/* {categories.map((category) => (
										<ListItem key={category.id}>
											<ListItemText primary={`${category.name}`} />
										</ListItem>
									))} */}
					{/* </List>
							</Box>
						</Box> */}
					{/* </Modal> */}
				</>
			) : (
				// LOGIN REGISTER
				<LoginRegister onLogin={handleLogin} onRegister={handleRegister} />
			)}
		</Box>
	);
}

export default App;
