describe('Módulo de Centros de Salud - VacunApp MX', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Debe permitir registrar un nuevo centro de salud en el sistema', () => {
    // Navegar a la sección de centros de salud
    cy.get('a[href="/health-centers"]').click();
    cy.url().should('include', '/health-centers');

    // Abrir el modal de registro
    cy.contains('Nuevo Establecimiento').click();

    // Rellenar los campos del formulario oficial
    const centerName = `Hospital Test ${Date.now()}`;
    cy.get('input[name="name"]').type(centerName);
    cy.get('input[name="clues"]').type('MSDGO999888');
    cy.get('input[name="phone"]').type('6181234567');
    cy.get('textarea[name="address"]').type('Av. 20 de Noviembre #500, Durango, Dgo.');

    // Guardar el registro
    cy.contains('button', 'Guardar Centro').click();

    // Verificar que el centro aparece listado en la vista
    cy.contains(centerName).should('be.visible');
    cy.contains('MSDGO999888').should('be.visible');
  });
});