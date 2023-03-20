import { View, StyleSheet } from "react-native";
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
      <TouchableRipple
        rippleColor={"rgba(255,255,255,0.3)"}
        onPress={() => {
          console.log(onPress);
          if (onPress) {
            onPress();
          }
        }}
        style={styles.cardContent}
      >
        {children}
      </TouchableRipple>
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
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardContent: {
    padding: 10,
  },
});

export default Card;
