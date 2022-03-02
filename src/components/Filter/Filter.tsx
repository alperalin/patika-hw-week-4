import React, { useState } from 'react';
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';

function Filter() {
	const [categorySelect, setCategorySelect] = useState<string>('');
	const [statusSelect, setStatusSelect] = useState<string>('');

	const handleCategorySelectChange = (event: SelectChangeEvent) => {
		setCategorySelect(event.target.value as string);
	};

	const handleStatusChange = (event: SelectChangeEvent) => {
		setStatusSelect(event.target.value as string);
	};

	return '';
	// <Box component="div" sx={{ width: '100%', mb: 10 }}>
	// 	<Typography variant="h2" gutterBottom component="h1">
	// 		Filtrele
	// 	</Typography>
	// 	<Box
	// 		component="form"
	// 		sx={{
	// 			'& .MuiTextField-root': { m: 1, width: '25ch' },
	// 		}}
	// 		noValidate
	// 		autoComplete="off"
	// 		// onSubmit={handleSubmit}
	// 	>
	// 		<FormControl sx={{ m: 1, minWidth: 120 }}>
	// 			<InputLabel id="demo-simple-select-label">Kategori</InputLabel>
	// 			<Select
	// 				labelId="demo-simple-select-label"
	// 				id="categorySelect"
	// 				value={categorySelect}
	// 				label="Kategori Sec"
	// 				onChange={handleCategorySelectChange}
	// 			>
	// 				{/* {categories.map((category) => (
	// 							<MenuItem value={category.id.toString()}>
	// 								{category.name}
	// 							</MenuItem>
	// 						))} */}
	// 			</Select>
	// 		</FormControl>
	// 		<FormControl sx={{ m: 1, minWidth: 120 }}>
	// 			<InputLabel id="demo-simple-select-label">Statu</InputLabel>
	// 			<Select
	// 				labelId="demo-simple-select-label"
	// 				id="statuSelect"
	// 				// value={status}
	// 				label="Statu Sec"
	// 				onChange={handleStatusChange}
	// 			>
	// 				<MenuItem value={10}>Statu 1</MenuItem>
	// 				<MenuItem value={20}>Statu 2</MenuItem>
	// 				<MenuItem value={30}>Statu 3</MenuItem>
	// 			</Select>
	// 		</FormControl>
	// 		<Button type="submit" variant="contained">
	// 			Filtrele
	// 		</Button>
	// 		<Button type="button" variant="outlined">
	// 			Filtreyi Temizle
	// 		</Button>
	// 	</Box>
	// </Box>
}

export default Filter;
