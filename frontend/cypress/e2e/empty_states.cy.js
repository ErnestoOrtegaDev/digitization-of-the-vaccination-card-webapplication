describe('Validación de Estados Vacíos - VacunApp MX', () => {
  it('Debe mostrar la interfaz correctamente cuando no hay registros', () => {
    // Interceptar la llamada y devolver un arreglo vacío
    cy.intercept('GET', '**/api/v1/patients*', {
      statusCode: 200,
      body: { status: 'success', data: [] }
    }).as('getEmptyPatients');

    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();

    cy.get('a[href="/patients"]').click();
    cy.wait('@getEmptyPatients');

    // Aquí verificamos que la tabla no tenga filas de datos
    cy.get('tbody tr').should('not.exist');
    // Si tu sistema tiene un mensaje de "Sin pacientes", valídalo aquí:
    // cy.contains('No hay pacientes registrados').should('be.visible');
  });
});