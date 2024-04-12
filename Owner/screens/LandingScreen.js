import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, Pressable } from 'react-native';

const LandingPage = ({ navigation }) => {
    const Login = () => {
        navigation.navigate('Login');
    };
    const CreateAccount = () => {
        navigation.navigate('SignUp');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 30 }}>Hello my Friend!</Text>
            <Image
                style={{ height: 250, width: 250, resizeMode: 'center' }}
                source={require('../assets/friends.png')}
            />
            <Pressable onPress={Login} style={styles.logInBtn}>
                <Text style={styles.buttonText}>LOG IN</Text>
            </Pressable>
            <Pressable onPress={CreateAccount} style={styles.signUpBtn}>
                <Text style={styles.buttonText}>SIGN UP</Text>
            </Pressable>
        </SafeAreaView>
    );
};
// colors
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffd60a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
    },
    signUpBtn: {
        width: '60%',
        paddingVertical: 20,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: '#3a86ff',
    },
    logInBtn: {
        width: '60%',
        paddingVertical: 20,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: '#fb5607',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});

export default LandingPage;
