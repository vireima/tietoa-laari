import TaskWidget from "../components/TaskWidget";
import { Loader, SimpleGrid } from "@mantine/core";
import useFilteredData from "../hooks/useFilteredData";

function Tasks() {
  const { filteredTasks, usersQuery, channelsQuery } = useFilteredData();

  // if (filteredTasks) {
  //   filteredTasks.sort(
  //     (a: Task, b: Task) =>
  //       DateTime.fromISO(b.modified).toSeconds() -
  //       DateTime.fromISO(a.modified).toSeconds()
  //   );
  // }

  return (
    <>
      {!filteredTasks ? (
        <Loader />
      ) : (
        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 3, lg: 4, xl: 5 }}
          p={{ base: "0.2rem", sm: "1rem", lg: "2rem" }}
          pt="4rem"
          bg="gray.1"
        >
          {filteredTasks.map((task) => (
            <TaskWidget
              initialTask={task}
              users={usersQuery.data}
              channels={channelsQuery.data}
              key={task._id}
            />
          ))}
        </SimpleGrid>
      )}
    </>
  );
}

export default Tasks;
