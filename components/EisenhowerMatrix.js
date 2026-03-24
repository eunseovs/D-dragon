import React, { useState } from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet,
Modal,
TextInput,
Button
} from "react-native";

export default function EisenhowerMatrix(){

const [matrix,setMatrix] = useState({
q1:[],
q2:[],
q3:[],
q4:[]
});

const [modalVisible,setModalVisible] = useState(false);
const [selectedBox,setSelectedBox] = useState(null);
const [task,setTask] = useState("");

const openInput = (quadrant) =>{
setSelectedBox(quadrant);
setModalVisible(true);
};

const addTask = () =>{

if(task.trim()==="") return;

setMatrix({
...matrix,
[selectedBox]: [...matrix[selectedBox],task]
});

setTask("");
setModalVisible(false);

};

const Box = ({number,color,title,data,onPress}) =>(

<TouchableOpacity style={styles.box} onPress={onPress}>

<View style={[styles.circle,{backgroundColor:color}]}>
<Text style={styles.circleText}>{number}</Text>
</View>

<Text style={styles.boxTitle}>{title}</Text>

{data.map((item,index)=>(
<Text key={index} style={styles.task}>• {item}</Text>
))}

</TouchableOpacity>

);

return(

<View style={styles.container}>

<Text style={styles.title}>Eisenhower Matrix</Text>

<View style={styles.grid}>

<Box
number="1"
color="#A7D7C5"
title="중요함 - 긴급함"
data={matrix.q1}
onPress={()=>openInput("q1")}
/>

<Box
number="2"
color="#F6C1C1"
title="중요하지 않음 - 긴급함"
data={matrix.q2}
onPress={()=>openInput("q2")}
/>

<Box
number="3"
color="#B9D7F0"
title="중요함 - 긴급하지 않음"
data={matrix.q3}
onPress={()=>openInput("q3")}
/>

<Box
number="4"
color="#F4D58D"
title="중요하지 않음 - 긴급하지 않음"
data={matrix.q4}
onPress={()=>openInput("q4")}
/>

</View>

{/* 입력 모달 */}

<Modal
visible={modalVisible}
transparent
animationType="slide"
>

<View style={styles.modalBackground}>

<View style={styles.modalBox}>

<Text style={{fontSize:16,fontWeight:"600",marginBottom:10}}>
할 일 입력
</Text>

<TextInput
placeholder="할 일을 입력하세요"
value={task}
onChangeText={setTask}
style={styles.input}
/>

<Button title="추가하기" onPress={addTask}/>

</View>

</View>

</Modal>

</View>

);
}

const styles = StyleSheet.create({

container:{
backgroundColor:"#fff",
padding:15
},

title:{
fontSize:18,
fontWeight:"600",
marginBottom:10
},

grid:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between"
},

box:{
width:"48%",
backgroundColor:"#f3f3f3",
borderRadius:15,
padding:12,
marginBottom:10
},

circle:{
width:35,
height:35,
borderRadius:20,
justifyContent:"center",
alignItems:"center",
marginBottom:5
},

circleText:{
fontWeight:"bold",
fontSize:16
},

boxTitle:{
fontSize:12,
color:"#555",
marginBottom:5
},

task:{
fontSize:12
},

modalBackground:{
flex:1,
justifyContent:"center",
alignItems:"center",
backgroundColor:"rgba(0,0,0,0.3)"
},

modalBox:{
width:"80%",
backgroundColor:"#fff",
padding:20,
borderRadius:15
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:10,
padding:10,
marginBottom:10
}

});