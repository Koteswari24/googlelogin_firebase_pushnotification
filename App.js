import React, { useEffect, useState, Fragment } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Authentication from './src/Screens/Authentication';
import Authenticated from './src/Screens/Authenticated';
import PushController from './PushController/pushController';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '220600351720-ti342rnj8ijc042fucg415du3q7k5957.apps.googleusercontent.com',
    });
  }, []);

  async function onGoogleButtonPress() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  auth().onAuthStateChanged((user) => {
    console.log('user', user)

    if (user) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  });

  if (authenticated) {
    console.log('authenticated', authenticated)
    return <Authenticated />;
  }

  return (
    <Fragment>
      <PushController />
      <Authentication onGoogleButtonPress={onGoogleButtonPress} />
    </Fragment>

  );
}