// Imports
import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

// Interface
import { Pages } from '../../utils/types';

interface HeaderProps {
	pages: Pages;
	onBackButtonClick: ({ currentPage, prevPage }: Pages) => void;
	onLogoutButtonClick: ({ currentPage, prevPage }: Pages) => void;
}

function Header({
	pages,
	onBackButtonClick,
	onLogoutButtonClick,
}: HeaderProps) {
	return (
		<Box
			component="header"
			sx={{
				borderBottom: 1,
				padding: 3,
			}}
		>
			<Grid container spacing={2}>
				<Grid item xs={2}>
					{pages.currentPage === 'StatusEdit' ? (
						<>
							<Button
								onClick={() => {
									onBackButtonClick({
										currentPage: 'CategoryEdit',
										prevPage: null,
									});
								}}
								variant="outlined"
							>
								Kategoriler Sayfasina Don
							</Button>
						</>
					) : (
						''
					)}

					{pages.currentPage === 'CategoryEdit' ? (
						<Button
							onClick={() => {
								onBackButtonClick({ currentPage: 'App', prevPage: null });
							}}
							variant="outlined"
						>
							Todo Sayfasina Don
						</Button>
					) : (
						''
					)}
				</Grid>
				<Grid item xs={8}>
					<Typography
						variant="h1"
						component="h1"
						fontSize="2rem"
						textAlign="center"
						m={0}
					>
						TodoList App
					</Typography>
				</Grid>
				<Grid
					item
					xs={2}
					sx={{
						textAlign: 'right',
					}}
				>
					{pages.currentPage !== 'Login' ? (
						<Button
							onClick={() => {
								onLogoutButtonClick({ currentPage: 'Login', prevPage: null });
							}}
							variant="contained"
						>
							Logout
						</Button>
					) : (
						''
					)}
				</Grid>
			</Grid>
		</Box>
	);
}

export default Header;
