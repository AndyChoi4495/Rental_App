import { View, StyleSheet, Pressable, Text, SafeAreaView, FlatList, Image, Button, Modal } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '../firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import MapView, { Marker } from 'react-native-maps';

const MapScreen = ({ navigation }) => {
    const [reverseGecodeResultsLabel, setReverseGecodeResultsLabel] = useState('reverse geocoding results go here');
    const [currLocationLabel, setCurrLocationLabel] = useState('curr location results here');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [friendist, setFriendList] = useState([]);
    const [usernameLabel, setUsernameLabel] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const mapRef = useRef(null);

    useEffect(() => {
        if (auth.currentUser === null) {
            console.log('NO ONE IS LOGGED IN');
            navigation.navigate('Login');
        } else {
            console.log(auth.currentUser);
            setUsernameLabel(auth.currentUser.email);
        }
        getLocationData();
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        try {
            const permissionsObject = await Location.requestForegroundPermissionsAsync();
            if (permissionsObject.status === 'granted') {
                alert('Permission granted!');
            } else {
                alert('Permission denied or not provided');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const INITIAL_POSITION = {
        latitude: 43.6532,
        longitude: -79.3832,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    };

    const getLocationData = async () => {
        console.log("Retrieving all documents from the 'Friends' collection...");
        try {
            const querySnapshot = await getDocs(collection(db, 'Friends'));
            const resultsFromDB = [];

            querySnapshot.forEach((currDoc) => {
                console.log(currDoc.data());
                const friend = {
                    id: currDoc.id,
                    ...currDoc.data(),
                };
                console.log(friend);
                resultsFromDB.push(friend);
                return;
            });

            // at this point, we are done  the forEach
            // so update the state variable that is connected to FlatList
            setFriendList(resultsFromDB);
        } catch (err) {
            console.log(err);
        }
    };

    const pinPressed = (markerData) => {
        console.log(markerData);
        setSelectedMarker(markerData);
        setIsModalVisible(true);

        // navigation.navigate('Detail', { markerData });
    };

    const goToCurrLocation = async () => {
        try {
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            mapRef.current.animateToRegion(
                {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                },
                1000
            );
            console.log(`The current location is:`);
            console.log(location);
        } catch (err) {
            console.log(err);
        }
    };

    const goToBooking = (selectedMarker) => {
        console.log('========================');
        console.log(typeof selectedMarker);
        console.log(selectedMarker);
        setIsModalVisible(!isModalVisible);
        navigation.navigate('Booking', { data: selectedMarker });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapView style={styles.mapStyle} ref={mapRef} initialRegion={INITIAL_POSITION}>
                {friendist.map((currMarker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: currMarker.Latitude, longitude: currMarker.Longitude }}
                        title={currMarker.FirstName}
                        onPress={() => pinPressed(currMarker)}
                    />
                ))}
            </MapView>
            <Pressable style={styles.currentLocationButton} onPress={goToCurrLocation}>
                <MaterialIcons name="my-location" size={24} color="white" />
            </Pressable>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalContent}>
                            <Pressable style={styles.closeBtn} onPress={() => setIsModalVisible(!isModalVisible)}>
                                <MaterialIcons name="close" size={24} color="#2196F3" />
                            </Pressable>
                            <Image source={{ uri: selectedMarker?.URL }} style={styles.image} />
                            <Text style={styles.modalText}>
                                Name: {selectedMarker?.FirstName} {}
                                {selectedMarker?.LastName}
                            </Text>
                            <Text style={styles.modalText}>Hourly Rate: ${selectedMarker?.HourlyRate}</Text>
                            <Text style={styles.modalText}>Address: {selectedMarker?.Address}</Text>
                            <Text style={styles.modalText}>City: {selectedMarker?.City}</Text>
                            <Pressable
                                style={styles.bookBtn}
                                onPress={() => {
                                    goToBooking(selectedMarker);
                                }}
                            >
                                <Text style={styles.buttonText}>Book now</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        marginVertical: 8,
    },
    headingText: {
        fontSize: 24,
        marginVertical: 8,
        textAlign: 'center',
    },
    currentLocationButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#2196F3',
        borderRadius: 30,
        padding: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    mapStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalView: {
        width: '100%',
        height: 'auto',
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 25,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginVertical: 8,
        color: '#333',
        textAlign: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 30,
        marginBottom: 20,
    },
    modalContent: {
        width: '100%',
        alignItems: 'center',
        position: 'relative',
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'transparent',
        borderRadius: 20,
        padding: 8,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bookBtn: {
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
    },
});

export default MapScreen;
