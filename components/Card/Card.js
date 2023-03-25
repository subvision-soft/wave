import { View, StyleSheet, TouchableOpacity } from "react-native";
import { TouchableRipple } from "react-native-paper";

const Card = ({
  children,
  color,
  onPress,
  borderColor = "#fff",
  bgColor = "#fff",
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          console.log(onPress);
          if (onPress) {
            onPress();
          }
        }}
        style={styles.cardContent}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardContent: {
    padding: 10,
  },
});

export default Card;
