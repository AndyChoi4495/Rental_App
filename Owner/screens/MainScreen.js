import { View, StyleSheet, Pressable, Text, SafeAreaView, FlatList, Image, RefreshControl } from 'react-native';
import React from 'react';
import { auth, db } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';

const MainPage = ({ navigation }) => {
    const [usernameLabel, setUsernameLabel] = useState('username goes here');
    const [errorMessageLabel, setErrorMessageLabel] = useState('');
    const [friendList, setFriendList] = useState([]);
    const [userUid, setUserUid] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const getAllData = async () => {
        console.log("Retrieving all documents from the 'Friends' collection...");
        try {
            const querySnapshot = await getDocs(collection(db, 'Friends'));
            const resultsFromDB = [];

            querySnapshot.forEach((currDoc) => {
                /*  console.log(`Document id: ${currDoc.id}`);
                console.log('Document data:');
                console.log(currDoc.data()); */

                const friend = {
                    id: currDoc.id,
                    ...currDoc.data(),
                };

                if (friend.OwnerId == userUid) {
                    // add it to the array
                    resultsFromDB.push(friend);
                }

                return;
            });

            // at this point, we are done  the forEach
            // so update the state variable that is connected to FlatList
            setFriendList(resultsFromDB);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteItem = async (id) => {
        try {
            console.log(id);
            const getdoc = doc(db, 'Friends', id);
            const querySnapshot = await getDoc(getdoc);

            if (userUid === querySnapshot.data().OwnerId) {
                const docRef = doc(db, 'Friends', id);
                await deleteDoc(docRef);
                console.log(`Item ${id} deleted successfully.`);
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    useEffect(() => {
        if (auth.currentUser === null) {
            console.log('NO ONE IS LOGGED IN');
        } else {
            console.log(auth.currentUser);
            setUsernameLabel(auth.currentUser.email);
            setUserUid(auth.currentUser.uid);
        }
        getAllData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getAllData();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const Item = ({ FirstName, LastName, HourlyRate, City, Address, URL, Id, id }) => (
        <Pressable /* onPress={{}} */>
            <View style={styles.item}>
                <Image source={{ url: URL }} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{`${FirstName} ${LastName}`}</Text>
                    <Text style={styles.hourlyRate}>Hourly Rate: ${HourlyRate}</Text>
                    <Text style={styles.location}>{`${City}, ${Address}`}</Text>
                </View>
                <Pressable style={styles.deleteButton} onPress={() => deleteItem(id)}>
                    <Ionicons name="trash-bin" size={24} color="red" />
                </Pressable>
            </View>
        </Pressable>
    );

    const logoutPressed = async () => {
        // TODO: Code to logout
        console.log('Logging the user out..');
        try {
            if (auth.currentUser === null) {
                console.log('logoutPressed: There is no user to logout!');
                navigation.navigate('Friends');
            } else {
                await signOut(auth);
                console.log('logoutPressed: Logout complete');
                alert('logout complete!');
                navigation.navigate('Friends');
            }
        } catch (error) {
            console.log('ERROR when logging out');
            console.log(error);
        }
    };

    const addListPressed = () => {
        console.log('Add List button pressed');
        navigation.navigate('AddList');
    };
    const listPressed = () => {
        console.log('List is pressed');
        navigation.navigate('ListDetail');
    };

    const manageBookingPressed = () => {
        console.log('Manage Booking button pressed');
        navigation.navigate('Reservation List');
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text>User: {usernameLabel}</Text>
                <Pressable onPress={logoutPressed} style={styles.btn}>
                    <Text style={styles.btnRedLabel}>LogOut</Text>
                </Pressable>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.title}>Friends List</Text>

                <Pressable onPress={addListPressed} style={styles.btnAddList}>
                    <Ionicons name="add-circle-outline" size={24} color="black" />
                    <Text style={styles.btnLabel}>Add List</Text>
                </Pressable>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Pressable onPress={manageBookingPressed} style={styles.btnManageBooking}>
                    <Ionicons name="calendar-outline" size={24} color="black" />
                    <Text style={styles.btnGreenLabel}>Manage Booking</Text>
                </Pressable>
            </View>

            <FlatList
                data={friendList}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <Item
                        FirstName={item.FirstName}
                        LastName={item.LastName}
                        HourlyRate={item.HourlyRate}
                        City={item.City}
                        Address={item.Address}
                        URL={item.URL}
                        id={item.id}
                    />
                )}
                keyExtractor={(item) => item.Id}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#00bbf9',
        marginBottom: 20,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 10,
    },
    btnLabel: {
        marginLeft: 5,
        fontSize: 15,
        color: '#00bbf9',
        fontWeight: 'bold',
    },
    btnRedLabel: {
        marginLeft: 5,
        fontSize: 15,
        color: 'red',
        fontWeight: 'bold',
    },
    btnGreenLabel: {
        marginLeft: 5,
        fontSize: 15,
        color: '#fb5607',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 20,
    },
    item: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    textContainer: {
        flex: 1,
        marginLeft: 20,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00bbf9',
    },
    hourlyRate: {
        fontSize: 16,
        color: '#666666',
    },
    location: {
        fontSize: 14,
        color: '#aaaaaa',
    },
    btnAddList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginRight: 10,
        marginBottom: 5,
    },
    btnManageBooking: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginRight: 10,
        marginBottom: 5,
    },
    deleteBtn: {
        padding: 10,
    },
});

export default MainPage;
