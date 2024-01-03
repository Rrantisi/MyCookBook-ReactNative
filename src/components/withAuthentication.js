import React, { useEffect, useState } from 'react';
import { View } from 'react-native'
import { auth } from '../../firebase';
import AuthComponent from './AuthComponent';

export const withAuthentication = (WrappedComponent) => {
  return (props) => {
    const [user, setUser] = useState(auth.currentUser);

    // Authentication state listener to keep track of current authenticated user
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
      });

      return () => unsubscribe();
    }, []);

    if (user) {
      return <WrappedComponent {...props} />;
    } else {
      return (
        <View style={{backgroundColor: '#F0F0F0', flex: 1}}>
          <AuthComponent />
        </View>
      )
    }
  };
};
