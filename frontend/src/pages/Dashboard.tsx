import React from 'react';
import { Header } from '../shared/components/layout/Header';
import { Button } from '../shared/components/common/Button';
import { TaskCard } from '../features/tasks/components/TaskCard';
import { TaskCardMobile } from '../features/tasks/components/TaskCardMobile';
import { TaskForm } from '../features/tasks/components/TaskForm';
import { TaskProvider, useTasks } from '../features/tasks/context/TaskContext';
import { SnackbarProvider } from '../shared/context/SnackbarContext';
import { useTaskHandlers } from '../features/tasks/hooks/useTaskHandlers';
import styles from './Dashboard.module.css';

const DashboardContent: React.FC = () => {
  const {
    tasksToDo,
    tasksDone,
    isLoading,
    error,
    fetchTasks,
  } = useTasks();

  const {
    showTaskForm,
    editingTask,
    openAddTaskForm,
    openEditTaskForm,
    closeTaskForm,
    handleAddTask,
    handleEditTask,
    handleDelete,
    handleToggle,
  } = useTaskHandlers();

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Tasks for the next month</h1>
          <Button
            variant="primary"
            onClick={openAddTaskForm}
            className={styles.addButton}
          >
            + Add task
          </Button>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <span>{error}</span>
            <Button
              variant="secondary"
              onClick={() => fetchTasks()}
              style={{ marginLeft: '12px', padding: '6px 12px', fontSize: '14px' }}
            >
              Retry
            </Button>
          </div>
        )}

        <div className={styles.sections}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Tasks to do <span className={styles.chevron}>▼</span>
            </h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th>☰ Task name</th>
                    <th>📅 Due date</th>
                    <th>🏷️ Tag</th>
                    <th>🌤️ Weather</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasksToDo.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.empty}>
                        No tasks to do
                      </td>
                    </tr>
                  ) : (
                    tasksToDo.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onEdit={openEditTaskForm}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.mobileCardContainer}>
              {tasksToDo.length === 0 ? (
                <div className={styles.emptyMobile}>No tasks to do</div>
              ) : (
                tasksToDo.map((task) => (
                  <TaskCardMobile
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onEdit={openEditTaskForm}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Tasks done <span className={styles.chevron}>▼</span>
            </h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th>☰ Task name</th>
                    <th>📅 Due date</th>
                    <th>🏷️ Tag</th>
                    <th>🌤️ Weather</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasksDone.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.empty}>
                        No completed tasks
                      </td>
                    </tr>
                  ) : (
                    tasksDone.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggle}
                        onEdit={openEditTaskForm}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.mobileCardContainer}>
              {tasksDone.length === 0 ? (
                <div className={styles.emptyMobile}>No completed tasks</div>
              ) : (
                tasksDone.map((task) => (
                  <TaskCardMobile
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onEdit={openEditTaskForm}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? handleEditTask : handleAddTask}
          onCancel={closeTaskForm}
        />
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <TaskProvider>
      <SnackbarProvider>
        <DashboardContent />
      </SnackbarProvider>
    </TaskProvider>
  );
};

export default Dashboard;
