import React, {useState,useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  PermissionsAndroid,
} from 'react-native';

const App = ({navigation}) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('LogIn')
        }, 1500)
    },[]);

    return(
        <View style = {styles.mainContainer}>
            <Image style = {styles.imageStyle} source={require('../assets/logo.png')} />

            <Text style = {styles.textStyle}>Todo List App</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#34bb'
    },
    imageStyle: {
        width: 100,
        height: 100,
        paddingBottom: 20,
    },
    textStyle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        fontStyle: 'italic',
        textDecorationStyle: 'solid',
    }

});

export default App;