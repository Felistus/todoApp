import "./App.css";
import SunIcon from "./components/icons/SunIcon";
import MoonIcon from "./components/icons/MoonIcon";
import { useState, useEffect, useRef } from "react";
import { useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "./components/icons/DeleteIcon";

function App() {
  const [checkedTheme, setCheckedTheme] = useState(true);
  const [checkActive, setCheckActive] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);
  const [checkShowAllTask, setCheckShowAllTask] = useState(true);
  const [pageTheme, setPageTheme] = useState("dark");
  const [item, setItem] = useState("");
  const [todoArray, setTodoArray] = useState(
    JSON.parse(localStorage.getItem("todoItem") || "[]")
  );
  const [dispayTodoArray, setDispayTodoArray] = useState([...todoArray]);
  const [isChecked, setIsChecked] = useState(
    new Array(todoArray.length).fill(false)
  );

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragStart = (e, position) => {
    console.log(position);
    dragItem.current = position;
  };
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };
  const dragEnd = () => {
    const dragItemContent = dispayTodoArray[dragItem.current];
    dispayTodoArray.splice(dragItem.current, 1);
    dispayTodoArray.splice(dragOverItem.current, 0, dragItemContent);
    setTodoArray(dispayTodoArray);
  };
  function setTheme() {
    if (pageTheme === "dark") {
      setPageTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setPageTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  }
  function handleIsChecked(position) {
    const updatedNewCheckedState = isChecked.map((state, index) => {
      return index === position ? !state : state;
    });
    setIsChecked(updatedNewCheckedState);

    const updatedTodoArray = todoArray.map((item, index) => {
      return index === position
        ? { ...item, completed: true, active: false }
        : item;
    });
    setTodoArray(updatedTodoArray);
  }
  function handleInputChange(e) {
    setItem(e.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (item) {
      try {
        const todoItem = {
          task: item,
          completed: false,
          active: true,
        };
        setTodoArray([...todoArray, todoItem]);
        setItem("");
        toast.success("Task added successfully");
      } catch (error) {
        toast.error("Something went wrong, please try again");
      }
    } else toast.warning("Please enter a task");
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
  function handleSingleTaskDelete(position) {
    const arrayAfterSingleTaskDelete = todoArray.filter((item, index) => {
      return index !== position;
    });
    setTodoArray(arrayAfterSingleTaskDelete);
  }
  const listTodoItems = dispayTodoArray.map((item, index) => (
    <div
      key={index}
      draggable
      onDragStart={(e) => dragStart(e, index)}
      onDragEnter={(e) => dragEnter(e, index)}
      onDragEnd={dragEnd}
      className={
        `${
          item && !item.completed
            ? "hover:bg-[#d8d8e9] hover:text-[#161722] "
            : ""
        }` +
        " text-[#fafafa] w-full p-3 border-b-[1px] border-[#777a92] inline-flex justify-between cursor-move"
      }
    >
      <label
        className={
          `${item && item.completed ? " cursor-not-allowed " : ""}` +
          "flex items-center space-x-2 "
        }
      >
        <svg
          className={
            `${
              item && item.completed
                ? " checkbox-active cursor-not-allowed "
                : ""
            }` + " checkbox "
          }
          aria-hidden="true"
          viewBox="0 0 15 11"
          fill="none"
        >
          <path
            d="M1 4.5L5 9L14 1"
            strokeWidth="2"
            stroke={item && item.completed ? " #fff " : " "}
          />
        </svg>
        <input
          type="checkbox"
          checked={isChecked[index]}
          onChange={() => handleIsChecked(index)}
          className="hidden absolute"
        />
        <div
          className={
            `${
              item && item.completed
                ? " line-through text-[#9394a5] cursor-not-allowed "
                : ""
            }` + "flex-1 cursor-pointer"
          }
        >
          {item && item.task.charAt(0).toUpperCase() + item.task.slice(1)}
        </div>
      </label>
      {item && !item.completed ? (
        <div onClick={() => handleSingleTaskDelete(index)}>
          <DeleteIcon />
        </div>
      ) : null}
    </div>
  ));

  useEffect(() => {
    localStorage.setItem("todoItem", JSON.stringify(todoArray));
    setDispayTodoArray([...todoArray]);
    setIsChecked(new Array(todoArray.length).fill(false));
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
        <div className="flex flex-col justify-center items-center -mt-[160px] md:-mt-36 md:w-[500px] min-w-[300px] mx-auto h-auto px-4 md:px-0 pb-8 ">
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
                autoFocus
                value={item}
                onChange={handleInputChange}
                className="w-full flex-1 outline-none bg-transparent border-0 text-[#777a92]"
                placeholder="Create a new todo"
              />
            </form>
          </div>

          <div className="bg-[#25273c] w-full rounded-lg">
            <div className="max-h-[350px] customScroll overflow-y-scroll ">
              {listTodoItems.length > 0 ? (
                listTodoItems
              ) : (
                <div className="text-center text-white p-4 capitalize">
                  <p>No tasks todo</p>
                </div>
              )}
            </div>
            <div className="w-full flex p-3 justify-between capitalize space-x-5 text-xs text-[#9394a5]">
              <div>
                <span>{activeTasksLeft.length}</span>
                <span>{activeTasksLeft.length > 1 ? " items" : " item"}</span>
                <span> left </span>
              </div>
              <div className="hidden space-x-2 md:flex">
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

          {/* display on small screens for responsiveness */}
          <div className="flex space-x-2 mt-2 bg-[#25273c] text-[#9394a5] rounded-lg p-2 capitalize md:hidden">
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
                  `${checkActive ? " text-[#3a7bfd] " : ""}` + "cursor-pointer"
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

          <div className="text-center text-[#9394a5] p-2 my-2">
            <p>Drag and Drop to reorder list</p>
          </div>
        </div>
        <ToastContainer autoClose={3000} position="top-center" theme="dark" />
      </main>
    </>
  );
}

export default App;
