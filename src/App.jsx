import "./App.css";
import SunIcon from "./components/icons/SunIcon";
import MoonIcon from "./components/icons/MoonIcon";
import { useState, useEffect } from "react";
import { useMemo } from "react";

function App() {
  const existingTodoItems = JSON.parse(localStorage.getItem("todoItem"));
  const [isChecked, setIsChecked] = useState(false);
  const [checkedTheme, setCheckedTheme] = useState(true);
  const [checkActive, setCheckActive] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);
  const [checkShowAllTask, setCheckShowAllTask] = useState(true);
  const [pageTheme, setPageTheme] = useState("dark");
  const [item, setItem] = useState("");
  const [todoArray, setTodoArray] = useState([...existingTodoItems]);
  const [dispayTodoArray, setDispayTodoArray] = useState([...todoArray]);

  function setTheme() {
    if (pageTheme === "dark") {
      setPageTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setPageTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }
  function handleInputChange(e) {
    setItem(e.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    const todoItem = {
      task: item,
      completed: false,
      active: true,
    };
    setTodoArray([...todoArray, todoItem]);
    setItem("");
  }
  const activeTasksLeft = useMemo(() => {
    return todoArray.filter((item) => item.active);
  }, [todoArray]);

  function handleActive() {
    setCheckActive(!checkActive);
    if (!checkActive) {
      setCheckCompleted(false);
      setCheckShowAllTask(false);
      setDispayTodoArray([...activeTasksLeft]);
    }
  }
  function handleCompleted() {
    setCheckCompleted(!checkCompleted);
    if (!checkCompleted) {
      setCheckActive(false);
      setCheckShowAllTask(false);
      setDispayTodoArray([...todoArray.filter((item) => item.completed)]);
    }
  }
  function handleAllTask() {
    setCheckShowAllTask(!checkShowAllTask);
    if (!checkShowAllTask) {
      setCheckActive(false);
      setCheckCompleted(false);
      setDispayTodoArray([...todoArray]);
    }
  }
  function handleDeleteClick() {
    return todoArray.map((item) => {
      if (item.completed) {
        setTodoArray(todoArray.filter((item) => !item.completed));
      } else {
        setTodoArray(todoArray.filter((item) => item.active));
      }
    });
  }
  const listTodoItems = dispayTodoArray.map((item, index) => {
    return (
      <div
        key={index}
        className=" text-[#fafafa] w-full p-3 border-b-[1px] border-[#777a92]"
      >
        <label className="flex items-center space-x-2 ">
          <svg
            className={
              `${isChecked ? " checkbox--active " : ""}` + " checkbox "
            }
            aria-hidden="true"
            viewBox="0 0 15 11"
            fill="none"
          >
            <path
              d="M1 4.5L5 9L14 1"
              strokeWidth="2"
              stroke={isChecked ? "#fff" : "none"}
            />
          </svg>
          <input
            type="checkbox"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            className=" absolute"
          />
          <div className="flex-1 cursor-pointer">{item.task}</div>
        </label>
      </div>
    );
  });

  useEffect(() => {
    localStorage.setItem("todoItem", JSON.stringify(todoArray));
    setDispayTodoArray([...todoArray]);
  }, [todoArray]);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setCheckedTheme(true);
      localStorage.setItem("theme", "dark");
    } else {
      setCheckedTheme(false);
      setPageTheme("light");
      localStorage.setItem("theme", "light");
    }
  }, [pageTheme]);
  return (
    <>
      <main
        className={
          `${checkedTheme ? " bg-[#161722] " : " bg-[#e4e5f1] "}` +
          "w-full h-screen font-mono text-sm"
        }
      >
        <div className="w-full h-[230px]">
          {checkedTheme ? (
            <img
              src="/bg-desktop-dark.jpg"
              alt="background image for dark theme"
              className="w-full h-full"
            />
          ) : (
            <img
              src="/bg-desktop-light.jpg"
              alt="background image for light theme"
              className="w-full h-full"
            />
          )}
        </div>
        <div className="flex flex-col justify-center items-center -mt-36 md:w-[500px] min-w-[375px] mx-auto h-auto px-4 md:px-0  ">
          <div className="w-full flex uppercase text-white justify-between items-center mb-8 text-3xl font-semibold">
            <p>todo</p>
            <div onClick={setTheme} className="cursor-pointer">
              {checkedTheme ? <SunIcon /> : <MoonIcon />}
            </div>
          </div>
          <div className="bg-[#25273c] mb-5 w-full p-3 rounded-lg">
            <form
              onSubmit={handleSubmit}
              className="w-full flex items-center space-x-2"
            >
              <button
                type="submit"
                className="w-5 h-5 border-[1px] border-[#777a92] rounded-full"
              ></button>
              <input
                type="text"
                value={item}
                onChange={handleInputChange}
                className="w-full flex-1 outline-none bg-transparent border-0 text-[#777a92]"
                placeholder="Create a new todo"
              />
            </form>
          </div>

          <div className="bg-[#25273c] w-full rounded-lg">
            <div>{listTodoItems}</div>
            <div className="w-full flex p-3 justify-between capitalize space-x-5 text-xs text-[#9394a5]">
              <div>
                <span>{activeTasksLeft.length}</span>
                <span>{activeTasksLeft.length > 1 ? " items" : " item"}</span>
                <span> left </span>
              </div>
              <div className="flex space-x-2">
                <label>
                  <input
                    type="checkbox"
                    onChange={handleAllTask}
                    className="hidden absolute"
                  />
                  <span
                    className={
                      `${checkShowAllTask ? " text-[#3a7bfd] " : ""}` +
                      "cursor-pointer"
                    }
                  >
                    all
                  </span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    onChange={handleActive}
                    className="hidden absolute"
                  />
                  <span
                    className={
                      `${checkActive ? " text-[#3a7bfd] " : ""}` +
                      "cursor-pointer"
                    }
                  >
                    active
                  </span>
                </label>

                <label>
                  <input
                    type="checkbox"
                    onChange={handleCompleted}
                    className="hidden absolute"
                  />
                  <span
                    className={
                      `${checkCompleted ? " text-[#3a7bfd] " : ""}` +
                      "cursor-pointer"
                    }
                  >
                    completed
                  </span>
                </label>
              </div>
              <div onClick={handleDeleteClick} className="cursor-pointer">
                clear completed
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
