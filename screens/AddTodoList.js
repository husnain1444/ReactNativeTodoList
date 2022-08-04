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
  PermissionsAndroid,
  TouchableOpacity,
  Button,
  ToastAndroid,
  Platform,
  AlertIOS,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
import CheckBox from '@react-native-community/checkbox';
import { color } from 'react-native-reanimated';
import Realm from 'realm'
import { PersonSchema } from '../db/PersonSchema';
import {TaskSchema} from '../db/TaskSchema'
import DatePicker from 'react-native-date-picker'
import moment from "moment";
import PushNotification from "react-native-push-notification";


const App = ({navigation,route}) => {

    const [userName,setUserName] = useState('')
    const [userId,setUserId] = useState(0)
    const [taskId,setTaskId] = useState(0)
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [getTitle,setTitle] = useState('')
    const [getDesc,setDesc] = useState('')
    const [imageItem,setImageItem] = useState('')
    const [buttonText,setButtonText] = useState('Add Task')
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    const getParams = () => {
      if(route.params != undefined && route.params != NaN && route.params != null) {
        if(route.params.item != null) {
          setTaskId(route.params.item.id)
          setTitle(route.params.item.title)
          setDesc(route.params.item.description)
          setToggleCheckBox(route.params.item.isCompleted)
          setImageItem(route.params.item.image)
          setButtonText("Update Task")
        }
      } 
    }

    let realm = new Realm({schema:[PersonSchema, TaskSchema],deleteRealmIfMigrationNeeded:true});

    const requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Todo List App Camera Permission",
              message:
                "Todo List App needs access to your camera " +
                "so you can take awesome pictures.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the camera");
            return true
          } else {
            console.log("Camera permission denied");
            return false
          }
        } catch (err) {
          console.warn(err);
        }
    }

  const getData = async () => {
    try {
      AsyncStorage.getItem("User").then(value => {
        if(value != null) {
          let user = JSON.parse(value);
          setUserId(user.id)
          setUserName(user.name)
        }
      })
    } catch (error) {
      alert(error)
    }
  }

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

    getData();
    getRealmInstance();
    getParams();

    //Destructor ****************
    return () => {
      // realm.removeAllListeners()
      // dbList.removeAllListeners()
      // realm.close();
    }
  },[])

  async function openCamera() {

    if(requestCameraPermission()) {
        const output = await launchCamera({
            mediaType: 'mixed',
            cameraType: 'back',
            presentationStyle: 'fullScreen'
        });
    
        if (output?.assets != null) {
            setImageItem(output.assets[0].uri)
        } else if (output.errorCode != null) {
            alert(output.errorMessage)
        }
    }
  }

  async function selectFromGallary() {
    const output = await launchImageLibrary({
        mediaType: 'mixed',
        presentationStyle: 'fullScreen',
    });

    if (output?.assets != null) {
        setImageItem(output.assets[0].uri)
    } 
  }

  function onAddTask() {
    try {
        if (getTitle != '' && getDesc != '') {       
            if (buttonText == "Add Task") {
              let id = 0;
              if(realm.objects('Task').isEmpty() ||realm.objects('Task').max('id') == undefined) {
                  id = 0;
              } else{
                  id = realm.objects('Task').max('id') + 1;
                  console.log("Result added with key: " + id)
              }

              let query = "name = '"+userName+"'"
              const user = realm.objects('Person').filtered(query)[0]
              let tasks = user.toDoList

              realm.write(() => {
                // realm.deleteAll();
                const task = realm.create('Task', {
                  id: id,
                  userId: userId,
                  title: getTitle,
                  description: getDesc,
                  isCompleted: toggleCheckBox,
                  image: imageItem,
                  createdAt: new Date().toString(),
              });

              if (tasks.length == 0) {
                tasks = [task]
              } else {
                tasks.push(task)
              }
              user.toDoList = tasks
            });
          } else { //********************* For Update Task ****************//
            let query = "name = '"+userName+"'";
            const user = realm.objects('Person').filtered(query)[0]

            realm.write(() => {
              const  task = realm.objects('Task').filtered("id = '"+taskId+"'")[0]
              task.title = getTitle;
              task.description = getDesc;
              task.image = imageItem;
              task.isCompleted = toggleCheckBox;
              // realm.create('Task', {
              //   id: taskId,
              //   userId: userId,
              //   title: getTitle,
              //   description: getDesc,
              //   isCompleted: toggleCheckBox,
              //   image: imageItem,
              //   createdAt: new Date().toString()
              // },
              // "modified");
              // console.log(task)
            });

            realm.write(() => {
              console.log("UserId: "+userId)
              const taskQuery = "userId = '"+userId+"'";
              const tasks = realm.objects("Task").filtered(taskQuery)
              // console.log(tasks)
              user.toDoList = tasks
            });
          }
        
          navigation.goBack();
        } else {
            alert("Kindly Add Title and Description for Adding Task!")
        }
    } catch (error) {
        alert(error)
    }
  }

  function onAddAlarm() {
    if (getTitle != '' && getDesc != '') {  
      setOpen(true)
    } else {
      alert("Kindly Add Title and Description for Schedule Notification!")
    }
  } 

  var longToDate = function(millisec) {
    // var length = millisec.length - 7;
    // var date = parseInt(millisec.substring(6,length));
    // var date1 = parseInt(millisec)
    return (new Date(millisec));
}

  const setTaskAlarm = (pickedDate) => {
    // console.log("Get Current: "+ new Date())
    // console.log(pickedDate.getTime() - new Date().getTime())
    const convertedDate = longToDate((new Date().getTime() + (pickedDate.getTime() - new Date().getTime())))

    PushNotification.localNotificationSchedule({
      channelId: 'Todo-PushNotifications',
      title: getTitle,
      ignoreInForeground: true,
      message: getDesc,
      date: convertedDate,//new Date(new Date + 60 * 1000),
      allowWhileIdle: true,
      repeatTime: 1,
    });

    notifyMessage("Alarm Successfully Set For This Task!")
  }

  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      AlertIOS.alert(msg);
    }
  }

  return (
    <ScrollView>
        <View style = {styles.sectionContainer}>

            <TextInput placeholder='Title'
            style = {styles.inputStyle}
            value = {getTitle}
            onChangeText = {(newValue) => setTitle(newValue)}
            />

            <TextInput placeholder='Description'
            style = {styles.inputStyle}
            value = {getDesc}
            onChangeText = {(newValue) => setDesc(newValue)}
            multiline
            />

            <View style = {styles.checkBoxContainer}>
                <CheckBox
                    disabled={false}
                    value={toggleCheckBox}
                    onTintColor='#007aff'
                    onCheckColor = '#007aff'
                    tintColor = '#aaaaaa'
                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                    />

                <Text>Completed</Text>

                <TouchableOpacity style = {styles.buttonStyle}>
                  <View style = {{}}>
                    <Button onPress={onAddAlarm} title= "Add Alarm" color= 'green'/>

                    <DatePicker mode='datetime' date={date} 
                    modal
                    is24hourSource = 'locale'
                    timeZoneOffsetInMinutes={300}
                    time
                    open = {open}
                    onDateChange={(date) => {
                      setDate(date)
                      console("Date: "+date)
                    }}
                      onConfirm = {(date) => {
                        setOpen(false)
                        setDate(date)
                        // console.log("Date: "+date)
                        setTaskAlarm(date)
                        // console.log((moment(date).utc().format("dddd, MMMM Do YYYY, h:mm:ss a")))
                      }}
                      onCancel = {() => {
                        setOpen(false)
                      }}
                    />

                </View>
              </TouchableOpacity>

            </View>

            <View style = {styles.sectionText}>
                <Text style = {styles.sectionTitle}
                onPress={() => {openCamera()}} >Camera</Text>

                <Text style = {styles.sectionTitle}
                onPress={() => {selectFromGallary()}} >Gallary</Text>
            </View>

            <Image style = {styles.imageStyle} 
                source={imageItem == '' ? require('../assets/logo.png') : {uri: imageItem}} />

            <TouchableOpacity style = {styles.buttonStyle}>
                <View style = {{width: '100%'}}>
                    <Button onPress={onAddTask} title= {buttonText} color= 'green'/>
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
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 10,
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
  checkBoxContainer: {
    width: '100%',
    flexDirection: 'row', 
    alignItems: 'center' , 
    justifyContent: 'flex-start',
  },
});

export default App;