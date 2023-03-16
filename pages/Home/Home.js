import { View, Text, Image } from "react-native";
import logo from "../../assets/adaptive-icon.png";

const Home = function () {
  return (
    <View>
      <Image
        style={{
          width: 100,
          height: 100,
        }}
        source={logo}
      />
    </View>
  );
};

export default Home;
