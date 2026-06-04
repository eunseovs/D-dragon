import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
View,
TouchableOpacity,
StyleSheet,
Image,
ImageBackground,
} from 'react-native';

export default function EggScreen() {
const router = useRouter();
const [selectedEgg, setSelectedEgg] = useState<number | null>(null);

const eggImages = [
require('../img/redEgg.png'),
require('../img/blueEgg.png'),
require('../img/greenEgg.png'),
];

const selectEgg = () => {
  if (selectedEgg === null) return;
  router.push({
  pathname: "/character",
  params: {
    egg: selectedEgg,
  },
});
};

return (
<ImageBackground
source={require('../img/select_egg.png')}
style={styles.background}
resizeMode="cover"
> <View style={styles.container}> <View style={styles.eggContainer}>
{eggImages.map((egg, index) => (
<TouchableOpacity
key={index}
onPress={() => setSelectedEgg(index)}
>
<Image
source={egg}
style={[
styles.eggImage,
selectedEgg === index && styles.selectedEgg,
]}
/> </TouchableOpacity>
))} </View>

    <TouchableOpacity
      onPress={selectEgg}
      disabled={selectedEgg === null}
    >
      <Image
        source={require('../img/select_egg_button.png')}
        style={[
          styles.selectButton,
          selectedEgg === null && { opacity: 0.5 },
        ]}
      />
    </TouchableOpacity>
  </View>
</ImageBackground>
);
}

const styles = StyleSheet.create({
background: {
flex: 1,
},

container: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},

eggContainer: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 120,
},

eggImage: {
width: 110,
height: 110,
resizeMode: 'contain',
marginHorizontal: 10,
},

selectedEgg: {
borderWidth: 4,
borderColor: '#FFD966',
borderRadius: 999,
},

selectButton: {
width: 120,
height: 60,
resizeMode: 'contain',
marginTop: 40,
},
});
