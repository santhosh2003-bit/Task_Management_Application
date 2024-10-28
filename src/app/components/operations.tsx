import useTaskStore from "../store/useTaskStore";

export const deleteFunction = async (id: number) => {
  try {
    let confi = confirm("Are you sure you want to delete");
    if (confi) {
      const response = await fetch(
        `http://localhost:3000/api/update?id=${id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      if (response.ok) {
        console.log(response.json());
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
