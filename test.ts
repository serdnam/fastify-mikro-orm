import tap from 'tap';
import Fastify from 'fastify';
import { Entity } from '@mikro-orm/core';
import { PrimaryKey, Property } from '@mikro-orm/core';

import fastifyMikroORM from './index';

@Entity()
class User {
  
  @PrimaryKey()
  id!: number;
  
  @Property()
  username!: string;

}

tap.test('', async t => {
  const server = Fastify();

  t.teardown(async () => server.close())

  server.register(fastifyMikroORM, {
    entities: [User],
    dbName: 'test',
    type: 'postgresql',
    clientUrl: 'postgres://postgres:masterkey@localhost:5432/postgres'
  })
  
  await server.ready();

  t.ok(server.mikroORM.orm)

})