import { firebase as config } from './config';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/functions';

// Initalize and export Firebase.
export default firebase.initializeApp(config);