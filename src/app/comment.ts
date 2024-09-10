import { Post } from "./post";
import { User } from "./user";

export interface Comment {
    id : number;
    user: User;
    post: Post;
    text: string;
}