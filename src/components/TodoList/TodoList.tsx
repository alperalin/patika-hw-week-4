// Imports
import React, { useState } from 'react';
import {
	Box,
	List,
	ListItem,
	ListItemText,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
	Button,
	Alert,
} from '@mui/material';

// Interface
import {
	TodoInterface,
	TodoUpdateInterface,
	Category,
	Status,
} from '../../utils/types';

interface TodoListProps {
	todoList: TodoInterface[];
	categoryList: Category[];
	statusList: Status[];
	onTodoUpdate: ({ todo }: TodoUpdateInterface) => void;
	onTodoDelete: ({ todo }: TodoUpdateInterface) => void;
}

function TodoList({
	todoList,
	categoryList,
	statusList,
	onTodoUpdate,
	onTodoDelete,
}: TodoListProps) {
	//States
	const [categorySelect, setCategorySelect] = useState<any>({});
	const [statusSelect, setStatusSelect] = useState<any>({});
	const [showAlert, setShowAlert] = useState<any>({});

	// Functions
	function handleCategorySelectChange(
		event: SelectChangeEvent,
		todo: TodoInterface
	) {
		const name = event.target.name;
		const value = event.target.value;

		setCategorySelect((prev: any) => ({
			...prev,
			[name]: value,
		}));

		setStatusSelect((prev: any) => ({
			...prev,
			[name]: '',
		}));

		todo.categoryId = parseInt(value);
		todo.statusId = -1;

		if (todo.categoryId !== -1) {
			setShowAlert((prev: any) => ({
				...prev,
				[todo.id]: false,
			}));
		}
	}

	function handleStatusSelectChange(
		event: SelectChangeEvent,
		todo: TodoInterface
	) {
		const name = event.target.name;
		const value = event.target.value;

		setStatusSelect((prev: any) => ({
			...prev,
			[name]: value,
		}));

		todo.statusId = parseInt(value);

		if (todo.statusId !== -1) {
			setShowAlert((prev: any) => ({
				...prev,
				[todo.id]: false,
			}));
		}
	}

	function handleUpdate(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		todo: TodoInterface
	) {
		if (todo.categoryId !== -1 && todo.statusId !== -1) {
			setShowAlert((prev: any) => ({
				...prev,
				[todo.id]: false,
			}));

			onTodoUpdate({ todo });
		} else {
			setShowAlert((prev: any) => ({
				...prev,
				[todo.id]: true,
			}));
		}
	}

	function handleDelete(todo: TodoInterface) {
		onTodoDelete({ todo });
	}

	return (
		<Box component="div" sx={{ width: '100%', mb: 2 }}>
			<List sx={{ width: '100%' }}>
				{todoList.map((todo) => (
					<ListItem sx={{ flexWrap: 'wrap', mt: 2, mb: 2 }} key={todo.id}>
						<ListItemText primary={todo.title} sx={{ width: '33ch' }} />
						<FormControl required sx={{ m: 1, width: '20ch' }}>
							<InputLabel id="category-select">Kategori</InputLabel>
							<Select
								labelId="category-select"
								label="Kategori"
								id={todo.categoryId ? todo.categoryId.toString() : '-1'}
								name={todo.id.toString()}
								onChange={(event) => handleCategorySelectChange(event, todo)}
								value={
									categorySelect.length
										? categorySelect[todo.id].value
										: todo.categoryId
										? todo.categoryId.toString()
										: -1
								}
							>
								{categoryList.length &&
									categoryList.map((category) => (
										<MenuItem
											key={category.id.toString()}
											value={category.id.toString()}
										>
											{category.title}
										</MenuItem>
									))}
								<MenuItem value={-1}>None</MenuItem>
							</Select>
						</FormControl>
						<FormControl required sx={{ m: 1, width: '20ch' }}>
							<InputLabel id="statu-select">Statu</InputLabel>
							<Select
								labelId="status-select"
								label="Statu"
								id={todo.statusId ? todo.statusId.toString() : '-1'}
								name={todo.id.toString()}
								onChange={(event) => handleStatusSelectChange(event, todo)}
								value={
									statusSelect.length
										? statusSelect[todo.id].value
										: todo.statusId
										? todo.statusId.toString()
										: -1
								}
							>
								{statusList &&
									statusList
										.filter((status) => todo.categoryId === status.categoryId)
										.map((filteredStatus) => (
											<MenuItem
												key={filteredStatus.id}
												value={filteredStatus.id.toString()}
											>
												{filteredStatus.title}
											</MenuItem>
										))}
								<MenuItem value={-1}>None</MenuItem>
							</Select>
						</FormControl>
						<Button
							type="button"
							variant="contained"
							sx={{ mr: 1 }}
							onClick={(event) => handleUpdate(event, todo)}
						>
							Guncelle
						</Button>
						<Button
							type="button"
							variant="outlined"
							onClick={() => handleDelete(todo)}
						>
							Sil
						</Button>
						{showAlert[todo.id] ? (
							<Alert
								sx={{ width: '100%', mt: 1 }}
								key={todo.id}
								severity="error"
							>
								Kategori ve statu seciniz
							</Alert>
						) : (
							''
						)}
					</ListItem>
				))}
			</List>
		</Box>
	);
}

export default TodoList;
