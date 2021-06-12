import tap from 'tap'
import Fastify from 'fastify'
import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

import fastifyMikroORM from './index'

@Entity()
class User {
  @PrimaryKey()
  id!: number;

  @Property()
  username!: string;
}

tap.test('The fastify object must have been decorated with the MikroORM object', async t => {
  t.plan(1)

  const server = Fastify()

  t.teardown(async () => server.close())

  server.register(fastifyMikroORM, {
    entities: [User],
    dbName: 'test',
    type: 'postgresql',
    clientUrl: 'postgres://postgres:masterkey@localhost:5432/postgres'
  })

  await server.ready()

  t.ok(server.mikroORM.orm)
})

tap.test('Without the forkOnRequest option the default (to fork the EntityManager on each request) should apply', async t => {
  t.plan(1)

  const server = Fastify()

  t.teardown(async () => server.close())

  server.register(fastifyMikroORM, {
    entities: [User],
    dbName: 'test',
    type: 'postgresql',
    clientUrl: 'postgres://postgres:masterkey@localhost:5432/postgres',
    forkOnRequest: true
  })

  server.get('/', async function (this, request, reply) {
    const requestEntityManager = request.mikroORM.orm.em
    t.not(server.mikroORM.orm.em.id, requestEntityManager.id)
    return {}
  })

  await server.inject({
    method: 'GET',
    url: '/'
  })
})

tap.test('Setting the forkOnRequest option to false should use the same entity manager for all requests', async t => {
  t.plan(1)

  const server = Fastify()

  t.teardown(async () => server.close())

  server.register(fastifyMikroORM, {
    entities: [User],
    dbName: 'test',
    type: 'postgresql',
    clientUrl: 'postgres://postgres:masterkey@localhost:5432/postgres',
    forkOnRequest: false
  })

  server.get('/', async function (this, request, reply) {
    const requestEntityManager = request.mikroORM.orm.em
    t.equal(server.mikroORM.orm.em.id, requestEntityManager.id)
    return {}
  })

  await server.inject({
    method: 'GET',
    url: '/'
  })
})
