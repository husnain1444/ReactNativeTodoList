/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TodoList from './screens/TodoList'
import CompletedList from './screens/CompleteList'
import React from 'react';

import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  LogBox,
  // YellowBox,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const App = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  // const stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  // YellowBox.ignoreWarnings([
  //   'Non-serializable values were found in the navigation state',
  // ]);
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state'])

  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarShowLabel: true,
          headerStyle: {
            backgroundColor: '#0080ff'
          },
          headerTintColor: 'white',
          tabBarActiveBackgroundColor: 'green',
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#555',
          tabBarIcon: ({focused,size,color}) => {
            let name
            size = focused ? 25 : 20
            if(route.name === "TodoList") {
              color = focused ? '#fff' : '#555'
              name = require('./assets/todo_list.png')
            } else if(route.name === "CompletedList") {
              color = focused ? '#fff' : '#555'
              name = require('./assets/todo_complete.png')
            }

            return(
              <Image style = {{size: {size}, tintColor: color, width: size, height: size}}
                source={name}
                />
            )
          }
        }
        // , {headerShown: false}
        )}
        >
        <Tab.Screen
          name='TodoList'
          component={TodoList}
          // options = {{tabBarBadge: 3}}
          initialParams = {{mainNavigator: navigation}}
          />

        <Tab.Screen
          name='CompletedList'
          component={CompletedList}
          initialParams = {{mainNavigator: navigation}}
          />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
