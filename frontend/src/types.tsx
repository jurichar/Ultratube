// frontend/src/types.tsx

export interface Movie {
    id: string;
    title: string;
    release: string;
    image: string;
    synopsis: string;
    trailer: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
}