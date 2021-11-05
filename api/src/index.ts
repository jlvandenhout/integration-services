import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import swaggerUi from 'swagger-ui-express';
import { errorMiddleware } from './middlewares/error';
import { authenticationRouter, verificationRouter, channelInfoRouter, channelRouter, subscriptionRouter, identityRouter } from './routers';
import { MongoDbService } from './services/mongodb-service';
import { CONFIG } from './config';
import * as expressWinston from 'express-winston';
import swaggerJsdoc from 'swagger-jsdoc';
import { Logger } from './utils/logger';
import { openApiDefinition } from './routers/swagger';
import { serverInfoRouter } from './routers/server-info';
import yargs from 'yargs';
import { KeyGenerator } from './setup';
import { Config } from './models/config';

const logger = Logger.getInstance();

const argv = yargs
	.command('server', 'Start the integration service API', {})
	.command('keygen', 'Generate root identity for integration service API', {})
	.help()
	.alias('help', 'h').argv;

function useRouter(app: express.Express, prefix: string, router: express.Router) {
	const messages = router.stack.map((r) => `${Object.keys(r?.route?.methods)?.[0].toUpperCase()}  ${prefix}${r?.route?.path}`);
	messages.map((m) => logger.log(m));

	app.use(prefix, router);
}

async function getRootIdentityId(config: Config): Promise<string> {
	try {
		await MongoDbService.connect(config.databaseUrl, config.databaseName);

		const rootIdentity = await KeyGenerator.checkRootIdentity(config);

		if (rootIdentity) {
			return rootIdentity.doc.id;
		}
	} catch (e) {
		logger.error(e.message);
	}

	return null;
}

async function startServer(config: Config) {
	const rootIdentity = await getRootIdentityId(config);

	// setup did for server if not exists
	if (!rootIdentity) {
		process.exit(0);
	}

	const app = express();

	const port = config.port;
	const dbUrl = config.databaseUrl;
	const dbName = config.databaseName;
	const version = config.apiVersion;
	const openapiSpecification = swaggerJsdoc(openApiDefinition);

	app.use(express.json({ limit: '10mb' }));
	app.use(express.urlencoded({ limit: '10mb', extended: true }));
	app.use(expressWinston.logger(Logger.getInstance().options));

	app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification, { explorer: true }));

	const prefix = `/api/${version}`;
	useRouter(app, prefix + '/channel-info', channelInfoRouter);
	useRouter(app, prefix + '/channels', channelRouter);
	useRouter(app, prefix + '/subscriptions', subscriptionRouter);
	useRouter(app, prefix + '/identities', identityRouter);
	useRouter(app, prefix + '/authentication', authenticationRouter);
	useRouter(app, prefix + '/verification', verificationRouter);
	useRouter(app, '', serverInfoRouter);

	app.use(errorMiddleware);
	const server = app.listen(port, async () => {
		logger.log(`Started API Server on port ${port}`);
		await MongoDbService.connect(dbUrl, dbName);
	});
	server.setTimeout(50000);
}

async function keyGen(config: Config) {
	try {
		await MongoDbService.connect(config.databaseUrl, config.databaseName);

		const keyGenerator: KeyGenerator = new KeyGenerator(config);

		await keyGenerator.keyGeneration();
	} catch (e) {
		logger.error(e);
	}

	process.exit();
}

if (argv._.includes('server')) {
	startServer(CONFIG);
} else if (argv._.includes('keygen')) {
	keyGen(CONFIG);
}
