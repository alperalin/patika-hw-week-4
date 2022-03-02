// Imports
import React, { useState } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import { Category, TodoAddInterface, Status } from '../App/App';

// Interfaces
// TypeScript currentTarget icindeki elements'i tanimadigi
// icin elements'i tanimlayan bir interface olusturuldu
interface FormElements extends HTMLFormControlsCollection {
	todoInput: HTMLInputElement;
}

interface UserFormElements extends HTMLFormElement {
	readonly elements: FormElements;
}

// Props
interface TodoProps {
	onSubmit: (todo: TodoAddInterface) => void;
	categoryList: Category[];
	statusList: Status[];
}

function Todo({ onSubmit, categoryList, statusList }: TodoProps) {
	const [categorySelect, setCategorySelect] = useState<string>('');
	const [statusSelect, setStatusSelect] = useState<string>('');

	const handleCategorySelectChange = (event: SelectChangeEvent) => {
		setCategorySelect(event.target.value as string);
	};

	const handleStatusChange = (event: SelectChangeEvent) => {
		setStatusSelect(event.target.value as string);
	};

	function handleSubmit(event: React.FormEvent<UserFormElements>): void {
		event.preventDefault();
		const todoText: string = event.currentTarget.elements.todoInput.value;

		onSubmit({
			title: todoText,
			categoryId: parseInt(categorySelect),
			statusId: parseInt(statusSelect),
		});
	}

	return (
		<Box component="div" sx={{ width: '100%', mb: 10 }}>
			<Typography variant="h2" gutterBottom component="h1">
				Todo Ekle
			</Typography>
			<form autoComplete="off" onSubmit={handleSubmit}>
				<TextField
					sx={{ width: '33ch', m: 1 }}
					id="todoInput"
					name="todoInput"
					label="Todo Metni"
					placeholder="Todo Metni"
					required
				/>
				<FormControl required sx={{ m: 1, minWidth: 120 }}>
					<InputLabel id="demo-simple-select-label">Kategori</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="categorySelect"
						value={categorySelect}
						label="Kategori Sec"
						onChange={handleCategorySelectChange}
					>
						{categoryList &&
							categoryList.map((category) => (
								<MenuItem key={category.id} value={category.id.toString()}>
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
						value={statusSelect}
						label="Statu Sec"
						onChange={handleStatusChange}
					>
						{categorySelect &&
							statusList.map((status) =>
								status.categoryId.toString() === categorySelect ? (
									<MenuItem key={status.id} value={status.id.toString()}>
										{status.title}
									</MenuItem>
								) : (
									''
								)
							)}
					</Select>
				</FormControl>
				<br />
				<Button sx={{ ml: 1, mr: 1 }} type="submit" variant="contained">
					Ekle
				</Button>
			</form>
		</Box>
	);
}

export default Todo;
