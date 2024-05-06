import axios from "axios";
import { ActionFunctionArgs } from "react-router-dom";

export const editTasksAction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());

  console.log("payload ::", payload);
  console.log("params ::", params);

  await axios.patch("https://laari.up.railway.app/tasks", [payload]);

  return null; // redirect("/");
};
