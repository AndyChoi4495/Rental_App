import { StyleSheet, Text, View } from 'react-native';

// react navigation plugin imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import Home from './screens/LandingScreen';
import Login from './screens/LoginScreen';
import SignUp from './screens/SignUpScreen';
import Main from './screens/MainScreen';
import List from './screens/ListForm';
import ListDetail from './screens/ListDetail';
import ManageBooking from './screens/ManageBooking';
// navigation pattern code
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Friends" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="AddList" component={List} />
                <Stack.Screen name="ListDetail" component={ListDetail} />
                <Stack.Screen name="Reservation List" component={ManageBooking} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
