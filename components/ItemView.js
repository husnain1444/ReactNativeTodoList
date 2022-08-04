import {StyleSheet,View,Text, Image, Pressable, TouchableOpacity} from 'react-native';
import React,{useState} from 'react';
import { defaultColors } from '../utils/defaultColors';
import {crossImage} from '../images/crossImage';
import CheckBox from '@react-native-community/checkbox';

export default function ItemView(props) {

    const [toggleCheckBox, setToggleCheckBox] = useState(true)

    // setToggleCheckBox(props.listData.item.isCompleted);

    return(
        <TouchableOpacity activeOpacity={.5} onPress = {() => props.onClickItem()}>
          <View style = {styles.subContainer}>

            <View style = {styles.checkBoxStyle}>
              <CheckBox
                disabled={true}
                value={props.listData.item.isCompleted}
                tintColors={{ true: '#FFF', false: 'white' }}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
                />

              <View style = {{height: '100%', width: 2, backgroundColor: 'white',marginRight: 10,marginLeft: 10}}></View>
            </View>

            <View style = {{paddingRight: 50}}>
              <Text style={styles.textItem}>
                {
                // "(" + props.listData.item.id + ") " + 
                "Title: " + props.listData.item.title}
                </Text>

              <Text style={styles.textSubItem}>
               {"Desc: " + props.listData.item.description} 
              </Text>
            </View> 

            <Pressable style = {{position: 'absolute', right: 10,top: 10,}} 
              onPress={() => props.onClickCross()}>
                <Image style = {styles.imageStyle}
                source={ crossImage } //{require('./my-icon.png')}
                />
            </Pressable>

          </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    subContainer:{
        borderColor: '#cccc',
        borderWidth: 2,
        borderRadius: 10,
        margin: 5,
        backgroundColor: defaultColors.listTheme,
        padding: 10,
        flexDirection: 'row'
        // backgroundColor: 'red'
      },
    textItem: {
      fontStyle: 'italic',
      fontSize: 20,
      fontWeight: '600',
      color: 'white',
      textDecorationStyle: 'solid',
      },
      textSubItem: {
        fontSize: 16,
        fontWeight: '400',
        color: 'white',
        marginTop: 10,
        // backgroundColor: 'white'
      },
      imageStyle: {
        width: 25,
        height: 25,
        tintColor: 'white',
      },
    checkBoxStyle: {
      // position: 'absolute',
      // right: 5,
      // bottom: 3,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }
}) ;