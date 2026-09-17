import { initApp } from "../../../main";
import { loginUser } from "../../../utils/auth";
import { navigate, ROUTES } from "../../../utils/navigate";

initApp();

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const mensaje = document.getElementById("mensaje") as HTMLParagraphElement;

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;

  try {
    const user = loginUser(valueEmail, valuePassword);

    if (user.role === "admin") {
      navigate(ROUTES.ADMIN_HOME);
    } else {
      navigate(ROUTES.CLIENT_HOME);
    }
  } catch (error) {
    mensaje.textContent =
      error instanceof Error ? error.message : "Error inesperado";
  }
});
