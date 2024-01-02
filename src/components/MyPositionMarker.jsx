import React, { PropTypes, Component } from "react";
import shouldPureComponentUpdate from "react-pure-render/function";

const K_WIDTH = 20;
const K_HEIGHT = 20;

const greatPlaceStyle = {
  position: "absolute",
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT / 2,
  border: "5px solid #f44336",
  borderRadius: K_HEIGHT,
  backgroundColor: "white",
  textAlign: "center",
  color: "#3f51b5",
  fontSize: 16,
  fontWeight: "bold",
  padding: 4,
  transform: 'rotate(135deg)'
};

export default class MyPositionMarker extends Component {
  static defaultProps = {};
  shouldComponentUpdate = shouldPureComponentUpdate;
  render() {
    return <div style={greatPlaceStyle}>{this.props.text}</div>;
  }
}
