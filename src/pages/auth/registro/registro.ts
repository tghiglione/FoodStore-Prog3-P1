import { initApp } from "../../../main";
import { registerUser } from "../../../utils/auth";
import { navigate, ROUTES } from "../../../utils/navigate";

initApp();

const form = document.getElementById("form-registro") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const mensaje = document.getElementById("mensaje") as HTMLParagraphElement;

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();

  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;

  try {
    registerUser(valueEmail, valuePassword);

    mensaje.textContent = "Usuario registrado correctamente. Redirigiendo al login...";
    form.reset();

    setTimeout(() => navigate(ROUTES.LOGIN), 1000);
  } catch (error) {
    mensaje.textContent =
      error instanceof Error ? error.message : "Error inesperado";
  }
});
