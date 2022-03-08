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

// Interfaces
import {
	Category,
	TodoAddInterface,
	Status,
	StatusGetProps,
} from '../../utils/types';

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
	onCategoryChange: ({ categoryId }: StatusGetProps) => any;
}

// Component
function Todo({ onSubmit, categoryList, onCategoryChange }: TodoProps) {
	// States
	const [categorySelect, setCategorySelect] = useState<string>('');
	const [statusSelect, setStatusSelect] = useState<string>('');
	const [statusList, setStatusList] = useState<Status[]>([]);

	// Handle Category Selection
	async function handleCategorySelectChange(event: SelectChangeEvent) {
		setCategorySelect(event.target.value as string);

		// Secilen kategoriye bagli statuleri al
		const receivedStatus = await onCategoryChange({
			categoryId: parseInt(event.target.value),
		});

		// Gelen statuleri state icerisine at.
		if (receivedStatus.length) {
			setStatusList(receivedStatus);
		}
	}

	// Handle Status Selection
	const handleStatusChange = (event: SelectChangeEvent) => {
		setStatusSelect(event.target.value as string);
	};

	// Handle Todo Submit
	function handleSubmit(event: React.FormEvent<UserFormElements>): void {
		event.preventDefault();
		const todoText = event.currentTarget.elements.todoInput;

		// Todo verisi onSubmit uzerinden App component'ine gonderiliyor
		onSubmit({
			title: todoText.value,
			categoryId: parseInt(categorySelect),
			statusId: parseInt(statusSelect),
		});

		// Input degerleri temizleniyor
		todoText.value = '';
		setCategorySelect('');
		setStatusSelect('');
	}

	// Return Element
	return (
		<Box component="div" sx={{ width: '100%', mb: 10 }}>
			<Typography component="h2" fontSize="1.6rem" m={1} gutterBottom>
				Todo Ekle
			</Typography>
			<form autoComplete="off" onSubmit={handleSubmit}>
				<TextField
					sx={{ width: '60ch', m: 1 }}
					id="todoInput"
					name="todoInput"
					label="Todo Metni"
					placeholder="Todo Metni"
					required
				/>
				<FormControl required sx={{ m: 1, width: '20ch' }}>
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
				<FormControl required sx={{ m: 1, width: '20ch' }}>
					<InputLabel id="demo-simple-select-label">Statu</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="statuSelect"
						value={statusSelect}
						label="Statu Sec"
						onChange={handleStatusChange}
					>
						{statusList.length &&
							statusList.map((status) => (
								<MenuItem key={status.id} value={status.id.toString()}>
									{status.title}
								</MenuItem>
							))}
					</Select>
				</FormControl>
				<Button
					sx={{ width: '25ch', ml: 1, mr: 1, fontSize: '1rem' }}
					type="submit"
					variant="contained"
				>
					Ekle
				</Button>
			</form>
		</Box>
	);
}

export default Todo;
