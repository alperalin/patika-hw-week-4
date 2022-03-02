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
} from '@mui/material';

// Interface
import { TodoInterface, Category, Status } from '../App/App';

interface TodoListProps {
	todoList: TodoInterface[];
	categoryList: Category[];
	statusList: Status[];
}

function TodoList({ todoList, categoryList, statusList }: TodoListProps) {
	const [categorySelect, setCategorySelect] = useState<string>('');
	const [statusSelect, setStatusSelect] = useState<string>('');

	const handleCategorySelectChange = (event: SelectChangeEvent) => {
		setCategorySelect(event.target.value as string);
	};

	const handleStatusChange = (event: SelectChangeEvent) => {
		setStatusSelect(event.target.value as string);
	};

	return (
		<Box
			sx={{
				'& .MuiTextField-root': { m: 1, width: '25ch' },
			}}
		>
			<Typography variant="h2" gutterBottom component="h1">
				Todo Listesi
			</Typography>

			<List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
				{todoList.map((todo) => (
					<ListItem key={todo.id}>
						<ListItemText primary={todo.title} />
						<FormControl required sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Kategori</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="categorySelect"
								value={categorySelect}
								label="Kategori Sec"
								onChange={handleCategorySelectChange}
								defaultValue={todo.categoryId.toString()}
							>
								{/* {categories.map((category) => (
								<MenuItem value={todo.category.id.toString()}>
									{todo.category.name}
								</MenuItem>
							))} */}
							</Select>
						</FormControl>
						<FormControl required sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Statu</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="statuSelect"
								value={statusSelect}
								label="Statu Sec"
								onChange={handleStatusChange}
							>
								<MenuItem value={10}>
									{/* {todo.category.status ? todo.category.status.name : ''} */}
								</MenuItem>
							</Select>
						</FormControl>
					</ListItem>
				))}
			</List>
		</Box>
	);
}

export default TodoList;
