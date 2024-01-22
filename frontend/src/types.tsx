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

export interface Comment {
    id: string;
    user_id: string;
    movie_id: string;
    content: string;
    date: string;
    user?: User;
    movie?: Movie;
}