export interface User {
    id : number;
    username: string;
    email: string;
    password: string;
    profilePhoto : string;
    role: string;
    preferredLanguage : string;    
    coverPhoto : string;
    gender : string;
    createdAt : string;
    bio : string;
    following : User[];
    followers : User[];
}