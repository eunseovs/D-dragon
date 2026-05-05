import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

const users = [
 {name:"나", img:"https://i.pravatar.cc/100?img=1"},
 {name:"도연", img:"https://i.pravatar.cc/100?img=2"},
 {name:"민지", img:"https://i.pravatar.cc/100?img=3"},
 {name:"예서", img:"https://i.pravatar.cc/100?img=4"},
 {name:"은서", img:"https://i.pravatar.cc/100?img=5"},
];

export default function ProfileBar(){

return(

<View style={styles.container}>

<ScrollView horizontal showsHorizontalScrollIndicator={false}>

{users.map((user,i)=>(
<View key={i} style={styles.story}>

<View style={styles.circle}>
<Image source={{uri:user.img}} style={styles.image}/>
</View>

<Text style={styles.name}>{user.name}</Text>

</View>
))}

</ScrollView>

</View>

)

}

const styles = StyleSheet.create({

container:{
backgroundColor:"#D9D9D9",
paddingVertical:10
},

story:{
alignItems:"center",
marginHorizontal:10
},

circle:{
width:75,
height:75,
borderRadius:40,
borderWidth:3,
borderColor:"#79b39a",
justifyContent:"center",
alignItems:"center"
},

image:{
width:65,
height:65,
borderRadius:32
},

name:{
marginTop:5,
fontSize:12
}

});