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
import { TodoInterface, Category, Status, StatusGetProps } from '../App/App';

interface TodoListProps {
	todoList: TodoInterface[];
	categoryList: Category[];
	statusList: Status[];
	onGetStatus: ({ apiToken, categoryId }: StatusGetProps) => void;
}

function TodoList({
	todoList,
	categoryList,
	statusList,
	onGetStatus,
}: TodoListProps) {
	const [categorySelect, setCategorySelect] = useState<string>('');
	const [statusSelect, setStatusSelect] = useState<string>('');

	const handleCategorySelectChange = (event: SelectChangeEvent) => {
		setCategorySelect(event.target.value as string);
		console.log(event.target.value as string);
	};

	const handleStatusChange = (event: SelectChangeEvent) => {
		setStatusSelect(event.target.value as string);
	};

	return (
		<Box component="div" sx={{ width: '100%', mb: 10 }}>
			<Typography variant="h2" gutterBottom component="h1">
				Todo Listesi
			</Typography>

			<List sx={{ width: '100%', maxWidth: 800 }}>
				{todoList.map((todo) => (
					<ListItem key={todo.id}>
						<ListItemText primary={todo.title} />
						<FormControl required sx={{ m: 1, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-label">Kategori</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="categorySelect"
								label="Kategori Sec"
								onChange={handleCategorySelectChange}
								defaultValue={`${todo.categoryId}`}
							>
								{categoryList.map((category) => (
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
								onChange={handleStatusChange}
								defaultValue={'10'}
							>
								<MenuItem value={10}>test statu</MenuItem>
							</Select>
						</FormControl>
					</ListItem>
				))}
			</List>
		</Box>
	);
}

export default TodoList;
