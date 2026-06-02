import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [openOptions, setOpenOptions] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await api.get("/api/tasks", {
          headers: {
            Authorization: token,
          },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err?.response?.data || err.message || err);
        setError(err?.response?.data?.msg || "Unable to load tasks.");
      }
    };

    fetchTasks();
  }, [token, navigate]);

  const addTask = async () => {
    if (!token) {
      alert("Login required to add tasks.");
      return;
    }

    try {
      await api.post(
        "/api/tasks",
        { title },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setTitle("");
      setError("");

      const res = await api.get("/api/tasks", {
        headers: {
          Authorization: token,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err?.response?.data || err.message || err);
      alert(err?.response?.data?.msg || "Unable to add task.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`, {
        headers: {
          Authorization: token,
        },
      });
    } catch (err) {
      console.warn("Delete API failed, removing locally", err?.message || err);
    }

    setTasks((prev) => prev.filter((task) => task._id !== taskId));
    if (openOptions === taskId) {
      setOpenOptions(null);
    }
  };

  const editTask = async (task) => {
    const newTitle = prompt("Edit task title", task.title);
    if (!newTitle || newTitle.trim() === "") return;

    const updatedTask = { ...task, title: newTitle.trim() };

    try {
      await api.put(
        `/api/tasks/${task._id}`,
        { title: updatedTask.title },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } catch (err) {
      console.warn("Edit API failed, updating locally", err?.message || err);
    }

    setTasks((prev) => prev.map((item) => (item._id === task._id ? updatedTask : item)));
  };

  const toggleOptions = (taskId) => {
    setOpenOptions((current) => (current === taskId ? null : taskId));
  };

  return (
    <div className="page-container dashboard-page">
      <div className="card dashboard-card">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">My Tasks</h1>
            <p className="subtitle">Add a task and keep your day organized.</p>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="task-input-row">
          <input
            className="input-field"
            value={title}
            placeholder="New task title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="button task-button" onClick={addTask}>
            Add Task
          </button>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Add one to get started.</div>
          ) : (
            tasks.map((task) => (
              <div className="task-item" key={task._id}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-actions">
                    <button
                      className="button task-action-button options-button"
                      onClick={() => toggleOptions(task._id)}
                    >
                      Options
                    </button>
                  </div>
                </div>

                {openOptions === task._id && (
                  <div className="task-options-box">
                    <button className="button task-action-button" onClick={() => editTask(task)}>
                      Edit
                    </button>
                    <button
                      className="button task-action-button delete-button"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;