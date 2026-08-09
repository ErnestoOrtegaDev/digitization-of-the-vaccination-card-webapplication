describe('Seguridad por Roles - VacunApp MX', () => {
  it('Debe restringir el acceso al catálogo de vacunas a un usuario no administrador', () => {
    // Iniciar sesión como ciudadano (debes tener uno de prueba)
    cy.visit('/login');
    cy.get('input[type="email"]').type('ciudadano_test@ejemplo.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Intentar acceder a la ruta de vacunas
    cy.visit('/vaccines');

    // El sistema debería redirigir al dashboard (o home) al detectar rol insuficiente
    cy.url().should('not.include', '/vaccines');
    cy.url().should('include', '/dashboard');
  });
});