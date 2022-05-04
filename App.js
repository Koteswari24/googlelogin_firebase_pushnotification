import React, { useEffect, useState, Fragment } from 'react';
import { View } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Authentication from './src/Screens/Authentication';
import Authenticated from './src/Screens/Authenticated';
import PushController from './PushController/pushController';
import remoteConfig from '@react-native-firebase/remote-config';


export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [backgroundtheme, setBackgroundtheme] = useState('#95d7ed');

  //remoteConfig
  useEffect(() => {
    remoteConfig()
      .setDefaults({
        is_launched: false,
      })
      .then(() => remoteConfig().fetchAndActivate())
      .then(fetchedRemotely => {
        if (fetchedRemotely) {
          console.log('Configs were retrieved from the backend and activated.');
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated',
          );
        }
      });
      const isLaunched = remoteConfig().getValue('is_launched');
      if (isLaunched) {
        setBackgroundtheme('#ed95b8');
      }
      else{
        setBackgroundtheme('#95d7ed');
      }
  }, []);

  //GoogleSignin
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
      <View style={{ flex: 1, backgroundColor: backgroundtheme }}>
        <PushController />
        <Authentication onGoogleButtonPress={onGoogleButtonPress} />
      </View>
    </Fragment>

  );
}