import { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, SafeAreaView } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('yunseok1@gmail.com');
    const [password, setPassword] = useState('111111');
    const [confirmPassword, setConfirmPassword] = useState('111111');
    const [errorMessageLabel, setErrorMessageLabel] = useState('');

    const handleSignUp = async () => {
        if (email == '') {
            setErrorMessageLabel('Email is empty!');
            return;
        }
        if (password == '') {
            setErrorMessageLabel('password is empty!');
            return;
        }
        // Check if passwords match
        if (password !== confirmPassword) {
            setErrorMessageLabel('The passwords do not match!');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Account creation success');
            console.log(userCredential.user.uid);
            const currentUserId = userCredential.user.uid;
            // store the uid to verify the owners
            const docRef = await addDoc(collection(db, 'Owners'), { id: currentUserId });

            navigation.navigate('Main');
        } catch (err) {
            console.log('Cannot creating user');
            setErrorMessageLabel(err.code);
            console.log(`Error code: ${err.code}`);
            // console.log(`Error message: ${err.message}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 20, paddingLeft: 10 }}>Sign Up</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.tb}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.tb}
                secureTextEntry
            />
            <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.tb}
                secureTextEntry
            />
            <Text style={{ color: 'red', paddingLeft: 10 }}>{errorMessageLabel}</Text>
            <Pressable onPress={handleSignUp} style={styles.btn}>
                <Text style={styles.btnLabel}>Create Account</Text>
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
});

export default SignUpScreen;
