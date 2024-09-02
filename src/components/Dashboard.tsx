import { useReducer } from "react";

type Task = {
  id: number;
  title: string;
  isComplete: boolean;
};
type State = {
  tasks: Task[];
  filter: "ALL" | "COMPLETE" | "INCOMPLETE";
};
type Action =
  | {
      type: "CHANGE_INPUT";
      payload: {
        val: string;
      };
    }
  | {
      type: "ALL_FILTER";
    }
  | {
      type: "COMPLETE_FILTER";
    }
  | {
      type: "INCOMPLETE_FILTER";
    };
const initialState: State = {
  tasks: [], // Example initial state, can be replaced with actual data
  filter: "ALL",
};

const taskReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: Math.random(), isComplete: false, title: action.payload.val },
        ],
      };
    case "ALL_FILTER":
      return {
        ...state,
        filter: "ALL",
      };
    case "COMPLETE_FILTER":
      return {
        ...state,
        filter: "COMPLETE",
      };
    case "INCOMPLETE_FILTER":
      return {
        ...state,
        filter: "INCOMPLETE",
      };
    default:
      return state;
  }
};

const Dashboard = () => {
  const [taskState, dispatchTasK] = useReducer(taskReducer, initialState);

  const filteredTasks = taskState.tasks.filter((task) => {
    if (taskState.filter === "COMPLETE") {
      return task.isComplete;
    } else if (taskState.filter === "INCOMPLETE") {
      return !task.isComplete;
    }
    return true;
  });

  return (
    <div>
      <div className="mb-4">
        <input
          className="input input-bordered"
          onChange={(e) =>
            dispatchTasK({
              type: "CHANGE_INPUT",
              payload: { val: e.currentTarget.value },
            })
          }
        />
      </div>
      <div>
        <button
          className="btn btn-primary mr-4"
          onClick={() => dispatchTasK({ type: "ALL_FILTER" })}
        >
          All
        </button>

        <button
          onClick={() =>
            dispatchTasK({
              type: "COMPLETE_FILTER",
            })
          }
          className="btn btn-secondary mr-4"
        >
          Completed
        </button>

        <button
          onClick={() =>
            dispatchTasK({
              type: "INCOMPLETE_FILTER",
            })
          }
          className="btn btn-accent mr-4"
        >
          InCompleted
        </button>
      </div>
      <div className="mt-4">
        <ul className="flex flex-col justify-center items-center ">
          {filteredTasks.map((task) => (
            <li key={task.id} className="p-2 bg-slate-500">
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Dashboard;
