import { View, StyleSheet } from "react-native";
import { TouchableRipple } from "react-native-paper";

const Card = ({ children, style, color, onPress }) => {
  return (
    <TouchableRipple
      onPress={() => {
        console.log(onPress);
        if (onPress) {
          onPress();
        }
      }}
      style={[styles.card, style]}
    >
      {children}
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default Card;
