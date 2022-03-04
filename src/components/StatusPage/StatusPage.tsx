// Imports
import React, { useEffect, useState } from 'react';

// MUI
import {
	Box,
	Typography,
	Button,
	List,
	ListItem,
	TextField,
	FormControl,
} from '@mui/material';

// interface
import {
	Category,
	Status,
	StatusAddProps,
	StatusGetProps,
	StatusUpdateProps,
	StatusDeleteProps,
} from '../App/App';

// TypeScript currentTarget icindeki elements'i tanimadigi
// icin elements'i tanimlayan bir interface olusturuldu
interface FormElements extends HTMLFormControlsCollection {
	newStatuInput: HTMLInputElement;
	newColorInput: HTMLInputElement;
	statuInput: HTMLInputElement;
	colorInput: HTMLInputElement;
}

interface UserFormElements extends HTMLFormElement {
	readonly elements: FormElements;
}

interface StatusPageProps {
	categoryItem: Category | null;
	onAddStatus: ({ title, categoryId, color, apiToken }: StatusAddProps) => void;
	onGetStatus: ({ apiToken, categoryId }: StatusGetProps) => any;
	onUpdateStatus: ({
		apiToken,
		id,
		title,
		categoryId,
	}: StatusUpdateProps) => void;
	onDeleteStatus: ({ apiToken, id }: StatusDeleteProps) => void;
}

function StatusPage({
	categoryItem,
	onAddStatus,
	onGetStatus,
	onUpdateStatus,
	onDeleteStatus,
}: StatusPageProps) {
	const [statusList, setStatusList] = useState<Status[]>([]);

	useEffect(() => {
		if (categoryItem) {
			onGetStatus({ categoryId: categoryItem.id }).then((response: any) =>
				setStatusList(response)
			);
		}
	});

	// Handle Statu Submit
	function handleSubmit(event: React.FormEvent<UserFormElements>): void {
		event.preventDefault();
		const newStatuInput = event.currentTarget.elements.newStatuInput;
		const newColorInput = event.currentTarget.elements.newColorInput;

		// Todo verisi onSubmit uzerinden App component'ine gonderiliyor
		if (categoryItem) {
			// Sunucuya yeni statu eklenmesi icin request gonderiliyor.
			onAddStatus({
				title: newStatuInput.value,
				categoryId: categoryItem.id,
				color: newColorInput.value,
			});

			// Input degerleri temizleniyor
			newStatuInput.value = '';
			newColorInput.value = '';
		}
	}

	// Handle Statu Update
	function handleStatuUpdateSubmit(
		event: React.FormEvent<UserFormElements>,
		id: number,
		categoryId: number
	) {
		// Formun varsayilan aksiyonu durduruluyor
		event.preventDefault();

		// Input bir degiskene ataniyor
		const title = event.currentTarget.elements.statuInput.value;
		const color = event.currentTarget.elements.colorInput.value;

		// Input degeri yeni kategori olusturulmasi icin App component'ine gonderiliyor
		onUpdateStatus({
			id,
			categoryId,
			title,
			color,
		});
	}

	// Handle Delete Status
	function handleDeleteStatus(
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		statusId: number
	): void {
		// Formun Submit'ini tetiklemesi engelleniyor
		event.stopPropagation();

		// Status Id, statu silinmesi icin App component'ine gonderiliyor
		onDeleteStatus({ id: statusId });
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
			{/* // STATUS DUZENLE */}
			<Typography variant="h1" component="h1" gutterBottom>
				Statu Duzenle
			</Typography>

			<Box component="div" sx={{ width: '100%', mb: 10 }}>
				<Typography variant="h2" gutterBottom component="h1">
					Duzenlenen Kategori: {categoryItem?.title}
				</Typography>
				<form autoComplete="off" onSubmit={handleSubmit}>
					<TextField
						sx={{ width: '33ch', m: 1 }}
						id="newStatuInput"
						name="newStatuInput"
						label="Statu Adi"
						placeholder="Statu Adi"
						required
					/>
					<TextField
						sx={{ width: '15ch', m: 1 }}
						inputProps={{ pattern: '[a-zA-Z]*', maxLength: 6 }}
						id="newColorInput"
						name="newColorInput"
						label="Renk Ismi"
						placeholder="Renk Ismi"
						required
					/>
					<br />
					<Button sx={{ ml: 1, mr: 1 }} type="submit" variant="contained">
						Ekle
					</Button>
				</form>
			</Box>

			<Box component="div" sx={{ width: '100%', mb: 10 }}>
				<Typography variant="h2" component="h2" gutterBottom>
					Statu Listesi
				</Typography>

				<List sx={{ width: '100%', maxWidth: 800 }}>
					{categoryItem &&
						statusList.map((status) => (
							<ListItem key={status.id}>
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
									onSubmit={(event: any) =>
										handleStatuUpdateSubmit(event, status.id, categoryItem.id)
									}
								>
									<TextField
										sx={{ width: '33ch', mr: 5 }}
										id={status.id.toString()}
										name="statuInput"
										label="Statu Adi"
										placeholder="Statu Adi"
										variant="standard"
										required
										defaultValue={status.title}
									/>

									<TextField
										sx={{ width: '15ch', mr: 5 }}
										id={status.id.toString()}
										inputProps={{ pattern: '[a-zA-Z]*', maxLength: 6 }}
										name="colorInput"
										label="Statu Renk Adi"
										placeholder="Statu Renk Adi"
										variant="standard"
										required
										defaultValue={status.color}
									/>

									<Button type="submit" variant="contained" sx={{ mr: 1 }}>
										Guncelle
									</Button>

									<Button
										type="button"
										variant="outlined"
										onClick={(event) => handleDeleteStatus(event, status.id)}
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

export default StatusPage;
