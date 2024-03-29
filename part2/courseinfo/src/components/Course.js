const Header = ({ name }) => <h2>{name}</h2>

const Part = ({ name, exercises }) => 
  <p>
    {name} {exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}  
  </>

  const Total = ({parts}) => {
    const total = parts.reduce((prev, curr) => prev + curr.exercises, 0);

    return <strong>total of {total} exercises</strong>
  }

const Course = ({ course }) => {    
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    );
  };

  export default Course;