# fastify-mikro-orm
Fastify MikroORM plugin, which decorates the Fastify object with a MikroORM connection object.

This plugin uses the official [MikroORM](https://github.com/mikro-orm/mikro-orm) module.

## Install

```
npm i fastify-mikro-orm
```

## Usage

Once you have setup the schema through the MikroORM CLI, just register the plugin.

```typescript
import Fastify from 'fastify';
import fastifyMikroORM  from 'fastify-mikro-orm';
import { Customer } from './entities/Customer';

const fastify = Fastify()

fastify.register(fastifyMikroORM, {
  entitiesTs: ['./entities/*.ts'],
  entities: ['./build/entities/*.js'],
  dbName: "test",
  type: "postgresql",
  clientUrl: 'postgres://postgres:masterkey@localhost/'
});


fastify.get('/', async function (req, reply) {
  const customer = new Customer();
  customer.username = 'Test';
  await this.mikroORM.orm.em.persistAndFlush(customer);
  const users = this.mikroORM.orm.em.find(Customer, {});
  return users;
})

fastify.listen(3000, err => {
  if (err) throw err
})

```

You can access the MikroORM connection object through the Fastify instance, as shown above, you may also access it through the Request object (in which the EntityManager is forked by default on each request). 

```typescript
import Fastify from 'fastify';
import fastifyMikroORM  from 'fastify-mikro-orm';
import { Customer } from './entities/Customer';

const fastify = Fastify()

fastify.register(fastifyMikroORM, {
  entitiesTs: ['./entities/*.ts'],
  entities: ['./build/entities/*.js'],
  dbName: "test",
  type: "postgresql",
  clientUrl: 'postgres://postgres:masterkey@localhost/',
  forkOnRequest: true // This is the default
});


fastify.get('/', async function (req, reply) {
  const customer = new Customer();
  customer.username = 'Test';
  await req.mikroORM.orm.em.persistAndFlush(customer); // The EntityManager in this request is isolated from other requests
  const users = req.mikroORM.orm.em.find(Customer, {});
  return users;
})

fastify.listen(3000, err => {
  if (err) throw err
})

```


## License

[MIT](./LICENSE)