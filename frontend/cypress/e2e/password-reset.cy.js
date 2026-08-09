describe("Módulo de Recuperación de Contraseña - VacunApp MX", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it('Debe navegar de login a forgot-password con el link "¿Olvidaste tu contraseña?"', () => {
    cy.get('a[href="/forgot-password"]').click();
    cy.url().should("include", "/forgot-password");
    cy.contains("Recupera tu contraseña").should("be.visible");
  });

  describe("Pantalla: Olvidé mi contraseña", () => {
    beforeEach(() => {
      cy.visit("/forgot-password");
    });

    it("Debe mostrar mensaje de éxito genérico al enviar un correo válido", () => {
      cy.intercept("POST", "**/api/v1/auth/forgot-password", {
        statusCode: 200,
        body: {
          status: "success",
          message:
            "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.",
        },
      }).as("forgotPassword");

      cy.get('input[type="email"]').type("ernesto.dev@vacunapp.mx");
      cy.get('button[type="submit"]').click();

      cy.wait("@forgotPassword");
      cy.contains("Revisa tu bandeja de entrada").should("be.visible");
    });

    it("Debe mostrar el mismo mensaje genérico aunque el correo no exista (anti-enumeración)", () => {
      cy.intercept("POST", "**/api/v1/auth/forgot-password", {
        statusCode: 200,
        body: {
          status: "success",
          message:
            "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.",
        },
      }).as("forgotPassword");

      cy.get('input[type="email"]').type("no-existe@vacunapp.mx");
      cy.get('button[type="submit"]').click();

      cy.wait("@forgotPassword");
      cy.contains("Revisa tu bandeja de entrada").should("be.visible");
    });

    it("Debe mostrar error cuando el backend responde 429 (rate limit)", () => {
      cy.intercept("POST", "**/api/v1/auth/forgot-password", {
        statusCode: 429,
        body: {
          status: "error",
          message:
            "Demasiadas solicitudes de recuperación. Intenta de nuevo más tarde.",
        },
      }).as("forgotPasswordLimited");

      cy.get('input[type="email"]').type("ernesto.dev@vacunapp.mx");
      cy.get('button[type="submit"]').click();

      cy.wait("@forgotPasswordLimited");
      cy.contains("Demasiadas solicitudes de recuperación").should(
        "be.visible",
      );
    });

    it("No debe permitir enviar el formulario sin correo (validación HTML required)", () => {
      cy.get('button[type="submit"]').click();
      cy.get('input[type="email"]:invalid').should("exist");
    });
  });

  describe("Pantalla: Restablecer contraseña", () => {
    const validToken = "token-de-prueba-valido";

    it("Debe restablecer la contraseña con un token válido y redirigir a login", () => {
      cy.intercept("POST", "**/api/v1/auth/reset-password", {
        statusCode: 200,
        body: {
          status: "success",
          message: "Contraseña actualizada correctamente.",
        },
      }).as("resetPassword");

      cy.visit(`/reset-password?token=${validToken}`);

      cy.get('input[name="newPassword"]').type("NuevaPass123");
      cy.get('input[name="confirmPassword"]').type("NuevaPass123");
      cy.get('button[type="submit"]').click();

      cy.wait("@resetPassword").its("request.body").should("deep.equal", {
        token: validToken,
        newPassword: "NuevaPass123",
      });

      cy.url().should("include", "/login");
    });

    it("Debe mostrar error si el token es inválido o ya expiró", () => {
      cy.intercept("POST", "**/api/v1/auth/reset-password", {
        statusCode: 400,
        body: { status: "error", message: "Token inválido o expirado." },
      }).as("resetPasswordExpired");

      cy.visit("/reset-password?token=token-viejo-usado");

      cy.get('input[name="newPassword"]').type("NuevaPass123");
      cy.get('input[name="confirmPassword"]').type("NuevaPass123");
      cy.get('button[type="submit"]').click();

      cy.wait("@resetPasswordExpired");
      cy.contains("Token inválido o expirado").should("be.visible");
      cy.url().should("include", "/reset-password");
    });

    it("Debe mostrar error si las contraseñas no coinciden (validación de frontend, sin llamar al backend)", () => {
      cy.intercept("POST", "**/api/v1/auth/reset-password").as(
        "resetPasswordShouldNotBeCalled",
      );

      cy.visit(`/reset-password?token=${validToken}`);

      cy.get('input[name="newPassword"]').type("NuevaPass123");
      cy.get('input[name="confirmPassword"]').type("OtraPassDiferente");
      cy.get('button[type="submit"]').click();

      cy.contains("Las contraseñas no coinciden").should("be.visible");
      cy.get("@resetPasswordShouldNotBeCalled.all").should("have.length", 0);
    });

    it("El campo de nueva contraseña debe tener el atributo minlength=8 configurado", () => {
      cy.visit(`/reset-password?token=${validToken}`);

      cy.get('input[name="newPassword"]')
        .should("have.attr", "minlength", "8")
        .and("have.attr", "required");

      cy.get('input[name="confirmPassword"]')
        .should("have.attr", "minlength", "8")
        .and("have.attr", "required");
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // NOTA para el equipo:
  // Este spec prueba el FRONTEND de forma aislada con cy.intercept().
  // Si en algún punto quieren un test de integración real (backend +
  // Redis + Resend de verdad), tendría que ir en un spec separado,
  // por ejemplo password-reset.integration.cy.js, corriendo solo en
  // un pipeline de CI con permisos de red y una cuenta de Resend de
  // pruebas, no como parte de la suite normal de desarrollo.
  // ─────────────────────────────────────────────────────────────────
});
