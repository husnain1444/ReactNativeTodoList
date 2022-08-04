import React, {useState,useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Realm from 'realm'
import { PersonSchema } from '../db/PersonSchema';
import {TaskSchema} from '../db/TaskSchema'
import PushNotification from "react-native-push-notification";

const handleNotifications = (item) => {
    PushNotification.localNotification({
        channelId: 'Todo-PushNotifications',
        title: 'Registered',
        message: item + ' is Registered on Our Plateform!',
        data: {
            isOpenable: 0
        }
    });
}

const App = ({navigation}) => {

let realm = new Realm({schema:[PersonSchema, TaskSchema],deleteRealmIfMigrationNeeded:true});

const [getName,setName] = useState('')
const [getAge,setAge] = useState('')

useEffect(()=> {
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

},[])

function onRegisterUser() {
    try {
        let id = 0;
        if(realm.objects('Person').isEmpty() ||realm.objects('Person').max('id') == undefined) {
            id = 0;
        } else{
            id = realm.objects('Person').max('id') + 1;
            console.log("Result added with key: " + id)
        }
        if (getName != '' && getAge != '') {
            const query = "name = '"+getName+"'"
            const user = realm.objects('Person').filtered(query);
            if (user.isEmpty()) {
                realm.write(() => {
                    realm.create('Person', {
                      id: id,
                      name: getName,
                      age: getAge,
                      createdAt: new Date().toString(),
                    });
                  });
    
                handleNotifications(getName)
                navigation.goBack();
            } else {
                alert(getName + " is already Exist!");
            }
        } else {
            alert("Name Or Age can not be Empty!");
        }
    } catch (error) {
        alert(error)
    }
}

return (
    <ScrollView>
        <View style = {styles.sectionContainer}>

            <Image style = {styles.imageStyle}
                source={require('../assets/logo.png')} />

            <TextInput placeholder='Name'
            style = {styles.inputStyle}
            onChangeText = {(newValue) => setName(newValue)}
            />

            <TextInput placeholder='Age'
            style = {styles.inputStyle}
            keyboardType = 'numeric'
            onChangeText = {(enteredText) => setAge(enteredText)}
            />

            <TouchableOpacity style = {styles.buttonStyle}>
                <View style = {{width: '100%'}}>
                    <Button onPress={onRegisterUser} title='Register' color= 'green'/>
                </View>
            </TouchableOpacity>
        </View>
    </ScrollView>
    
);
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontWeight: '400',
    padding: 10,
    margin: 10,
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 10,
  },
  sectionText: {
    flexDirection: 'row',
    width: '80%',
    marginBottom: 20,
    justifyContent: 'space-around'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  imageStyle: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  inputStyle: {
    width: '100%',
    marginBottom: 20,
    padding: 5,
    paddingLeft: 10,
    borderColor: '#0080ff',
    borderWidth: 2,
    borderRadius: 10,
  },
  buttonStyle: {
    width: '100%',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default App;