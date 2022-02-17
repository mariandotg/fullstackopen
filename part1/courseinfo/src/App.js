import React from "react";

const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({ courseParts }) => {
  return (
    <>
      <Part part={courseParts.parts[0].name} exercises={courseParts.parts[0].exercises} />
      <Part part={courseParts.parts[1].name} exercises={courseParts.parts[1].exercises} />
      <Part part={courseParts.parts[2].name} exercises={courseParts.parts[2].exercises} />
    </>
  );
};

const Total = ({ courseParts }) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.parts[0].exercises +
        courseParts.parts[1].exercises +
        courseParts.parts[2].exercises}
    </p>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content courseParts={course} />
      <Total courseParts={course} />
    </div>
  );
};

export default App;
