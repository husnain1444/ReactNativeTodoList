 import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
 import App from '../App'
 import Splash from './Splash'
 import AddTodoList from './AddTodoList'
 import RegisterUser from './RegisterUser'

 import React, {useEffect} from 'react';
 import PushNotification from "react-native-push-notification";
 
 import {
   Image,
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   TextInput,
   useColorScheme,
   View,
 } from 'react-native';
 import LogInView from './LogInView'
 import { createNavigationContainerRef } from '@react-navigation/native';

 
 export const navigationRef = createNavigationContainerRef()

 export function navigate(name, params) {
   if (navigationRef.isReady()) {
     navigationRef.navigate(name, params);
   } else {
    alert("Navigation Reference is not Ready!")
   }
 }

 const LogIn = ({navigation,route}) => {
   const isDarkMode = useColorScheme() === 'dark';
   const stack = createStackNavigator();

   useEffect(() => {
      createChannel();
   },[])

    const createChannel = () => {
      PushNotification.createChannel({
        channelId: 'Todo-PushNotifications',
        channelName: 'Todo-PushNotifications'
      })
    }

   StatusBar.setHidden(true,'none')
   function LogInFunction({navigation}) {
    return(
        <LogInView navigation = {navigation} />
    )
 }

   return (
     <NavigationContainer independent={true} ref = {navigationRef}>
       <stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
         <stack.Screen
           name='Splash'
           component={Splash}
           />
         
         <stack.Screen
           name='LogIn'
           component={LogInFunction}
           />

        <stack.Screen
           name='RegisterUser'
           component={RegisterUser}
           options = {{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#0080ff'
            },
            headerTintColor: 'white'
          }}
           />
 
         <stack.Screen
           name='MainScreen'
           component={App}
           />

        <stack.Screen
          name='Add Todo List'
          component={AddTodoList}
          options = {{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#0080ff'
            },
            headerTintColor: 'white'
          }}
          />
       </stack.Navigator>
     </NavigationContainer>
   );
 };
 
 export default LogIn;
 