export const TaskSchema = {
    name: 'Task',
    properties: {
        id: 'int',
        userId: 'int',
        title: 'string',
        description: 'string',
        isCompleted: 'bool',
        image: 'string',
        createdAt: 'string', 
    },
    primarykey: "id"
};