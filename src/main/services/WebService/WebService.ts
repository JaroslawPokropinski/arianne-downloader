import { buildSchema } from 'type-graphql';
import Container, { Service } from 'typedi';
import log from 'electron-log';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { DownloadingFileResolver } from './schema/DownloadingFileResolver';

@Service()
export class WebService {
  port = parseInt((process.env.PORT || 4000).toString(), 10);

  constructor() {
    this.init();
  }

  private async init() {
    const schema = await buildSchema({
      resolvers: [DownloadingFileResolver],
      container: Container,
    });

    const server = new ApolloServer({
      schema,
    });

    startStandaloneServer(server, {
      listen: { port: this.port },
    })
      .then(({ url }) => log.debug(`🚀  Server ready at: ${url}`))
      .catch((reason) => log.error(reason));
  }
}
