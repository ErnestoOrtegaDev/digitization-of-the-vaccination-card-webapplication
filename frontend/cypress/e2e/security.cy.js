describe('Seguridad de Rutas - VacunApp MX', () => {
  it('Debe redirigir al Login si se intenta acceder al Dashboard sin sesión', () => {
    // Intentar acceder directamente a una ruta protegida
    cy.visit('/dashboard');

    // El sistema debería expulsar al usuario hacia el login
    cy.url().should('include', '/login');
    
    // Verificar que elementos del dashboard no son visibles
    cy.contains('Bienvenido, ernesto.dev').should('not.exist');
  });

  it('Debe evitar que un usuario sin sesión acceda a la gestión de pacientes', () => {
    cy.visit('/patients');
    cy.url().should('include', '/login');
  });
});