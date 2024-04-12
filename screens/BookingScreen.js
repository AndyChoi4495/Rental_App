import { View, StyleSheet, Pressable, Text, SafeAreaView, FlatList, Image, TextInput } from 'react-native';
import { storage, db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const BookingScreen = ({ route, navigation }) => {
    const [hours, setHours] = useState(1);
    const [totalPrice, setTotalPrice] = useState('');
    const [userUid, setUserUid] = useState('');

    const minHours = 1;
    const maxHours = 24;

    const { data } = route.params;
    console.log(data);

    useEffect(() => {
        const Price = hours * data.HourlyRate;
        setTotalPrice(Price);
        setUserUid(auth.currentUser.uid);
    }, [hours]);
    // Function to handle the increment of hours
    const increaseHours = () => {
        if (hours < maxHours) {
            setHours(hours + 1);
        }
    };

    // Function to handle the decrement of hours
    const decreaseHours = () => {
        if (hours > minHours) {
            setHours(hours - 1);
        }
    };

    const generatedConfirmNum = () => {
        const min = 10000000;
        const max = 99999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const bookPressed = async () => {
        console.log('Booked pressed!');
        const confirmNum = generatedConfirmNum();
        const ReservationList = {
            Name: `${data.FirstName} ${data.LastName}`,
            TotalPrice: totalPrice,
            MeetLocation: `${data.Address}, ${data.City}`,
            OwnerId: data.OwnerId,
            Id: Math.random(),
            ConfirmationNum: confirmNum,
            Status: 'CONFIRMED',
            UserUid: userUid,
        };
        const docRef = await addDoc(collection(db, 'Booking'), ReservationList);
        console.log(docRef);
        navigation.navigate('MyReservation');
    };

    //Item/service details
    //Meeting location
    //Price
    //Owner name and photo
    //Booking status → by default, the status = CONFIRMED
    //Booking confirmation code → randomly generated
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Booking Details</Text>
            <View style={styles.detailsContainer}>
                <Image source={{ url: data.URL }} style={styles.image} />
                <Text style={styles.detailText}>
                    Name: {data.FirstName} {data.LastName}
                </Text>
                <Text style={styles.detailText}>Meeting Location: {data.Address}</Text>
                <Text style={styles.hourText}>Hourly Rate: ${data.HourlyRate}</Text>
                <View style={styles.hourSelector}>
                    <Pressable onPress={decreaseHours} style={styles.btn}>
                        <Text style={styles.btnText}>-</Text>
                    </Pressable>
                    <Text style={styles.hourInput}>{hours}</Text>
                    <Pressable onPress={increaseHours} style={styles.btn}>
                        <Text style={styles.btnText}>+</Text>
                    </Pressable>
                </View>
                <Text style={styles.totalPrice}>Total Price: ${totalPrice}</Text>
                <Pressable
                    onPress={() => {
                        bookPressed();
                    }}
                    style={styles.bookBtn}
                >
                    <Text style={styles.btnText}>Book Now</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 20,
    },
    detailsContainer: {
        alignItems: 'center',
        width: '100%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 40,
        marginBottom: 15,
    },
    detailText: {
        fontSize: 16,
        color: 'black',
        marginVertical: 8,
    },
    btn: {
        backgroundColor: '#007bff',
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    btnText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    hoursText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    hourSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    hourInput: {
        marginHorizontal: 20,
        fontSize: 18,
        textAlign: 'center',
    },
    totalPrice: {
        fontSize: 20,
        marginVertical: 10,
    },
    bookBtn: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    hourText: {
        fontSize: 16,
        color: 'black',
        marginVertical: 8,
        fontWeight: 'bold',
    },
});

export default BookingScreen;
