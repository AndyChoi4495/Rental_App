import {
    View,
    StyleSheet,
    Pressable,
    Text,
    SafeAreaView,
    Image,
    ScrollView,
    FlatList,
    RefreshControl,
} from 'react-native';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';
import { storage, auth, db } from '../firebaseConfig';

const MyReservation = ({ route, navigation }) => {
    // const [imageURL, setImageURL] = useState('../assets/Emptyimg.png');
    const [usernameLabel, setUsernameLabel] = useState('username goes here');
    const [bookingList, setBookingList] = useState([]);
    const [userUid, setUserUid] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const getAllData = async () => {
        console.log("Retrieving all documents from the 'Booking' collection...");
        try {
            const querySnapshot = await getDocs(collection(db, 'Booking'));
            const resultsFromDB = [];

            querySnapshot.forEach((currDoc) => {
                console.log(currDoc.data());

                const Revervation = {
                    id: currDoc.id,
                    ...currDoc.data(),
                };

                if (Revervation.UserUid == userUid) {
                    // add it to the array
                    resultsFromDB.push(Revervation);
                }
                return;
            });
            setBookingList(resultsFromDB);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (auth.currentUser === null) {
            console.log('NO ONE IS LOGGED IN');
            navigation.navigate('Login');
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

    const Item = ({ Name, MeetLocation, TotalPrice, ConfirmationNum, Status }) => (
        <View>
            <View style={styles.item}>
                <Text style={styles.detail}>Confirmation #: {ConfirmationNum}</Text>
                <Text style={styles.detail}>Name: {Name}</Text>
                <Text style={styles.detail}>Location: {MeetLocation}</Text>
                <Text style={styles.detail}>Total Price: ${TotalPrice}</Text>
                <Text style={styles.detail}>Status: {Status}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={bookingList}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <Item
                        Name={`${item.Name}`}
                        MeetLocation={item.MeetLocation}
                        TotalPrice={item.TotalPrice}
                        ConfirmationNum={item.ConfirmationNum}
                        Status={item.Status}
                    />
                )}
                keyExtractor={(item) => item.id}
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
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
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
});

export default MyReservation;
