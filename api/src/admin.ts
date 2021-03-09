import * as dotenv from 'dotenv';
dotenv.config();
import { MongoDbService } from './services/mongodb-service';
import { CONFIG } from './config';
import { UserService } from './services/user-service';
import { IdentityService } from './services/identity-service';
import { AuthenticationService } from './services/authentication-service';

const dbUrl = CONFIG.databaseUrl;
const dbName = CONFIG.databaseName;

async function setupApi() {
  console.log(`Setting api please wait...`);
  await MongoDbService.connect(dbUrl, dbName);
  // TODO create database, documents and indexes in mongodb at the first time!
  // key-collection-links->linkedIdentity (unique + partial {"linkedIdentity":{"$exists":true}})

  const userService = new UserService();
  const identityService = IdentityService.getInstance(CONFIG.identityConfig);
  const authenticationService = new AuthenticationService(identityService, userService);

  const keyCollection = await authenticationService.getKeyCollection(0);
  console.log('keyCollection', keyCollection);

  if (!keyCollection) {
    console.log('add key collections');
    const identity = await authenticationService.createIdentity({
      storeIdentity: true,
      username: 'api-identity',
      classification: 'api',
      organization: 'IOTA',
      subscribedChannelIds: [],
      description: 'Root identity of the api!'
    });
    console.log('==================================================================================================');
    console.log(`== Store this identity in the as ENV var: ${identity.doc.id} ==`);
    console.log('==================================================================================================');

    const kc = await authenticationService.generateKeyCollection(identity.doc.id.toString());
    const res = await authenticationService.saveKeyCollection(kc);

    if (!res?.result.n) {
      console.log('could not save keycollection!');
    }
  } else {
    // update latest identity!
    const identity = await identityService.getLatestIdentity(process.env.SERVER_IDENTITY);
    await authenticationService.updateDatabaseIdentityDoc(identity);
    console.log('DOOOOOOC', identity);
  }

  console.log('done :)');
  process.exit(0);
}

setupApi();
