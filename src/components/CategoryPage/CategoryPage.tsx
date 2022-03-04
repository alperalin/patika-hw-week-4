// Imports
import React from 'react';

// MUI
import {
	Box,
	Typography,
	Button,
	List,
	ListItem,
	TextField,
} from '@mui/material';

// interface
import {
	Category,
	CategoryAddProps,
	CategoryUpdateProps,
	CategoryDeleteProps,
} from '../App/App';

interface CategoryPageProps {
	categoriesList: Category[];
	onNewCategorySubmit: ({ apiToken, title }: CategoryAddProps) => void;
	onUpdateCategorySubmit: ({
		apiToken,
		id,
		title,
	}: CategoryUpdateProps) => void;
	onDeleteCategorySubmit: ({ apiToken, id }: CategoryDeleteProps) => void;
	onStatusEdit: any;
}

// TypeScript currentTarget icindeki elements'i tanimadigi
// icin elements'i tanimlayan bir interface olusturuldu
interface FormElements extends HTMLFormControlsCollection {
	newCategoryInput: HTMLInputElement;
	categoryInput: HTMLInputElement;
}

interface UserFormElements extends HTMLFormElement {
	readonly elements: FormElements;
}

function CategoryPage({
	categoriesList,
	onNewCategorySubmit,
	onUpdateCategorySubmit,
	onDeleteCategorySubmit,
	onStatusEdit,
}: CategoryPageProps) {
	// Functions
	function handleNewCategorySubmit(event: React.FormEvent<UserFormElements>) {
		// Formun varsayilan aksiyonu durduruluyor
		event.preventDefault();

		// Input bir degiskene ataniyor
		const newCategoryTitle = event.currentTarget.elements.newCategoryInput;

		// Input degeri yeni kategori olusturulmasi icin App component'ine gonderiliyor
		onNewCategorySubmit({ title: newCategoryTitle.value });

		// Input temizleniyor
		newCategoryTitle.value = '';
	}

	function handleCategoryUpdateSubmit(
		event: React.FormEvent<UserFormElements>
	) {
		// Formun varsayilan aksiyonu durduruluyor
		event.preventDefault();

		console.log('hello');

		// Input bir degiskene ataniyor
		const updatedCategoryId = parseInt(
			event.currentTarget.elements.categoryInput.id
		);
		const updatedCategoryTitle =
			event.currentTarget.elements.categoryInput.value;

		// Input degeri yeni kategori olusturulmasi icin App component'ine gonderiliyor
		onUpdateCategorySubmit({
			id: updatedCategoryId,
			title: updatedCategoryTitle,
		});
	}

	function handleDeleteCategorySubmit(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		categoryId: number
	) {
		// Formun Submit'ini tetiklemesi engelleniyor
		event.stopPropagation();

		// Category id, kategori silinmesi icin App component'ine gonderiliyor
		onDeleteCategorySubmit({
			id: categoryId,
		});
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
			{/* // KATEGORI DUZENLE */}
			<Typography variant="h1" component="h1" gutterBottom>
				Kategorileri Duzenle
			</Typography>
			<Box component="div" sx={{ width: '100%', mb: 10 }}>
				<Typography variant="h2" gutterBottom component="h1">
					Kategori Ekle
				</Typography>

				<Box
					component="form"
					sx={{
						display: 'flex',
						flexWrap: 'wrap',
						alignItems: 'center',
						width: '100%',
						mb: 10,
					}}
					autoComplete="off"
					onSubmit={(event: any) => handleNewCategorySubmit(event)}
				>
					<TextField
						sx={{ width: '33ch', m: 1 }}
						id="newCategoryInput"
						name="newCategoryInput"
						label="Yeni Kategori Adi"
						placeholder="Yeni Kategori Adi"
						required
					/>
					<Button sx={{ ml: 1, mr: 1 }} type="submit" variant="contained">
						Kategori Ekle
					</Button>
				</Box>
			</Box>

			<Box component="div" sx={{ width: '100%', mb: 10 }}>
				<Typography variant="h2" component="h2" gutterBottom>
					Kategorileri Listesi
				</Typography>

				<List sx={{ width: '100%', maxWidth: 800 }}>
					{categoriesList.map((category) => (
						<ListItem key={category.id}>
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
								onSubmit={(event: any) => handleCategoryUpdateSubmit(event)}
							>
								<TextField
									sx={{ width: '33ch', mr: 5 }}
									id={category.id.toString()}
									name="categoryInput"
									label="Kategori Adi"
									placeholder="Kategori Adi"
									variant="standard"
									required
									defaultValue={category.title}
								/>

								<Button type="submit" variant="contained" sx={{ mr: 1 }}>
									Guncelle
								</Button>
								<Button
									type="button"
									sx={{ mr: 1 }}
									variant="contained"
									color="secondary"
									onClick={() => onStatusEdit(category.id)}
									// onClick={() => console.log('hello')}
								>
									Statuler Duzenle
								</Button>
								<Button
									type="button"
									variant="outlined"
									onClick={(event) =>
										handleDeleteCategorySubmit(event, category.id)
									}
								>
									Sil
								</Button>
							</Box>
						</ListItem>
					))}
				</List>
			</Box>
		</Box>
	);
}

export default CategoryPage;
