export interface LoginConfig {
	configpanel: 1;
	name?: string;
	icon?: string;
	credentials?: boolean;
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
	url?: string;
}

export interface LoginResponse {
	success: boolean;
	expires?: number;
	id?: string;
	user?: string;
	endpoint?: string;
}

export interface Context {
	baseUrl: URL;
	params: Record<string, string>;
}

export interface Service {
	noCredentials?: boolean;
	id: string;
	name: string;
	host: string;
	icon?: string;
	expires: number;
	endpoint: string;
	user: string;
}
