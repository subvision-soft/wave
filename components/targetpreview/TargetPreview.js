import targetBlueprint from "../../assets/target_blueprint.png";
import {
  View,
  Animated,
  useWindowDimensions,
  ImageBackground,
  Text,
  Touchable,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import TargetZone from "../../utils/target/TargetUtils";
import { forwardRef, useImperativeHandle, useState } from "react";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import Ionicons from "react-native-vector-icons/Ionicons";

const TargetPreview = forwardRef(({ impacts = [] }, ref) => {
  useImperativeHandle(ref, () => ({
    setImpacts: (impacts) => {
      setImpactsArray(impacts);
    },
  }));

  const [impactsArray, setImpactsArray] = useState(impacts);

  const { width, height } = useWindowDimensions();
  const windowSize = Math.min(width, height);

  const caseSize = 9;
  const cibleSize = 2565;
  const visuelSize = 810;
  const globalPadding = 180;
  const arrowSize = 9 * 6;
  const [selectedImpact, setSelectedImpact] = useState();

  const pointToDistance = (points) => {
    let i;

    for (i = 0; i < 43 && points > 411; i++) {
      points = points - 3;
    }
    for (; i < 48 && points > 411; i++) {
      points = points - 6;
    }
    console.log(i, points);
    if (i === 0) {
      return -1;
    }
    return 48 - i;
  };

  const placeImpact = (impact, key) => {
    let center = {
      x: 0,
      y: 0,
    };
    switch (impact.zone) {
      case TargetZone.TOP_LEFT:
        center.x = sizeToPercent(globalPadding + visuelSize / 2);
        center.y = sizeToPercent(cibleSize - globalPadding - visuelSize / 2);
        console.log("TOP_LEFT", center);

        break;
      case TargetZone.TOP_RIGHT:
        console.log("TOP_RIGHT");
        center.x = sizeToPercent(cibleSize - globalPadding - visuelSize / 2);
        center.y = sizeToPercent(cibleSize - globalPadding - visuelSize / 2);
        break;
      case TargetZone.BOTTOM_LEFT:
        console.log("BOTTOM_LEFT");
        center.x = sizeToPercent(globalPadding + visuelSize / 2);
        center.y = sizeToPercent(globalPadding + visuelSize / 2);
        break;
      case TargetZone.BOTTOM_RIGHT:
        console.log("BOTTOM_RIGHT");
        center.x = sizeToPercent(cibleSize - globalPadding - visuelSize / 2);
        center.y = sizeToPercent(globalPadding + visuelSize / 2);
        break;
      case TargetZone.CENTER:
        console.log("CENTER");
        center.x = windowSize / 2;
        center.y = windowSize / 2;
        break;
      default:
        break;
    }
    console.log(
      "Center",
      ((pointToDistance(impact.points) * caseSize) / arrowSize) * windowSize
    );

    if (pointToDistance(impact.points) === -1) {
      return null;
    } else {
      return (
        <Animated.View
          key={key}
          style={{
            position: "absolute",
            height: sizeToPercent(arrowSize) + (selectedImpact === key ? 4 : 0),
            width: sizeToPercent(arrowSize) + (selectedImpact === key ? 4 : 0),
            transform: [
              {
                rotate: `${impact.angle + 180}deg`,
              },
              {
                translateX:
                  ((pointToDistance(impact.points) * caseSize) / cibleSize) *
                  windowSize,
              },
            ],
            borderRadius: windowSize,
            borderWidth: selectedImpact === key ? 2 : 0,
            borderColor: "rgba(255,105,0,0.5)",
            backgroundColor: "red",
            bottom:
              center.y -
              (sizeToPercent(arrowSize) + (selectedImpact === key ? 4 : 0)) / 2,
            left:
              center.x -
              (sizeToPercent(arrowSize) + (selectedImpact === key ? 4 : 0)) / 2,
          }}
        >
          <TouchableOpacity
            onPress={() => setSelectedImpact(key)}
            style={{
              width: "300%",
              height: "300%",
            }}
          ></TouchableOpacity>
        </Animated.View>
      );
    }
  };

  const sizeToPercent = (size) => {
    console.log("Size", (size / cibleSize) * windowSize);
    return (size / cibleSize) * windowSize;
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: windowSize,
          backgroundColor: "#fff",
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text>
          Total :{" "}
          {impactsArray
            .map((impact) => impact.points)
            .reduce((a, b) => a + b, 0)}
        </Text>
        <Text>
          Hors cible :{" "}
          {impactsArray.filter((impact) => impact.points === 0).length}
        </Text>
      </View>
      <View
        className="target-preview"
        style={{
          width: windowSize,
          height: windowSize,
          position: "relative",
          backgroundColor: "#fff",
        }}
      >
        <ReactNativeZoomableView maxZoom={4}>
          <ImageBackground
            source={targetBlueprint}
            resizeMode={"contain"}
            style={{ width: "100%", height: "100%" }}
          >
            {impactsArray.map((impact, index) => {
              return placeImpact(impact, index);
            })}
          </ImageBackground>
        </ReactNativeZoomableView>
      </View>
      <View style={styles.container}>
        <FlatList
          data={impactsArray}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      selectedImpact === index ? "transparent" : "#fff",
                  },
                ]}
                onPress={() => setSelectedImpact(index)}
              >
                <Text
                  style={{
                    fontSize: 20,
                  }}
                >
                  {item.points}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      let newImpacts = [...impactsArray];
                      newImpacts.push(item);
                      setImpactsArray(newImpacts);
                    }}
                  >
                    <Ionicons
                      name={"duplicate-outline"}
                      size={30}
                      color={"#000"}
                    ></Ionicons>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      let newImpacts = [...impactsArray];
                      newImpacts.splice(index, 1);
                      setImpactsArray(newImpacts);
                    }}
                  >
                    <Ionicons
                      name={"trash-outline"}
                      size={30}
                      color={"#000"}
                    ></Ionicons>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  item: {
    padding: 5,
    backgroundColor: "#fff",
    flexDirection: "row",
    marginTop: 2,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
    fontSize: 30,
  },
});

export default TargetPreview;
