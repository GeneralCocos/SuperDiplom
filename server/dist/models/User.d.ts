import { Model, Sequelize } from 'sequelize';
interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}
declare class User extends Model<UserAttributes> implements UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}
export declare const initUser: (sequelize: Sequelize) => void;
export { User };
