// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Styles
import './App.css';

// Components
import LoginRegister from './components/Login/LoginRegister';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Modal from '@mui/material/Modal';

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

interface Todo {
	id: number;
	text: string;
	category: Category;
}

interface Category {
	id: number;
	name: string;
	status?: {
		id: number;
		name: string;
	};
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
	const [categoryList, setCategoryList] = useState<Category[]>([]);
	const [categorySelect, setCategorySelect] = useState('');
	const [categoryText, setCategoryText] = useState<string>('');
	const [status, setStatus] = useState('');
	const [todoList, setTodoList] = useState<Todo[]>([]);
	const [todoText, setTodoText] = useState<string>('');
	const [open, setOpen] = useState(false);

	useEffect(() => console.log(token), [token]);

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

	const handleCategorySelectChange = (event: SelectChangeEvent) => {
		setCategorySelect(event.target.value as string);
	};

	const handleStatusChange = (event: SelectChangeEvent) => {
		setStatus(event.target.value as string);
	};

	const handleSubmit = (event: React.SyntheticEvent) => {
		event.preventDefault();
		setTodoList([
			...todoList,
			{
				id: Math.round(Math.random() * 1000),
				text: todoText,
				category: {
					id: Math.round(Math.random() * 1000),
					name: categorySelect,
					status: {
						id: Math.round(Math.random() * 1000),
						name: status,
					},
				},
			},
		]);
	};

	const handleCategorySubmit = (event: React.SyntheticEvent) => {
		event.preventDefault();
		setCategoryList([
			...categoryList,
			{
				id: Math.round(Math.random() * 1000),
				name: categoryText,
			},
		]);
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

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
					const token = response.data.token;
					document.cookie = `token=${token}`;
					setToken(token);
				}
			})
			.catch((error) =>
				console.log(
					`error code: ${error.response.status} message: ${error.response.data}`
				)
			);
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
					const token = response.data.token;
					document.cookie = `token=${token}`;
					setToken(token);
				}
			})
			.catch((error) =>
				console.log(
					`error code: ${error.response.status} message: ${error.response.data}`
				)
			);
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

					<Typography variant="h2" gutterBottom component="h1">
						Todo Ekle
					</Typography>
					<Box
						component="form"
						sx={{
							'& .MuiTextField-root': { m: 1, width: '25ch' },
						}}
						noValidate
						autoComplete="off"
						onSubmit={handleSubmit}
					>
						<TextField
							id="todoInput"
							label="Todo Metni"
							placeholder="Todo Metni"
							onChange={(event: any) => {
								setTodoText(event.target.value);
							}}
							value={todoText}
							required
						/>
						<FormControl sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Kategori</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="categorySelect"
								value={categorySelect}
								label="Kategori Sec"
								onChange={handleCategorySelectChange}
							>
								{categoryList.map((category) => (
									<MenuItem value={category.id.toString()}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Statu</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="statuSelect"
								value={status}
								label="Statu Sec"
								onChange={handleStatusChange}
							>
								<MenuItem value={10}>Statu 1</MenuItem>
								<MenuItem value={20}>Statu 2</MenuItem>
								<MenuItem value={30}>Statu 3</MenuItem>
							</Select>
						</FormControl>
						<br />
						<Button type="submit" variant="contained">
							Ekle
						</Button>
					</Box>

					<Typography variant="h2" gutterBottom component="h1">
						Filtrele
					</Typography>
					<Box
						component="form"
						sx={{
							'& .MuiTextField-root': { m: 1, width: '25ch' },
						}}
						noValidate
						autoComplete="off"
						onSubmit={handleSubmit}
					>
						<FormControl sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Kategori</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="categorySelect"
								value={categorySelect}
								label="Kategori Sec"
								onChange={handleCategorySelectChange}
							>
								{categoryList.map((category) => (
									<MenuItem value={category.id.toString()}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Statu</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="statuSelect"
								value={status}
								label="Statu Sec"
								onChange={handleStatusChange}
							>
								<MenuItem value={10}>Statu 1</MenuItem>
								<MenuItem value={20}>Statu 2</MenuItem>
								<MenuItem value={30}>Statu 3</MenuItem>
							</Select>
						</FormControl>
						<Button type="submit" variant="contained">
							Filtrele
						</Button>
						<Button type="button" variant="outlined">
							Filtreyi Temizle
						</Button>
					</Box>

					<Typography variant="h2" gutterBottom component="h1">
						Todo Listesi
					</Typography>
					<Box
						sx={{
							'& .MuiTextField-root': { m: 1, width: '25ch' },
						}}
					>
						<List
							sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
						>
							{todoList.map((todo) => (
								<ListItem key={todo.id}>
									<ListItemText
										primary={`${todo.text} ${todo.category.name} ${
											todo.category.status ? todo.category.status.name : ''
										}`}
									/>
									<FormControl sx={{ m: 1, minWidth: 120 }}>
										<InputLabel id="demo-simple-select-label">
											Kategori
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="categorySelect"
											value={categorySelect}
											label="Kategori Sec"
											onChange={handleCategorySelectChange}
										>
											{categoryList.map((category) => (
												<MenuItem value={todo.category.id.toString()}>
													{todo.category.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									<FormControl sx={{ m: 1, minWidth: 120 }}>
										<InputLabel id="demo-simple-select-label">Statu</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="statuSelect"
											value={status}
											label="Statu Sec"
											onChange={handleStatusChange}
										>
											<MenuItem value={10}>
												{todo.category.status ? todo.category.status.name : ''}
											</MenuItem>
										</Select>
									</FormControl>
								</ListItem>
							))}
						</List>
					</Box>

					<Button type="button" variant="contained" onClick={handleOpen}>
						Kategorileri duzenle
					</Button>

					{/* Kategorileri Duzenleme Modali */}
					<Modal
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
									{categoryList.map((category) => (
										<ListItem key={category.id}>
											<ListItemText primary={`${category.name}`} />
										</ListItem>
									))}
								</List>
							</Box>
						</Box>
					</Modal>
				</>
			) : (
				// LOGIN REGISTER
				<LoginRegister onLogin={handleLogin} onRegister={handleRegister} />
			)}
		</Box>
	);
}

export default App;
