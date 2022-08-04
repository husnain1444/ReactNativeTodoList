import { TaskSchema } from "./TaskSchema";
export const PersonSchema = {
    name: 'Person',
    properties: {
        id: 'int',
        name: 'string',
        age: 'string',
        createdAt: 'string',
        toDoList: {type: 'list', objectType: 'Task'},
    },
    primaryKey: 'id'
};