import { ApolloServer } from 'apollo-server';
import log from 'electron-log';
import { buildSchema } from 'type-graphql';
import Container, { Service } from 'typedi';

@Service()
export class WebService {
  port = process.env.PORT || 4000;

  constructor() {
    this.init();
  }

  private async init() {
    const resolversPath = `${__dirname}/**/*Resolver.{ts,js}`;

    const schema = await buildSchema({
      resolvers: [resolversPath],
      container: Container,
    });

    const server = new ApolloServer({
      schema,
    });

    const { url } = await server.listen(this.port);
    if (process.env.NODE_ENV === 'development') {
      log.debug(`Server is running, GraphQL Playground available at ${url}`);
    }
  }
}
