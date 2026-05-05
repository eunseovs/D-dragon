import { Image, TouchableOpacity } from "react-native";

export default function PhotoCard({item,selected,onPress}){

  return(

    <TouchableOpacity onPress={()=>onPress(item)}>

      <Image
        source={{uri:item.uri}}
        style={{
          width:120,
          height:120,
          margin:5,
          borderWidth:selected?3:0,
          borderColor:"#7fb59d"
        }}
      />

    </TouchableOpacity>

  );

}