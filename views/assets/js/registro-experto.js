// Mostrar el formulario solo si el usuario está logeado
// Requiere que el token esté en localStorage

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".registro-experto-form");
  const errorContainer = document.createElement("div");
  errorContainer.className = "error-message";
  if (form) form.parentElement.insertBefore(errorContainer, form);

  // Verificar sesión
  async function checkSession() {
    try {
      const res = await fetch("/api/usuarios/session", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No autenticado");
      const data = await res.json();
      if (!data.usuarioId) throw new Error("No autenticado");
      if (form) form.style.display = "block";
      errorContainer.style.display = "none";
      return true;
    } catch (err) {
      if (form) form.style.display = "none";
      errorContainer.textContent =
        "Debes iniciar sesión como usuario para registrarte como experto.";
      errorContainer.style.display = "block";
      return false;
    }
  }

  // Verificar sesión al cargar
  checkSession();

  // Manejar envío del formulario
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      // Verificar sesión nuevamente antes de enviar
      const hasSession = await checkSession();
      if (!hasSession) return;
      try {
        const formData = new FormData(form);
        const res = await fetch("/registro-experto", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          const result = await res.text();
          document.open();
          document.write(result);
          document.close();
        }
      } catch (err) {
        errorContainer.textContent =
          "Error al enviar solicitud. Por favor intenta nuevamente.";
        errorContainer.style.display = "block";
      }
    });
  }
});
