import targetBlueprint from "../../assets/target_blueprint.png";
import {
  View,
  Animated,
  useWindowDimensions,
  ImageBackground,
  Text,
} from "react-native";
import TargetZone from "../../utils/target/TargetUtils";
import { useState } from "react";

const TargetPreview = ({ impacts = [] }) => {
  const { width, height } = useWindowDimensions();
  const windowSize = Math.min(width, height);

  const caseSize = 9;
  const cibleSize = 2565;
  const visuelSize = 810;
  const globalPadding = 180;
  const arrowSize = 9 * 6;

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
            height: sizeToPercent(arrowSize),
            width: sizeToPercent(arrowSize),
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
            backgroundColor: "red",
            bottom: center.y - sizeToPercent(arrowSize) / 2,
            left: center.x - sizeToPercent(arrowSize) / 2,
          }}
        ></Animated.View>
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
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <View
        className="target-preview"
        style={{
          width: windowSize,
          height: windowSize,
          position: "relative",
          backgroundColor: "#fff",
        }}
      >
        <ImageBackground
          source={targetBlueprint}
          resizeMode={"contain"}
          style={{ width: "100%", height: "100%" }}
        >
          {impacts.map((impact, index) => {
            return placeImpact(impact, index);
          })}
        </ImageBackground>
      </View>
      <View
        style={{
          width: windowSize,
          backgroundColor: "#fff",
          padding: 10,
        }}
      >
        <Text>
          Total :{" "}
          {impacts.map((impact) => impact.points).reduce((a, b) => a + b, 0)}
        </Text>
        <Text>
          Hors cible : {impacts.filter((impact) => impact.points === 0).length}
        </Text>
      </View>
    </View>
  );
};

export default TargetPreview;
