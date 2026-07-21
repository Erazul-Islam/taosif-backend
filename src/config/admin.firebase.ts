import * as admin from 'firebase-admin';
import serviceAccount from './firebase-service.json';

const serviceAccountObj = JSON.parse(JSON.stringify(serviceAccount));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountObj as admin.ServiceAccount),
});

export default admin;
