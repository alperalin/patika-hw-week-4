import React, { useState } from 'react';
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
	Typography,
	MenuItem,
} from '@mui/material';

// Interfaces
import { Category, Status, StatusGetProps } from '../../utils/types';

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
	onSubmit: (categoryId: number, statusId: number) => void;
	categoryList: Category[];
	onCategoryChange: ({ categoryId }: StatusGetProps) => any;
}

function Filter({ onSubmit, categoryList, onCategoryChange }: TodoProps) {
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
		setStatusList(receivedStatus);
	}

	// Handle Status Selection
	const handleStatusChange = (event: SelectChangeEvent) => {
		setStatusSelect(event.target.value as string);
	};

	// Handle Todo Submit
	function handleSubmit(event: React.FormEvent<UserFormElements>): void {
		// Formun varsayilan islevi durduruluyor
		event.preventDefault();

		// Onsubmit ile filter degerleri gonderiliyor
		onSubmit(parseInt(categorySelect), parseInt(statusSelect));
	}

	function handleClear(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): void {
		// Butonun formu tetiklemesi engelleniyor
		event.stopPropagation();

		// Onsubmit ile filter temizleniyor
		onSubmit(0, 0);

		// Filter Select elemanlari temizleniyor.
		setCategorySelect('');
		setStatusSelect('');
	}

	return (
		<Box component="div" sx={{ width: '100%', mb: 2 }}>
			<Typography component="h2" fontSize="1.6rem" gutterBottom>
				Todo Listesi
			</Typography>
			<Box
				component="form"
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					width: '100%',
					mb: 2,
				}}
				autoComplete="off"
				onSubmit={handleSubmit}
			>
				<Typography
					sx={{ width: '10ch', mr: 1 }}
					component="h3"
					fontSize="1.2rem"
					gutterBottom
				>
					Filtrele
				</Typography>
				<FormControl sx={{ width: '33ch', mr: 1 }}>
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
				<FormControl sx={{ width: '33ch', mr: 1 }}>
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
				<Button sx={{ mr: 1 }} type="submit" variant="contained">
					Filtrele
				</Button>
				<Button type="button" variant="outlined" onClick={handleClear}>
					Filtreyi Sil
				</Button>
			</Box>
		</Box>
	);
}

export default Filter;
