describe('Resiliencia y Manejo de Errores - VacunApp MX', () => {
  it('Debe mostrar un mensaje de error si el servidor de vacunas falla', () => {
    // it('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();

    // NTERCEPTAR: Forzar un error 500 cuando el front pida las vacunas
    cy.intercept('GET', '**/api/v1/vaccines', {
      statusCode: 500,
      body: { message: 'Error interno del servidor' }
    }).as('getVaccinesFail');

    // Ir a vacunas
    cy.get('a[href="/vaccines"]').click();

    // Esperar al error y verificar que el Toast de 'sonner' aparezca
    cy.wait('@getVaccinesFail');
    cy.contains('No se pudo guardar la información').should('exist'); // Ajusta según tu mensaje de error real
  });
});