describe('Persistencia de Sesión - VacunApp MX', () => {
  it('Debe mantener la sesión activa después de recargar la página', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();

    // Verificar sesión activa
    cy.url().should('include', '/dashboard');

    // Simular recarga de página (F5)
    cy.reload();

    // Verificar que el usuario sigue logueado y no fue enviado al login
    cy.url().should('include', '/dashboard');
    cy.contains('ernesto.dev').should('be.visible');
  });
});