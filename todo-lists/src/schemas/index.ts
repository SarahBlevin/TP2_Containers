export const listListsSchema = {
    tags: ['lists'],
    summary: 'List all the lists',
    response: {
        200: {
            description: 'Successful response',
            type: 'array',
            items: {
              $ref: 'ITodoList#'
            }
        }
    }
}

export const addListSchema = {
    tags: ['lists'],
    summary: 'Add a new list',
    body: {
        $ref: 'ITodoList#'
    }
}