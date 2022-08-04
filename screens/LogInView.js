import {
    Button,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
  } from 'react-native';
  
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from "react-native-push-notification";
import Realm from 'realm'
import { PersonSchema } from '../db/PersonSchema';
import {TaskSchema} from '../db/TaskSchema'

const App = (props) => {

useEffect(() => {
    const getRealmInstance = async () => {
        try {
            realm = await Realm.open({
                path: 'myrealm',
                schema: [PersonSchema,TaskSchema],
                schemaVersion: 1
            });
            } catch (e) {
            console.log(e);
            }
    }
    
    getRealmInstance();
    getData()
},[])

const [inputText,setInputText] = useState('')
let navigation = props.navigation
let realm = new Realm({schema:[PersonSchema, TaskSchema],deleteRealmIfMigrationNeeded:true});

function getInputText(enteredText) {
    setInputText(enteredText)
}

const handleNotifications = (item) => {
    PushNotification.localNotification({
        channelId: 'Todo-PushNotifications',
        title: 'LogIn',
        message: item + ' is LogIn on Our Plateform!',
        data: {
            isOpenable: 0
        }
    });
}

const getData = async () => {
    try {
      AsyncStorage.getItem("User").then(value => {
        if(value != null){
            let user = JSON.parse(value);
            setInputText(user.name)
        }
      })
    } catch (error) {
      alert(error)
    }
}

async function onLogIn() {
    if (inputText == '' || inputText == null) {
        alert("Please Enter Your Name!")
    } else {
        try {
            const query = "name = '"+inputText+"'"
            const user = realm.objects('Person').filtered(query);
            if (!user.isEmpty()) {
                await AsyncStorage.setItem("User",JSON.stringify(user[0]))
                handleNotifications(inputText)
                // setInputText('')
                navigation.navigate("MainScreen")   
            } else {
                alert(inputText + " Did not Exist!")
            }    
        } catch (error) {
            alert(error)
        }  
    }
}

async function onRegister() {
    navigation.navigate('RegisterUser');
} 

return (
    <View style = {styles.sectionContainer}>
        
        <Image style = {styles.imageStyle}
            source={require('../assets/logo.png')} />
        
        <Text style = {styles.sectionTitle}>Check Your Todo List!</Text>

        <TextInput style = {styles.inputTextStyle}
            placeholder='Please Enter Your Name'
            value = {inputText}
            onChangeText={getInputText} />

        <View style= {styles.buttonStyle}>
            <Button title='LogIn' onPress={() => onLogIn()}/>
        </View>
        <View style= {styles.buttonStyle}>
            <Button title='Register' onPress={() => onRegister()}/>
        </View>
    </View>
)
}

const styles = StyleSheet.create({
sectionContainer: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
},
sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#f04f',
    fontStyle: 'italic',
    paddingBottom: 50,
},
sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
},
imageStyle: {
    height: 100,
    width: 100,
},
inputTextStyle: {
    width: '70%',
    padding: 10,
    borderRadius: 10,
    borderColor: '#f04f',
    borderWidth: 2,
    color: 'black',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
},
buttonStyle: {
    width: 150,
    padding: 20,
    margin: 10,
    borderRadius: 10,
}
});

export default App;