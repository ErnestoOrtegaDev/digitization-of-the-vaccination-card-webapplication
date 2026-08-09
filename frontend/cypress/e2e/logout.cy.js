describe('Gestión de Sesión - Logout', () => {
  it('Debe cerrar sesión y redirigir al login', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();

    // Realizar logout y confirmar en el modal
    cy.contains('Cerrar Sesión').click();
    cy.contains('Sí, cerrar sesión').click();

    // Verificar redirección
    cy.url().should('include', '/login');

    // Intentar volver al dashboard (debe ser bloqueado)
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});