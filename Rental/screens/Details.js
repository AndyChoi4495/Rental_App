import { View, StyleSheet, Pressable, Text, SafeAreaView, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const DetailsScreen = ({ route }) => {
    const { markerData } = route.params;
    const [imageURL, setImageURL] = useState('../assets/Emptyimg.png');

    useEffect(() => {
        if (markerData.Filename) {
            const imageRef = ref(storage, `gs://react-native-ys.appspot.com/${markerData.Filename}`);
            getDownloadURL(imageRef)
                .then((url) => {
                    setImageURL(url);
                })
                .catch((error) => {
                    console.error('Error fetching image:', error);
                });
        }
    }, [markerData]);

    const handleBookingPress = () => {
        //booking confirm
        //save  confirmation number into data base with Name, hour, total price, userId(can be array multiple user can book same person)
        // ask to go to reservation page or back to map
        //
        console.log('Booking button pressed');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Image source={{ uri: imageURL }} style={styles.image} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>
                        {markerData.FirstName} {markerData.LastName}
                    </Text>
                    <Text style={styles.detail}>Hourly Rate: ${markerData.HourlyRate}</Text>
                    <Text style={styles.detail}>Address: {markerData.Address}</Text>
                    <Text style={styles.detail}>City: {markerData.City}</Text>
                </View>
            </ScrollView>
            <Pressable style={styles.bookingButton} onPress={handleBookingPress}>
                <Text style={styles.bookingButtonText}>Book Now</Text>
            </Pressable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Light grey background for contrast
    },
    scrollView: {
        alignItems: 'center',
        paddingTop: 20,
    },
    image: {
        width: 200, // Adjusted for aesthetic
        height: 200,
        borderRadius: 100, // Circular image
        borderWidth: 5,
        borderColor: '#ddd', // Light border for image
        marginBottom: 20,
    },
    detailsContainer: {
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // Darker text for emphasis
        marginBottom: 10,
    },
    detail: {
        fontSize: 16,
        color: '#666', // Slightly lighter text for details
        marginBottom: 5,
    },
    bookingButton: {
        marginTop: 20,
        backgroundColor: '#007bff', // Example blue color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    bookingButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DetailsScreen;
