// Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import Header from '../Header/Header';
import LoginRegister from '../Login/LoginRegister';
import Todo from '../Todo/Todo';
import Filter from '../Filter/Filter';
import TodoList from '../TodoList/TodoList';
import CategoryPage from '../CategoryPage/CategoryPage';
import StatusPage from '../StatusPage/StatusPage';

// MUI
import { Box, Button, Grid } from '@mui/material';

// API
import { service } from '../../utils/service';

// Types
import {
	Login,
	Register,
	Pages,
	TodoInterface,
	TodoAddInterface,
	TodoUpdateInterface,
	Category,
	CategoryAddProps,
	CategoryUpdateProps,
	CategoryDeleteProps,
	Status,
	StatusUpdateProps,
	StatusDeleteProps,
	StatusGetProps,
	StatusGetAllProps,
	StatusCommon,
} from '../../utils/types';

function App() {
	// STATES
	const [token, setToken] = useState<string>(() => getCookie('token') || '');
	const [pages, setPages] = useState<Pages>({
		currentPage: 'App',
		prevPage: null,
	});
	const [todoList, setTodoList] = useState<TodoInterface[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [status, setStatus] = useState<Status[]>([]);
	const [editCategory, setEditCategory] = useState<Category | null>(null);

	// Token alindigindan categoriler ve todolar sunucudan cekiliyor
	useEffect(() => {
		if (token) {
			// Diger api cagrilarinda kullanilmasi icin
			// sunucunun dondugu token degeri
			// axios'un defaults degerlerine ekleniyor.
			service.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			getCategories();
			getAllTodo();
		} else {
			service.defaults.headers.common['Authorization'] = '';
			handlePageChange({ currentPage: 'Login', prevPage: null });
		}
	}, [token]);

	useEffect(() => {
		if (editCategory) {
			setPages({
				currentPage: 'StatusEdit',
				prevPage: 'CategoryEdit',
			});
		}
	}, [editCategory]);

	// FUNCTIONS
	// Get Cookie
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

	// Delete token
	function deleteToken({ currentPage, prevPage }: Pages): void {
		// Sayfa Login olarak degistiriliyor
		handlePageChange({ currentPage, prevPage });

		// Token state'i siliniyor.
		setToken('');

		// Token cookie'si siliniyor
		document.cookie = 'token=; Max-Age=-99999999;';
	}

	// Handle Login
	function handleLogin(data: Login): void {
		// API call
		service
			.post('/auth/login', data)
			.then((response) => {
				if (response.status === 200) {
					// Diger api cagrilarinda kullanilmasi icin
					// sunucunun dondugu token degeri
					// axios'un defaults degerlerine ekleniyor.
					service.defaults.headers.common['Authorization'] = `Bearer ${token}`;

					// Token cookie'ye kayit ediliyor.
					document.cookie = `token=${response.data.token}`;

					// Sunucudan gelen token verisi
					// token state'ne ekleniyor
					setToken(response.data.token);

					// Gosterilen sayfa App olarak degistiriliyor
					handlePageChange({ currentPage: 'App', prevPage: 'Login' });
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Handle Register
	function handleRegister(data: Register): void {
		// API call
		service
			.post('/auth/register', data)
			.then((response) => {
				if (response.status === 200) {
					// Diger api cagrilarinda kullanilmasi icin
					// sunucunun dondugu token degeri
					// axios'un defaults degerlerine ekleniyor.
					service.defaults.headers.common['Authorization'] = `Bearer ${token}`;

					// Token cookie'ye kayit ediliyor.
					document.cookie = `token=${response.data.token}`;

					// Sunucudan gelen token verisi
					// token state'ne ekleniyor
					setToken(response.data.token);

					// Gosterilen sayfa App olarak degistiriliyor
					handlePageChange({ currentPage: 'App', prevPage: 'Login' });
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Category Operations
	function addCategory(data: CategoryAddProps): void {
		// API call
		service
			.post('/category', data)
			.then((response) => {
				if (response.status === 200) {
					const category: Category = response.data;
					setCategories((prev) => [...prev, category]);
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function getCategories(): void {
		// API call
		service
			.get('/category')
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

	function updateCategory({ id, title }: CategoryUpdateProps): void {
		// API call
		service
			.put(`/category/${id}`, { title })
			.then((response) => {
				if (response.status === 200) {
					getCategories();
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function deleteCategory({ id }: CategoryDeleteProps): void {
		// API Call
		service
			.delete(`/category/${id}`)
			.then((response) => {
				if (response.status === 200) {
					getCategories();
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Status Operations
	async function addStatus(data: StatusCommon) {
		// API call
		const status: Status = await service
			.post('/status', data)
			.then((response) => {
				if (response.status === 200) {
					setStatus((prev) => [...prev, response.data]);
					return response.data;
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
		return status;
	}

	async function getStatus(data: StatusGetProps) {
		// API call
		const status: Status[] = await service
			.get('/status', { params: data })
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

	async function getAllStatus({ categories }: StatusGetAllProps) {
		const receivedStatus = await Promise.all(
			categories.map((category) => getStatus({ categoryId: category.id }))
		);

		receivedStatus.forEach((status) =>
			setStatus((prev) => [...prev, ...status])
		);
	}

	function updateStatus({
		id,
		title,
		color,
		categoryId,
	}: StatusUpdateProps): void {
		const data = JSON.stringify({ title, categoryId, color });

		// API call
		service
			.put(`/status/${id}`, data)
			.then((response) => {
				if (response.status === 200) {
					getAllStatus({ categories });
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function deleteStatus({ id }: StatusDeleteProps): void {
		// API call
		service
			.delete(`/status/${id}`)
			.then((response) => {
				if (response.status === 200) {
					getAllStatus({ categories });
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	// Todo Operations
	function addTodo(data: TodoAddInterface): void {
		// API call
		service
			.post('/todo', data)
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

	function updateTodo({ todo }: TodoUpdateInterface): void {
		const data = JSON.stringify({
			title: todo.title,
			categoryId: todo.categoryId,
			statusId: todo.statusId,
		});

		// API call
		service
			.put(`/todo/${todo.id}`, data)
			.then((response) => {
				if (response.status === 200) {
					getAllTodo();
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function deleteTodo({ todo }: TodoUpdateInterface): void {
		// API call
		service
			.delete(`/todo/${todo.id}`)
			.then((response) => {
				if (response.status === 200) {
					getAllTodo();
				}
			})
			.catch((error) => {
				console.log(`error code: ${error.response.status}`);
				console.dir(error.response.data);
			});
	}

	function getAllTodo(): void {
		// API call
		service
			.get('/todo')
			.then((response) => {
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

	// Filter Operations
	function filter(categoryId: number, statusId: number) {
		const params = Object.fromEntries(
			Object.entries({ categoryId: categoryId, statusId: statusId }).filter(
				([key, value]) => value
			)
		);

		axios
			.get('http://localhost:80/todo', {
				params: params,
				headers: {
					Authorization: `Bearer ${token}`,
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

	// Page Change
	function handlePageChange({ currentPage, prevPage }: Pages) {
		if (currentPage === 'CategoryEdit') setEditCategory(null);
		setPages({ currentPage, prevPage });
	}

	// App Ekrani Donuluyor
	if (token && pages.currentPage === 'App') {
		// MAIN PAGE
		return (
			<>
				<Header
					pages={pages}
					onBackButtonClick={handlePageChange}
					onLogoutButtonClick={deleteToken}
				/>
				<Box
					sx={{
						maxWidth: '100%',
						width: '100%',
						p: 2,
						boxSizing: 'border-box',
						mt: 2,
						mb: 2,
					}}
				>
					<Grid container spacing={2} direction="row" justifyContent="center">
						<Grid item xs={2}></Grid>
						<Grid sx={{ display: 'flex', flexWrap: 'wrap' }} item xs={8}>
							{/* Todo */}
							<Todo
								onSubmit={addTodo}
								categoryList={categories}
								onCategoryChange={getStatus}
							/>

							{/* Filter */}
							<Filter
								onSubmit={filter}
								categoryList={categories}
								onCategoryChange={getStatus}
							/>

							{/* Todolist */}
							<TodoList
								todoList={todoList}
								categoryList={categories}
								statusList={status}
								onTodoUpdate={updateTodo}
								onTodoDelete={deleteTodo}
							/>

							{/* Change category */}
							<Button
								sx={{ margin: '0 auto' }}
								type="button"
								variant="contained"
								onClick={() =>
									setPages({ currentPage: 'CategoryEdit', prevPage: 'App' })
								}
							>
								Kategorileri duzenle
							</Button>
						</Grid>
						<Grid item xs={2}></Grid>
					</Grid>
				</Box>
			</>
		);
	} else if (token && pages.currentPage === 'CategoryEdit') {
		// KATEGORI DUZENLE
		return (
			<>
				<Header
					pages={pages}
					onBackButtonClick={handlePageChange}
					onLogoutButtonClick={deleteToken}
				/>
				<CategoryPage
					onNewCategorySubmit={addCategory}
					onUpdateCategorySubmit={updateCategory}
					onDeleteCategorySubmit={deleteCategory}
					onStatusEdit={setEditCategory}
					categoriesList={categories}
				/>
			</>
		);
	} else if (token && pages.currentPage === 'StatusEdit') {
		// STATU DUZENLE
		return (
			<>
				<Header
					pages={pages}
					onBackButtonClick={handlePageChange}
					onLogoutButtonClick={deleteToken}
				/>
				<StatusPage
					categoryItem={editCategory}
					onAddStatus={addStatus}
					onGetStatus={getStatus}
					onUpdateStatus={updateStatus}
					onDeleteStatus={deleteStatus}
				/>
			</>
		);
	} else {
		// LOGIN REGISTER
		return (
			<>
				<Header
					pages={pages}
					onBackButtonClick={handlePageChange}
					onLogoutButtonClick={deleteToken}
				/>
				<LoginRegister onLogin={handleLogin} onRegister={handleRegister} />;
			</>
		);
	}
}

export default App;
