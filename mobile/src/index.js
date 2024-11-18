import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './routes';

const App = () => (
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
);

AppRegistry.registerComponent('SunGuard', () => App);
