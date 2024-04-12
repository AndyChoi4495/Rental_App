import { StyleSheet, Text, View, TextInput, Pressable, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    // form fields
    const [emailFromUI, setEmailFromUI] = useState('yunseok@gmail.com');
    const [passwordFromUI, setPasswordFromUI] = useState('111111');
    const [errorMessageLabel, setErrorMessageLabel] = useState('');
    const OwnerId = [];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Users'));
                querySnapshot.forEach((currDoc) => {
                    console.log('Document data:');
                    console.log(currDoc.data());
                    OwnerId.push(currDoc.data());
                });
            } catch (err) {
                console.log(err);
            }
        };
        fetchData().catch(console.error);
    }, []);

    const loginPressed = async () => {
        if (auth.currentUser === null) {
            // no one is logged in, so login
            try {
                await signInWithEmailAndPassword(auth, emailFromUI, passwordFromUI);
                console.log(`loginPressed: Who is the currently logged in user? ${auth.currentUser.uid}`);
                alert('Login complete!');

                // then, navigate them to the next screen
                navigation.navigate('Main');
            } catch (error) {
                console.log(`Error code: ${error.code}`);
                console.log(`Error message: ${error.message}`);
                // full error message
                console.log(error);
                setErrorMessageLabel(error);
            }
        } else {
            // someone is logged in so show some kind of message
            alert('You are already logged in!');
            navigation.navigate('Main');
        }
    };

    const signUpPressed = async () => {
        navigation.navigate('SignUp');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 20, paddingLeft: 10 }}>Login</Text>
            {/* email tb */}
            <TextInput placeholder="Enter email" onChangeText={setEmailFromUI} value={emailFromUI} style={styles.tb} />

            {/* password tb */}
            <TextInput
                placeholder="Enter password"
                onChangeText={setPasswordFromUI}
                value={passwordFromUI}
                style={styles.tb}
            />

            <Text style={{ color: 'red' }}>{errorMessageLabel}</Text>
            {/* button */}
            <Pressable onPress={loginPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Login</Text>
            </Pressable>
            <Pressable onPress={signUpPressed} style={styles.btn}>
                <Text style={styles.btnLabel}>Sign Up</Text>
            </Pressable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    tb: {
        width: '95%',
        borderRadius: 5,
        backgroundColor: '#efefef',
        color: '#333',
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    btn: {
        borderWidth: 1,
        borderColor: '#141D21',
        borderRadius: 8,
        paddingVertical: 16,
        marginVertical: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    btnLabel: {
        fontSize: 16,
        textAlign: 'center',
    },
    error: {
        fontSize: 16,
        textAlign: 'center',
        color: 'blue',
    },
});

export default LoginScreen;
