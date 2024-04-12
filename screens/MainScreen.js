import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';

const MainScreen = ({ navigation }) => {
    const [usernameLabel, setUsernameLabel] = useState('username goes here');

    useEffect(() => {
        if (auth.currentUser === null) {
            console.log('NO ONE IS LOGGED IN');
            navigation.navigate('Login');
        } else {
            console.log(auth.currentUser);
            setUsernameLabel(auth.currentUser.email);
        }
    }, []);

    const logout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Login'); // Use replace to prevent going back to the main screen
            alert('Logout sucessfully');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.title}> {usernameLabel}</Text>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Map')}>
                <Text style={styles.buttonText}>Go to Map</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => navigation.navigate('MyReservation')}>
                <Text style={styles.buttonText}>My Reservation</Text>
            </Pressable>
            <Pressable style={styles.logoutButton} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    button: {
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: 'blue',
    },
    logoutButton: {
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default MainScreen;
