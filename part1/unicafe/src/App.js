import { useState } from "react";

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value}
        {text === "positive" ? "%" : ""}
      </td>
    </tr>
  );
};

const Statistics = ({ clicks }) => {
  const all = clicks.good + clicks.neutral + clicks.bad;
  const average = (clicks.good * 1 + clicks.bad * -1) / all;
  const positive = clicks.good * (100 / all);

  return (
    <>
      {all > 0 ? (
        <table>
          <tbody>
            <StatisticLine text="good" value={clicks.good} />
            <StatisticLine text="neutral" value={clicks.neutral} />
            <StatisticLine text="bad" value={clicks.bad} />
            <StatisticLine text="all" value={all} />
            <StatisticLine text="average" value={average} />
            <StatisticLine text="positive" value={positive} />
          </tbody>
        </table>
      ) : (
        <div>No feedback given</div>
      )}
    </>
  );
};

const App = () => {
  const [clicks, setClicks] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
  });

  const handleClick = (feedback) =>
    setClicks({ ...clicks, [`${feedback}`]: clicks[`${feedback}`] + 1 });

  return (
    <main>
      <h1>give feedback</h1>
      <Button text="good" onClick={() => handleClick("good")} />
      <Button text="neutral" onClick={() => handleClick("neutral")} />
      <Button text="bad" onClick={() => handleClick("bad")} />
      <h1>statistics</h1>
      <Statistics clicks={clicks} />
    </main>
  );
};

export default App;
