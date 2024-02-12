import React from "react";
import { fabric } from "fabric";

//algorithm design:

//HIGH LEVEL: 
// neuron properties: 
// left aligned, fixed width of around 200px, 

//1) clicking new runs neuron() 
// neuron's center is the center of the viewport
// neuron's text field is empty and focused
//2) any four corners can be hovered over to reveal connection points
//  clicking and holding mouse1 on an endpoint creates a connection between the
//  center of the neuron and the current mouse position. on mouse release, if the mouse
//  is over a neuron then the connection is made between the two neurons, else the 
//  connection is deleted


//MID LEVEL:
//library of choice: react-konva
//FUNCTIONS:
//ConnectionLine(p1,p2,loading)
// creates a connection between two neurons, pulses when loading (create a line, if loading is true then pulse line, else return line)
// a new neuron connected to another must contain at least x of the same terms 
// as the neuron it is connected to, where x=1 for up to L2, x=2 for up to l3, x=4 thereafter.
// don't worry, ai can help with this
//Neuron()
// creates a new neuron in the center of the viewport with a focused text field
// variables:
//   hasFalseReasoning: boolean, if true show a red exclamation mark
//   connection: end neuron ID
//   xCoord: number, x coordinate of neuron on canvas
//   yCoord

//COMPONENTS:
//NewNeuron(), a green button with a plus sign which runs Neuron()
// behaviours: onClick={Neuron() after 500ms}
// characteristics: bg-primary-500 hover:bg-primary-400 text-white font-bold py-2 px-4 rounded-lg
type Props = {};
const page = (props: Props) => {
  return (
    <>
      <h1>Coming soon!</h1>
    </>
  );
};

export default page;
