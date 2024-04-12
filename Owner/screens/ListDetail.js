import { View, StyleSheet, Pressable, Text, SafeAreaView, FlatList, Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { useState, useEffect } from 'react';

const ListDetail = ({ route }) => {
    const { detailData } = route.params;
    const [imageURL, setImageURL] = useState('../assets/Emptyimg.png');

    useEffect(() => {
        if (detailData.Filename) {
            const imageRef = ref(storage, `gs://react-native-ys.appspot.com/${detailData.Filename}`);
            getDownloadURL(imageRef)
                .then((url) => {
                    setImageURL(url);
                })
                .catch((error) => {
                    console.error('Error fetching image:', error);
                });
        }
    }, [detailData]);

    return (
        <SafeAreaView>
            <Text>Details</Text>
        </SafeAreaView>
    );
};

export default ListDetail;
