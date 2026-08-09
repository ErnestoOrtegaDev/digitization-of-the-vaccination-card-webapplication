describe('Módulo de Búsqueda Global - VacunApp MX', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Debe abrir el buscador global y encontrar módulos o registros', () => {
    // Abrir el buscador global usando el botón visible del encabezado
    cy.contains('Buscar...').click();

    // Verificar que el modal de búsqueda global sea visible y escribir el término
    cy.get('input[placeholder*="buscar"]')
      .should('be.visible')
      .and('have.attr', 'placeholder')
      .and('match', /buscar/i);

    cy.get('input[placeholder*="buscar"]').type('Vacunas');

    // Comprobar que arroja resultados coincidentes en la lista
    cy.contains('Vacunas').should('be.visible');
  });
});