describe('Prueba Forzada de Fallo (QA Control Quality) - VacunApp MX', () => {
  it('Debe fallar deliberadamente al buscar un texto inexistente en el Dashboard', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    cy.contains('Texto Inexistente de Prueba QA 2026').should('be.visible');
  });
});