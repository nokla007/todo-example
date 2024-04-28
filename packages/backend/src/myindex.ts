import { Elysia, t } from 'elysia'

let TODOS = [
  {
    id: 1,
    starred: false,
    completed: false,
    desc: 'Wake up at 5am'
  },
  {
    id: 2,
    starred: false,
    completed: false,
    desc: 'Brush your teeth'
  }
]

let len = TODOS.length

const addTODO = (data: object) => {
  len++
  const newTODO = { id: len, ...data }
  TODOS.push(newTODO)
  return newTODO
}

const updateTODO = (data: object, id: number) => {
  let updatedTodo
  TODOS = TODOS.map((x) => {
    if (x.id === id) {
      // const updatedTodo = { id: id, ...data }
      // const updatedTodo = Object.assign(x, data)
      // return updatedTodo
      Object.assign(x, data)
      updatedTodo = x
      return x
    }
    return x
  })
  return updatedTodo
}

const deleteTODO = (id: number) => {
  TODOS = TODOS.filter((todo) => {
    return todo.id !== id
  })
}

const app = new Elysia()
  .get('/todos', () => TODOS)
  .get(
    '/todos/:id',
    ({ params, error }) => {
      const todo = TODOS.find((todo) => todo.id === params.id)
      if (!todo) {
        return error(404)
      }
      return todo
    },
    {
      params: t.Object({
        id: t.Numeric()
      })
    }
  )
  .post(
    '/todos',
    ({ body }) => {
      return addTODO(body)
    },
    {
      body: t.Object({
        starred: t.Boolean(),
        completed: t.Boolean(),
        desc: t.String()
      })
    }
  )
  .put(
    '/todos/:id',
    ({ params, body }) => {
      return updateTODO(body, params.id)
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      body: t.Object({
        starred: t.Boolean(),
        completed: t.Boolean(),
        desc: t.String()
      })
    }
  )
  .patch(
    '/todos/:id',
    ({ params, body }) => {
      return updateTODO(body, params.id)
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      body: t.Object({
        starred: t.Optional(t.Boolean()),
        completed: t.Optional(t.Boolean()),
        desc: t.Optional(t.String())
      })
    }
  )
  .delete(
    '/todos/:id',
    ({ params }) => {
      deleteTODO(params.id)
    },
    {
      params: t.Object({
        id: t.Numeric()
      })
    }
  )
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
/*
 * GET /todos
 * GET /todos/123421
 * POST /todos
 * PUT /todos/1234321 {}
 * PATCH /todos/12312312 {}
 * DELETE /todos/1231231
 */
