describe('Flujo de Aplicación de Dosis - VacunApp MX', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Debe navegar a la cartilla de un paciente mediante el icono de acción y abrir el modal', () => {
    // Ir a la sección de pacientes
    cy.get('a[href="/patients"]').click();
    cy.url().should('include', '/patients');

    // Localizar la tabla y hacer clic en el último icono de acción (Cartilla/Documento) de la primera fila
    // Usamos 'tr' para la primera fila de la tabla y seleccionamos el último botón o icono SVG
    cy.get('tbody tr').first().find('button, a').last().click();

    // Verificar que redirige correctamente a la vista de la cartilla del paciente
    cy.url().should('match', /\/cartilla\/\d+/);

    // Validar que la tabla de la cartilla carga de manera visible
    cy.get('table').should('be.visible');

    // Intentar hacer clic en "Registrar Dosis" en la primera opción disponible (si existe alguna pendiente)
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Registrar Dosis")').length > 0) {
        cy.get('button').contains('Registrar Dosis').first().click();
        cy.contains('Registrar Dosis').should('be.visible');
        cy.get('select').should('be.visible');
      } else {
        cy.log('El paciente seleccionado ya tiene todas sus dosis aplicadas.');
      }
    });
  });
});