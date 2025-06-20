export interface LoginConfig {
	configpanel: 1;
	name?: string;
	icon?: string;
	login: {
		method?: string;
		endpoint: string;
		fields: LoginField[];
	};
}

export interface LoginField {
	type: string;
	id: string;
	name?: string;
	placeholder?: string;
}

export interface LoginResponse {
	success: boolean;
	id?: string;
}
