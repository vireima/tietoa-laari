import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  console.error(error);

  let errorMessage: string = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "Tuntematon virhe :(";
  }

  return (
    <div id="error-page">
      <h1>Virhe</h1>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
