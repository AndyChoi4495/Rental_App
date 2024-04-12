import { StyleSheet, Text, View } from 'react-native';

// react navigation plugin imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/LandingScreen';
import Login from './screens/LoginScreen';
import SignUp from './screens/SignUpScreen';
import Main from './screens/MainScreen';
import Map from './screens/MapScreen';
import Booking from './screens/BookingScreen';
import Detail from './screens/Details';
import MyReservation from './screens/MyReservation';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Friends" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Map" component={Map} />
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="Booking" component={Booking} />
                <Stack.Screen name="Detail" component={Detail} />
                <Stack.Screen name="MyReservation" component={MyReservation} />
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
