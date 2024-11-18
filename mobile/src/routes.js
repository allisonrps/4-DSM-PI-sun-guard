import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import UserScreen from './pages/UserScreen';
import ChartsScreen from './pages/ChartsScreen'; // Importando a nova tela de gráficos

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: 'Cadastro', headerShown: true }}
    />
    <Stack.Screen
      name="User"
      component={UserScreen}
      options={{ title: 'Informações do Usuário' }}
    />
    <Stack.Screen
      name="Charts"
      component={ChartsScreen} // Adicionando a tela de gráficos
      options={{ title: 'Gráficos de Sensor' }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
