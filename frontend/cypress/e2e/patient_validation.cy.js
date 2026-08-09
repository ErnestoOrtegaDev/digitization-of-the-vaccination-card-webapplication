describe('Validaciones de Pacientes - VacunApp MX', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();
  });

  it('Debe mostrar error al intentar guardar un paciente con CURP incompleta', () => {
    cy.get('a[href="/patients"]').click();
    cy.contains('Nuevo Paciente').click();

    // Rellenar solo el nombre pero dejar CURP incompleta (ej. 5 caracteres)
    cy.get('input[name="full_name"]').type('Paciente Incompleto');
    cy.get('input[name="curp"]').type('ABCD1'); // Solo 5 caracteres

    // Intentar guardar
    cy.contains('Guardar Paciente').click();

    // Verificar que el mensaje de error de validación aparezca (debe coincidir con tu lógica de error en PatientModal)
    cy.contains('La CURP debe tener exactamente 18 caracteres').should('be.visible');
  });
});