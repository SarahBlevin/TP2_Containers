export interface ITodoList {
  id: string
  title: string
  description: string
  items: ITodoItem[]
}

export interface ITodoItem {
    //Un item peut avoir plusieurs états : PENDING, IN-PROGRESS, DONE.
    id: string
    title: string       
    description: string
    state: 'PENDING' | 'IN-PROGRESS' | 'DONE'
}
