import { initApp } from "../../../main";
import { logout } from "../../../utils/auth";

initApp();

const buttonLogout = document.getElementById(
  "logoutButton"
) as HTMLButtonElement;

buttonLogout?.addEventListener("click", () => {
  logout();
});
