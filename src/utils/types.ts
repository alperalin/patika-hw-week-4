export interface TodoInterface {
	id: number;
	userId: number;
	title: string;
	categoryId: number;
	statusId: number;
	updatedAt: string;
	createdAt: string;
}

export interface TodoAddInterface {
	title: string;
	categoryId: number;
	statusId: number;
}

export interface TodoUpdateInterface {
	todo: TodoInterface;
}

export interface Category {
	id: number;
	userId: number;
	title: string;
	createdAt: string;
	updatedAt: string;
}

export interface CategoryAddProps {
	title: Category['title'];
}

export interface CategoryUpdateProps {
	id: Category['id'];
	title: Category['title'];
}

export interface CategoryDeleteProps {
	id: Category['id'];
}

export interface StatusCommon {
	title: string;
	categoryId: number;
	color: string;
}

export interface Status extends StatusCommon {
	id: number;
}

export interface StatusGetProps {
	categoryId: number;
}

export interface StatusGetAllProps {
	categories: Category[];
}

export interface StatusUpdateProps {
	id: number;
	title: string;
	color: string;
	categoryId: number;
}

export interface StatusDeleteProps {
	id: number;
}

export interface Login {
	username: string;
	password: string;
}

export interface Register extends Login {
	passwordConfirm: string;
}

export interface Pages {
	currentPage: 'Login' | 'App' | 'CategoryEdit' | 'StatusEdit' | null;
	prevPage: 'Login' | 'App' | 'CategoryEdit' | 'StatusEdit' | null;
}
