import { View, StyleSheet, Pressable, Text, SafeAreaView, FlatList, Image, RefreshControl } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ManageBooking = () => {
    const [usernameLabel, setUsernameLabel] = useState('username goes here');
    const [userUid, setUserUid] = useState('');
    const [docId, setDocId] = useState('');
    const [bookingData, setBookingData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const getAllBookingData = async () => {
        console.log("Retrieving all documents from the ' Booking' collection...");
        try {
            const querySnapshot = await getDocs(collection(db, 'Booking'));
            const resultsFromDB = [];

            querySnapshot.forEach((currDoc) => {
                console.log(`Document id: ${currDoc.id}`);
                console.log('Document data:');
                console.log(currDoc.data());

                const booking = {
                    id: currDoc.id,
                    ...currDoc.data(),
                };
                console.log(booking);
                if (booking.OwnerId == userUid) {
                    // add it to the array
                    resultsFromDB.push(booking);
                }
                return;
            });
            setBookingData(resultsFromDB);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (auth.currentUser === null) {
            console.log('LogIn require');
            navigation.navigate('Login');
        } else {
            console.log(auth.currentUser);
            setUserUid(auth.currentUser.uid);
            setUsernameLabel(auth.currentUser.email);
        }
        getAllBookingData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getAllBookingData();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const cancelBooking = async (id) => {
        try {
            console.log(id);
            const getdoc = doc(db, 'Booking', id);

            const querySnapshot = await getDoc(getdoc);

            //console.log('data:', querySnapshot.data().Status);
            if (querySnapshot.data().Status === 'CONFIRMED') {
                const docRef = doc(db, 'Booking', id);
                const updatedValues = { Status: 'CANCELLED' };
                await updateDoc(docRef, updatedValues);
                console.log(`Booking ${id} cancelled.`);
            }
            return;
        } catch (error) {
            console.error('Error cancelling booking:', error);
        }
    };

    const Item = ({ Name, MeetLocation, TotalPrice, ConfirmationNum, Status, id }) => (
        <Pressable>
            <View style={styles.item}>
                <Pressable style={styles.cancelButton} onPress={() => cancelBooking(id)}>
                    <MaterialIcons name="cancel" size={24} color="red" />
                </Pressable>
                <View style={styles.itemContent}>
                    <Text style={styles.detail}>Confirmation #: {ConfirmationNum}</Text>
                    <Text style={styles.detail}>Name: {Name}</Text>
                    <Text style={styles.detail}>Location: {MeetLocation}</Text>
                    <Text style={styles.detail}>Total Price: ${TotalPrice}</Text>
                    <Text style={styles.detail}>Status: {Status}</Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={bookingData}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <Item
                        Name={`${item.Name}`}
                        MeetLocation={item.MeetLocation}
                        TotalPrice={item.TotalPrice}
                        ConfirmationNum={item.ConfirmationNum}
                        Status={item.Status}
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
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        padding: 20,
        backgroundColor: '#eee',
        width: '100%',
        textAlign: 'center',
    },
    item: {
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        position: 'relative',
    },
    itemContent: {
        flex: 1,
        paddingLeft: 15,
    },
    detail: {
        fontSize: 16,
        color: '#444',
        marginBottom: 8,
    },
    header: {
        backgroundColor: '#007bff',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    cancelBtn: {
        position: 'absolute',
        top: 5,
        right: 10,
        padding: 10,
    },
});

export default ManageBooking;
