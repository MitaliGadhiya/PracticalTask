import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { store, persistor } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import Loader from './src/components/common/Loader';
import { Colors } from './src/theme';
import { configureGoogleSignIn } from './src/services/social/googleAuth';

configureGoogleSignIn();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader visible />} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor={Colors.background} translucent />
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
