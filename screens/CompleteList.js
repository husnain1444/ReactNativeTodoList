import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState,useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
      const temp = [...tasksList];
    // removing the element using splice
      // temp.splice(index, 1);
      const filteredTemp = temp.filter((item) => {
        return item.isCompleted == true
      })
      const filteredByUser = filteredTemp.filter((item) => {
        return item.userId == userId
      })
      navigation.setOptions({tabBarBadge: filteredByUser.length})
      setList(filteredByUser)
      console.log(`Looks like Task #${index} has left the realm.`);
    });
    // Handle newly added PerTaskson objects
    changes.insertions.forEach((index) => {
      const temp = [...tasksList]
      const filteredTemp = temp.filter((item) => {
        return item.isCompleted == true
      })
      const filteredByUser = filteredTemp.filter((item) => {
        return item.userId == userId
      })
      navigation.setOptions({tabBarBadge: filteredByUser.length})
      setList(filteredByUser)
      console.log(`Looks like Task #${index} has Updated the realm.`);
    });
    // Handle Task objects that were modified
    changes.modifications.forEach((index) => {
      let tempTasks = [...tasksList];
      console.log("Todo UPdated List: "+tempTasks)
      tempTasks = tempTasks.filter((item) => {
        return item.isCompleted == true
      })
      const filteredByUser = tempTasks.filter((item) => {
        return item.userId == userId
      })
      setList(filteredByUser)
      navigation.setOptions({tabBarBadge: filteredByUser.length})
      // const modifiedTask = tasksList[index];
      // console.log(`Hey ${modifiedTask.title}, you look different!`);
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
      // getData();
      // const list = modifiedPerson.toDoList.filter((item) => {
      //   return item.isCompleted == false
      // });
      // setList(list)
      console.log(`Hey ${modifiedPerson.name}, you look different!`);
    });
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
                return item.isCompleted == true
            });
          setList(list)

          navigation.setOptions({tabBarBadge: list.length})
        }
      })
    } catch (error) {
      alert(error)
    }
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
    console.log("Click", item)
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
      <FlatList 
      data={getList}
      renderItem = {(itemData) => {
        return <ItemView listData = {itemData}
        onClickCross = {() => {onCrossClicked(itemData.item)}}
        onClickItem = {() => {onClickItem(itemData.item)}}
        />
      }}
      />
    </View>
  );
};
  
const styles = StyleSheet.create({
  sectionContainer: {
    margin: 10,
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