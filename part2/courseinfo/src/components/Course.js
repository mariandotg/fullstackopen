const Header = ({ name }) => <h1>{name}</h1>

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

const Course = ({ course }) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
      </div>
    );
  };

  export default Course;