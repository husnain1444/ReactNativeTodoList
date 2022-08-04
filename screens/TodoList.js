import React, {useState,useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  FlatList,
} from 'react-native';
import ItemView from '../components/ItemView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Realm from 'realm'
import { PersonSchema } from '../db/PersonSchema';
import {TaskSchema} from '../db/TaskSchema'


const App = ({navigation, route}) => {

  const [userName,setUserName] = useState('')
  const [userId,setUserId] = useState(0)
  const [getList,setList] = useState([TaskSchema])
  let realm = new Realm({schema:[PersonSchema, TaskSchema],deleteRealmIfMigrationNeeded:true});

  useEffect(()=> {
    getData();

    try {
      const dbList = realm.objects('Task');

      //Change Listner ************
      dbList.addListener(onTaskChangeListner)
      // dbList.addListener(onPersonChangeListner)
    } catch (error) {
      alert(error)
    }

    //Destructor ****************
    return () => {
      // realm.removeAllListeners()
      // dbList.removeAllListeners()
      // realm.close();
    }
  },[])

  function onTaskChangeListner(tasksList,changes) {
    // Handle deleted Task objects
    changes.deletions.forEach((index) => {
      // You cannot directly access deleted objects,
      // but you can update a UI list, etc. based on the index.
      let temp = [...tasksList];
    // removing the element using splice
      // temp.splice(index, 1);
      // console.log("Temp: "+temp.length)
      const filteredTemp = temp.filter((item) => {
        return item.isCompleted == false
      }).filter((item) => {
        return item.userId == userId
      })
      navigation.setOptions({tabBarBadge: filteredTemp.length})
      setList(filteredTemp)
      console.log(`Looks like Task #${index} has left the realm.`);
      // }
    });
    // Handle newly added PerTaskson objects
    changes.insertions.forEach((index) => {
      // const insertedTask = tasksList[index];
      // if(insertedTask.isCompleted == false) {
      //   navigation.setOptions({tabBarBadge: getList.length + 1})
      //   setList((currentItems) => [...currentItems,insertedTask])
      //   console.log(`Welcome our new friend, ${insertedTask.title}!`);
      // }
      const temp = [...tasksList]
      console.log("Temp: "+temp)
      const filteredTemp = temp.filter((item) => {
        return item.isCompleted == false
      })
      const filteredByUser = filteredTemp.filter((item) => {
        return item.userId == userId
      })
      console.log("Filtered: "+filteredByUser)
      navigation.setOptions({tabBarBadge: filteredByUser.length})
      setList(filteredByUser)
      console.log(`Looks like Task #${index} has Updated the realm.`);
    });
    // Handle Task objects that were modified
    changes.modifications.forEach((index) => {
      let tempTasks = [...tasksList];
      console.log("Todo Updated List: "+tasksList)
      tempTasks = tempTasks.filter((item) => {
        return item.isCompleted == false
      })
      const filteredByUser = tempTasks.filter((item) => {
        return item.userId == userId
      })
      setList(filteredByUser)
      navigation.setOptions({tabBarBadge: filteredByUser.length})
      // const modifiedTask = tasksList[index];
      // console.log(`Hey ${modifiedTask.name}, you look different!`);
    });
  }

  function onPersonChangeListner(personsList,changes) {
    // Handle deleted Person objects
    changes.deletions.forEach((index) => {
      // You cannot directly access deleted objects,
      // but you can update a UI list, etc. based on the index.
      const temp = [...personsList];
      // removing the element using splice
      temp.splice(index, 1);
      // setPersonList(temp)
      console.log(`Looks like Person #${index} has left the realm.`);
    });
    // Handle newly added Person objects
    changes.insertions.forEach((index) => {
      const insertedPerson = personsList[index];
      // setPersonList((currentItems) => [...currentItems,insertedPerson])
      console.log(`Welcome our new friend, ${insertedPerson.name}!`);

    });
    // Handle Person objects that were modified
    changes.modifications.forEach((index) => {
      const modifiedPerson = personsList[index];
      // const list = modifiedPerson.toDoList.filter((item) => {
      //   return item.isCompleted == false
      // });
      // setList(list)
      console.log(`Hey ${modifiedPerson.name}, you look different!`);
    });
  }

  async function getUpdatedData() {
    let query = "name = '"+userName+"'";
    let list = await realm.objects('Person').filtered(query)[0].toDoList;
    console.log("......................."+list)
      list = list.filter((item) => {
          return item.isCompleted == false
      });
    setList(list)
    navigation.setOptions({tabBarBadge: list.length})
  }

  const getData = async () => {
    try {
      AsyncStorage.getItem("User").then(value => {
        if(value != null) {
          let user = JSON.parse(value);
          setUserName(user.name)
          setUserId(user.id)

          // let query = "name = '"+user.name+"'"
          // let list = realm.objects('Person').filtered(query)[0].toDoList;
          let query = "userId = '"+user.id+"'"
          let list = realm.objects('Task').filtered(query);
            list = list.filter((item) => {
                return item.isCompleted == false
            });
          setList(list)
          navigation.setOptions({tabBarBadge: list.length})
        }
      })
    } catch (error) {
      alert(error)
    }
  }

  function addTodoList() {
    route.params.mainNavigator.navigate("Add Todo List");
  }

  function onCrossClicked(item) {

    Alert.alert("Delete!","Are you Sure to Delete This Task?",
    [
      {
        text: 'Yes',
        onPress: () => {
          DeleteItemFromDB(item);
        }
      },
      {
        text: 'No',
        onPress: () => {}
      }
    ])
    
  }

  function DeleteItemFromDB(item) {
    // console.log("Click", item)
    try {
      realm.write(() => {
        // Delete all instances of Cat from the realm.
        // realm.delete(realm.objects("Cat"));
        realm.delete(item);
      });
    } catch (error) {
      alert(error)
    }
  }

  function onClickItem(item) {
    route.params.mainNavigator.navigate("Add Todo List", {item: item});
  }
  
  return (
    <View style = {styles.sectionContainer}>

      <View style = {{alignItems: 'center'}}>
        <Text style = {styles.sectionTitle}
          onPress={() => {navigation.navigate("TodoDetail")}} >{userName}</Text>
      </View>
      
      <FlatList 
      data={getList}
      renderItem = {(itemData) => {
        return <ItemView listData = {itemData}
        onClickCross = {() => {onCrossClicked(itemData.item)}}
        onClickItem = {() => {onClickItem(itemData.item)}}
        />
      }}
      />
      
      <TouchableOpacity activeOpacity={.5} 
      style = {styles.addButton}
      onPress = {() => {addTodoList()}}>
        <View>
          <Image style = {styles.imageStyle} source = {require('../assets/add_icon.png')} />
        </View>
      </TouchableOpacity>

    </View>
  );
};
  
  const styles = StyleSheet.create({
    sectionContainer: {
      flex: 1,
      margin: 10,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: 'black',
      textDecorationLine: 'underline',
      textDecorationColor: '#007aff',
      textDecorationStyle: 'solid',
      fontStyle: 'italic'
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
    addButton: {
      width: 60,
      height: 60,
      backgroundColor: '#0080ff',
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 10,
      right: 10,
      elevation: 5,
    },
    imageStyle: {
      width: 20,
      height: 20,
      tintColor: 'white'
    }
  });
  
  export default App;