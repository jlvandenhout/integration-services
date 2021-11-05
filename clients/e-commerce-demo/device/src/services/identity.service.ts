import fs from 'fs';
import path from 'path';
import { CONFIG, LogisticDeviceIdentity, SellerServiceIdentity } from '../config/config';
import { axiosClient } from '../utils/client';

export const createIdentity = async (index: number): Promise<string | undefined> => {
	const identityPath = path.join(__dirname, '..', 'config', `DeviceIdentity-${index}.json`);
	let file, identity;
	try {
		file = fs.readFileSync(identityPath);
		identity = file && JSON.parse(file.toString());
	} catch (e) {
		console.log('no identity file found');
	}

	if (identity?.doc?.id != null) {
		console.log('Identity already created!');
		return identity?.doc?.id;
	}
	console.log('Creating the device identity...');
	const newIdentityData = index === 1 ? SellerServiceIdentity : LogisticDeviceIdentity;
	const apiKey = CONFIG.apiKey ? `?api-key=${CONFIG.apiKey}` : '';

	const res = await axiosClient.post(`${CONFIG.baseUrl}/identities/create${apiKey}`, JSON.stringify(newIdentityData));

	if (res?.status === 201) {
		console.log('Successfully created the identity!');
		console.log('###########################');
		console.log('###########################');
		const configPath = path.join(__dirname, '..', 'config');
		if (!fs.existsSync(configPath)) fs.mkdirSync(configPath);
		fs.writeFileSync(identityPath, JSON.stringify(res.data));

		return res.data.doc.id;
	}
};