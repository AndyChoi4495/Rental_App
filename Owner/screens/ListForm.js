import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, Image, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage, db, auth } from '../firebaseConfig';
import { uploadBytesResumable, ref, getDownloadURL, list } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import * as Location from 'expo-location';

const ListForm = ({ navigation }) => {
    const [listData, setListData] = useState(null);
    const [firstName, setFirstName] = useState('yunseok');
    const [lastName, setLastName] = useState('Choi');
    const [hourlyRate, setHourlyRate] = useState('20');
    const [city, setCity] = useState('Toronto');
    const [address, setAddress] = useState('123 Yonge street');
    const [imageUri, setImageUri] = useState('');
    const [resultsLabel, setResultsLabel] = useState('');
    const [imageFromGallery, setImageFromGallery] = useState(null);
    const [errorMessageLabel, setErrorMessageLabel] = useState('');
    const [fileName, setFileName] = useState('Emptyimg.png');
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [OwnerId, setOwnerId] = useState('');

    useEffect(() => {
        console.log('==========================================');
        console.log('Latitude changed:', latitude);
        console.log('Longitude changed:', longitude);
        //console.log(auth.currentUser);\
        //console.log('friend is changed:', friendToInsert);
        console.log('imageUri is changed:', imageUri);
        //setListData(friendToInsert);
        //console.log('ListData changed:', listData);
        console.log('==========================================');

        // not a good idea, need to improve.

        if (latitude !== 0 && longitude !== 0 && imageUri) {
            createList();
        }

        setOwnerId(auth.currentUser.uid);
    }, [latitude, longitude, imageUri]);

    const chooseImage = async () => {
        try {
            // 1. Attempt to open the image gallery
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            console.log(`DEBUG: The image information is`);
            console.log(result);

            // 2. if the person cancelled, then show an message
            if (result.canceled === true) {
                setResultsLabel('ERROR: User did not choose a photo');
                setImageFromGallery(null);
                return;
            }

            // 3. otherwise, display the image in the UI
            // a. retrivinv the Uri proprerty
            const filePath = result.assets[0].uri;
            // b. update teh <Image> component with the photo
            setImageFromGallery(filePath);
            // debugging, not required for actual app
            setImageUri(filePath);
            console.log(filePath);
        } catch (err) {
            console.log(err);
        }
    };

    const addURL = async () => {
        const imageRef = ref(storage, `gs://react-native-ys.appspot.com/${fileName}`);
        await getDownloadURL(imageRef)
            .then((url) => {
                console.log('2');
                console.log('==============================');
                // console.log(url);
                //console.log(typeof url);
                setImageUri(url);
            })
            .catch((error) => {
                console.error('Error fetching image:', error);
            });
    };

    const doFwdGeocode = async () => {
        try {
            const geocodedLocation = await Location.geocodeAsync(address, city);
            // console.log(geocodedLocation); // array of possible locations
            const result = geocodedLocation[0];
            if (result === undefined) {
                alert('No coordinates found');
                return;
            }
            //console.log(result);
            console.log('3');
            console.log(`Latitude: ${result.latitude}`);
            console.log(`Longitude: ${result.longitude}`);
            // const lat = result.latitude.toString();
            //const lon = result.longitude.toString();
            const lat = result.latitude;
            const lon = result.longitude;
            setLatitude(lat);
            setLongitude(lon);
        } catch (err) {
            console.log(err);
        }
        console.log('4');
    };

    const saveToCloud = async () => {
        console.log('1');
        // 0. error checking make sure a photo is selected
        if (imageFromGallery === null) {
            alert('No photo selected');
            await addURL();
            return;
        }

        // 1. get the filename of the photo from the device
        // extract the file name from the path
        // - look for the last "/" symbol
        // - get all text that comes after the / sybmol
        const filename = imageFromGallery.substring(imageFromGallery.lastIndexOf('/') + 1, imageFromGallery.length);

        console.log(`DEBUG:  File name is: ${filename}`);

        // 2. Tell firebase where to save the photo in Firebase Stroage
        // storage = the export from fireBase config
        // filename is the name of the file we want to use in Firebase Storage

        setFileName(filename);
        const photoRef = ref(storage, filename);
        console.log('PhotoRef:', photoRef);

        try {
            // 3. "download" the file from the device
            console.log('DEBUG: Downloading the file from the device');
            const response = await fetch(imageFromGallery);

            // 4. convert the file to a "blob"
            console.log('DEBUG: Converting to a blob');
            const blob = await response.blob();

            // 5. upload the "blob" to firebase storage
            console.log('DEBUG: Upload to firebase storage');
            await uploadBytesResumable(photoRef, blob);

            alert('DONE: Upload Complete');
            console.log('Upload done');
        } catch (err) {
            console.log(err);
        }
    };

    const createList = async () => {
        if (firstName == '' || lastName == '' || hourlyRate == '' || city == '' || address == '') {
            setErrorMessageLabel('Please fill in all the fields.');
            return;
        }
        try {
            await saveToCloud();

            await doFwdGeocode();
            // await addURL();
            const friendToInsert = {
                FirstName: firstName,
                LastName: lastName,
                HourlyRate: hourlyRate,
                City: city,
                Address: address,
                Filename: fileName,
                Latitude: latitude,
                Longitude: longitude,
                URL: imageUri,
                OwnerId: OwnerId,
                Id: Math.random(),
            };

            console.log('Creating document with:', friendToInsert);

            if (latitude !== 0 && longitude !== 0 && imageUri) {
                await addDoc(collection(db, 'Friends'), friendToInsert);
            }

            navigation.navigate('Main');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text>First Name: </Text>
            <TextInput placeholder="FirstName" value={firstName} onChangeText={setFirstName} style={styles.input} />
            <Text>Last Name: </Text>
            <TextInput placeholder="LastName" value={lastName} onChangeText={setLastName} style={styles.input} />
            <Text>Hourly Rate: </Text>
            <TextInput
                placeholder="Hourly Rate"
                keyboardType="numeric"
                value={hourlyRate}
                onChangeText={setHourlyRate}
                style={styles.input}
            />
            <Text>City: </Text>
            <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
            <Text>Address: </Text>
            <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={styles.input} />
            <Text style={{ color: 'red' }}>{errorMessageLabel} </Text>
            <Button title="Pick Image" onPress={chooseImage} />

            <Image source={{ uri: imageFromGallery }} style={styles.image} />
            <Pressable onPress={createList} style={styles.btn}>
                <Text style={styles.btnLabel}>Create List</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    btn: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    btnLabel: {
        color: '#fff',
        fontSize: 16,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginVertical: 20,
    },
});

export default ListForm;
