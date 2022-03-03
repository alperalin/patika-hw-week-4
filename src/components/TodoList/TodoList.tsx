// Imports
import React, { useState } from 'react';
import {
	Box,
	List,
	ListItem,
	ListItemText,
	FormControl,
	InputLabel,
	Typography,
	Select,
	MenuItem,
	SelectChangeEvent,
	Checkbox,
} from '@mui/material';

// Interface
import {
	TodoInterface,
	TodoUpdateInterface,
	Category,
	Status,
} from '../App/App';

interface TodoListProps {
	todoList: TodoInterface[];
	categoryList: Category[];
	statusList: Status[];
	onTodoUpdate: ({ apiToken, todo }: TodoUpdateInterface) => void;
}

function TodoList({
	todoList,
	categoryList,
	statusList,
	onTodoUpdate,
}: TodoListProps) {
	const [categorySelect, setCategorySelect] = useState<string>('');
	const [statusSelect, setStatusSelect] = useState<string>('');

	const handleCategorySelectChange = async (
		event: SelectChangeEvent,
		todo: TodoInterface
	) => {
		// todo.categoryId = parseInt(event.target.value);
		// onTodoUpdate({ todo });
	};

	// const handleStatusChange = (event: SelectChangeEvent) => {
	// 	setStatusSelect(event.target.value as string);
	// };

	return (
		<Box component="div" sx={{ width: '100%', mb: 10 }}>
			<Typography variant="h2" gutterBottom component="h1">
				Todo Listesi
			</Typography>

			<List sx={{ width: '100%', maxWidth: 800 }}>
				{todoList.map((todo) => (
					<ListItem key={todo.id}>
						<Checkbox value={todo.done} readOnly={true} />
						<ListItemText primary={todo.title} />
						<FormControl required sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Kategori</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="categorySelect"
								label="Kategori Sec"
								onChange={(event) => handleCategorySelectChange(event, todo)}
								defaultValue={`${todo.categoryId}`}
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
							</Select>
						</FormControl>
						<FormControl required sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Statu</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="statuSelect"
								label="Statu Sec"
								defaultValue={todo.statusId ? todo.statusId.toString() : ''}
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
							</Select>
						</FormControl>
					</ListItem>
				))}
			</List>
		</Box>
	);
}

export default TodoList;
