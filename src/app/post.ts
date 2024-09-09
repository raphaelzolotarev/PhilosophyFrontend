import { Like } from './like';
import { User } from './user';

export interface Post {
    id : number;
    title: string;
    imageUrl: string;
    category : string;
    description: string;
    author : User;   
    likes : Like[];   
    comments : Comment[];   
}